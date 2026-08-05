import imageCompression from 'browser-image-compression';
import { NamingSettings, OutputSettings, ProcessedImageResult, ResizeSettings, SupportedFormat } from '../types';
import { calculateSavings, calculateTargetDimensions, getMimeTypeForOutput, resizeImageCanvas } from '../utils/imageUtils';
import { generateFileName } from '../utils/fileUtils';

export class ImageProcessingService {
  private worker: Worker | null = null;
  private workerCallbacks: Map<string, (msg: { blob?: Blob; error?: string }) => void> = new Map();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') {
      try {
        this.worker = new Worker(new URL('../workers/imageWorker.ts', import.meta.url), {
          type: 'module',
        });

        this.worker.onmessage = (e: MessageEvent) => {
          const { id, status, blob, error } = e.data;
          const callback = this.workerCallbacks.get(id);
          if (callback) {
            callback({ blob, error: status === 'error' ? error : undefined });
            this.workerCallbacks.delete(id);
          }
        };

        this.worker.onerror = () => {
          this.worker = null;
        };
      } catch {
        this.worker = null;
      }
    }
  }

  public async processImage(
    id: string,
    file: File,
    originalWidth: number,
    originalHeight: number,
    originalFormat: SupportedFormat,
    resizeSettings: ResizeSettings,
    outputSettings: OutputSettings,
    namingSettings: NamingSettings
  ): Promise<ProcessedImageResult> {
    const targetDim = calculateTargetDimensions(resizeSettings, originalWidth, originalHeight);
    const mimeType = getMimeTypeForOutput(outputSettings.format, originalFormat);
    const quality = outputSettings.quality;

    let resultBlob: Blob;

    // Step 1: High-precision Lanczos/Bicubic step-down canvas resizing
    if (this.worker) {
      try {
        resultBlob = await new Promise<Blob>((resolve, reject) => {
          this.workerCallbacks.set(id, ({ blob, error }) => {
            if (error || !blob) {
              reject(new Error(error || 'Worker image generation failed.'));
            } else {
              resolve(blob);
            }
          });

          this.worker?.postMessage({
            id,
            fileBlob: file,
            targetWidth: targetDim.width,
            targetHeight: targetDim.height,
            mimeType,
            quality,
          });
        });
      } catch {
        resultBlob = await this.processOnMainThread(file, targetDim.width, targetDim.height, mimeType, quality);
      }
    } else {
      resultBlob = await this.processOnMainThread(file, targetDim.width, targetDim.height, mimeType, quality);
    }

    // Step 2: Extra multi-pass compression optimization via browser-image-compression if needed
    if (quality < 100 && (mimeType === 'image/jpeg' || mimeType === 'image/webp')) {
      try {
        const intermediateFile = new File([resultBlob], file.name, { type: mimeType });
        const options = {
          maxSizeMB: 50,
          maxWidthOrHeight: Math.max(targetDim.width, targetDim.height),
          useWebWorker: true,
          fileType: mimeType,
          initialQuality: quality / 100,
        };
        const compressedBlob = await imageCompression(intermediateFile, options);
        if (compressedBlob.size > 0 && compressedBlob.size <= resultBlob.size) {
          resultBlob = compressedBlob;
        }
      } catch {
        // Fall back to step 1 result if browser-image-compression is bypassed
      }
    }

    const { savingsPercentage, compressionRatio } = calculateSavings(file.size, resultBlob.size);
    const fileName = generateFileName(
      file.name,
      targetDim.width,
      targetDim.height,
      outputSettings.format,
      originalFormat,
      namingSettings
    );

    const url = URL.createObjectURL(resultBlob);

    return {
      blob: resultBlob,
      url,
      width: targetDim.width,
      height: targetDim.height,
      size: resultBlob.size,
      format: mimeType.split('/')[1] || outputSettings.format,
      savingsPercentage,
      compressionRatio,
      fileName,
    };
  }

  private async processOnMainThread(
    file: File,
    width: number,
    height: number,
    mimeType: string,
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = async () => {
        try {
          const blob = await resizeImageCanvas(img, width, height, mimeType, quality);
          URL.revokeObjectURL(objectUrl);
          resolve(blob);
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image on main thread.'));
      };

      img.src = objectUrl;
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const imageProcessingService = new ImageProcessingService();
