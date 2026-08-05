import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatBytes } from '../../utils/fileUtils';

export const StatsPanel: React.FC = () => {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);

  const activeItem = images.find((i) => i.id === selectedImageId) || images[0];

  if (!activeItem) return null;

  const res = activeItem.processedResult;
  const isSavingsPositive = res ? res.savingsPercentage > 0 : false;

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          File Specs & Compression Analytics
        </span>
        {res && (
          <Badge variant={isSavingsPositive ? 'green' : 'neutral'} size="md">
            {isSavingsPositive ? `${res.savingsPercentage}% Smaller` : `Size Changed`}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        {/* Original Specs */}
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 flex flex-col gap-2">
          <div className="flex items-center justify-between font-sans">
            <span className="font-medium text-zinc-500 dark:text-zinc-400">Original</span>
            <span className="uppercase text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
              {activeItem.originalFormat}
            </span>
          </div>
          <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
            <span>Dimensions:</span>
            <span className="font-semibold">{activeItem.originalWidth} × {activeItem.originalHeight}</span>
          </div>
          <div className="flex justify-between text-zinc-700 dark:text-zinc-300">
            <span>File Size:</span>
            <span className="font-semibold">{formatBytes(activeItem.originalSize)}</span>
          </div>
        </div>

        {/* Output Specs */}
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 flex flex-col gap-2">
          <div className="flex items-center justify-between font-sans">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">Resized Output</span>
            <span className="uppercase text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {res?.format || activeItem.originalFormat}
            </span>
          </div>
          <div className="flex justify-between text-zinc-900 dark:text-zinc-100">
            <span>Dimensions:</span>
            <span className="font-semibold">{res ? `${res.width} × ${res.height}` : '...'}</span>
          </div>
          <div className="flex justify-between text-zinc-900 dark:text-zinc-100">
            <span>File Size:</span>
            <span className="font-semibold">{res ? formatBytes(res.size) : '...'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
