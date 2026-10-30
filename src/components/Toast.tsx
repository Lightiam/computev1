import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

let addToastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export const toast = {
  success: (title: string, message?: string) => addToastFn?.({ type: 'success', title, message }),
  error: (title: string, message?: string) => addToastFn?.({ type: 'error', title, message }),
  warning: (title: string, message?: string) => addToastFn?.({ type: 'warning', title, message }),
  info: (title: string, message?: string) => addToastFn?.({ type: 'info', title, message }),
};

const typeConfig: Record<ToastType, { icon: typeof CheckCircle; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => {
          const config = typeConfig[t.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className={`flex items-start gap-3 p-3 rounded-xl border backdrop-blur-xl shadow-2xl ${config.bg}`}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/90">{t.title}</p>
                {t.message && <p className="text-[10px] text-white/50 mt-0.5">{t.message}</p>}
              </div>
              <button onClick={() => removeToast(t.id)} className="text-white/30 hover:text-white/60 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
