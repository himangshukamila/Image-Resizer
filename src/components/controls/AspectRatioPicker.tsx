import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { AspectRatioPreset } from '../../types';
import { Input } from '../ui/Input';
import { getAspectRatioDecimal } from '../../utils/imageUtils';

export const AspectRatioPicker: React.FC = () => {
  const resizeSettings = useImageStore((state) => state.resizeSettings);
  const updateResizeSettings = useImageStore((state) => state.updateResizeSettings);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);

  const activeItem = images.find((i) => i.id === selectedImageId) || images[0];
  const origW = activeItem ? activeItem.originalWidth : 1920;
  const origH = activeItem ? activeItem.originalHeight : 1080;

  const presets: { id: AspectRatioPreset; label: string }[] = [
    { id: 'original', label: 'Original' },
    { id: '1:1', label: '1:1' },
    { id: '16:9', label: '16:9' },
    { id: '4:3', label: '4:3' },
    { id: '9:16', label: '9:16' },
    { id: '3:2', label: '3:2' },
    { id: 'custom', label: 'Custom' },
  ];

  const handleSelectPreset = (preset: AspectRatioPreset) => {
    const ratio = getAspectRatioDecimal(preset, origW, origH, resizeSettings.customAspectRatio);
    const currentW = resizeSettings.width || origW;
    const newH = Math.max(1, Math.round(currentW / ratio));

    updateResizeSettings({
      aspectRatioPreset: preset,
      lockAspectRatio: true,
      height: newH,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        Aspect Ratio Presets
      </label>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => {
          const isSelected = resizeSettings.aspectRatioPreset === p.id;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p.id)}
              className={`py-1.5 px-3 rounded-lg text-xs font-mono font-medium border transition-colors whitespace-nowrap ${
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

      {resizeSettings.aspectRatioPreset === 'custom' && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Input
            label="Width Ratio"
            type="number"
            min={1}
            value={resizeSettings.customAspectRatio.width}
            onChange={(e) => {
              const customW = parseInt(e.target.value, 10) || 1;
              const newCustom = { ...resizeSettings.customAspectRatio, width: customW };
              const ratio = customW / newCustom.height;
              const currentW = resizeSettings.width || origW;
              updateResizeSettings({
                customAspectRatio: newCustom,
                height: Math.max(1, Math.round(currentW / ratio)),
              });
            }}
          />
          <Input
            label="Height Ratio"
            type="number"
            min={1}
            value={resizeSettings.customAspectRatio.height}
            onChange={(e) => {
              const customH = parseInt(e.target.value, 10) || 1;
              const newCustom = { ...resizeSettings.customAspectRatio, height: customH };
              const ratio = newCustom.width / customH;
              const currentW = resizeSettings.width || origW;
              updateResizeSettings({
                customAspectRatio: newCustom,
                height: Math.max(1, Math.round(currentW / ratio)),
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
