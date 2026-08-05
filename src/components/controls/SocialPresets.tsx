import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { SOCIAL_MEDIA_PRESETS } from '../../constants';

export const SocialPresets: React.FC = () => {
  const updateResizeSettings = useImageStore((state) => state.updateResizeSettings);

  const handleSelectSocialPreset = (width: number, height: number) => {
    updateResizeSettings({
      mode: 'dimensions',
      width,
      height,
      lockAspectRatio: false,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        Social Media Presets
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {SOCIAL_MEDIA_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleSelectSocialPreset(p.width, p.height)}
            className="flex flex-col items-start p-2 rounded-lg text-left border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 transition-colors"
          >
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{p.label}</span>
            <span className="text-[10px] font-mono text-zinc-400">
              {p.width} × {p.height}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
