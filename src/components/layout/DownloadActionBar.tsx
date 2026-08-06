import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { Download, FolderDown } from 'lucide-react';
import { downloadSingleBlob, downloadZip, formatBytes } from '../../utils/fileUtils';

export const DownloadActionBar: React.FC = () => {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const addToast = useImageStore((state) => state.addToast);

  const activeItem = images.find((i) => i.id === selectedImageId) || images[0];
  const doneItems = images.filter((img) => img.status === 'done' && img.processedResult);

  if (images.length === 0) return null;

  const handleDownloadSingle = () => {
    if (!activeItem?.processedResult) return;
    downloadSingleBlob(activeItem.processedResult.blob, activeItem.processedResult.fileName);
    addToast({
      type: 'success',
      title: 'Saved File',
      description: `Downloaded ${activeItem.processedResult.fileName}`,
    });
  };

  const handleDownloadZip = () => {
    if (doneItems.length === 0) return;
    const items = doneItems.map((img) => ({
      blob: img.processedResult!.blob,
      fileName: img.processedResult!.fileName,
    }));

    if (items.length === 1) {
      downloadSingleBlob(items[0].blob, items[0].fileName);
    } else {
      downloadZip(items);
    }
  };

  const totalOrigSize = doneItems.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalOutSize = doneItems.reduce((acc, curr) => acc + (curr.processedResult?.size || 0), 0);
  const totalSavedBytes = Math.max(0, totalOrigSize - totalOutSize);
  const totalSavedPct =
    totalOrigSize > 0 ? parseFloat(((totalSavedBytes / totalOrigSize) * 100).toFixed(1)) : 0;

  return (
    <div className="sticky bottom-4 z-40 max-w-4xl mx-auto px-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <span>{doneItems.length} of {images.length} images processed</span>
          {totalSavedPct > 0 && (
            <span className="ml-2 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ({formatBytes(totalSavedBytes)} saved · {totalSavedPct}% reduction)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeItem?.processedResult && (
            <button
              type="button"
              onClick={handleDownloadSingle}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>Download Active</span>
            </button>
          )}

          {doneItems.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadZip}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 shadow-sm transition-colors cursor-pointer"
            >
              <FolderDown className="w-3.5 h-3.5 text-white dark:text-zinc-900" />
              <span>Download All ({doneItems.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
