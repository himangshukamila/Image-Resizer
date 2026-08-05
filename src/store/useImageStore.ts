import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  COMPRESSION_PRESETS,
  DEFAULT_NAMING_SETTINGS,
  DEFAULT_OUTPUT_SETTINGS,
  DEFAULT_RESIZE_SETTINGS,
} from '../constants';
import { imageProcessingService } from '../services/imageProcessingService';
import {
  CompressionPreset,
  ImageFileItem,
  NamingSettings,
  OutputSettings,
  ResizeSettings,
  ThemeMode,
  ToastMessage,
} from '../types';
import { getFormatFromMime } from '../utils/fileUtils';
import { detectCorruptedImageAndGetDimensions } from '../utils/validationUtils';

interface ImageState {
  // File queue
  images: ImageFileItem[];
  selectedImageId: string | null;
  isProcessingAll: boolean;

  // Settings (persisted)
  resizeSettings: ResizeSettings;
  outputSettings: OutputSettings;
  namingSettings: NamingSettings;
  theme: ThemeMode;

  // UI States
  previewViewMode: 'single' | 'split' | 'sideBySide';
  zoomLevel: number;
  toasts: ToastMessage[];

  // Actions
  addImages: (files: FileList | File[]) => Promise<void>;
  removeImage: (id: string) => void;
  clearAllImages: () => void;
  setSelectedImageId: (id: string | null) => void;

  updateResizeSettings: (settings: Partial<ResizeSettings>) => void;
  updateOutputSettings: (settings: Partial<OutputSettings>) => void;
  updateNamingSettings: (settings: Partial<NamingSettings>) => void;
  applyCompressionPreset: (preset: CompressionPreset) => void;
  resetAllSettings: () => void;

  setTheme: (theme: ThemeMode) => void;
  setPreviewViewMode: (mode: 'single' | 'split' | 'sideBySide') => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;

