import React, { useState, useRef } from 'react';
import { useImageStore } from '../../store/useImageStore';
import { ZoomControls } from './ZoomControls';
import { Badge } from '../ui/Badge';
import { GripVertical, Loader2 } from 'lucide-react';

export const ComparisonViewer: React.FC = () => {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const previewViewMode = useImageStore((state) => state.previewViewMode);
  const zoomLevel = useImageStore((state) => state.zoomLevel);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = images.find((i) => i.id === selectedImageId) || images[0];

  if (!activeItem) return null;

  const originalUrl = activeItem.previewUrl;
  const processedUrl = activeItem.processedResult?.url || originalUrl;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <ZoomControls />

      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[360px] sm:h-[460px] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center select-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #18181b 25%, transparent 25%), 
            linear-gradient(-45deg, #18181b 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #18181b 75%), 
            linear-gradient(-45deg, transparent 75%, #18181b 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        {activeItem.status === 'processing' && (
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-2 text-white">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
            <span className="text-xs font-mono">Processing canvas...</span>
          </div>
        )}

        {/* View Mode: Split Slider */}
        {previewViewMode === 'split' && (
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.1s ease-out' }}
          >
            {/* After image (Background layer) */}
            <img
              src={processedUrl}
              alt="Resized Image"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="green" size="sm">
                Resized ({activeItem.processedResult?.width || activeItem.originalWidth}×
                {activeItem.processedResult?.height || activeItem.originalHeight})
              </Badge>
            </div>

            {/* Before image (Clipped Foreground layer) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={originalUrl}
                alt="Original Image"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              />
              <div className="absolute top-3 left-3 z-10">
                <Badge variant="neutral" size="sm">
                  Original ({activeItem.originalWidth}×{activeItem.originalHeight})
                </Badge>
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20 cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-zinc-900 border border-zinc-300 flex items-center justify-center shadow">
                <GripVertical className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Side by Side */}
        {previewViewMode === 'sideBySide' && (
          <div
            className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 overflow-hidden"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.1s ease-out' }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
              <span className="absolute top-2 left-2 z-10">
                <Badge variant="neutral" size="sm">
                  Original
                </Badge>
              </span>
              <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />
            </div>

            <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
              <span className="absolute top-2 left-2 z-10">
                <Badge variant="green" size="sm">
                  Resized Output
                </Badge>
              </span>
              <img src={processedUrl} alt="Processed" className="w-full h-full object-contain" />
            </div>
          </div>
        )}

        {/* View Mode: Single Output */}
        {previewViewMode === 'single' && (
          <div
            className="relative w-full h-full p-3 flex items-center justify-center overflow-hidden"
            style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.1s ease-out' }}
          >
            <img src={processedUrl} alt="Resized Output" className="w-full h-full object-contain" />
            <div className="absolute top-3 left-3">
              <Badge variant="green" size="sm">
                Resized Result
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
