'use client';

import { useState } from 'react';
import { Film, Image as ImageIcon, Zap, Star } from 'lucide-react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const VideoEditor = dynamic(() => import('@/components/VideoEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2a2a] border-t-white" />
    </div>
  ),
});

const ImageResizer = dynamic(() => import('@/components/ImageResizer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2a2a] border-t-white" />
    </div>
  ),
});

type Tab = 'video' | 'image';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('video');

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#0a0a0a' }}>
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Zap size={16} className="text-black" fill="black" />
            </div>
            <div>
              <h1
                className="text-2xl leading-none text-white"
                style={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.05em' }}
              >
                REFRAME
              </h1>
              <p className="text-[10px] text-[#444] leading-none mt-0.5" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                Browser-based video & image editor
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#111] px-3 py-1.5 sm:flex">
              <div className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-[11px] text-[#555]">100% Private · No Upload</span>
            </div>
            <a
              href="https://github.com/Akshatverma79/SnapTrim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2 text-xs text-[#888] transition-all hover:border-[#444] hover:text-white"
            >
              <Star size={13} />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero strip ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-[#111]" style={{ background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)' }}>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-1">
            <p
              className="text-4xl text-white"
              style={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.04em' }}
            >
              RESIZE. TRIM. CONVERT.
            </p>
            <p className="text-sm text-[#555]" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              Professional video & image editing — completely in your browser. No account, no upload, no waiting.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ───────────────────────────────────────────────────────── */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab('video')}
              id="tab-video"
              className={cn(
                'tab-btn flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-colors',
                activeTab === 'video'
                  ? 'active border-white text-white'
                  : 'border-transparent text-[#555] hover:text-[#888]'
              )}
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              <Film size={15} />
              Video Editor
            </button>
            <button
              onClick={() => setActiveTab('image')}
              id="tab-image"
              className={cn(
                'tab-btn flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-colors',
                activeTab === 'image'
                  ? 'active border-white text-white'
                  : 'border-transparent text-[#555] hover:text-[#888]'
              )}
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              <ImageIcon size={15} />
              Image Resizer
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────────── */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-6">
          {/* Feature pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            {activeTab === 'video' ? (
              <>
                <FeaturePill>11 output presets</FeaturePill>
                <FeaturePill>Trim & cut</FeaturePill>
                <FeaturePill>Rotate</FeaturePill>
                <FeaturePill>Speed control</FeaturePill>
                <FeaturePill>Mute audio</FeaturePill>
                <FeaturePill>MP4 & WebM export</FeaturePill>
                <FeaturePill>FFmpeg.wasm powered</FeaturePill>
              </>
            ) : (
              <>
                <FeaturePill>12 output presets</FeaturePill>
                <FeaturePill>Fit / Fill / Stretch</FeaturePill>
                <FeaturePill>Background color</FeaturePill>
                <FeaturePill>JPEG / PNG / WebP</FeaturePill>
                <FeaturePill>Quality slider</FeaturePill>
                <FeaturePill>Canvas API powered</FeaturePill>
              </>
            )}
          </div>

          {/* Editor panel */}
          <div
            className="rounded-3xl border border-[#1a1a1a] p-6 fade-in"
            style={{ background: '#111111' }}
          >
            {activeTab === 'video' ? <VideoEditor /> : <ImageResizer />}
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#111] py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-lg text-white"
                style={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.05em' }}
              >
                REFRAME
              </span>
              <span className="text-[#333]">·</span>
              <span className="text-xs text-[#444]">MIT License</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#444]">
              <span>All processing happens locally in your browser</span>
              <span className="text-[#333]">·</span>
              <a
                href="https://github.com/Akshatverma79/SnapTrim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#888] transition-colors"
              >
                <Star size={11} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[#1e1e1e] bg-[#0d0d0d] px-3 py-1 text-[11px] text-[#555]">
      {children}
    </span>
  );
}
