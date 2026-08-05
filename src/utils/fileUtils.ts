import saveAs from 'file-saver';
import JSZip from 'jszip';
import { NamingSettings, OutputFormat, SupportedFormat } from '../types';

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toLowerCase() || '';
}

export function getFormatFromMime(mimeType: string, filename?: string): SupportedFormat {
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('gif')) return 'gif';
  if (mimeType.includes('avif')) return 'avif';

  if (filename) {
    const ext = getFileExtension(filename);
    if (['jpg', 'jpeg'].includes(ext)) return 'jpg';
    if (ext === 'png') return 'png';
    if (ext === 'webp') return 'webp';
    if (ext === 'gif') return 'gif';
    if (ext === 'avif') return 'avif';
  }

  return 'jpg';
}

export function getTargetFileExtension(targetFormat: OutputFormat, originalFormat: SupportedFormat): string {
  if (targetFormat === 'original') {
    return (originalFormat as string) === 'jpeg' ? 'jpg' : originalFormat;
  }
  return targetFormat;
}

export function generateFileName(
  originalName: string,
  width: number,
  height: number,
  format: OutputFormat,
  originalFormat: SupportedFormat,
  naming: NamingSettings
): string {
  const extIndex = originalName.lastIndexOf('.');
  const baseName = extIndex !== -1 ? originalName.slice(0, extIndex) : originalName;
  const targetExt = getTargetFileExtension(format, originalFormat);

  if (naming.preserveOriginalName && !naming.suffix && !naming.prefix) {
    return `${baseName}.${targetExt}`;
  }

  let finalName = naming.pattern
    .replace('{filename}', baseName)
    .replace('{width}', width.toString())
    .replace('{height}', height.toString())
    .replace('{format}', targetExt);

  if (naming.prefix) {
    finalName = `${naming.prefix}${finalName}`;
  }

  if (naming.suffix && !finalName.endsWith(naming.suffix)) {
    finalName = `${finalName}${naming.suffix}`;
  }

  return `${finalName}.${targetExt}`;
}

export function downloadSingleBlob(blob: Blob, fileName: string): void {
  saveAs(blob, fileName);
}

export async function downloadZip(
  items: { blob: Blob; fileName: string }[],
  zipName = 'resized_images.zip'
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('resized_images') || zip;

  const usedNames = new Set<string>();

  items.forEach((item, index) => {
    let name = item.fileName;
    if (usedNames.has(name)) {
      const extIndex = name.lastIndexOf('.');
      if (extIndex !== -1) {
        name = `${name.slice(0, extIndex)}_${index + 1}${name.slice(extIndex)}`;
      } else {
        name = `${name}_${index + 1}`;
      }
    }
    usedNames.add(name);
    folder.file(name, item.blob);
  });

  const zipContent = await zip.generateAsync({ type: 'blob' });
  saveAs(zipContent, zipName);
}
