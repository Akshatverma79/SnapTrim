'use client';

import { RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Rotation = 0 | 90 | 180 | 270;

interface RotateControlProps {
  value: Rotation;
  onChange: (v: Rotation) => void;
}

const OPTIONS: Rotation[] = [0, 90, 180, 270];

export default function RotateControl({ value, onChange }: RotateControlProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {OPTIONS.map((deg) => (
        <button
          key={deg}
          onClick={() => onChange(deg)}
          className={cn(
            'flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-all duration-150',
            value === deg
              ? 'border-white bg-white/[0.08] text-white'
              : 'border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#aaa]'
          )}
        >
          <RotateCw
            size={14}
            style={{ transform: `rotate(${deg}deg)` }}
            className="transition-transform duration-200"
          />
          <span className="text-[11px] font-medium">{deg}°</span>
        </button>
      ))}
    </div>
  );
}
