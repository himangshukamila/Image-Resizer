import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ResizeControls } from './ResizeControls';
import { AspectRatioPicker } from './AspectRatioPicker';
import { SocialPresets } from './SocialPresets';
import { TransformControls } from './TransformControls';
import { QualityControls } from './QualityControls';
import { TargetSizeControls } from './TargetSizeControls';
import { FormatControls } from './FormatControls';
import { WatermarkControls } from './WatermarkControls';
import { AdjustmentControls } from './AdjustmentControls';
import { NamingControls } from './NamingControls';
import { useImageStore } from '../../store/useImageStore';
import { RotateCcw } from 'lucide-react';

export const SettingsSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resize' | 'compress' | 'format' | 'effects' | 'naming'>('resize');
  const resetAllSettings = useImageStore((state) => state.resetAllSettings);

  return (
    <Card className="w-full flex flex-col gap-4">
      {/* Control Header & Reset Button */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
          Image Resizer Studio
        </span>
        <button
          type="button"
          onClick={resetAllSettings}
          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors font-medium cursor-pointer"
          title="Reset all size, watermark, and filter settings to original defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Control Tabs */}
      <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('resize')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
            activeTab === 'resize'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Resize & Social
        </button>

        <button
          onClick={() => setActiveTab('compress')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
            activeTab === 'compress'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Compression
        </button>

        <button
          onClick={() => setActiveTab('format')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
            activeTab === 'format'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Format & Watermark
        </button>

        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
            activeTab === 'effects'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Filters
        </button>

        <button
          onClick={() => setActiveTab('naming')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
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
            <TransformControls />
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <ResizeControls />
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <SocialPresets />
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <AspectRatioPicker />
          </>
        )}

        {activeTab === 'compress' && (
          <>
            <QualityControls />
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <TargetSizeControls />
          </>
        )}

        {activeTab === 'format' && (
          <>
            <FormatControls />
            <hr className="border-zinc-200 dark:border-zinc-800" />
            <WatermarkControls />
          </>
        )}

        {activeTab === 'effects' && <AdjustmentControls />}

        {activeTab === 'naming' && <NamingControls />}
      </div>
    </Card>
  );
};
