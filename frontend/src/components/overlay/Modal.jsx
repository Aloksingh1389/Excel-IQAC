import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  footer = null,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-slate-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-slate-200 bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // danger, warning, primary
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title={title}>
      <div className="flex items-start gap-4 mb-5">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            variant === 'danger'
              ? 'bg-rose-100 text-rose-600'
              : variant === 'warning'
              ? 'bg-amber-100 text-amber-600'
              : 'bg-blue-100 text-blue-600'
          }`}
        >
          {variant === 'danger' ? (
            <ShieldAlert className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>
        <div className="text-sm text-slate-600 leading-relaxed">{message}</div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'max-w-md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 ${
          position === 'right' ? 'right-0' : 'left-0'
        } flex max-w-full`}
      >
        <div
          className={`w-screen ${width} bg-white shadow-2xl flex flex-col border-l border-slate-200`}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/50 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};
