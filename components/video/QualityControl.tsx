'use client';

import { cn } from '@/lib/utils';

interface QualityControlProps {
  crf: number;
  format: 'mp4' | 'webm';
  onCrfChange: (v: number) => void;
  onFormatChange: (v: 'mp4' | 'webm') => void;
}

function getCrfLabel(crf: number): string {
  if (crf <= 20) return 'Excellent';
  if (crf <= 25) return 'High';
  if (crf <= 30) return 'Medium';
  if (crf <= 38) return 'Low';
  return 'Poor';
}

function getCrfColor(crf: number): string {
  if (crf <= 20) return 'text-emerald-400';
  if (crf <= 25) return 'text-green-400';
  if (crf <= 30) return 'text-yellow-400';
  if (crf <= 38) return 'text-orange-400';
  return 'text-red-400';
}

export default function QualityControl({
  crf,
  format,
  onCrfChange,
  onFormatChange,
}: QualityControlProps) {
  return (
    <div className="space-y-4">
      {/* CRF Slider */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[11px] text-[#555]">Quality (CRF)</label>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-white">{crf}</span>
            <span className={cn('text-[11px] font-medium', getCrfColor(crf))}>
              — {getCrfLabel(crf)}
            </span>
          </div>
        </div>
        <input
          type="range"
          min={15}
          max={51}
          value={crf}
          onChange={(e) => onCrfChange(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-[10px] text-[#444]">
          <span>Best quality</span>
          <span>Smallest file</span>
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="mb-2 block text-[11px] text-[#555]">Output Format</label>
        <div className="grid grid-cols-2 gap-2">
          {(['mp4', 'webm'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onFormatChange(fmt)}
              className={cn(
                'rounded-xl border py-2.5 text-sm font-medium uppercase tracking-wide transition-all duration-150',
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
    </div>
  );
}
