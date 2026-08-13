import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (msg, duration) => addToast(msg, 'success', duration);
  const error = (msg, duration) => addToast(msg, 'error', duration);
  const warning = (msg, duration) => addToast(msg, 'warning', duration);
  const info = (msg, duration) => addToast(msg, 'info', duration);

  return (
    <ToastContext.Provider value={{ toast: { success, error, warning, info } }}>
      {children}
      {/* Toast Overlay */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          let bg = 'bg-white border-slate-200 text-slate-800';
          let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

          if (t.type === 'success') {
            bg = 'bg-emerald-50 border-emerald-200 text-emerald-950';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
          } else if (t.type === 'error') {
            bg = 'bg-rose-50 border-rose-200 text-rose-950';
            icon = <XCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          } else if (t.type === 'warning') {
            bg = 'bg-amber-50 border-amber-200 text-amber-950';
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${bg}`}
            >
              {icon}
              <div className="flex-1 text-sm font-medium leading-5">{t.message}</div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context.toast;
};
