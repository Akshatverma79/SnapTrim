'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface TrimControlProps {
  trimStart: number;
  trimEnd: number;
  duration: number;
  onTrimStart: (v: number) => void;
  onTrimEnd: (v: number) => void;
}

function toMMSS(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function fromMMSS(value: string): number {
  const parts = value.split(':');
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseFloat(parts[1]);
    if (!isNaN(m) && !isNaN(s)) return m * 60 + s;
  }
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

export default function TrimControl({
  trimStart,
  trimEnd,
  duration,
  onTrimStart,
  onTrimEnd,
}: TrimControlProps) {
  const [startInput, setStartInput] = useState(toMMSS(trimStart));
  const [endInput, setEndInput] = useState(toMMSS(trimEnd > 0 ? trimEnd : duration));

  useEffect(() => { setStartInput(toMMSS(trimStart)); }, [trimStart]);
  useEffect(() => { setEndInput(toMMSS(trimEnd > 0 ? trimEnd : duration)); }, [trimEnd, duration]);

  const handleStartBlur = () => {
    const val = fromMMSS(startInput);
    const clamped = Math.max(0, Math.min(val, duration - 0.1));
    onTrimStart(clamped);
    setStartInput(toMMSS(clamped));
  };

  const handleEndBlur = () => {
    const val = fromMMSS(endInput);
    const clamped = Math.max(trimStart + 0.1, Math.min(val, duration));
    onTrimEnd(clamped);
    setEndInput(toMMSS(clamped));
  };

  const trimDuration = (trimEnd > 0 ? trimEnd : duration) - trimStart;

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-[11px] text-[#555]">Start</label>
          <input
            type="text"
            value={startInput}
            onChange={(e) => setStartInput(e.target.value)}
            onBlur={handleStartBlur}
            placeholder="0:00"
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-center text-sm font-mono text-white placeholder-[#444] focus:border-[#555] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-[#555]">End</label>
          <input
            type="text"
            value={endInput}
            onChange={(e) => setEndInput(e.target.value)}
            onBlur={handleEndBlur}
            placeholder={duration > 0 ? toMMSS(duration) : '--:--'}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-center text-sm font-mono text-white placeholder-[#444] focus:border-[#555] focus:outline-none"
          />
        </div>
      </div>
      {duration > 0 && (
        <div className="mt-2 flex items-center justify-between text-xs text-[#555]">
          <div className="flex items-center gap-1">
            <Clock size={11} />
            <span>Duration: {formatDuration(trimDuration > 0 ? trimDuration : duration)}</span>
          </div>
          <span>Total: {formatDuration(duration)}</span>
        </div>
      )}
    </div>
  );
}
