// ─── Video Presets ───────────────────────────────────────────────────────────
export interface VideoPreset {
  id: string;
  label: string;
  width: number;
  height: number;
  ratio: string;
  description: string;
}

// ─── Image Presets ────────────────────────────────────────────────────────────
export interface ImagePreset {
  id: string;
  label: string;
  width: number;
  height: number;
  description: string;
}

// ─── Framing Modes ───────────────────────────────────────────────────────────
export type FramingMode = 'fit' | 'fill';
export type ImageFramingMode = 'fit' | 'fill' | 'stretch';

// ─── Edit Recipes ─────────────────────────────────────────────────────────────
export interface VideoEditRecipe {
  file: File;
  preset: VideoPreset | null;
  customWidth: number;
  customHeight: number;
  framing: FramingMode;
  trimStart: number;
  trimEnd: number;
  rotation: 0 | 90 | 180 | 270;
  muted: boolean;
  speed: number;
  crf: number;
  format: 'mp4' | 'webm';
}

export interface ImageEditRecipe {
  file: File;
  preset: ImagePreset | null;
  customWidth: number;
  customHeight: number;
  framing: ImageFramingMode;
  bgColor: string;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
}

// ─── Export Status ────────────────────────────────────────────────────────────
export interface ExportStatus {
  state: 'idle' | 'loading' | 'processing' | 'done' | 'error';
  progress: number;
  message: string;
  outputUrl: string | null;
  outputName: string | null;
}
