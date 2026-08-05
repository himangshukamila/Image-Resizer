import React from 'react';
import { Sun, Moon, Image as ImageIcon } from 'lucide-react';
import { useImageStore } from '../../store/useImageStore';
import { useTheme } from '../../hooks/useTheme';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const images = useImageStore((state) => state.images);
  const doneCount = images.filter((i) => i.status === 'done').length;

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900">
            <ImageIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            ImageResizer
          </span>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-4">
          {images.length > 0 && (
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {doneCount}/{images.length} processed
            </span>
          )}

          {/* Theme switcher: Light & Dark only */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
