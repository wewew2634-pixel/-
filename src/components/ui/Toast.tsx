'use client';

import React from 'react';
import { useUIStore, type Toast as ToastType } from '@/store/ui.store';
import { cn } from '@/lib/utils';

/**
 * Toast Item Component
 */
const ToastItem = ({ toast }: { toast: ToastType }) => {
  const hideToast = useUIStore((state) => state.hideToast);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors = {
    success: 'bg-success/10 border-success/20 text-success',
    error: 'bg-danger/10 border-danger/20 text-danger',
    warning: 'bg-warning/10 border-warning/20 text-warning',
    info: 'bg-info/10 border-info/20 text-info',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-xl shadow-lg animate-slide-down',
        'max-w-md w-full',
        colors[toast.type]
      )}
      role="alert"
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg',
          toast.type === 'success' && 'bg-success text-white',
          toast.type === 'error' && 'bg-danger text-white',
          toast.type === 'warning' && 'bg-warning text-white',
          toast.type === 'info' && 'bg-info text-white'
        )}
      >
        {icons[toast.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <h4 className="font-semibold text-sm mb-1 text-text-primary">
            {toast.title}
          </h4>
        )}
        <p className="text-sm text-text-secondary">{toast.message}</p>
        
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => hideToast(toast.id)}
        className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
        aria-label="Close notification"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

/**
 * Toast Container Component
 */
export const ToastContainer = () => {
  const toasts = useUIStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-0 right-0 z-toast p-4 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  );
};

/**
 * Toast Hook for easy usage
 */
export { useToast } from '@/store/ui.store';
