/**
 * Bookmark Store
 * 
 * Manages user bookmarks/favorites for missions.
 * Persists bookmarks to localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookmarkState {
  bookmarkedMissionIds: Set<string>;
  addBookmark: (missionId: string) => void;
  removeBookmark: (missionId: string) => void;
  toggleBookmark: (missionId: string) => void;
  isBookmarked: (missionId: string) => boolean;
  getBookmarkedIds: () => string[];
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedMissionIds: new Set<string>(),

      addBookmark: (missionId: string) => {
        set((state) => {
          const newBookmarks = new Set(state.bookmarkedMissionIds);
          newBookmarks.add(missionId);
          return { bookmarkedMissionIds: newBookmarks };
        });
      },

      removeBookmark: (missionId: string) => {
        set((state) => {
          const newBookmarks = new Set(state.bookmarkedMissionIds);
          newBookmarks.delete(missionId);
          return { bookmarkedMissionIds: newBookmarks };
        });
      },

      toggleBookmark: (missionId: string) => {
        const { isBookmarked, addBookmark, removeBookmark } = get();
        if (isBookmarked(missionId)) {
          removeBookmark(missionId);
        } else {
          addBookmark(missionId);
        }
      },

      isBookmarked: (missionId: string) => {
        return get().bookmarkedMissionIds.has(missionId);
      },

      getBookmarkedIds: () => {
        return Array.from(get().bookmarkedMissionIds);
      },

      clearBookmarks: () => {
        set({ bookmarkedMissionIds: new Set<string>() });
      },
    }),
    {
      name: 'bookmark-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          
          try {
            const { state } = JSON.parse(str);
            // Convert array back to Set
            return {
              state: {
                ...state,
                bookmarkedMissionIds: new Set(state.bookmarkedMissionIds || []),
              },
            };
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          const { state } = value;
          // Convert Set to array for serialization
          const serializable = {
            state: {
              ...state,
              bookmarkedMissionIds: Array.from(state.bookmarkedMissionIds),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
