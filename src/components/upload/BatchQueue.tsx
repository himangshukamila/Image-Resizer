import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, Trash2, RefreshCw, FolderDown } from 'lucide-react';
import { useImageStore } from '../../store/useImageStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatBytes, downloadSingleBlob, downloadZip } from '../../utils/fileUtils';

export const BatchQueue: React.FC = () => {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const setSelectedImageId = useImageStore((state) => state.setSelectedImageId);
  const removeImage = useImageStore((state) => state.removeImage);
  const clearAllImages = useImageStore((state) => state.clearAllImages);
  const processAllImages = useImageStore((state) => state.processAllImages);
  const isProcessingAll = useImageStore((state) => state.isProcessingAll);
  const addToast = useImageStore((state) => state.addToast);

  if (images.length === 0) return null;

  const doneItems = images.filter((img) => img.status === 'done' && img.processedResult);

  const handleDownloadAll = () => {
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

    addToast({
      type: 'success',
      title: 'Downloading Batch',
      description: `Downloading ${items.length} images.`,
    });
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Uploaded Queue ({images.length})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={processAllImages}
            isLoading={isProcessingAll}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Re-process
          </Button>

          {doneItems.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadAll}
              leftIcon={<FolderDown className="w-3.5 h-3.5" />}
            >
              Download All ZIP ({doneItems.length})
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllImages}
            className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Queue items */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {images.map((item) => {
            const isSelected = item.id === selectedImageId;
            const res = item.processedResult;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => setSelectedImageId(item.id)}
                className={`group flex items-center justify-between gap-3 p-2.5 rounded-lg border transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-600'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-10 h-10 rounded object-cover bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-zinc-400">
                        {item.originalFormat}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {item.originalWidth}×{item.originalHeight} ({formatBytes(item.originalSize)})
                      {res && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-1.5">
                          → {res.width}×{res.height} ({formatBytes(res.size)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {item.status === 'processing' && (
                    <RefreshCw className="w-4 h-4 animate-spin text-zinc-400" />
                  )}

                  {item.status === 'done' && res && (
                    <div className="flex items-center gap-1.5">
                      {res.savingsPercentage > 0 && (
                        <Badge variant="green" size="sm">
                          -{res.savingsPercentage}%
                        </Badge>
                      )}
                      <button
                        onClick={() => downloadSingleBlob(res.blob, res.fileName)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => removeImage(item.id)}
                    className="p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
