import { create } from 'zustand';

/**
 * Toast Type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Modal Type
 */
export interface Modal {
  id: string;
  title?: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  closeOnBackdrop?: boolean;
  onClose?: () => void;
}

/**
 * UI Store State
 */
interface UIState {
  // Loading States
  isGlobalLoading: boolean;
  loadingMessage: string | null;
  
  // Toasts
  toasts: Toast[];
  
  // Modals
  modals: Modal[];
  activeModalId: string | null;
  
  // Bottom Sheet (for mobile)
  isBottomSheetOpen: boolean;
  bottomSheetContent: React.ReactNode | null;
  
  // Page Transitions
  isPageTransitioning: boolean;
  
  // Actions - Loading
  setGlobalLoading: (isLoading: boolean, message?: string) => void;
  
  // Actions - Toast
  showToast: (toast: Omit<Toast, 'id'>) => string;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  
  // Shorthand Toast Methods
  toast: {
    success: (message: string, title?: string, duration?: number) => string;
    error: (message: string, title?: string, duration?: number) => string;
    warning: (message: string, title?: string, duration?: number) => string;
    info: (message: string, title?: string, duration?: number) => string;
  };
  
  // Actions - Modal
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Actions - Bottom Sheet
  openBottomSheet: (content: React.ReactNode) => void;
  closeBottomSheet: () => void;
  
  // Actions - Page Transition
  setPageTransitioning: (isTransitioning: boolean) => void;
}

/**
 * UI Store
 * 
 * Features:
 * - Global loading state
 * - Toast notifications (auto-dismiss)
 * - Modal management (stack-based)
 * - Bottom sheet for mobile
 * - Page transition state
 */
export const useUIStore = create<UIState>((set, get) => ({
  // Initial State
  isGlobalLoading: false,
  loadingMessage: null,
  toasts: [],
  modals: [],
  activeModalId: null,
  isBottomSheetOpen: false,
  bottomSheetContent: null,
  isPageTransitioning: false,

  // Global Loading
  setGlobalLoading: (isLoading, message = null) => {
    set({ isGlobalLoading: isLoading, loadingMessage: message });
  },

  // Show Toast
  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 3000, // default 3 seconds
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss
    if (newToast.duration) {
      setTimeout(() => {
        get().hideToast(id);
      }, newToast.duration);
    }

    return id;
  },

  // Hide Toast
  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  // Clear All Toasts
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Shorthand Toast Methods
  toast: {
    success: (message, title, duration = 3000) => {
      return get().showToast({ type: 'success', message, title, duration });
    },
    error: (message, title, duration = 5000) => {
      return get().showToast({ type: 'error', message, title, duration });
    },
    warning: (message, title, duration = 4000) => {
      return get().showToast({ type: 'warning', message, title, duration });
    },
    info: (message, title, duration = 3000) => {
      return get().showToast({ type: 'info', message, title, duration });
    },
  },

  // Open Modal
  openModal: (modal) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newModal: Modal = {
      id,
      size: 'md',
      closeOnBackdrop: true,
      ...modal,
    };

    set((state) => ({
      modals: [...state.modals, newModal],
      activeModalId: id,
    }));

    return id;
  },

  // Close Modal
  closeModal: (id) => {
    const modal = get().modals.find((m) => m.id === id);
    if (modal?.onClose) {
      modal.onClose();
    }

    set((state) => {
      const newModals = state.modals.filter((m) => m.id !== id);
      return {
        modals: newModals,
        activeModalId: newModals.length > 0 ? newModals[newModals.length - 1].id : null,
      };
    });
  },

  // Close All Modals
  closeAllModals: () => {
    const { modals } = get();
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    set({ modals: [], activeModalId: null });
  },

  // Open Bottom Sheet
  openBottomSheet: (content) => {
    set({
      isBottomSheetOpen: true,
      bottomSheetContent: content,
    });
  },

  // Close Bottom Sheet
  closeBottomSheet: () => {
    set({
      isBottomSheetOpen: false,
      bottomSheetContent: null,
    });
  },

  // Page Transition
  setPageTransitioning: (isTransitioning) => {
    set({ isPageTransitioning });
  },
}));

/**
 * Selectors
 */
export const selectIsGlobalLoading = (state: UIState) => state.isGlobalLoading;
export const selectLoadingMessage = (state: UIState) => state.loadingMessage;
export const selectToasts = (state: UIState) => state.toasts;
export const selectModals = (state: UIState) => state.modals;
export const selectActiveModalId = (state: UIState) => state.activeModalId;
export const selectIsBottomSheetOpen = (state: UIState) => state.isBottomSheetOpen;
export const selectBottomSheetContent = (state: UIState) => state.bottomSheetContent;

/**
 * Helper Hooks
 */
export const useIsGlobalLoading = () => useUIStore(selectIsGlobalLoading);
export const useToasts = () => useUIStore(selectToasts);
export const useModals = () => useUIStore(selectModals);
export const useActiveModal = () => {
  const modals = useUIStore(selectModals);
  const activeId = useUIStore(selectActiveModalId);
  return modals.find((m) => m.id === activeId);
};
export const useBottomSheet = () => ({
  isOpen: useUIStore(selectIsBottomSheetOpen),
  content: useUIStore(selectBottomSheetContent),
  open: useUIStore((state) => state.openBottomSheet),
  close: useUIStore((state) => state.closeBottomSheet),
});

/**
 * Toast Hook (shorthand)
 */
export const useToast = () => useUIStore((state) => state.toast);
