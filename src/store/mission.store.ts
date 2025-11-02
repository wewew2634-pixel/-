/**
 * Mission Store
 * 
 * Global state management for missions using Zustand.
 * Handles mission list, filters, infinite scroll, and pagination.
 */

import { create } from 'zustand';
import type { Mission, MissionFilters } from '@/types/mission.types';
import { getPaginatedMissions } from '@/lib/mock/missions.mock';

interface MissionState {
  // Data
  missions: Mission[];
  filteredMissions: Mission[];
  selectedMission: Mission | null;
  
  // Pagination
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  
  // Filters
  filters: MissionFilters;
  
  // Actions
  fetchMissions: () => Promise<void>;
  fetchMoreMissions: () => Promise<void>;
  setFilters: (filters: Partial<MissionFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setSelectedMission: (mission: Mission | null) => void;
  refreshMissions: () => Promise<void>;
}

const DEFAULT_FILTERS: MissionFilters = {
  category: 'all',
  status: ['active'],
  sortBy: 'newest',
  featured: undefined,
  urgent: undefined,
};

export const useMissionStore = create<MissionState>((set, get) => ({
  // Initial state
  missions: [],
  filteredMissions: [],
  selectedMission: null,
  page: 1,
  pageSize: 10,
  total: 0,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  filters: DEFAULT_FILTERS,

  // Fetch initial missions
  fetchMissions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const result = getPaginatedMissions(1, get().pageSize);
      
      set({
        missions: result.missions,
        filteredMissions: result.missions,
        page: 1,
        total: result.total,
        hasMore: result.hasMore,
        isLoading: false,
      });
      
      // Apply any active filters
      get().applyFilters();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch missions',
        isLoading: false,
      });
    }
  },

  // Fetch more missions (infinite scroll)
  fetchMoreMissions: async () => {
    const { hasMore, isLoadingMore, page, pageSize } = get();
    
    if (!hasMore || isLoadingMore) return;
    
    set({ isLoadingMore: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const nextPage = page + 1;
      const result = getPaginatedMissions(nextPage, pageSize);
      
      set((state) => ({
        missions: [...state.missions, ...result.missions],
        filteredMissions: [...state.missions, ...result.missions],
        page: nextPage,
        hasMore: result.hasMore,
        isLoadingMore: false,
      }));
      
      // Reapply filters to include new missions
      get().applyFilters();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch more missions',
        isLoadingMore: false,
      });
    }
  },

  // Set filters (partial update)
  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));
  },

  // Reset filters to default
  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
    get().applyFilters();
  },

  // Apply current filters to missions
  applyFilters: () => {
    const { missions, filters } = get();
    
    let filtered = [...missions];
    
    // Filter by category
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((m) => m.category === filters.category);
    }
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((m) => filters.status!.includes(m.status));
    }
    
    // Filter by difficulty
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter((m) => filters.difficulty!.includes(m.difficulty));
    }
    
    // Filter by reward type
    if (filters.rewardType && filters.rewardType.length > 0) {
      filtered = filtered.filter((m) => filters.rewardType!.includes(m.reward.type));
    }
    
    // Filter by reward range
    if (filters.minReward !== undefined) {
      filtered = filtered.filter((m) => m.reward.amount >= filters.minReward!);
    }
    if (filters.maxReward !== undefined) {
      filtered = filtered.filter((m) => m.reward.amount <= filters.maxReward!);
    }
    
    // Filter by distance
    if (filters.maxDistance !== undefined) {
      filtered = filtered.filter(
        (m) => (m.location.distance || 0) <= filters.maxDistance!
      );
    }
    
    // Filter by search term
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(search) ||
          m.merchant.name.toLowerCase().includes(search) ||
          m.description.toLowerCase().includes(search) ||
          m.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }
    
    // Filter by featured
    if (filters.featured !== undefined) {
      filtered = filtered.filter((m) => m.featured === filters.featured);
    }
    
    // Filter by urgent
    if (filters.urgent !== undefined) {
      filtered = filtered.filter((m) => m.urgent === filters.urgent);
    }
    
    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          filtered.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'reward':
          filtered.sort((a, b) => b.reward.amount - a.reward.amount);
          break;
        case 'distance':
          filtered.sort((a, b) => 
            (a.location.distance || 0) - (b.location.distance || 0)
          );
          break;
        case 'popular':
          filtered.sort((a, b) => b.stats.views - a.stats.views);
          break;
        case 'deadline':
          filtered.sort((a, b) => 
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
          break;
      }
    }
    
    set({ filteredMissions: filtered });
  },

  // Set selected mission
  setSelectedMission: (mission) => {
    set({ selectedMission: mission });
  },

  // Refresh missions (reset and fetch)
  refreshMissions: async () => {
    set({ page: 1, missions: [], filteredMissions: [] });
    await get().fetchMissions();
  },
}));

// Convenience hooks
export const useMissions = () => useMissionStore((state) => state.filteredMissions);
export const useMissionFilters = () => useMissionStore((state) => state.filters);
export const useMissionActions = () => useMissionStore((state) => ({
  fetchMissions: state.fetchMissions,
  fetchMoreMissions: state.fetchMoreMissions,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
  applyFilters: state.applyFilters,
  refreshMissions: state.refreshMissions,
}));
