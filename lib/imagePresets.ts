import { ImagePreset } from './types';

export const IMAGE_PRESETS: ImagePreset[] = [
  { id: 'ig_square',      label: 'IG Square',      width: 1080, height: 1080, description: 'Instagram Square' },
  { id: 'ig_portrait',    label: 'IG Portrait',    width: 1080, height: 1350, description: 'Instagram Portrait' },
  { id: 'ig_landscape',   label: 'IG Landscape',   width: 1080, height: 608,  description: 'Instagram Landscape' },
  { id: 'reels_cover',    label: 'Reels Cover',    width: 1080, height: 1920, description: 'Reels Cover' },
  { id: 'twitter_post',   label: 'Twitter Post',   width: 1200, height: 675,  description: 'Twitter/X Post' },
  { id: 'twitter_banner', label: 'Twitter Banner', width: 1500, height: 500,  description: 'Twitter/X Banner' },
  { id: 'linkedin_post',  label: 'LinkedIn Post',  width: 1200, height: 627,  description: 'LinkedIn Post' },
  { id: 'linkedin_cover', label: 'LinkedIn Cover', width: 1584, height: 396,  description: 'LinkedIn Cover' },
  { id: 'yt_thumb',       label: 'YT Thumbnail',   width: 1280, height: 720,  description: 'YouTube Thumbnail' },
  { id: 'whatsapp',       label: 'WhatsApp',       width: 512,  height: 512,  description: 'WhatsApp Sticker' },
  { id: 'fb_cover',       label: 'FB Cover',       width: 851,  height: 315,  description: 'Facebook Cover' },
  { id: 'custom',         label: 'Custom',         width: 0,    height: 0,    description: 'Set your own' },
];
