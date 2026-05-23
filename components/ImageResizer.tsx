'use client';

import { useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

import UploadZone from '@/components/UploadZone';
import ExportButton from '@/components/ExportButton';
import ImagePresetSelector from '@/components/image/ImagePresetSelector';
import ImageFramingControl from '@/components/image/ImageFramingControl';
import ImageQualityControl from '@/components/image/ImageQualityControl';
import ImagePreview from '@/components/image/ImagePreview';

import { IMAGE_PRESETS } from '@/lib/imagePresets';
import { ImageEditRecipe, ExportStatus } from '@/lib/types';
import { processImage } from '@/lib/imageProcessor';

const DEFAULT_RECIPE: Omit<ImageEditRecipe, 'file'> = {
  preset: IMAGE_PRESETS[0], // IG Square
  customWidth: 1080,
  customHeight: 1080,
  framing: 'fit',
  bgColor: '#000000',
  format: 'jpeg',
  quality: 90,
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

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });
  const [recipe, setRecipe] = useState<Omit<ImageEditRecipe, 'file'>>(DEFAULT_RECIPE);
  const [status, setStatus] = useState<ExportStatus>(DEFAULT_STATUS);
  const [outputDims, setOutputDims] = useState({ w: 0, h: 0 });

  const handleFile = useCallback((f: File) => {
    if (originalSrc) URL.revokeObjectURL(originalSrc);
    if (status.outputUrl) URL.revokeObjectURL(status.outputUrl);

    const url = URL.createObjectURL(f);
    setFile(f);
    setOriginalSrc(url);
    setStatus(DEFAULT_STATUS);
    setRecipe(DEFAULT_RECIPE);
    setOutputDims({ w: 0, h: 0 });

    // Get natural dimensions
    const img = new Image();
    img.onload = () => setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  }, [originalSrc, status.outputUrl]);

  const handleReset = () => {
    if (status.outputUrl) URL.revokeObjectURL(status.outputUrl);
    setRecipe(DEFAULT_RECIPE);
    setStatus(DEFAULT_STATUS);
    setOutputDims({ w: 0, h: 0 });
  };

  const handleExport = async () => {
    if (!file) return;
    if (status.outputUrl) URL.revokeObjectURL(status.outputUrl);

    setStatus({ state: 'processing', progress: 50, message: 'Resizing image…', outputUrl: null, outputName: null });

    try {
      const fullRecipe: ImageEditRecipe = { ...recipe, file };
      const blob = await processImage(fullRecipe);

      const outputUrl = URL.createObjectURL(blob);
      const ext = recipe.format === 'jpeg' ? 'jpg' : recipe.format;
      const baseName = file.name.replace(/\.[^.]+$/, '');
      const outputName = `reframe-${baseName}.${ext}`;

      // Get output dimensions
      const outW = recipe.preset?.id !== 'custom' && recipe.preset
        ? recipe.preset.width : recipe.customWidth;
      const outH = recipe.preset?.id !== 'custom' && recipe.preset
        ? recipe.preset.height : recipe.customHeight;

      setOutputDims({ w: outW, h: outH });
      setStatus({ state: 'done', progress: 100, message: 'Resize complete!', outputUrl, outputName });
    } catch (err) {
      console.error('Image resize error:', err);
      setStatus({
        state: 'error',
        progress: 0,
        message: err instanceof Error ? err.message : 'Resize failed. Please try again.',
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
          accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif"
          onFile={handleFile}
          label="Drag & Drop your image here"
          formats="JPG, PNG, WebP, GIF, BMP, AVIF"
          maxSizeMB={100}
          icon="image"
          currentFile={file}
        />

        {originalSrc && (
          <div className="fade-in">
            <ImagePreview
              originalSrc={originalSrc}
              originalWidth={origDims.w}
              originalHeight={origDims.h}
              originalSize={file?.size ?? 0}
              outputSrc={status.outputUrl}
              outputWidth={outputDims.w}
              outputHeight={outputDims.h}
              outputSize={0}
            />
          </div>
        )}
      </div>

      {/* ── Right Column: Controls ────────────────────────────────────────────── */}
      <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        {/* Output Size */}
        <section>
          <SectionTitle>Output Size</SectionTitle>
          <ImagePresetSelector
            selected={recipe.preset}
            onSelect={(p) => patch('preset', p)}
            customWidth={recipe.customWidth}
            customHeight={recipe.customHeight}
            onCustomWidth={(v) => patch('customWidth', v)}
            onCustomHeight={(v) => patch('customHeight', v)}
          />
        </section>

        {/* Framing */}
        <section>
          <SectionTitle>Framing</SectionTitle>
          <ImageFramingControl
            value={recipe.framing}
            bgColor={recipe.bgColor}
            onChange={(v) => patch('framing', v)}
            onBgColor={(v) => patch('bgColor', v)}
          />
        </section>

        {/* Quality */}
        <section>
          <SectionTitle>Format & Quality</SectionTitle>
          <ImageQualityControl
            format={recipe.format}
            quality={recipe.quality}
            onFormat={(v) => patch('format', v)}
            onQuality={(v) => patch('quality', v)}
          />
        </section>

        {/* Divider */}
        <div className="border-t border-[#1a1a1a]" />

        {/* Export */}
        <ExportButton
          status={status}
          onExport={handleExport}
          disabled={!file}
          label="Resize Image"
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
