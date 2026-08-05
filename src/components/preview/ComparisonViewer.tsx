import React, { useState, useRef, useEffect } from 'react';
import { useImageStore } from '../../store/useImageStore';
import { ZoomControls } from './ZoomControls';
import { Badge } from '../ui/Badge';
import { GripVertical, Loader2 } from 'lucide-react';

export const ComparisonViewer: React.FC = () => {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const previewViewMode = useImageStore((state) => state.previewViewMode);
  const zoomLevel = useImageStore((state) => state.zoomLevel);
  const setZoomLevel = useImageStore((state) => state.setZoomLevel);

  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(zoomLevel);

  const activeItem = images.find((i) => i.id === selectedImageId) || images[0];

  const originalUrl = activeItem?.previewUrl || '';
  const processedUrl = activeItem?.processedResult?.url || originalUrl;

  // Prevent browser zoom and handle Ctrl/Cmd + Wheel zoom strictly for image
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [setZoomLevel]);

  if (!activeItem) return null;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPosition(pos);
  };

  // 2-finger touch pinch zoom for mobile/trackpads on image
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      initialZoomRef.current = zoomLevel;
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = currentDist / touchStartDistRef.current;
      const newZoom = Math.min(Math.max(initialZoomRef.current * scale, 0.5), 3);
      setZoomLevel(newZoom);
    } else if (e.touches.length === 1 && isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    touchStartDistRef.current = null;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <ZoomControls />

      {/* Fixed Container Frame - Page layout never zooms */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[360px] sm:h-[460px] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center select-none touch-none"
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
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Fixed Badges */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <Badge variant="neutral" size="sm">
                Original ({activeItem.originalWidth}×{activeItem.originalHeight})
              </Badge>
            </div>
            <div className="absolute top-3 right-3 z-20 pointer-events-none">
              <Badge variant="green" size="sm">
                Resized ({activeItem.processedResult?.width || activeItem.originalWidth}×
                {activeItem.processedResult?.height || activeItem.originalHeight})
              </Badge>
            </div>

            {/* Image Content Layer ONLY receives scale transform */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              {/* After image (Background layer) */}
              <img
                src={processedUrl}
                alt="Resized Image"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

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
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 overflow-hidden">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
              <span className="absolute top-2 left-2 z-20 pointer-events-none">
                <Badge variant="neutral" size="sm">
                  Original
                </Badge>
              </span>
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                <img src={originalUrl} alt="Original" className="w-full h-full object-contain pointer-events-none" />
              </div>
            </div>

            <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2">
              <span className="absolute top-2 left-2 z-20 pointer-events-none">
                <Badge variant="green" size="sm">
                  Resized Output
                </Badge>
              </span>
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              >
                <img src={processedUrl} alt="Processed" className="w-full h-full object-contain pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Single Output */}
        {previewViewMode === 'single' && (
          <div className="relative w-full h-full p-3 flex items-center justify-center overflow-hidden">
            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <Badge variant="green" size="sm">
                Resized Result
              </Badge>
            </div>
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-75"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              <img src={processedUrl} alt="Resized Output" className="w-full h-full object-contain pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
