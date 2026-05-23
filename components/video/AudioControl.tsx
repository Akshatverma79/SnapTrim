'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioControlProps {
  muted: boolean;
  onChange: (muted: boolean) => void;
}

export default function AudioControl({ muted, onChange }: AudioControlProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onChange(false)}
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all duration-150',
          !muted
            ? 'border-white bg-white/[0.08] text-white'
            : 'border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#aaa]'
        )}
      >
        <Volume2 size={15} />
        Keep Audio
      </button>
      <button
        onClick={() => onChange(true)}
        className={cn(
          'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all duration-150',
          muted
            ? 'border-white bg-white/[0.08] text-white'
            : 'border-[#2a2a2a] text-[#666] hover:border-[#444] hover:text-[#aaa]'
        )}
      >
        <VolumeX size={15} />
        Mute
      </button>
    </div>
  );
}
