import React from 'react';
import { useImageStore } from '../../store/useImageStore';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';

export const NamingControls: React.FC = () => {
  const namingSettings = useImageStore((state) => state.namingSettings);
  const updateNamingSettings = useImageStore((state) => state.updateNamingSettings);

  const suffixPresets = ['_resized', '_1080w', '_compressed'];

  return (
    <div className="flex flex-col gap-3">
      <Toggle
        checked={namingSettings.preserveOriginalName}
        onChange={(checked) => updateNamingSettings({ preserveOriginalName: checked })}
        label="Preserve Original Filename"
        description="Keep original filename unchanged"
      />

      {!namingSettings.preserveOriginalName && (
        <div className="flex flex-col gap-3 pt-1">
          <Input
            label="File Suffix / Pattern"
            value={namingSettings.suffix || namingSettings.pattern}
            onChange={(e) => updateNamingSettings({ suffix: e.target.value, pattern: e.target.value })}
            placeholder="_resized"
          />

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500 font-medium">Presets:</span>
            {suffixPresets.map((sfx) => (
              <button
                key={sfx}
                type="button"
                onClick={() => updateNamingSettings({ suffix: sfx, pattern: `{filename}${sfx}` })}
                className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${
                  namingSettings.suffix === sfx
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                {sfx}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
