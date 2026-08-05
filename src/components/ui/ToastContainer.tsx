import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useImageStore } from '../../store/useImageStore';
import { ToastMessage } from '../../types';

export const ToastItem: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const removeToast = useImageStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, removeToast]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/80',
    error: 'border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/80',
    warning: 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/80',
    info: 'border-indigo-500/30 bg-indigo-50/90 dark:bg-indigo-950/80',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-xl max-w-md w-full ${
        borders[toast.type]
      }`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed break-words">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg"
        aria-label="Dismiss toast notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useImageStore((state) => state.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
