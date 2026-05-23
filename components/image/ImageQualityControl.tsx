'use client';

import { cn } from '@/lib/utils';

interface ImageQualityControlProps {
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
  onFormat: (v: 'jpeg' | 'png' | 'webp') => void;
  onQuality: (v: number) => void;
}

function getQualityLabel(q: number): string {
  if (q >= 90) return 'Excellent';
  if (q >= 75) return 'High';
  if (q >= 55) return 'Medium';
  if (q >= 35) return 'Low';
  return 'Poor';
}

function getQualityColor(q: number): string {
  if (q >= 90) return 'text-emerald-400';
  if (q >= 75) return 'text-green-400';
  if (q >= 55) return 'text-yellow-400';
  if (q >= 35) return 'text-orange-400';
  return 'text-red-400';
}

export default function ImageQualityControl({
  format,
  quality,
  onFormat,
  onQuality,
}: ImageQualityControlProps) {
  return (
    <div className="space-y-4">
      {/* Format */}
      <div>
        <label className="mb-2 block text-[11px] text-[#555]">Output Format</label>
        <div className="grid grid-cols-3 gap-2">
          {(['jpeg', 'png', 'webp'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onFormat(fmt)}
              className={cn(
                'rounded-xl border py-2.5 text-xs font-semibold uppercase tracking-wide transition-all duration-150',
                format === fmt
                  ? 'border-white bg-white/[0.08] text-white'
                  : 'border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#aaa]'
              )}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Quality */}
      {format !== 'png' && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[11px] text-[#555]">Quality</label>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs text-white">{quality}%</span>
              <span className={cn('text-[11px] font-medium', getQualityColor(quality))}>
                — {getQualityLabel(quality)}
              </span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => onQuality(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-[10px] text-[#444]">
            <span>Smallest file</span>
            <span>Best quality</span>
          </div>
        </div>
      )}

      {format === 'png' && (
        <p className="text-center text-xs text-[#444]">
          PNG is lossless — quality slider not applicable
        </p>
      )}
    </div>
  );
}
