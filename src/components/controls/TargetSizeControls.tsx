import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';

export const TargetSizeControls: React.FC = () => {
  const targetSizeSettings = useImageStore((state) => state.targetSizeSettings);
  const updateTargetSizeSettings = useImageStore((state) => state.updateTargetSizeSettings);

  return (
    <div className="flex flex-col gap-3">
      <Toggle
        checked={targetSizeSettings.enabled}
        onChange={(checked) => updateTargetSizeSettings({ enabled: checked })}
        label="Compress to Max File Size"
        description="Auto-calculate quality to stay under a specific file size limit"
      />

      {targetSizeSettings.enabled && (
        <div className="flex flex-col gap-2 pt-1">
          <Input
            label="Maximum Target Size (KB)"
            type="number"
            min={10}
            max={50000}
            value={targetSizeSettings.targetSizeKB}
            onChange={(e) =>
              updateTargetSizeSettings({
                targetSizeKB: Math.max(10, parseInt(e.target.value, 10) || 100),
              })
            }
            suffixText="KB"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[100, 200, 500, 1000].map((kb) => (
              <button
                key={kb}
                type="button"
                onClick={() => updateTargetSizeSettings({ targetSizeKB: kb })}
                className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${
                  targetSizeSettings.targetSizeKB === kb
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                Under {kb >= 1000 ? `${kb / 1000}MB` : `${kb}KB`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
