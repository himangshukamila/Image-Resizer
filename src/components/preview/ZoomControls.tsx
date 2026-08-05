import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useImageStore } from '../../store/useImageStore';
import { Button } from '../ui/Button';

export const ZoomControls: React.FC = () => {
  const zoomLevel = useImageStore((state) => state.zoomLevel);
  const setZoomLevel = useImageStore((state) => state.setZoomLevel);
  const previewViewMode = useImageStore((state) => state.previewViewMode);
  const setPreviewViewMode = useImageStore((state) => state.setPreviewViewMode);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs">
      {/* View Modes */}
      <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <button
          type="button"
          onClick={() => setPreviewViewMode('split')}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
            previewViewMode === 'split'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Compare Slider
        </button>

        <button
          type="button"
          onClick={() => setPreviewViewMode('sideBySide')}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
            previewViewMode === 'sideBySide'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Side-by-Side
        </button>

        <button
          type="button"
          onClick={() => setPreviewViewMode('single')}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
            previewViewMode === 'single'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Resized Result
        </button>
      </div>

      {/* Image Zoom Toolbar (Scales image content only) */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setZoomLevel(1)}
          title="Click to reset image zoom to 100%"
          className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
        >
          {Math.round(zoomLevel * 100)}%
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))}
          title="Zoom Out Image (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(1)}
          title="Reset Image Zoom to 100%"
          leftIcon={<RotateCcw className="w-3 h-3" />}
        >
          100%
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 3))}
          title="Zoom In Image (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
