import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, CreatorProfile, MerchantProfile, AuthProvider } from '@/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  user: User | CreatorProfile | MerchantProfile | null;
  role: 'creator' | 'merchant' | 'guest' | 'admin' | null;
  isGuestMode: boolean;
  authProvider: AuthProvider | null;
  
  login: (user: User | CreatorProfile | MerchantProfile, token: string, refreshToken: string, provider: AuthProvider) => void;
  logout: () => void;
  setUser: (user: User | CreatorProfile | MerchantProfile) => void;
  updateUser: (updates: Partial<User | CreatorProfile | MerchantProfile>) => void;
  setGuestMode: (isGuest: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setTokens: (token: string, refreshToken: string) => void;
  clearTokens: () => void;
  isCreator: () => boolean;
  isMerchant: () => boolean;
  isGuest: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      refreshToken: null,
      user: null,
      role: null,
      isGuestMode: false,
      authProvider: null,

      login: (user, token, refreshToken, provider) => {
        set({
          isAuthenticated: true,
          user,
          token,
          refreshToken,
          role: user.role,
          authProvider: provider,
          isGuestMode: false,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          role: null,
          authProvider: null,
          isGuestMode: false,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({ user, role: user.role });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      setGuestMode: (isGuest) => {
        set({ isGuestMode: isGuest, role: isGuest ? 'guest' : null });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setTokens: (token, refreshToken) => {
        set({ token, refreshToken });
      },

      clearTokens: () => {
        set({ token: null, refreshToken: null });
      },

      isCreator: () => get().role === 'creator',
      isMerchant: () => get().role === 'merchant',
      isGuest: () => get().role === 'guest' || get().isGuestMode,
    }),
    {
      name: 'jjikmeok-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
