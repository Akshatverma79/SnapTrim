'use client';

import { formatBytes } from '@/lib/utils';

interface ImagePreviewProps {
  originalSrc: string | null;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  outputSrc: string | null;
  outputWidth: number;
  outputHeight: number;
  outputSize: number;
}

export default function ImagePreview({
  originalSrc,
  originalWidth,
  originalHeight,
  originalSize,
  outputSrc,
  outputWidth,
  outputHeight,
  outputSize,
}: ImagePreviewProps) {
  if (!originalSrc) return null;

  return (
    <div className="space-y-3">
      {outputSrc ? (
        <div className="grid grid-cols-2 gap-3">
          {/* Original */}
          <div className="space-y-2">
            <p className="text-center text-[11px] font-medium text-[#555] uppercase tracking-wider">Original</p>
            <div className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0d0d0d]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalSrc}
                alt="Original"
                className="w-full object-contain"
                style={{ maxHeight: '200px' }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-[#555]">{originalWidth} × {originalHeight}</p>
              <p className="text-[11px] text-[#444]">{formatBytes(originalSize)}</p>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <p className="text-center text-[11px] font-medium text-[#22c55e] uppercase tracking-wider">Resized</p>
            <div className="overflow-hidden rounded-xl border border-[#22c55e]/30 bg-[#0d0d0d]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={outputSrc}
                alt="Resized"
                className="w-full object-contain"
                style={{ maxHeight: '200px' }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-white">{outputWidth} × {outputHeight}</p>
              <p className="text-[11px] text-[#22c55e]">{formatBytes(outputSize)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-center text-[11px] font-medium text-[#555] uppercase tracking-wider">Preview</p>
          <div className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#0d0d0d]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalSrc}
              alt="Uploaded image"
              className="w-full object-contain"
              style={{ maxHeight: '300px' }}
            />
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-[#555]">
            <span>{originalWidth} × {originalHeight}</span>
            <span>·</span>
            <span>{formatBytes(originalSize)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
