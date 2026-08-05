import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { OutputFormat } from '../../types';

export const FormatControls: React.FC = () => {
  const outputSettings = useImageStore((state) => state.outputSettings);
  const updateOutputSettings = useImageStore((state) => state.updateOutputSettings);

  const formats: { id: OutputFormat; label: string }[] = [
    { id: 'original', label: 'Original' },
    { id: 'jpg', label: 'JPG' },
    { id: 'png', label: 'PNG' },
    { id: 'webp', label: 'WEBP' },
    { id: 'avif', label: 'AVIF' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        Output Format
      </label>

      <div className="grid grid-cols-5 gap-1.5">
        {formats.map((f) => {
          const isSelected = outputSettings.format === f.id;

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => updateOutputSettings({ format: f.id })}
              className={`py-1.5 rounded-lg text-xs font-mono font-medium border uppercase transition-colors ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
