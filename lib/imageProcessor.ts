import { ImageEditRecipe } from './types';

export async function processImage(recipe: ImageEditRecipe): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');

      const W =
        recipe.preset?.id !== 'custom' && recipe.preset
          ? recipe.preset.width
          : recipe.customWidth;
      const H =
        recipe.preset?.id !== 'custom' && recipe.preset
          ? recipe.preset.height
          : recipe.customHeight;

      if (W <= 0 || H <= 0) {
        reject(new Error('Invalid output dimensions'));
        return;
      }

      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Enable high-quality image smoothing to prevent blurry output
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (recipe.framing === 'fit') {
        // Letterbox / pillarbox — fill background then draw centered scaled image
        ctx.fillStyle = recipe.bgColor;
        ctx.fillRect(0, 0, W, H);
        const scale = Math.min(W / img.width, H / img.height);
        const x = (W - img.width * scale) / 2;
        const y = (H - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else if (recipe.framing === 'fill') {
        // Scale to cover, then center-crop
        const scale = Math.max(W / img.width, H / img.height);
        const x = (W - img.width * scale) / 2;
        const y = (H - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        // Stretch — exact dimensions
        ctx.drawImage(img, 0, 0, W, H);
      }

      const mimeType =
        recipe.format === 'jpeg'
          ? 'image/jpeg'
          : recipe.format === 'png'
          ? 'image/png'
          : 'image/webp';

      const quality =
        recipe.format === 'png' ? undefined : recipe.quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(recipe.file);
  });
}

export function estimateOutputSize(
  canvas: HTMLCanvasElement,
  format: 'jpeg' | 'png' | 'webp',
  quality: number
): Promise<number> {
  return new Promise((resolve) => {
    const mimeType =
      format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
    const q = format === 'png' ? undefined : quality / 100;
    canvas.toBlob(
      (blob) => resolve(blob?.size ?? 0),
      mimeType,
      q
    );
  });
}
