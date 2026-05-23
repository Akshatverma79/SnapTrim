'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { VideoEditRecipe } from './types';

let ffmpegInstance: FFmpeg | null = null;
let isLoaded = false;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && isLoaded) return ffmpegInstance;
  ffmpegInstance = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpegInstance.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });
  isLoaded = true;
  return ffmpegInstance;
}

function buildAtempo(speed: number): string[] {
  // atempo is limited to 0.5–2.0, so chain multiple filters for extreme values
  if (speed <= 0) return [];
  const filters: string[] = [];
  let remaining = speed;
  while (remaining > 2.0) {
    filters.push('atempo=2.0');
    remaining /= 2.0;
  }
  while (remaining < 0.5) {
    filters.push('atempo=0.5');
    remaining /= 0.5;
  }
  filters.push(`atempo=${remaining.toFixed(4)}`);
  return filters;
}

export async function processVideo(
  recipe: VideoEditRecipe,
  onProgress: (progress: number) => void
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  ffmpeg.on('progress', ({ progress }) => {
    const clamped = Math.min(100, Math.round(progress * 100));
    onProgress(clamped);
  });

  const ext = recipe.file.name.split('.').pop()?.toLowerCase() || 'mp4';
  const inputName = `input.${ext}`;
  const outputName = `output.${recipe.format}`;

  await ffmpeg.writeFile(inputName, await fetchFile(recipe.file));

  const args: string[] = [];

  // Trim — use -ss before input for fast seeking
  if (recipe.trimStart > 0) {
    args.push('-ss', recipe.trimStart.toFixed(3));
  }
  args.push('-i', inputName);
  if (recipe.trimEnd > 0 && recipe.trimEnd > recipe.trimStart) {
    args.push('-to', (recipe.trimEnd - recipe.trimStart).toFixed(3));
  }

  // Build video filter chain
  const vFilters: string[] = [];

  // Output dimensions
  const W = recipe.preset?.id === 'custom' ? recipe.customWidth : (recipe.preset?.width ?? recipe.customWidth);
  const H = recipe.preset?.id === 'custom' ? recipe.customHeight : (recipe.preset?.height ?? recipe.customHeight);

  if (W > 0 && H > 0) {
    if (recipe.framing === 'fit') {
      vFilters.push(
        `scale=${W}:${H}:force_original_aspect_ratio=decrease`,
        `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2`
      );
    } else {
      // fill
      vFilters.push(
        `scale=${W}:${H}:force_original_aspect_ratio=increase`,
        `crop=${W}:${H}`
      );
    }
  }

  // Rotation using transpose
  if (recipe.rotation === 90) {
    vFilters.push('transpose=1');
  } else if (recipe.rotation === 180) {
    vFilters.push('transpose=1', 'transpose=1');
  } else if (recipe.rotation === 270) {
    vFilters.push('transpose=2');
  }

  // Speed — video PTS
  if (recipe.speed !== 1) {
    vFilters.push(`setpts=${(1 / recipe.speed).toFixed(4)}*PTS`);
  }

  if (vFilters.length > 0) {
    args.push('-vf', vFilters.join(','));
  }

  // Audio
  if (recipe.muted) {
    args.push('-an');
  } else if (recipe.speed !== 1) {
    const atempoFilters = buildAtempo(recipe.speed);
    if (atempoFilters.length > 0) {
      args.push('-af', atempoFilters.join(','));
    }
  }

  // Quality & codec
  if (recipe.format === 'mp4') {
    args.push('-c:v', 'libx264', '-crf', recipe.crf.toString(), '-preset', 'fast');
    if (!recipe.muted) args.push('-c:a', 'aac');
  } else {
    args.push('-c:v', 'libvpx-vp9', '-crf', recipe.crf.toString(), '-b:v', '0');
    if (!recipe.muted) args.push('-c:a', 'libopus');
  }

  args.push('-movflags', '+faststart');
  args.push(outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  const mimeType = recipe.format === 'mp4' ? 'video/mp4' : 'video/webm';
  const rawData = data as Uint8Array;
  // Copy into a plain ArrayBuffer to avoid SharedArrayBuffer type issues
  const plainBuffer = new Uint8Array(rawData).buffer as ArrayBuffer;
  const blob = new Blob([plainBuffer], { type: mimeType });

  // Cleanup
  try {
    await ffmpeg.deleteFile(inputName);
    await ffmpeg.deleteFile(outputName);
  } catch {
    // ignore cleanup errors
  }

  return blob;
}
