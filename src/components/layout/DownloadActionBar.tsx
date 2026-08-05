import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { Button } from '../ui/Button';
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
    <div className="sticky bottom-4 z-30 max-w-4xl mx-auto px-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg border border-zinc-800 dark:border-zinc-200">
        <div className="text-xs font-medium">
          <span>{doneItems.length} of {images.length} images processed</span>
          {totalSavedPct > 0 && (
            <span className="ml-2 font-mono text-emerald-400 dark:text-emerald-600 font-semibold">
              ({formatBytes(totalSavedBytes)} saved · {totalSavedPct}% reduction)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeItem?.processedResult && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSingle}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="bg-transparent border-zinc-700 dark:border-zinc-300 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              Download Active
            </Button>
          )}

          {doneItems.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadZip}
              leftIcon={<FolderDown className="w-3.5 h-3.5" />}
              className="bg-white text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              Download ZIP ({doneItems.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
