import React from 'react';
import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/layout/HeroSection';
import { Dropzone } from '../components/upload/Dropzone';
import { BatchQueue } from '../components/upload/BatchQueue';
import { ComparisonViewer } from '../components/preview/ComparisonViewer';
import { StatsPanel } from '../components/preview/StatsPanel';
import { SettingsSidebar } from '../components/controls/SettingsSidebar';
import { DownloadActionBar } from '../components/layout/DownloadActionBar';
import { ToastContainer } from '../components/ui/ToastContainer';
import { useClipboardPaste } from '../hooks/useClipboardPaste';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useTheme } from '../hooks/useTheme';
import { useImageStore } from '../store/useImageStore';

export const ResizerApp: React.FC = () => {
  useClipboardPaste();
  useKeyboardShortcuts();
  useTheme();

  const images = useImageStore((state) => state.images);
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        {!hasImages ? (
          <>
            <HeroSection />
            <section aria-label="Image Upload Zone">
              <Dropzone compact={false} />
            </section>
          </>
        ) : (
          <>
            {/* Compact "Add More Files" Bar when workspace is active */}
            <section aria-label="Add More Files">
              <Dropzone compact={true} />
            </section>

            {/* Batch Queue */}
            <section aria-label="Batch Queue">
              <BatchQueue />
            </section>

            {/* Workspace: Preview & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Preview Column */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <ComparisonViewer />
                <StatsPanel />
              </div>

              {/* Right Controls Column */}
              <div className="lg:col-span-5 sticky top-6">
                <SettingsSidebar />
              </div>
            </div>
          </>
        )}
      </main>

      <DownloadActionBar />
      <ToastContainer />
    </div>
  );
};
