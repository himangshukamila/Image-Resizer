import { useEffect } from 'react';
import { useImageStore } from '../store/useImageStore';
import { downloadSingleBlob, downloadZip } from '../utils/fileUtils';

export function useKeyboardShortcuts() {
  const setZoomLevel = useImageStore((state) => state.setZoomLevel);
  const clearAllImages = useImageStore((state) => state.clearAllImages);
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const addToast = useImageStore((state) => state.addToast);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside input elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const doneItems = images
          .filter((img) => img.status === 'done' && img.processedResult)
          .map((img) => ({
            blob: img.processedResult!.blob,
            fileName: img.processedResult!.fileName,
          }));

        if (doneItems.length > 0) {
          if (doneItems.length === 1) {
            downloadSingleBlob(doneItems[0].blob, doneItems[0].fileName);
          } else {
            downloadZip(doneItems);
          }
          addToast({
            type: 'success',
            title: 'Download Triggered',
            description: `Downloading ${doneItems.length} processed image${doneItems.length > 1 ? 's' : ''}.`,
          });
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        clearAllImages();
        return;
      }

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        setZoomLevel((prev) => Math.min(prev + 0.25, 3));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoomLevel(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setZoomLevel, clearAllImages, images, selectedImageId, addToast]);
}
