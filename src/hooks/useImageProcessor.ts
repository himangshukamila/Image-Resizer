import { useImageStore } from '../store/useImageStore';

export function useImageProcessor() {
  const images = useImageStore((state) => state.images);
  const selectedImageId = useImageStore((state) => state.selectedImageId);
  const isProcessingAll = useImageStore((state) => state.isProcessingAll);
  const processSingleImage = useImageStore((state) => state.processSingleImage);
  const processAllImages = useImageStore((state) => state.processAllImages);
  const clearAllImages = useImageStore((state) => state.clearAllImages);

  const selectedImage = images.find((img) => img.id === selectedImageId) || images[0] || null;

  const totalOriginalBytes = images.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalProcessedBytes = images.reduce(
    (acc, curr) => acc + (curr.processedResult?.size || curr.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalProcessedBytes);
  const overallSavingsPercentage =
    totalOriginalBytes > 0
      ? parseFloat(((totalSavedBytes / totalOriginalBytes) * 100).toFixed(1))
      : 0;

  return {
    images,
    selectedImage,
    isProcessingAll,
    processSingleImage,
    processAllImages,
    clearAllImages,
    totalOriginalBytes,
    totalProcessedBytes,
    totalSavedBytes,
    overallSavingsPercentage,
  };
}
