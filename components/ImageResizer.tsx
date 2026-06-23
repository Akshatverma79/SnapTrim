'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { RotateCcw, Download, Loader2 } from 'lucide-react';

import UploadZone from '@/components/UploadZone';
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
  const [isAutoProcessing, setIsAutoProcessing] = useState(false);
  const [outputSize, setOutputSize] = useState(0);

  // Ref to track the latest processing request and cancel stale ones
  const processingIdRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFile = useCallback((f: File) => {
    if (originalSrc) URL.revokeObjectURL(originalSrc);
    if (status.outputUrl) URL.revokeObjectURL(status.outputUrl);

    const url = URL.createObjectURL(f);
    setFile(f);
    setOriginalSrc(url);
    setStatus(DEFAULT_STATUS);
    setRecipe(DEFAULT_RECIPE);
    setOutputDims({ w: 0, h: 0 });
    setOutputSize(0);

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
    setOutputSize(0);
  };

  // Auto-process whenever recipe or file changes
  useEffect(() => {
    if (!file) return;

    // Determine target dimensions
    const targetW = recipe.preset?.id !== 'custom' && recipe.preset
      ? recipe.preset.width : recipe.customWidth;
    const targetH = recipe.preset?.id !== 'custom' && recipe.preset
      ? recipe.preset.height : recipe.customHeight;

    // Don't process if custom dimensions are invalid
    if (targetW <= 0 || targetH <= 0) return;

    // Debounce to avoid excessive processing (e.g. while typing custom dimensions)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const currentId = ++processingIdRef.current;

    debounceTimerRef.current = setTimeout(async () => {
      setIsAutoProcessing(true);

      try {
        const fullRecipe: ImageEditRecipe = { ...recipe, file };
        const blob = await processImage(fullRecipe);

        // Only update if this is still the latest request
        if (currentId !== processingIdRef.current) return;

        // Revoke previous output URL
        setStatus((prev) => {
          if (prev.outputUrl) URL.revokeObjectURL(prev.outputUrl);
          return prev;
        });

        const outputUrl = URL.createObjectURL(blob);
        const ext = recipe.format === 'jpeg' ? 'jpg' : recipe.format;
        const baseName = file.name.replace(/\.[^.]+$/, '');
        const outputName = `snaptrim-${baseName}.${ext}`;

        setOutputDims({ w: targetW, h: targetH });
        setOutputSize(blob.size);
        setStatus({ state: 'done', progress: 100, message: 'Resize complete!', outputUrl, outputName });
      } catch (err) {
        if (currentId !== processingIdRef.current) return;
        console.error('Image resize error:', err);
        setStatus({
          state: 'error',
          progress: 0,
          message: err instanceof Error ? err.message : 'Resize failed.',
          outputUrl: null,
          outputName: null,
        });
      } finally {
        if (currentId === processingIdRef.current) {
          setIsAutoProcessing(false);
        }
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [file, recipe]);

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
            {/* Auto-processing spinner overlay */}
            {isAutoProcessing && (
              <div className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3">
                <Loader2 size={14} className="animate-spin text-[#22c55e]" />
                <span className="text-sm text-[#888]">Resizing…</span>
              </div>
            )}
            <ImagePreview
              originalSrc={originalSrc}
              originalWidth={origDims.w}
              originalHeight={origDims.h}
              originalSize={file?.size ?? 0}
              outputSrc={status.outputUrl}
              outputWidth={outputDims.w}
              outputHeight={outputDims.h}
              outputSize={outputSize}
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

        {/* Download — only show when output is ready */}
        {status.state === 'done' && status.outputUrl && (
          <a
            href={status.outputUrl}
            download={status.outputName || 'snaptrim-export'}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 bg-[#22c55e] text-sm font-semibold text-black hover:bg-[#16a34a] transition-all duration-200 active:scale-[0.98]"
          >
            <Download size={16} />
            Download Resized Image
          </a>
        )}

        {/* Error state */}
        {status.state === 'error' && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-900/50 bg-red-950/30 p-4">
            <span className="text-sm text-red-300">{status.message || 'Resize failed.'}</span>
          </div>
        )}

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