  processSingleImage: (id: string) => Promise<void>;
  processAllImages: () => Promise<void>;

  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useImageStore = create<ImageState>()(
  persist(
    (set, get) => ({
      images: [],
      selectedImageId: null,
      isProcessingAll: false,

      resizeSettings: DEFAULT_RESIZE_SETTINGS,
      outputSettings: DEFAULT_OUTPUT_SETTINGS,
      namingSettings: DEFAULT_NAMING_SETTINGS,
      theme: 'light',

      previewViewMode: 'split',
      zoomLevel: 1,
      toasts: [],

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast: ToastMessage = { ...toast, id, duration: toast.duration || 4000 };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
      },

      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },

      addImages: async (fileList) => {
        const filesArray = Array.from(fileList);
        if (filesArray.length === 0) return;

        const newItems: ImageFileItem[] = [];
        let errorCount = 0;

        for (const file of filesArray) {
          const validation = await detectCorruptedImageAndGetDimensions(file);

          if (!validation.valid || !validation.width || !validation.height) {
            errorCount++;
            get().addToast({
              type: 'error',
              title: 'Upload Failed',
              description: validation.error || `Could not load ${file.name}`,
            });
            continue;
          }

          const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          const previewUrl = URL.createObjectURL(file);
          const originalFormat = getFormatFromMime(file.type, file.name);

          const newItem: ImageFileItem = {
            id,
            file,
            name: file.name,
            originalSize: file.size,
            originalWidth: validation.width,
            originalHeight: validation.height,
            originalFormat,
            aspectRatio: validation.width / validation.height,
            previewUrl,
            status: 'idle',
            progress: 0,
            error: null,
            processedResult: null,
          };

          newItems.push(newItem);
        }

        if (newItems.length > 0) {
          set((state) => {
            const updatedImages = [...state.images, ...newItems];
            const currentSelected = state.selectedImageId;
            const newSelected = currentSelected || newItems[0].id;

            // Update default dimensions in resize settings if first item loaded
            const firstItem = newItems[0];
            const updatedResizeSettings =
              state.images.length === 0
                ? {
                    ...state.resizeSettings,
                    width: firstItem.originalWidth,
                    height: firstItem.originalHeight,
                  }
                : state.resizeSettings;

            return {
              images: updatedImages,
              selectedImageId: newSelected,
              resizeSettings: updatedResizeSettings,
            };
          });

          get().addToast({
            type: 'success',
            title: 'Images Uploaded',
            description: `Successfully added ${newItems.length} image${newItems.length > 1 ? 's' : ''}.`,
          });

          // Automatically trigger background process for newly added images
          newItems.forEach((item) => {
            get().processSingleImage(item.id);
          });
        }
      },

      removeImage: (id) => {
        set((state) => {
          const itemToRemove = state.images.find((img) => img.id === id);
          if (itemToRemove) {
            URL.revokeObjectURL(itemToRemove.previewUrl);
            if (itemToRemove.processedResult?.url) {
              URL.revokeObjectURL(itemToRemove.processedResult.url);
            }
          }

          const remaining = state.images.filter((img) => img.id !== id);
          const newSelected =
            state.selectedImageId === id
              ? remaining.length > 0
                ? remaining[0].id
                : null
              : state.selectedImageId;

          return {
            images: remaining,
            selectedImageId: newSelected,
          };
        });
      },

      clearAllImages: () => {
        const { images } = get();
        images.forEach((img) => {
          URL.revokeObjectURL(img.previewUrl);
          if (img.processedResult?.url) {
            URL.revokeObjectURL(img.processedResult.url);
          }
        });

        set({
          images: [],
          selectedImageId: null,
        });

        get().addToast({
          type: 'info',
          title: 'Cleared',
          description: 'All images removed from queue.',
        });
      },

      setSelectedImageId: (id) => set({ selectedImageId: id }),

      updateResizeSettings: (partial) => {
        set((state) => {
          const newSettings = { ...state.resizeSettings, ...partial };
          return { resizeSettings: newSettings };
        });

        // Trigger re-process for active queue
        const activeImages = get().images;
        activeImages.forEach((img) => get().processSingleImage(img.id));
      },

      updateOutputSettings: (partial) => {
        set((state) => {
          const newSettings = { ...state.outputSettings, ...partial };
          return { outputSettings: newSettings };
        });

        // Trigger re-process
        const activeImages = get().images;
        activeImages.forEach((img) => get().processSingleImage(img.id));
      },

      updateNamingSettings: (partial) => {
        set((state) => ({
          namingSettings: { ...state.namingSettings, ...partial },
        }));
      },

      applyCompressionPreset: (preset) => {
        if (preset === 'custom') {
          set((state) => ({
            outputSettings: { ...state.outputSettings, compressionPreset: 'custom' },
          }));
          return;
        }

        const quality = COMPRESSION_PRESETS[preset];
        set((state) => ({
          outputSettings: {
            ...state.outputSettings,
            quality,
            compressionPreset: preset,
          },
        }));

        const activeImages = get().images;
        activeImages.forEach((img) => get().processSingleImage(img.id));
      },

      resetAllSettings: () => {
        const { images, selectedImageId } = get();
        const activeItem = images.find((i) => i.id === selectedImageId) || images[0];

        const defaultW = activeItem ? activeItem.originalWidth : DEFAULT_RESIZE_SETTINGS.width;
        const defaultH = activeItem ? activeItem.originalHeight : DEFAULT_RESIZE_SETTINGS.height;

        set({
          resizeSettings: {
            ...DEFAULT_RESIZE_SETTINGS,
            width: defaultW,
            height: defaultH,
          },
          outputSettings: DEFAULT_OUTPUT_SETTINGS,
          namingSettings: DEFAULT_NAMING_SETTINGS,
        });

        get().addToast({
          type: 'info',
          title: 'Reset to Defaults',
          description: 'Original size and settings restored.',
        });

        const activeImages = get().images;
        activeImages.forEach((img) => get().processSingleImage(img.id));
      },

      setTheme: (theme) => set({ theme }),
      setPreviewViewMode: (mode) => set({ previewViewMode: mode }),
      setZoomLevel: (zoomOrFn) =>
        set((state) => ({
          zoomLevel: typeof zoomOrFn === 'function' ? zoomOrFn(state.zoomLevel) : zoomOrFn,
        })),

      processSingleImage: async (id) => {
        const { images, resizeSettings, outputSettings, namingSettings } = get();
        const targetIndex = images.findIndex((img) => img.id === id);
        if (targetIndex === -1) return;

        const targetItem = images[targetIndex];

        set((state) => ({
          images: state.images.map((img) =>
            img.id === id ? { ...img, status: 'processing', progress: 50, error: null } : img
          ),
        }));

        try {
          const result = await imageProcessingService.processImage(
            id,
            targetItem.file,
            targetItem.originalWidth,
            targetItem.originalHeight,
            targetItem.originalFormat,
            resizeSettings,
            outputSettings,
            namingSettings
          );

          set((state) => ({
            images: state.images.map((img) =>
              img.id === id
                ? {
                    ...img,
                    status: 'done',
                    progress: 100,
                    processedResult: result,
                  }
                : img
            ),
          }));
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to process image';
          set((state) => ({
            images: state.images.map((img) =>
              img.id === id ? { ...img, status: 'error', progress: 0, error: errorMsg } : img
            ),
          }));

          get().addToast({
            type: 'error',
            title: 'Processing Failed',
            description: `${targetItem.name}: ${errorMsg}`,
          });
        }
      },

      processAllImages: async () => {
        const { images } = get();
        if (images.length === 0) return;

        set({ isProcessingAll: true });
        for (const img of images) {
          await get().processSingleImage(img.id);
        }
        set({ isProcessingAll: false });

        get().addToast({
          type: 'success',
          title: 'Batch Complete',
          description: `All ${images.length} images resized & converted.`,
        });
      },
    }),
    {
      name: 'image-resizer-settings-store',
      partialize: (state) => ({
        resizeSettings: state.resizeSettings,
        outputSettings: state.outputSettings,
        namingSettings: state.namingSettings,
        theme: state.theme,
      }),
    }
  )
);
