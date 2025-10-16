'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

/**
 * Modal Component
 */
export const Modal = () => {
  const modals = useUIStore((state) => state.modals);
  const activeModalId = useUIStore((state) => state.activeModalId);
  const closeModal = useUIStore((state) => state.closeModal);

  const activeModal = modals.find((m) => m.id === activeModalId);

  useEffect(() => {
    // Lock body scroll when modal is open
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  useEffect(() => {
    // Close modal on ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalId) {
        closeModal(activeModalId);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activeModalId, closeModal]);

  if (!activeModal) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && activeModal.closeOnBackdrop) {
      closeModal(activeModal.id);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={cn(
          'relative w-full bg-bg-elevated rounded-xl shadow-xl animate-scale-in',
          'max-h-[90vh] flex flex-col',
          sizeClasses[activeModal.size || 'md']
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={activeModal.title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {activeModal.title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2
              id="modal-title"
              className="text-h2 font-semibold text-text-primary"
            >
              {activeModal.title}
            </h2>
            <button
              onClick={() => closeModal(activeModal.id)}
              className="text-text-tertiary hover:text-text-primary transition-colors p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
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
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeModal.content}
        </div>
      </div>
    </div>
  );

  // Render modal in portal (at document.body)
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
};

/**
 * Modal Hook for easy usage
 */
export const useModal = () => {
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeAllModals = useUIStore((state) => state.closeAllModals);

  return {
    open: openModal,
    close: closeModal,
    closeAll: closeAllModals,
  };
};
