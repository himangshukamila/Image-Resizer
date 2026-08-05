import React, { useRef, useState } from 'react';
import { Upload, Plus, FileImage } from 'lucide-react';
import { useImageStore } from '../../store/useImageStore';
import { ACCEPTED_EXTENSIONS } from '../../constants';

interface DropzoneProps {
  compact?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ compact = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addImages = useImageStore((state) => state.addImages);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPTED_EXTENSIONS.join(',')}
        onChange={handleFileChange}
        className="hidden"
        id="image-upload-input"
        aria-label="Upload image files"
      />

      {compact ? (
        /* Compact "Add More Files" Bar when images exist */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group cursor-pointer rounded-xl border border-dashed py-3 px-4 text-center flex items-center justify-between transition-all duration-200 ${
            isDragOver
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <span>Add more images or drop files here</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <span className="hidden sm:inline">Supports JPG, PNG, WEBP, GIF, AVIF</span>
            <kbd className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 text-[10px] font-semibold">
              ⌘V
            </kbd>
          </div>
        </div>
      ) : (
        /* Large Primary Dropzone for empty home state */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group cursor-pointer rounded-2xl border-2 border-dashed min-h-[220px] sm:min-h-[260px] py-12 sm:py-16 px-8 text-center flex items-center justify-center transition-all duration-200 ${
            isDragOver
              ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100/80 dark:bg-zinc-800/80 scale-[1.005]'
              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs'
          }`}
        >
          <div className="flex flex-col items-center justify-center max-w-md mx-auto gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center transition-transform group-hover:scale-110">
              <Upload className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Click to upload or drag & drop images
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Supports JPG, PNG, WEBP, GIF, AVIF up to 50MB (or paste with <kbd className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">⌘V</kbd>)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
