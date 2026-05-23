import type { Metadata } from 'next';
import { Bebas_Neue, Syne, DM_Sans } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const syne = Syne({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Reframe — Browser-Based Video & Image Editor',
  description:
    'Free, private, no-upload video and image editor. Resize, trim, rotate, and convert videos and images entirely in your browser with FFmpeg.wasm and Canvas API.',
  keywords: ['video editor', 'image resizer', 'browser', 'ffmpeg', 'no upload', 'privacy'],
  openGraph: {
    title: 'Reframe — Browser-Based Video & Image Editor',
    description: 'Free, private, no-upload video and image editor powered by FFmpeg.wasm.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${syne.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
