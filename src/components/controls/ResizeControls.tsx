import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Link2, Link2Off } from 'lucide-react';
import { getAspectRatioDecimal } from '../../utils/imageUtils';

export const ResizeControls: React.FC = () => {
  const resizeSettings = useImageStore((state) => state.resizeSettings);
  const updateResizeSettings = useImageStore((state) => state.updateResizeSettings);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);

  const activeItem = images.find((i) => i.id === selectedImageId) || images[0];
  const origW = activeItem ? activeItem.originalWidth : 1920;
  const origH = activeItem ? activeItem.originalHeight : 1080;

  const currentRatio = getAspectRatioDecimal(
    resizeSettings.aspectRatioPreset,
    origW,
    origH,
    resizeSettings.customAspectRatio
  );

  const handleWidthChange = (val: string) => {
    const w = parseInt(val, 10);
    if (isNaN(w) || w <= 0) {
      updateResizeSettings({ width: 0 });
      return;
    }

    if (resizeSettings.lockAspectRatio && currentRatio > 0) {
      const h = Math.max(1, Math.round(w / currentRatio));
      updateResizeSettings({ width: w, height: h });
    } else {
      updateResizeSettings({ width: w });
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val, 10);
    if (isNaN(h) || h <= 0) {
      updateResizeSettings({ height: 0 });
      return;
    }

    if (resizeSettings.lockAspectRatio && currentRatio > 0) {
      const w = Math.max(1, Math.round(h * currentRatio));
      updateResizeSettings({ height: h, width: w });
    } else {
      updateResizeSettings({ height: h });
    }
  };

  const percentagePresets = [25, 50, 75, 100, 150, 200];

  return (
    <div className="flex flex-col gap-4">
      {/* Mode Tabs */}
      <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => updateResizeSettings({ mode: 'dimensions' })}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
            resizeSettings.mode === 'dimensions'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Dimensions
        </button>
        <button
          onClick={() => updateResizeSettings({ mode: 'percentage' })}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
            resizeSettings.mode === 'percentage'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Percentage
        </button>
        <button
          onClick={() => updateResizeSettings({ mode: 'scale' })}
          className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
            resizeSettings.mode === 'scale'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Custom Scale
        </button>
      </div>

      {/* Mode: Dimensions */}
      {resizeSettings.mode === 'dimensions' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                label="Width"
                type="number"
                min={1}
                max={10000}
                value={resizeSettings.width || ''}
                onChange={(e) => handleWidthChange(e.target.value)}
                suffixText="px"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const nextLock = !resizeSettings.lockAspectRatio;
                if (nextLock && currentRatio > 0) {
                  const w = resizeSettings.width || origW;
                  const h = Math.max(1, Math.round(w / currentRatio));
                  updateResizeSettings({ lockAspectRatio: true, height: h });
                } else {
                  updateResizeSettings({ lockAspectRatio: false });
                }
              }}
              title={resizeSettings.lockAspectRatio ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
              className={`p-2 rounded-lg border mb-0.5 transition-colors ${
                resizeSettings.lockAspectRatio
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {resizeSettings.lockAspectRatio ? (
                <Link2 className="w-4 h-4" />
              ) : (
                <Link2Off className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1">
              <Input
                label="Height"
                type="number"
                min={1}
                max={10000}
                value={resizeSettings.height || ''}
                onChange={(e) => handleHeightChange(e.target.value)}
                suffixText="px"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode: Percentage */}
      {resizeSettings.mode === 'percentage' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Scale Percentage
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {percentagePresets.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => updateResizeSettings({ percentage: pct })}
                className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                  resizeSettings.percentage === pct
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode: Custom Scale Slider */}
      {resizeSettings.mode === 'scale' && (
        <Slider
          label="Scale Factor"
          min={1}
          max={500}
          step={1}
          unit="%"
          value={resizeSettings.scale}
          onChange={(val) => updateResizeSettings({ scale: val })}
          marks={[
            { value: 25, label: '25%' },
            { value: 100, label: '100%' },
            { value: 250, label: '250%' },
            { value: 500, label: '500%' },
          ]}
        />
      )}
    </div>
  );
};
