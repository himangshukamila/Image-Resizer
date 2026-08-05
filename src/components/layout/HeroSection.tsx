import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="text-center py-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Resize & Convert Images
      </h1>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
        Batch resize JPG, PNG, WEBP, GIF, and AVIF images quickly in your browser. No files uploaded to any server.
      </p>
    </div>
  );
};
