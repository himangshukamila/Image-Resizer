import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { WatermarkPosition } from '../../types';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';

export const WatermarkControls: React.FC = () => {
  const watermarkSettings = useImageStore((state) => state.watermarkSettings);
  const updateWatermarkSettings = useImageStore((state) => state.updateWatermarkSettings);

  const positions: { id: WatermarkPosition; label: string }[] = [
    { id: 'top-left', label: 'Top Left' },
    { id: 'top-right', label: 'Top Right' },
    { id: 'center', label: 'Center' },
    { id: 'bottom-left', label: 'Bottom Left' },
    { id: 'bottom-right', label: 'Bottom Right' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Toggle
        checked={watermarkSettings.enabled}
        onChange={(checked) => updateWatermarkSettings({ enabled: checked })}
        label="Add Text Watermark"
        description="Overlay custom text watermark on resized images"
      />

      {watermarkSettings.enabled && (
        <div className="flex flex-col gap-3 pt-1">
          <Input
            label="Watermark Text"
            value={watermarkSettings.text}
            onChange={(e) => updateWatermarkSettings({ text: e.target.value })}
            placeholder="e.g. © 2026 MyBrand"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Position
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {positions.map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => updateWatermarkSettings({ position: pos.id })}
                  className={`py-1 px-2 rounded text-xs font-medium border transition-colors ${
                    watermarkSettings.position === pos.id
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <Slider
            label="Watermark Opacity"
            min={10}
            max={100}
            step={5}
            unit="%"
            value={Math.round(watermarkSettings.opacity * 100)}
            onChange={(val) => updateWatermarkSettings({ opacity: val / 100 })}
          />
        </div>
      )}
    </div>
  );
};
