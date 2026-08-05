import { AspectRatioPreset, CompressionPreset, OutputFormat, SupportedFormat } from '../types';

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

export const ACCEPTED_IMAGE_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/avif': ['.avif'],
};

export const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

export const ASPECT_RATIO_VALUES: Record<Exclude<AspectRatioPreset, 'original' | 'custom'>, number> = {
  '1:1': 1,
  '4:3': 4 / 3,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '3:2': 3 / 2,
};

export const COMPRESSION_PRESETS: Record<Exclude<CompressionPreset, 'custom'>, number> = {
  low: 90,
  medium: 75,
  high: 50,
};

export const FORMAT_MIME_TYPES: Record<Exclude<OutputFormat, 'original'>, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

export const DEFAULT_RESIZE_SETTINGS = {
  mode: 'dimensions' as const,
  width: 1920,
  height: 1080,
  percentage: 100,
  scale: 100,
  lockAspectRatio: true,
  aspectRatioPreset: 'original' as AspectRatioPreset,
  customAspectRatio: { width: 16, height: 9 },
  fitMode: 'exact' as const,
};

export const DEFAULT_OUTPUT_SETTINGS = {
  format: 'original' as OutputFormat,
  quality: 85,
  compressionPreset: 'medium' as CompressionPreset,
};

export const DEFAULT_NAMING_SETTINGS = {
  pattern: '{filename}_resized',
  suffix: '_resized',
  prefix: '',
  preserveOriginalName: false,
};
