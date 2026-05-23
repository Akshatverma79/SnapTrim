'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, Film, Image as ImageIcon } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';

interface UploadZoneProps {
  accept: string;
  onFile: (file: File) => void;
  label?: string;
  formats?: string;
  maxSizeMB?: number;
  icon?: 'video' | 'image';
  currentFile?: File | null;
}

export default function UploadZone({
  accept,
  onFile,
  label = 'Drag & Drop your file here',
  formats,
  maxSizeMB = 2048,
  icon = 'video',
  currentFile,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max size is ${maxSizeMB}MB.`);
        return;
      }
      onFile(file);
    },
    [onFile, maxSizeMB]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);

  const onClick = () => inputRef.current?.click();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // Keyboard shortcut Ctrl+O / Cmd+O
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        inputRef.current?.click();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const IconComp = icon === 'video' ? Film : ImageIcon;

  return (
    <div className="w-full">
      <div
        onClick={onClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center gap-4',
          'min-h-[200px] w-full rounded-2xl border-2 border-dashed cursor-pointer',
          'transition-all duration-200 select-none',
          isDragging
            ? 'upload-drag-over'
            : 'border-[#2a2a2a] hover:border-[#444] hover:bg-white/[0.02]',
          currentFile ? 'min-h-[120px] py-5' : 'py-10'
        )}
        style={{ background: isDragging ? 'rgba(255,255,255,0.04)' : undefined }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
        />

        {currentFile ? (
          <div className="flex items-center gap-3 px-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <IconComp size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{currentFile.name}</p>
              <p className="text-xs text-[#666]">{formatBytes(currentFile.size)}</p>
            </div>
            <span className="ml-auto shrink-0 rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#666] hover:border-[#444] hover:text-white transition-colors">
              Change
            </span>
          </div>
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
              <IconComp size={28} className="text-white/60" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-white">{label}</p>
              <p className="mt-1 text-sm text-[#666]">or click to browse</p>
            </div>
            {formats && (
              <p className="text-xs text-[#444]">{formats}</p>
            )}
            <p className="text-xs text-[#333]">
              <kbd className="rounded border border-[#333] px-1.5 py-0.5 text-[10px]">Ctrl+O</kbd>
              {' '}to open
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
