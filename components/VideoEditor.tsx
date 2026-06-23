'use client';

import { useState, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause } from 'lucide-react';

import UploadZone from '@/components/UploadZone';
import ExportButton from '@/components/ExportButton';
import PresetSelector from '@/components/video/PresetSelector';
import FramingControl from '@/components/video/FramingControl';
import TrimControl from '@/components/video/TrimControl';
import RotateControl from '@/components/video/RotateControl';
import AudioControl from '@/components/video/AudioControl';
import SpeedControl from '@/components/video/SpeedControl';
import QualityControl from '@/components/video/QualityControl';

import { VIDEO_PRESETS } from '@/lib/videoPresets';
import { VideoEditRecipe, VideoPreset, ExportStatus } from '@/lib/types';
import { formatDuration } from '@/lib/utils';

const DEFAULT_RECIPE: Omit<VideoEditRecipe, 'file'> = {
  preset: VIDEO_PRESETS[0], // Reels 9:16
  customWidth: 1080,
  customHeight: 1920,
  framing: 'fit',
  trimStart: 0,
  trimEnd: 0,
  rotation: 0,
  muted: false,
  speed: 1,
  crf: 23,
  format: 'mp4',
};

const DEFAULT_STATUS: ExportStatus = {
  state: 'idle',
  progress: 0,
  message: '',
  outputUrl: null,
  outputName: null,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#555]"
      style={{ fontFamily: 'var(--font-syne)' }}
    >
      {children}
    </h3>
  );
}

export default function VideoEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recipe, setRecipe] = useState<Omit<VideoEditRecipe, 'file'>>(DEFAULT_RECIPE);
  const [status, setStatus] = useState<ExportStatus>(DEFAULT_STATUS);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = useCallback((f: File) => {
    // Revoke old URL
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    // Revoke old output URL
    if (status.outputUrl) URL.revokeObjectURL(status.outputUrl);

    const url = URL.createObjectURL(f);
    setFile(f);
    setVideoUrl(url);
    setStatus(DEFAULT_STATUS);
    setRecipe(DEFAULT_RECIPE);
    setIsPlaying(false);
    setDuration(0);
  }, [videoUrl, status.outputUrl]);

  const handleReset = () => {
    if (status.outputUrl) URL.revokeObjectURL(status.outputUrl);
    setRecipe(DEFAULT_RECIPE);
    setStatus(DEFAULT_STATUS);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play(); setIsPlaying(true); }
  };

  const handleExport = async () => {
    if (!file) return;
    if (status.outputUrl) URL.revokeObjectURL(status.outputUrl);

    setStatus({ state: 'loading', progress: 0, message: 'Loading FFmpeg…', outputUrl: null, outputName: null });

    try {
      // Dynamic import to keep FFmpeg client-side only
      const { processVideo } = await import('@/lib/ffmpeg');

      setStatus((s) => ({ ...s, state: 'processing', message: 'Processing video…' }));

      const fullRecipe: VideoEditRecipe = { ...recipe, file };
      const blob = await processVideo(fullRecipe, (progress) => {
        setStatus((s) => ({
          ...s,
          state: 'processing',
          progress,
          message: progress >= 100 ? 'Finalizing…' : 'Processing…',
        }));
      });

      const outputUrl = URL.createObjectURL(blob);
      const ext = recipe.format;
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const outputName = `snaptrim-${baseName}.${ext}`;

      setStatus({ state: 'done', progress: 100, message: 'Export complete!', outputUrl, outputName });
    } catch (err) {
      console.error('Export error:', err);
      setStatus({
        state: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : 'Export failed. Please try again.',
        outputUrl: null,
        outputName: null,
      });
    }
  };

  const patch = <K extends keyof typeof recipe>(key: K, value: (typeof recipe)[K]) =>
    setRecipe((r) => ({ ...r, [key]: value }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ── Left Column: Preview ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <UploadZone
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,.mp4,.mov,.avi,.mkv,.webm"
          onFile={handleFile}
          label="Drag & Drop your video here"
          formats="MP4, MOV, AVI, MKV, WebM — up to 2GB"
          maxSizeMB={2048}
          icon="video"
          currentFile={file}
        />

        {videoUrl && (
          <div className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-black fade-in">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full"
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              controls={false}
              playsInline
            />
            {/* Custom play overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm ring-1 ring-white/20 transition-all hover:bg-black/80 hover:ring-white/40 active:scale-95"
              >
                {isPlaying ? <Pause size={18} fill="white" className="text-white" /> : <Play size={18} fill="white" className="text-white ml-0.5" />}
              </button>
            </div>
            {duration > 0 && (
              <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-mono text-white backdrop-blur-sm">
                {formatDuration(duration)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right Column: Controls ────────────────────────────────────────────── */}
      <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        {/* Output Size */}
        <section>
          <SectionTitle>Output Size</SectionTitle>
          <PresetSelector
            selected={recipe.preset}
            onSelect={(p: VideoPreset) => patch('preset', p)}
            customWidth={recipe.customWidth}
            customHeight={recipe.customHeight}
            onCustomWidth={(v) => patch('customWidth', v)}
            onCustomHeight={(v) => patch('customHeight', v)}
          />
        </section>

        {/* Framing */}
        <section>
          <SectionTitle>Framing</SectionTitle>
          <FramingControl value={recipe.framing} onChange={(v) => patch('framing', v)} />
        </section>

        {/* Trim */}
        <section>
          <SectionTitle>Trim</SectionTitle>
          <TrimControl
            trimStart={recipe.trimStart}
            trimEnd={recipe.trimEnd}
            duration={duration}
            onTrimStart={(v) => patch('trimStart', v)}
            onTrimEnd={(v) => patch('trimEnd', v)}
          />
        </section>

        {/* Rotation */}
        <section>
          <SectionTitle>Rotation</SectionTitle>
          <RotateControl value={recipe.rotation} onChange={(v) => patch('rotation', v)} />
        </section>

        {/* Audio */}
        <section>
          <SectionTitle>Audio</SectionTitle>
          <AudioControl muted={recipe.muted} onChange={(v) => patch('muted', v)} />
        </section>

        {/* Speed */}
        <section>
          <SectionTitle>Speed</SectionTitle>
          <SpeedControl value={recipe.speed} onChange={(v) => patch('speed', v)} />
        </section>

        {/* Quality */}
        <section>
          <SectionTitle>Quality & Format</SectionTitle>
          <QualityControl
            crf={recipe.crf}
            format={recipe.format}
            onCrfChange={(v) => patch('crf', v)}
            onFormatChange={(v) => patch('format', v)}
          />
        </section>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a]" />

        {/* Export */}
        <ExportButton
          status={status}
          onExport={handleExport}
          disabled={!file}
          label="Export Video"
        />

        {/* Reset */}
        {file && (
          <button
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm text-[#555] hover:text-[#888] transition-colors"
          >
            <RotateCcw size={13} />
            Reset Settings
          </button>
        )}
      </div>
    </div>
  );
}
