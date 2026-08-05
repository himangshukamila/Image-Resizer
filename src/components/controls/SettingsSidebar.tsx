import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ResizeControls } from './ResizeControls';
import { AspectRatioPicker } from './AspectRatioPicker';
import { QualityControls } from './QualityControls';
import { FormatControls } from './FormatControls';
import { NamingControls } from './NamingControls';
import { useImageStore } from '../../store/useImageStore';
import { RotateCcw } from 'lucide-react';

export const SettingsSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resize' | 'format' | 'naming'>('resize');
  const resetAllSettings = useImageStore((state) => state.resetAllSettings);

  return (
    <Card className="w-full flex flex-col gap-4">
      {/* Control Header & Reset Button */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          Resize Controls
        </span>
        <button
          type="button"
          onClick={resetAllSettings}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-medium cursor-pointer"
          title="Reset size and settings to original defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Control Tabs */}
      <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab('resize')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeTab === 'resize'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Resize & Scale
        </button>

        <button
          onClick={() => setActiveTab('format')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeTab === 'format'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Format & Quality
        </button>

        <button
          onClick={() => setActiveTab('naming')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${
            activeTab === 'naming'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Naming
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex flex-col gap-5 pt-1">
        {activeTab === 'resize' && (
          <>
            <ResizeControls />
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <AspectRatioPicker />
          </>
        )}

        {activeTab === 'format' && (
          <>
            <FormatControls />
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <QualityControls />
          </>
        )}

        {activeTab === 'naming' && <NamingControls />}
      </div>
    </Card>
  );
};
