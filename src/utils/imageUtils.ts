import { ASPECT_RATIO_VALUES, FORMAT_MIME_TYPES } from '../constants';
import { AspectRatioPreset, OutputFormat, ResizeSettings, SupportedFormat } from '../types';

export interface TargetDimensions {
  width: number;
  height: number;
}

export function getAspectRatioDecimal(
  preset: AspectRatioPreset,
  originalWidth: number,
  originalHeight: number,
  customAspectRatio: { width: number; height: number }
): number {
  if (preset === 'original') {
    return originalHeight > 0 ? originalWidth / originalHeight : 1;
  }
  if (preset === 'custom') {
    return customAspectRatio.height > 0 && customAspectRatio.width > 0
      ? customAspectRatio.width / customAspectRatio.height
      : 1;
  }
  return ASPECT_RATIO_VALUES[preset] || (originalHeight > 0 ? originalWidth / originalHeight : 1);
}

export function calculateTargetDimensions(
  settings: ResizeSettings,
  originalWidth: number,
  originalHeight: number
): TargetDimensions {
  if (originalWidth <= 0 || originalHeight <= 0) {
    return { width: Math.max(1, settings.width || 800), height: Math.max(1, settings.height || 600) };
  }

  const ratio = getAspectRatioDecimal(
    settings.aspectRatioPreset,
    originalWidth,
    originalHeight,
    settings.customAspectRatio
  );

  if (settings.mode === 'percentage') {
    const scaleFactor = Math.max(0.01, settings.percentage / 100);
    const w = Math.max(1, Math.round(originalWidth * scaleFactor));
    const h = settings.lockAspectRatio
      ? Math.max(1, Math.round(w / ratio))
      : Math.max(1, Math.round(originalHeight * scaleFactor));
    return { width: w, height: h };
  }

  if (settings.mode === 'scale') {
    const scaleFactor = Math.max(0.01, settings.scale / 100);
    const w = Math.max(1, Math.round(originalWidth * scaleFactor));
    const h = settings.lockAspectRatio
      ? Math.max(1, Math.round(w / ratio))
      : Math.max(1, Math.round(originalHeight * scaleFactor));
    return { width: w, height: h };
  }

  // Dimension mode ('dimensions')
  const w = Math.max(1, Math.round(settings.width || originalWidth));
  let h = Math.max(1, Math.round(settings.height || originalHeight));

  if (settings.lockAspectRatio) {
    h = Math.max(1, Math.round(w / ratio));
  }

  return { width: w, height: h };
}

export function calculateSavings(
  originalSizeBytes: number,
  newSizeBytes: number
): { savingsPercentage: number; compressionRatio: number } {
  if (originalSizeBytes <= 0 || newSizeBytes <= 0) {
    return { savingsPercentage: 0, compressionRatio: 1 };
  }

  const diff = originalSizeBytes - newSizeBytes;
  const savingsPercentage = parseFloat(((diff / originalSizeBytes) * 100).toFixed(1));
  const compressionRatio = parseFloat((originalSizeBytes / newSizeBytes).toFixed(2));

  return { savingsPercentage, compressionRatio };
}

export function getMimeTypeForOutput(
  format: OutputFormat,
  originalFormat: SupportedFormat
): string {
  if (format === 'original') {
    if (originalFormat === 'jpeg' || originalFormat === 'jpg') return 'image/jpeg';
    if (originalFormat === 'png') return 'image/png';
    if (originalFormat === 'webp') return 'image/webp';
    if (originalFormat === 'avif') return 'image/avif';
    return 'image/jpeg';
  }
  return FORMAT_MIME_TYPES[format] || 'image/jpeg';
}

/**
 * Step-down canvas scaling algorithm to ensure smooth anti-aliasing without artifacts
 */
export async function resizeImageCanvas(
  imageSource: HTMLImageElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number,
  mimeType: string,
  quality: number
): Promise<Blob> {
  let curWidth = imageSource.width;
  let curHeight = imageSource.height;

  let canvas: HTMLCanvasElement | OffscreenCanvas;
  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;

  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(curWidth, curHeight);
    ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D | null;
  } else {
    canvas = document.createElement('canvas');
    canvas.width = curWidth;
    canvas.height = curHeight;
    ctx = (canvas as HTMLCanvasElement).getContext('2d');
  }

  if (!ctx) {
    throw new Error('Could not obtain canvas rendering context.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(imageSource, 0, 0, curWidth, curHeight);

  // Multi-step downsampling for smooth quality
  while (curWidth * 0.5 > targetWidth && curHeight * 0.5 > targetHeight) {
    curWidth = Math.floor(curWidth * 0.5);
    curHeight = Math.floor(curHeight * 0.5);

    let stepCanvas: HTMLCanvasElement | OffscreenCanvas;
    let stepCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;

    if (typeof OffscreenCanvas !== 'undefined') {
      stepCanvas = new OffscreenCanvas(curWidth, curHeight);
      stepCtx = stepCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D | null;
    } else {
      stepCanvas = document.createElement('canvas');
      stepCanvas.width = curWidth;
      stepCanvas.height = curHeight;
      stepCtx = (stepCanvas as HTMLCanvasElement).getContext('2d');
    }

    if (stepCtx) {
      stepCtx.imageSmoothingEnabled = true;
      stepCtx.imageSmoothingQuality = 'high';
      stepCtx.drawImage(canvas, 0, 0, curWidth, curHeight);
      canvas = stepCanvas;
      ctx = stepCtx;
    }
  }

  // Final draw to exact target dimensions
  let finalCanvas: HTMLCanvasElement | OffscreenCanvas;
  let finalCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;

  if (typeof OffscreenCanvas !== 'undefined') {
    finalCanvas = new OffscreenCanvas(targetWidth, targetHeight);
    finalCtx = finalCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D | null;
  } else {
    finalCanvas = document.createElement('canvas');
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;
    finalCtx = (finalCanvas as HTMLCanvasElement).getContext('2d');
  }

  if (!finalCtx) {
    throw new Error('Failed to create final canvas context');
  }

  // Fill transparent PNG backgrounds with white when converting to JPEG
  if (mimeType === 'image/jpeg') {
    finalCtx.fillStyle = '#FFFFFF';
    finalCtx.fillRect(0, 0, targetWidth, targetHeight);
  }

  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';
  finalCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

  const normalizedQuality = Math.min(Math.max(quality / 100, 0.01), 1.0);

  if ('convertToBlob' in finalCanvas) {
    try {
      return await (finalCanvas as OffscreenCanvas).convertToBlob({
        type: mimeType,
        quality: normalizedQuality,
      });
    } catch {
      return await (finalCanvas as OffscreenCanvas).convertToBlob({
        type: 'image/png',
      });
    }
  } else {
    return new Promise((resolve, reject) => {
      (finalCanvas as HTMLCanvasElement).toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else {
            (finalCanvas as HTMLCanvasElement).toBlob(
              (fallbackBlob) => {
                if (fallbackBlob) resolve(fallbackBlob);
                else reject(new Error('Canvas toBlob failed'));
              },
              'image/png'
            );
          }
        },
        mimeType,
        normalizedQuality
      );
    });
  }
}
