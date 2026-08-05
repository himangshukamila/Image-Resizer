export type SupportedFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif' | 'avif';
export type OutputFormat = 'original' | 'jpg' | 'png' | 'webp' | 'avif';

export type AspectRatioPreset = 'original' | '1:1' | '4:3' | '16:9' | '9:16' | '3:2' | 'custom';
export type FitMode = 'exact' | 'contain' | 'cover' | 'fill';
export type CompressionPreset = 'low' | 'medium' | 'high' | 'custom';

export type ThemeMode = 'light' | 'dark';

export interface ProcessedImageResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  savingsPercentage: number;
  compressionRatio: number;
  fileName: string;
}

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: SupportedFormat;
  aspectRatio: number;
  previewUrl: string;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  error: string | null;
  processedResult: ProcessedImageResult | null;
}

export interface ResizeSettings {
  mode: 'dimensions' | 'percentage' | 'scale';
  width: number;
  height: number;
  percentage: number;
  scale: number;
  lockAspectRatio: boolean;
  aspectRatioPreset: AspectRatioPreset;
  customAspectRatio: { width: number; height: number };
  fitMode: FitMode;
}

export interface OutputSettings {
  format: OutputFormat;
  quality: number;
  compressionPreset: CompressionPreset;
}

export interface NamingSettings {
  pattern: string;
  suffix: string;
  preserveOriginalName: boolean;
  prefix: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
