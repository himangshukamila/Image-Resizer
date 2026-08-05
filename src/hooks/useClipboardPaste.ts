import { useEffect } from 'react';
import { useImageStore } from '../store/useImageStore';

export function useClipboardPaste() {
  const addImages = useImageStore((state) => state.addImages);
  const addToast = useImageStore((state) => state.addToast);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData || !e.clipboardData.items) return;

      const items = Array.from(e.clipboardData.items);
      const imageFiles: File[] = [];

      for (const item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            // Rename pasted item if generic
            const name = file.name === 'image.png' ? `pasted-image-${Date.now()}.png` : file.name;
            const renamedFile = new File([file], name, { type: file.type });
            imageFiles.push(renamedFile);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        addImages(imageFiles);
        addToast({
          type: 'info',
          title: 'Pasted Image',
          description: `Pasted ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} from clipboard.`,
        });
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addImages, addToast]);
}
