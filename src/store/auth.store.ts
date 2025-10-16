import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, CreatorProfile, MerchantProfile, AuthProvider } from '@/types';

/**
 * Auth Store State
 */
interface AuthState {
  // Authentication
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  
  // User
  user: User | CreatorProfile | MerchantProfile | null;
  role: 'creator' | 'merchant' | 'guest' | null;
  
  // Guest Mode
  isGuestMode: boolean;
  
  // Auth Provider
  authProvider: AuthProvider | null;
  
  // Actions
  login: (user: User | CreatorProfile | MerchantProfile, token: string, refreshToken: string, provider: AuthProvider) => void;
  logout: () => void;
  setUser: (user: User | CreatorProfile | MerchantProfile) => void;
  updateUser: (updates: Partial<User | CreatorProfile | MerchantProfile>) => void;
  setGuestMode: (isGuest: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Token Management
  setTokens: (token: string, refreshToken: string) => void;
  clearTokens: () => void;
  
  // Utility
  isCreator: () => boolean;
  isMerchant: () => boolean;
  isGuest: () => boolean;
}

/**
 * Auth Store
 * 
 * Features:
 * - Persistent storage (localStorage)
 * - Token management
 * - Guest mode support
 * - OAuth provider tracking
 * - Type-safe user profiles
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      isLoading: false,
      token: null,
      refreshToken: null,
      user: null,
      role: null,
      isGuestMode: false,
      authProvider: null,

      // Login Action
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

      // Logout Action
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

      // Set User
      setUser: (user) => {
        set({
          user,
          role: user.role,
          isAuthenticated: true,
        });
      },

      // Update User (Partial)
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      // Guest Mode
      setGuestMode: (isGuest) => {
        set({
          isGuestMode: isGuest,
          role: isGuest ? 'guest' : null,
          isAuthenticated: isGuest,
        });
      },

      // Loading State
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Token Management
      setTokens: (token, refreshToken) => {
        set({ token, refreshToken });
      },

      clearTokens: () => {
        set({ token: null, refreshToken: null });
      },

      // Utility Methods
      isCreator: () => {
        const { role } = get();
        return role === 'creator';
      },

      isMerchant: () => {
        const { role } = get();
        return role === 'merchant';
      },

      isGuest: () => {
        const { isGuestMode } = get();
        return isGuestMode;
      },
    }),
    {
      name: 'jjikmeok-auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        role: state.role,
        authProvider: state.authProvider,
        isGuestMode: state.isGuestMode,
      }),
    }
  )
);

/**
 * Selectors (for optimized re-renders)
 */
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUser = (state: AuthState) => state.user;
export const selectRole = (state: AuthState) => state.role;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectIsGuestMode = (state: AuthState) => state.isGuestMode;
export const selectToken = (state: AuthState) => state.token;

/**
 * Helper Hooks
 */
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
export const useUser = () => useAuthStore(selectUser);
export const useRole = () => useAuthStore(selectRole);
export const useIsLoading = () => useAuthStore(selectIsLoading);
export const useIsGuestMode = () => useAuthStore(selectIsGuestMode);
