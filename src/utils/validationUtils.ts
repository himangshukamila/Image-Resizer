import { ACCEPTED_EXTENSIONS, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '../constants';
import { formatBytes, getFileExtension } from './fileUtils';

export interface ValidationResult {
  valid: boolean;
  width?: number;
  height?: number;
  error?: string;
}

export function validateFileBasic(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds maximum limit of ${formatBytes(MAX_FILE_SIZE_BYTES)}.`,
    };
  }

  const extension = `.${getFileExtension(file.name)}`;
  const isValidType =
    Object.keys(ACCEPTED_IMAGE_TYPES).includes(file.type) ||
    ACCEPTED_EXTENSIONS.includes(extension.toLowerCase());

  if (!isValidType) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || extension}). Accepted formats: JPG, PNG, WEBP, GIF, AVIF.`,
    };
  }

  return { valid: true };
}

export async function detectCorruptedImageAndGetDimensions(file: File): Promise<ValidationResult> {
  const basic = validateFileBasic(file);
  if (!basic.valid) {
    return basic;
  }

  // Check if createImageBitmap is available
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      const width = bitmap.width;
      const height = bitmap.height;
      bitmap.close();
      if (width === 0 || height === 0) {
        return { valid: false, error: 'Corrupted image: Image dimensions are 0x0.' };
      }
      return { valid: true, width, height };
    } catch (err) {
      // Fallback to Image element decode
    }
  }

  return new Promise<ValidationResult>((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      URL.revokeObjectURL(url);

      if (width === 0 || height === 0) {
        resolve({ valid: false, error: 'Corrupted or unreadable image file.' });
      } else {
        resolve({ valid: true, width, height });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Failed to decode image. File may be corrupted or in an unsupported codec format.',
      });
    };

    img.src = url;
  });
}
