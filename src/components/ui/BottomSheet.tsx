/**
 * Bottom Sheet Component
 * 
 * Mobile-optimized modal that slides up from the bottom.
 * Supports drag-to-dismiss, backdrop, and custom heights.
 * 
 * @example
 * ```tsx
 * const { open, close } = useBottomSheet();
 * 
 * const showSheet = () => {
 *   open({
 *     title: 'Options',
 *     content: <OptionsList />,
 *     height: 'auto',
 *   });
 * };
 * ```
 */

'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface BottomSheetProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  height?: 'auto' | 'half' | 'full';
  dismissible?: boolean;
  showHandle?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  title,
  children,
  isOpen,
  onClose,
  height = 'auto',
  dismissible = true,
  showHandle = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const heightClasses = {
    auto: 'max-h-[90vh]',
    half: 'h-[50vh]',
    full: 'h-[100vh]',
  };

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle drag start
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dismissible) return;
    
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    setDragStartY(clientY);
  };

  // Handle drag move
  const handleDragMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isDragging || !dismissible) return;

    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    const offset = clientY - dragStartY;

    // Only allow dragging down
    if (offset > 0) {
      setDragOffset(offset);
    }
  }, [isDragging, dismissible, dragStartY]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);

    // Close if dragged more than 100px
    if (dragOffset > 100) {
      onClose();
    }

    setDragOffset(0);
  }, [isDragging, dragOffset, onClose]);

  // Attach drag listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove as EventListener);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove as EventListener);
      window.addEventListener('touchend', handleDragEnd);

      return () => {
        window.removeEventListener('mousemove', handleDragMove as EventListener);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove as EventListener);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isOpen) return null;

  const bottomSheetContent = (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-bg-elevated rounded-t-2xl shadow-2xl',
          'flex flex-col',
          'animate-slide-up',
          heightClasses[height]
        )}
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart as any}
          >
            <div className="w-10 h-1 bg-border rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
            {dismissible && (
              <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors p-1"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );

  // Render in portal
  if (typeof window === 'undefined') return null;
  return createPortal(bottomSheetContent, document.body);
};

BottomSheet.displayName = 'BottomSheet';

/**
 * useBottomSheet Hook
 * 
 * Convenience hook to manage bottom sheet state.
 */
export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string | undefined>();
  const [height, setHeight] = useState<'auto' | 'half' | 'full'>('auto');

  const open = (config: {
    title?: string;
    content: React.ReactNode;
    height?: 'auto' | 'half' | 'full';
  }) => {
    setTitle(config.title);
    setContent(config.content);
    setHeight(config.height || 'auto');
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Clear content after animation
    setTimeout(() => {
      setContent(null);
      setTitle(undefined);
    }, 200);
  };

  return {
    isOpen,
    open,
    close,
    BottomSheet: (
      <BottomSheet
        isOpen={isOpen}
        onClose={close}
        title={title}
        height={height}
      >
        {content}
      </BottomSheet>
    ),
  };
}
