import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useImageStore } from '../../store/useImageStore';
import { Button } from '../ui/Button';

export const ZoomControls: React.FC = () => {
  const zoomLevel = useImageStore((state) => state.zoomLevel);
  const setZoomLevel = useImageStore((state) => state.setZoomLevel);
  const previewViewMode = useImageStore((state) => state.previewViewMode);
  const setPreviewViewMode = useImageStore((state) => state.setPreviewViewMode);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
      {/* View Modes */}
      <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setPreviewViewMode('split')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            previewViewMode === 'split'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Compare Slider
        </button>

        <button
          onClick={() => setPreviewViewMode('sideBySide')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            previewViewMode === 'sideBySide'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Side-by-Side
        </button>

        <button
          onClick={() => setPreviewViewMode('single')}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            previewViewMode === 'single'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Resized Result
        </button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 min-w-[40px] text-right">
          {Math.round(zoomLevel * 100)}%
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))}
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel(1)}
          title="Reset Zoom"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 3))}
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
