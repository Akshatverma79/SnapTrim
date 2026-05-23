'use client';

import { Minimize2, Maximize2 } from 'lucide-react';
import { FramingMode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FramingControlProps {
  value: FramingMode;
  onChange: (v: FramingMode) => void;
}

const options: { id: FramingMode; label: string; description: string; Icon: React.ElementType }[] = [
  { id: 'fit',  label: 'Fit',  description: 'Letterbox / pillarbox',   Icon: Minimize2 },
  { id: 'fill', label: 'Fill', description: 'Crop to fill the frame', Icon: Maximize2 },
];

export default function FramingControl({ value, onChange }: FramingControlProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
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
          <div className="flex items-center gap-2">
            <Icon size={14} />
            <span className="text-sm font-semibold">{label}</span>
          </div>
          <span className="text-[11px] leading-tight opacity-60">{description}</span>
        </button>
      ))}
    </div>
  );
}
