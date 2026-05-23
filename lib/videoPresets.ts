import { VideoPreset } from './types';

export const VIDEO_PRESETS: VideoPreset[] = [
  { id: 'reels',       label: 'Reels',      width: 1080, height: 1920, ratio: '9:16',    description: 'Reels · TikTok · Shorts' },
  { id: 'ig_feed',     label: 'IG Feed',    width: 1080, height: 1350, ratio: '4:5',    description: 'Instagram Feed' },
  { id: 'square',      label: 'Square',     width: 1080, height: 1080, ratio: '1:1',    description: 'Square' },
  { id: 'youtube',     label: 'YouTube',    width: 1920, height: 1080, ratio: '16:9',   description: 'YouTube · Landscape' },
  { id: 'twitter',     label: 'Twitter/X',  width: 1280, height: 720,  ratio: '16:9',   description: 'Twitter / X' },
  { id: 'ultrawide',   label: 'Ultrawide',  width: 2560, height: 1080, ratio: '21:9',   description: 'Ultrawide' },
  { id: 'ig_panoramic',label: 'Panoramic',  width: 1080, height: 230,  ratio: '47:10',  description: 'IG Panoramic' },
  { id: 'portrait',    label: 'Portrait',   width: 1080, height: 1440, ratio: '3:4',    description: 'Portrait' },
  { id: 'anamorphic',  label: 'Anamorphic', width: 2390, height: 1000, ratio: '2.39:1', description: 'Anamorphic Cinema' },
  { id: 'dci2k',       label: 'DCI 2K',     width: 2048, height: 1080, ratio: '17:9',   description: 'DCI 2K' },
  { id: 'custom',      label: 'Custom',     width: 0,    height: 0,    ratio: 'custom', description: 'Set your own' },
];
