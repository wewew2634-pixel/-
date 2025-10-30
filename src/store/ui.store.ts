import { create } from 'zustand';
import type { BannerProps } from '@/components/ui/Banner';

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

export interface BannerState {
  id: string;
  props: Omit<BannerProps, 'id' | 'onDismiss'>;
  persistent?: boolean;
}

interface UIState {
  toasts: Toast[];
  modals: Modal[];
  bottomSheets: BottomSheet[];
  banners: BannerState[];
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

  showBanner: (banner: Omit<BannerState, 'id'>) => string;
  dismissBanner: (id: string) => void;
  clearBanners: () => void;

  banner: {
    info: (message: string, title?: string, persistent?: boolean) => string;
    success: (message: string, title?: string, persistent?: boolean) => string;
    warning: (message: string, title?: string, persistent?: boolean) => string;
    error: (message: string, title?: string, persistent?: boolean) => string;
  };

  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  modals: [],
  bottomSheets: [],
  banners: [],
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

  showBanner: (banner) => {
    const id = `banner-${Date.now()}-${Math.random()}`;
    set((state) => ({
      banners: [...state.banners, { ...banner, id }],
    }));

    // Auto-dismiss for non-persistent banners
    if (!banner.persistent && banner.props.autoHideDuration) {
      setTimeout(() => {
        get().dismissBanner(id);
      }, banner.props.autoHideDuration);
    }

    return id;
  },

  dismissBanner: (id) => {
    set((state) => ({
      banners: state.banners.filter((b) => b.id !== id),
    }));
  },

  clearBanners: () => {
    set({ banners: [] });
  },

  banner: {
    info: (message, title, persistent = false) => {
      return get().showBanner({
        props: {
          variant: 'info',
          message,
          title,
          dismissible: true,
        },
        persistent,
      });
    },
    success: (message, title, persistent = false) => {
      return get().showBanner({
        props: {
          variant: 'success',
          message,
          title,
          dismissible: true,
        },
        persistent,
      });
    },
    warning: (message, title, persistent = false) => {
      return get().showBanner({
        props: {
          variant: 'warning',
          message,
          title,
          dismissible: true,
        },
        persistent,
      });
    },
    error: (message, title, persistent = true) => {
      return get().showBanner({
        props: {
          variant: 'error',
          message,
          title,
          dismissible: true,
        },
        persistent,
      });
    },
  },
}));

export const useToast = () => useUIStore((state) => state.toast);
