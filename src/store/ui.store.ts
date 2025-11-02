import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface Modal {
  id: string;
  title?: string;
  content: React.ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
}

export interface BottomSheet {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

interface UIState {
  toasts: Toast[];
  modals: Modal[];
  bottomSheets: BottomSheet[];
  activeModalId: string | undefined;
  isLoading: boolean;
  loadingMessage: string | undefined;

  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
  };

  openModal: (modal: Omit<Modal, 'id'> & { closeOnBackdrop?: boolean }) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  openBottomSheet: (sheet: Omit<BottomSheet, 'id'>) => string;
  closeBottomSheet: (id: string) => void;
  closeAllBottomSheets: () => void;

  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  modals: [],
  bottomSheets: [],
  activeModalId: undefined,
  isLoading: false,
  loadingMessage: undefined,

  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    if (toast.duration) {
      setTimeout(() => {
        get().hideToast(id);
      }, toast.duration);
    }
  },

  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  toast: {
    success: (message, title, duration = 3000) => {
      get().showToast({ type: 'success', message, title, duration });
    },
    error: (message, title, duration = 5000) => {
      get().showToast({ type: 'error', message, title, duration });
    },
    warning: (message, title, duration = 4000) => {
      get().showToast({ type: 'warning', message, title, duration });
    },
    info: (message, title, duration = 3000) => {
      get().showToast({ type: 'info', message, title, duration });
    },
  },

  openModal: (modal) => {
    const id = `modal-${Date.now()}`;
    set((state) => ({
      modals: [...state.modals, { 
        ...modal, 
        id,
        closeOnBackdrop: modal.closeOnBackdrop ?? true,
        size: modal.size ?? 'md',
      }],
      activeModalId: id,
    }));
    return id;
  },

  closeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
      activeModalId: state.modals.find((m) => m.id !== id)?.id,
    }));
  },

  closeAllModals: () => {
    set({ modals: [], activeModalId: undefined });
  },

  openBottomSheet: (sheet) => {
    const id = `sheet-${Date.now()}`;
    set((state) => ({
      bottomSheets: [...state.bottomSheets, { ...sheet, id }],
    }));
    return id;
  },

  closeBottomSheet: (id) => {
    set((state) => ({
      bottomSheets: state.bottomSheets.filter((s) => s.id !== id),
    }));
  },

  closeAllBottomSheets: () => {
    set({ bottomSheets: [] });
  },

  setLoading: (isLoading, message) => {
    set({ isLoading, loadingMessage: message });
  },
}));

export const useToast = () => useUIStore((state) => state.toast);
