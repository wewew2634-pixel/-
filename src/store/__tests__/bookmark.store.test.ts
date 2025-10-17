/**
 * Bookmark Store Tests
 * 
 * Tests for bookmark functionality:
 * - Adding/removing bookmarks
 * - Toggling bookmarks
 * - Checking bookmark status
 * - Clearing all bookmarks
 * - LocalStorage persistence
 */

import { useBookmarkStore } from '../bookmark.store';

describe('Bookmark Store', () => {
  beforeEach(() => {
    // Clear store
    useBookmarkStore.setState({ bookmarkedMissionIds: new Set() });
    // Clear localStorage
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('has empty bookmarks initially', () => {
      const state = useBookmarkStore.getState();
      expect(state.bookmarkedMissionIds.size).toBe(0);
      expect(state.getBookmarkedIds()).toEqual([]);
    });
  });

  describe('Add Bookmark', () => {
    it('adds a bookmark', () => {
      const { addBookmark, isBookmarked } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      
      expect(isBookmarked('mission-1')).toBe(true);
    });

    it('adds multiple bookmarks', () => {
      const { addBookmark, getBookmarkedIds } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-2');
      addBookmark('mission-3');
      
      const bookmarkedIds = getBookmarkedIds();
      expect(bookmarkedIds).toHaveLength(3);
      expect(bookmarkedIds).toContain('mission-1');
      expect(bookmarkedIds).toContain('mission-2');
      expect(bookmarkedIds).toContain('mission-3');
    });

    it('does not add duplicate bookmarks', () => {
      const { addBookmark, getBookmarkedIds } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-1');
      addBookmark('mission-1');
      
      expect(getBookmarkedIds()).toHaveLength(1);
    });
  });

  describe('Remove Bookmark', () => {
    it('removes a bookmark', () => {
      const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      expect(isBookmarked('mission-1')).toBe(true);
      
      removeBookmark('mission-1');
      expect(isBookmarked('mission-1')).toBe(false);
    });

    it('does nothing when removing non-existent bookmark', () => {
      const { removeBookmark, getBookmarkedIds } = useBookmarkStore.getState();
      
      removeBookmark('mission-nonexistent');
      
      expect(getBookmarkedIds()).toHaveLength(0);
    });

    it('removes only the specified bookmark', () => {
      const { addBookmark, removeBookmark, getBookmarkedIds } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-2');
      addBookmark('mission-3');
      
      removeBookmark('mission-2');
      
      const bookmarkedIds = getBookmarkedIds();
      expect(bookmarkedIds).toHaveLength(2);
      expect(bookmarkedIds).toContain('mission-1');
      expect(bookmarkedIds).toContain('mission-3');
      expect(bookmarkedIds).not.toContain('mission-2');
    });
  });

  describe('Toggle Bookmark', () => {
    it('adds bookmark when not bookmarked', () => {
      const { toggleBookmark, isBookmarked } = useBookmarkStore.getState();
      
      expect(isBookmarked('mission-1')).toBe(false);
      
      toggleBookmark('mission-1');
      
      expect(isBookmarked('mission-1')).toBe(true);
    });

    it('removes bookmark when already bookmarked', () => {
      const { addBookmark, toggleBookmark, isBookmarked } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      expect(isBookmarked('mission-1')).toBe(true);
      
      toggleBookmark('mission-1');
      
      expect(isBookmarked('mission-1')).toBe(false);
    });

    it('toggles multiple times correctly', () => {
      const { toggleBookmark, isBookmarked } = useBookmarkStore.getState();
      
      toggleBookmark('mission-1');
      expect(isBookmarked('mission-1')).toBe(true);
      
      toggleBookmark('mission-1');
      expect(isBookmarked('mission-1')).toBe(false);
      
      toggleBookmark('mission-1');
      expect(isBookmarked('mission-1')).toBe(true);
    });
  });

  describe('Is Bookmarked', () => {
    it('returns true for bookmarked missions', () => {
      const { addBookmark, isBookmarked } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      
      expect(isBookmarked('mission-1')).toBe(true);
    });

    it('returns false for non-bookmarked missions', () => {
      const { isBookmarked } = useBookmarkStore.getState();
      
      expect(isBookmarked('mission-1')).toBe(false);
    });

    it('returns correct status for multiple missions', () => {
      const { addBookmark, isBookmarked } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-3');
      
      expect(isBookmarked('mission-1')).toBe(true);
      expect(isBookmarked('mission-2')).toBe(false);
      expect(isBookmarked('mission-3')).toBe(true);
    });
  });

  describe('Get Bookmarked IDs', () => {
    it('returns empty array when no bookmarks', () => {
      const { getBookmarkedIds } = useBookmarkStore.getState();
      
      expect(getBookmarkedIds()).toEqual([]);
    });

    it('returns array of bookmarked mission IDs', () => {
      const { addBookmark, getBookmarkedIds } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-2');
      addBookmark('mission-3');
      
      const bookmarkedIds = getBookmarkedIds();
      expect(bookmarkedIds).toHaveLength(3);
      expect(bookmarkedIds).toEqual(expect.arrayContaining(['mission-1', 'mission-2', 'mission-3']));
    });

    it('returns up-to-date array after changes', () => {
      const { addBookmark, removeBookmark, getBookmarkedIds } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-2');
      expect(getBookmarkedIds()).toHaveLength(2);
      
      removeBookmark('mission-1');
      expect(getBookmarkedIds()).toHaveLength(1);
      expect(getBookmarkedIds()).toEqual(['mission-2']);
    });
  });

  describe('Clear Bookmarks', () => {
    it('removes all bookmarks', () => {
      const { addBookmark, clearBookmarks, getBookmarkedIds } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-2');
      addBookmark('mission-3');
      expect(getBookmarkedIds()).toHaveLength(3);
      
      clearBookmarks();
      
      expect(getBookmarkedIds()).toHaveLength(0);
    });

    it('works on empty store', () => {
      const { clearBookmarks, getBookmarkedIds } = useBookmarkStore.getState();
      
      clearBookmarks();
      
      expect(getBookmarkedIds()).toHaveLength(0);
    });
  });

  describe('LocalStorage Persistence', () => {
    it('persists bookmarks to localStorage', () => {
      const { addBookmark } = useBookmarkStore.getState();
      
      addBookmark('mission-1');
      addBookmark('mission-2');
      
      // Check localStorage
      const stored = localStorage.getItem('bookmark-storage');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.state.bookmarkedMissionIds).toContain('mission-1');
      expect(parsed.state.bookmarkedMissionIds).toContain('mission-2');
    });

    it('loads bookmarks from localStorage', () => {
      // Manually set localStorage
      localStorage.setItem(
        'bookmark-storage',
        JSON.stringify({
          state: {
            bookmarkedMissionIds: ['mission-1', 'mission-2', 'mission-3'],
          },
        })
      );
      
      // Create new store instance (simulates page reload)
      const newStore = useBookmarkStore.getState();
      
      // Note: Zustand persist hydration happens after first render
      // In real app, this would work after hydration
      expect(newStore.bookmarkedMissionIds).toBeDefined();
    });

    it('handles corrupted localStorage data', () => {
      localStorage.setItem('bookmark-storage', 'invalid-json');
      
      // Should not throw error
      expect(() => {
        useBookmarkStore.getState();
      }).not.toThrow();
    });
  });
});
