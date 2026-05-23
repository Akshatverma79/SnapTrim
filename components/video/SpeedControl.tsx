'use client';

import { cn } from '@/lib/utils';

interface SpeedControlProps {
  value: number;
  onChange: (v: number) => void;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.5, 2, 4];

export default function SpeedControl({ value, onChange }: SpeedControlProps) {
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {SPEEDS.map((speed) => (
        <button
          key={speed}
          onClick={() => onChange(speed)}
          className={cn(
            'rounded-lg border py-2 text-center text-[11px] font-medium transition-all duration-150',
            value === speed
              ? 'border-white bg-white/[0.08] text-white'
              : 'border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#aaa]'
          )}
        >
          {speed === 1 ? '1×' : speed < 1 ? `${speed}×` : `${speed}×`}
        </button>
      ))}
    </div>
  );
}
