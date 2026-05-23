'use client';

import { Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportStatus } from '@/lib/types';

interface ExportButtonProps {
  status: ExportStatus;
  onExport: () => void;
  disabled?: boolean;
  label?: string;
}

export default function ExportButton({
  status,
  onExport,
  disabled = false,
  label = 'Export',
}: ExportButtonProps) {
  const isIdle = status.state === 'idle';
  const isLoading = status.state === 'loading';
  const isProcessing = status.state === 'processing';
  const isDone = status.state === 'done';
  const isError = status.state === 'error';
  const isActive = isLoading || isProcessing;

  if (isActive) {
    return (
      <div className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-[#22c55e]" />
            <span className="text-sm font-medium text-white">
              {isLoading ? 'Loading FFmpeg…' : status.progress >= 100 ? 'Finalizing…' : 'Processing…'}
            </span>
          </div>
          <span className="text-sm font-medium text-[#22c55e]">
            {isLoading ? '' : `${Math.min(status.progress, 100)}%`}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
          <div
            className="progress-bar-fill"
            style={{ width: isLoading ? '5%' : `${Math.min(status.progress, 100)}%` }}
          />
        </div>
        {status.message && (
          <p className="mt-2 text-center text-xs text-[#666]">{status.message}</p>
        )}
      </div>
    );
  }

  if (isDone && status.outputUrl) {
    return (
      <div className="flex w-full flex-col gap-2">
        <a
          href={status.outputUrl}
          download={status.outputName || 'reframe-export'}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl py-4',
            'bg-[#22c55e] text-sm font-semibold text-black',
            'hover:bg-[#16a34a] transition-all duration-200',
            'active:scale-[0.98]'
          )}
        >
          <Download size={16} />
          Download File
        </a>
        <button
          onClick={onExport}
          className="w-full rounded-2xl border border-[#2a2a2a] py-3 text-sm text-[#666] hover:border-[#444] hover:text-white transition-all duration-200"
        >
          Export Again
        </button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2 rounded-2xl border border-red-900/50 bg-red-950/30 p-4">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <p className="text-sm text-red-300">{status.message || 'Export failed. Try again.'}</p>
        </div>
        <button
          onClick={onExport}
          disabled={disabled}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-2xl py-4',
            'bg-[#22c55e] text-sm font-semibold text-black',
            'hover:bg-[#16a34a] transition-all duration-200 active:scale-[0.98]',
            disabled && 'cursor-not-allowed opacity-40'
          )}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onExport}
      disabled={disabled}
      id="export-btn"
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-2xl py-4',
        'bg-[#22c55e] text-sm font-semibold text-black',
        'hover:bg-[#16a34a] transition-all duration-200 active:scale-[0.98]',
        disabled && 'cursor-not-allowed opacity-30'
      )}
    >
      {isDone && <CheckCircle size={16} />}
      {label}
    </button>
  );
}
