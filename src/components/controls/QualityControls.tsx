import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { CompressionPreset } from '../../types';
import { Slider } from '../ui/Slider';
import { formatBytes } from '../../utils/fileUtils';
import { Sparkles } from 'lucide-react';

export const QualityControls: React.FC = () => {
  const outputSettings = useImageStore((state) => state.outputSettings);
  const updateOutputSettings = useImageStore((state) => state.updateOutputSettings);
  const applyCompressionPreset = useImageStore((state) => state.applyCompressionPreset);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);

  const activeItem = images.find((i) => i.id === selectedImageId) || images[0];
  const res = activeItem?.processedResult;

  const presets: { id: CompressionPreset; label: string; desc: string }[] = [
    { id: 'low', label: 'Low', desc: '90% Quality' },
    { id: 'medium', label: 'Medium', desc: '75% Quality' },
    { id: 'high', label: 'High', desc: '50% Quality' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Live Savings Callout */}
      {res && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Compression Result</span>
          </div>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
            {formatBytes(activeItem.originalSize)} → {formatBytes(res.size)} ({res.savingsPercentage > 0 ? `-${res.savingsPercentage}%` : 'Size changed'})
          </span>
        </div>
      )}

      {/* Preset Buttons */}
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
                className={`py-2 px-2 rounded-lg text-xs font-medium border flex flex-col items-center gap-0.5 transition-colors ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                <span className="font-semibold">{p.label}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`}>
                  {p.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality Slider */}
      <Slider
        label="Custom Quality Slider"
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
          { value: 75, label: '75%' },
          { value: 90, label: '90%' },
          { value: 100, label: '100%' },
        ]}
      />
    </div>
  );
};
