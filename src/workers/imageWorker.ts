// Web Worker for off-main-thread image processing & resizing

export interface WorkerInputMessage {
  id: string;
  fileBlob: Blob;
  targetWidth: number;
  targetHeight: number;
  mimeType: string;
  quality: number;
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
  const { id, fileBlob, targetWidth, targetHeight, mimeType, quality } = e.data;

  try {
    const bitmap = await createImageBitmap(fileBlob);
    let curWidth = bitmap.width;
    let curHeight = bitmap.height;

    let canvas = new OffscreenCanvas(curWidth, curHeight);
    let ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('OffscreenCanvas 2D context not supported in worker.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, curWidth, curHeight);
    bitmap.close();

    // Multi-step downsampling for maximum quality and anti-aliasing
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

    const normalizedQuality = Math.min(Math.max(quality / 100, 0.01), 1.0);

    let outputBlob: Blob;
    try {
      outputBlob = await finalCanvas.convertToBlob({
        type: mimeType,
        quality: normalizedQuality,
      });
    } catch {
      // Fallback format if target codec isn't supported by browser engine (e.g. AVIF fallback)
      outputBlob = await finalCanvas.convertToBlob({
        type: mimeType.includes('png') || mimeType.includes('avif') ? 'image/png' : 'image/jpeg',
        quality: normalizedQuality,
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
