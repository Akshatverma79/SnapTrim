'use client';

import { Minimize2, Maximize2, StretchHorizontal } from 'lucide-react';
import { ImageFramingMode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ImageFramingControlProps {
  value: ImageFramingMode;
  bgColor: string;
  onChange: (v: ImageFramingMode) => void;
  onBgColor: (v: string) => void;
}

const options: {
  id: ImageFramingMode;
  label: string;
  description: string;
  Icon: React.ElementType;
}[] = [
  { id: 'fit',     label: 'Fit',     description: 'Add background bars', Icon: Minimize2 },
  { id: 'fill',    label: 'Fill',    description: 'Crop to fill',         Icon: Maximize2 },
  { id: 'stretch', label: 'Stretch', description: 'Distort to fit',       Icon: StretchHorizontal },
];

export default function ImageFramingControl({
  value,
  bgColor,
  onChange,
  onBgColor,
}: ImageFramingControlProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {options.map(({ id, label, description, Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all duration-150',
              value === id
                ? 'border-white bg-white/[0.08] text-white'
                : 'border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#aaa]'
            )}
          >
            <div className="flex items-center gap-1.5">
              <Icon size={13} />
              <span className="text-xs font-semibold">{label}</span>
            </div>
            <span className="text-[10px] leading-tight opacity-60">{description}</span>
          </button>
        ))}
      </div>

      {value === 'fit' && (
        <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3">
          <span className="text-xs text-[#666]">Background color</span>
          <div className="flex flex-1 items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColor(e.target.value)}
              id="bg-color-picker"
            />
            <span className="font-mono text-xs text-[#555]">{bgColor}</span>
          </div>
        </div>
      )}
    </div>
  );
}
