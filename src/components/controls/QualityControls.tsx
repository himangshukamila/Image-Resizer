import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { CompressionPreset } from '../../types';
import { Slider } from '../ui/Slider';

export const QualityControls: React.FC = () => {
  const outputSettings = useImageStore((state) => state.outputSettings);
  const updateOutputSettings = useImageStore((state) => state.updateOutputSettings);
  const applyCompressionPreset = useImageStore((state) => state.applyCompressionPreset);

  const presets: { id: CompressionPreset; label: string }[] = [
    { id: 'low', label: 'Low (90%)' },
    { id: 'medium', label: 'Medium (75%)' },
    { id: 'high', label: 'High (50%)' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Compression Level
        </label>

        <div className="grid grid-cols-3 gap-1.5">
          {presets.map((p) => {
            const isSelected = outputSettings.compressionPreset === p.id;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyCompressionPreset(p.id)}
                className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <Slider
        label="Quality Level"
        min={1}
        max={100}
        step={1}
        unit="%"
        value={outputSettings.quality}
        onChange={(val) => {
          updateOutputSettings({ quality: val, compressionPreset: 'custom' });
        }}
        marks={[
          { value: 1, label: '1%' },
          { value: 50, label: '50%' },
          { value: 85, label: '85%' },
          { value: 100, label: '100%' },
        ]}
      />
    </div>
  );
};
