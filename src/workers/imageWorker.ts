// Web Worker for off-main-thread image processing, transformation, watermark, and resizing

import {
  AdjustmentSettings,
  TargetSizeSettings,
  TransformSettings,
  WatermarkSettings,
} from '../types';

export interface WorkerInputMessage {
  id: string;
  fileBlob: Blob;
  targetWidth: number;
  targetHeight: number;
  mimeType: string;
  quality: number;
  transformSettings?: TransformSettings;
  targetSizeSettings?: TargetSizeSettings;
  watermarkSettings?: WatermarkSettings;
  adjustmentSettings?: AdjustmentSettings;
}

export interface WorkerOutputMessage {
  id: string;
  status: 'success' | 'error';
  blob?: Blob;
  error?: string;
  width?: number;
  height?: number;
}

self.onmessage = async (e: MessageEvent<WorkerInputMessage>) => {
  const {
    id,
    fileBlob,
    targetWidth,
    targetHeight,
    mimeType,
    quality,
    transformSettings,
    targetSizeSettings,
    watermarkSettings,
    adjustmentSettings,
  } = e.data;

  try {
    const bitmap = await createImageBitmap(fileBlob);
    let origW = bitmap.width;
    let origH = bitmap.height;

    // Handle 90° / 270° rotation dimension swapping
    const rot = transformSettings?.rotation || 0;
    const isSwapped = rot === 90 || rot === 270;
    const canvasW = isSwapped ? origH : origW;
    const canvasH = isSwapped ? origW : origH;

    // Initial canvas for rotation, flips, and adjustments
    let canvas = new OffscreenCanvas(canvasW, canvasH);
    let ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('OffscreenCanvas 2D context not supported in worker.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Apply rotation & flip transforms
    ctx.save();
    ctx.translate(canvasW / 2, canvasH / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(transformSettings?.flipH ? -1 : 1, transformSettings?.flipV ? -1 : 1);
    ctx.drawImage(bitmap, -origW / 2, -origH / 2);
    ctx.restore();
    bitmap.close();

    // Apply CSS-like filter adjustments (brightness, contrast, grayscale, sepia)
    if (adjustmentSettings) {
      const { brightness, contrast, grayscale, sepia } = adjustmentSettings;
      const filterParts: string[] = [];

      if (brightness !== 100) filterParts.push(`brightness(${brightness}%)`);
      if (contrast !== 100) filterParts.push(`contrast(${contrast}%)`);
      if (grayscale) filterParts.push('grayscale(100%)');
      if (sepia) filterParts.push('sepia(100%)');

      if (filterParts.length > 0 && 'filter' in ctx) {
        const filterStr = filterParts.join(' ');
        const tempCanvas = new OffscreenCanvas(canvasW, canvasH);
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          (tempCtx as unknown as { filter: string }).filter = filterStr;
          tempCtx.drawImage(canvas, 0, 0);
          canvas = tempCanvas;
          ctx = tempCtx;
        }
      }
    }

    // Apply Watermark overlay if enabled
    if (watermarkSettings && watermarkSettings.enabled && watermarkSettings.text.trim()) {
      ctx.save();
      const fontSize = Math.max(12, Math.round((watermarkSettings.fontSize || 24) * (canvasW / 1000)));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 6;
      ctx.globalAlpha = Math.min(Math.max(watermarkSettings.opacity || 0.7, 0.1), 1.0);

      const metrics = ctx.measureText(watermarkSettings.text);
      const textWidth = metrics.width;
      const textHeight = fontSize;
      const padding = 20;

      let x = canvasW - textWidth - padding;
      let y = canvasH - padding;

      const pos = watermarkSettings.position || 'bottom-right';
      if (pos === 'bottom-left') {
        x = padding;
        y = canvasH - padding;
      } else if (pos === 'top-right') {
        x = canvasW - textWidth - padding;
        y = padding + textHeight;
      } else if (pos === 'top-left') {
        x = padding;
        y = padding + textHeight;
      } else if (pos === 'center') {
        x = (canvasW - textWidth) / 2;
        y = (canvasH + textHeight) / 2;
      }

      ctx.fillText(watermarkSettings.text, x, y);
      ctx.restore();
    }

    // Step-down downsampling for smooth scaling quality
    let curWidth = canvasW;
    let curHeight = canvasH;

    while (curWidth * 0.5 > targetWidth && curHeight * 0.5 > targetHeight) {
      curWidth = Math.floor(curWidth * 0.5);
      curHeight = Math.floor(curHeight * 0.5);

      const stepCanvas = new OffscreenCanvas(curWidth, curHeight);
      const stepCtx = stepCanvas.getContext('2d');

      if (stepCtx) {
        stepCtx.imageSmoothingEnabled = true;
        stepCtx.imageSmoothingQuality = 'high';
        stepCtx.drawImage(canvas, 0, 0, curWidth, curHeight);
        canvas = stepCanvas;
        ctx = stepCtx;
      }
    }

    // Final render canvas
    const finalCanvas = new OffscreenCanvas(targetWidth, targetHeight);
    const finalCtx = finalCanvas.getContext('2d');

    if (!finalCtx) {
      throw new Error('Failed to create final worker OffscreenCanvas context.');
    }

    if (mimeType === 'image/jpeg') {
      finalCtx.fillStyle = '#FFFFFF';
      finalCtx.fillRect(0, 0, targetWidth, targetHeight);
    }

    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
    finalCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);

    let targetQuality = Math.min(Math.max(quality / 100, 0.01), 1.0);

    // Target File Size Matcher (Binary search quality targeting)
    if (targetSizeSettings && targetSizeSettings.enabled && targetSizeSettings.targetSizeKB > 0) {
      const maxSizeBytes = targetSizeSettings.targetSizeKB * 1024;
      let minQ = 0.05;
      let maxQ = 1.0;

      for (let i = 0; i < 6; i++) {
        const testQ = (minQ + maxQ) / 2;
        const testBlob = await finalCanvas.convertToBlob({ type: mimeType, quality: testQ });
        if (testBlob.size > maxSizeBytes) {
          maxQ = testQ;
        } else {
          minQ = testQ;
        }
      }
      targetQuality = minQ;
    }

    let outputBlob: Blob;
    try {
      outputBlob = await finalCanvas.convertToBlob({
        type: mimeType,
        quality: targetQuality,
      });
    } catch {
      outputBlob = await finalCanvas.convertToBlob({
        type: mimeType.includes('png') || mimeType.includes('avif') ? 'image/png' : 'image/jpeg',
        quality: targetQuality,
      });
    }

    const response: WorkerOutputMessage = {
      id,
      status: 'success',
      blob: outputBlob,
      width: targetWidth,
      height: targetHeight,
    };

    self.postMessage(response);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown image worker error';
    const response: WorkerOutputMessage = {
      id,
      status: 'error',
      error: errorMessage,
    };
    self.postMessage(response);
  }
};

export {};
