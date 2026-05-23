'use client';

import { VIDEO_PRESETS } from '@/lib/videoPresets';
import { VideoPreset } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PresetSelectorProps {
  selected: VideoPreset | null;
  onSelect: (preset: VideoPreset) => void;
  customWidth: number;
  customHeight: number;
  onCustomWidth: (v: number) => void;
  onCustomHeight: (v: number) => void;
}

export default function PresetSelector({
  selected,
  onSelect,
  customWidth,
  customHeight,
  onCustomWidth,
  onCustomHeight,
}: PresetSelectorProps) {
  const isCustom = selected?.id === 'custom';

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {VIDEO_PRESETS.map((preset) => {
          const active = selected?.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={cn(
                'flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all duration-150',
                active
                  ? 'border-white bg-white/[0.08] text-white'
                  : 'border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#aaa]'
              )}
            >
              <span className="text-xs font-semibold leading-tight">{preset.label}</span>
              {preset.ratio !== 'custom' && (
                <span className="mt-0.5 text-[10px] leading-tight opacity-60">{preset.ratio}</span>
              )}
            </button>
          );
        })}
      </div>

      {selected && !isCustom && (
        <p className="mt-2 text-center text-xs text-[#555]">
          {selected.width} × {selected.height} — {selected.description}
        </p>
      )}

      {isCustom && (
        <div className="mt-3 flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-[11px] text-[#555]">Width (px)</label>
            <input
              type="number"
              value={customWidth || ''}
              onChange={(e) => onCustomWidth(parseInt(e.target.value, 10) || 0)}
              placeholder="1920"
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#555] focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[11px] text-[#555]">Height (px)</label>
            <input
              type="number"
              value={customHeight || ''}
              onChange={(e) => onCustomHeight(parseInt(e.target.value, 10) || 0)}
              placeholder="1080"
              className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#555] focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
