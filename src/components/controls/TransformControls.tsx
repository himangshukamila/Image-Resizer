import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

export const TransformControls: React.FC = () => {
  const transformSettings = useImageStore((state) => state.transformSettings);
  const updateTransformSettings = useImageStore((state) => state.updateTransformSettings);

  const handleRotateLeft = () => {
    const nextRot = (transformSettings.rotation - 90 + 360) % 360;
    updateTransformSettings({ rotation: nextRot });
  };

  const handleRotateRight = () => {
    const nextRot = (transformSettings.rotation + 90) % 360;
    updateTransformSettings({ rotation: nextRot });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        Rotation & Flips
      </label>

      <div className="grid grid-cols-4 gap-1.5">
        <button
          type="button"
          onClick={handleRotateLeft}
          title="Rotate 90° Counter-Clockwise"
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>-90°</span>
        </button>

        <button
          type="button"
          onClick={handleRotateRight}
          title="Rotate 90° Clockwise"
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>+90°</span>
        </button>

        <button
          type="button"
          onClick={() => updateTransformSettings({ flipH: !transformSettings.flipH })}
          title="Flip Horizontal"
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
            transformSettings.flipH
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
          }`}
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span>Flip H</span>
        </button>

        <button
          type="button"
          onClick={() => updateTransformSettings({ flipV: !transformSettings.flipV })}
          title="Flip Vertical"
          className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
            transformSettings.flipV
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
          }`}
        >
          <FlipVertical className="w-3.5 h-3.5" />
          <span>Flip V</span>
        </button>
      </div>
    </div>
  );
};
