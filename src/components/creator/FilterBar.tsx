/**
 * Filter Bar Component
 * 
 * Mission filtering UI with category tabs, search, and sort options.
 * Supports debounced search and real-time filter updates.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useInfiniteScroll';
import { useMissionStore } from '@/store/mission.store';
import type { MissionCategory } from '@/types/mission.types';

const CATEGORIES: { value: MissionCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '전체', icon: '📋' },
  { value: 'food', label: '음식점', icon: '🍽️' },
  { value: 'cafe', label: '카페', icon: '☕' },
  { value: 'activity', label: '액티비티', icon: '🎯' },
  { value: 'shopping', label: '쇼핑', icon: '🛍️' },
  { value: 'beauty', label: '뷰티', icon: '💄' },
  { value: 'etc', label: '기타', icon: '📦' },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'newest', label: '최신순' },
  { value: 'reward', label: '높은 리워드순' },
  { value: 'distance', label: '가까운 거리순' },
  { value: 'popular', label: '인기순' },
  { value: 'deadline', label: '마감 임박순' },
];

export interface FilterBarProps {
  className?: string;
  onFilterChange?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ className, onFilterChange }) => {
  const filters = useMissionStore((state) => state.filters);
  const setFilters = useMissionStore((state) => state.setFilters);
  const applyFilters = useMissionStore((state) => state.applyFilters);
  const resetFilters = useMissionStore((state) => state.resetFilters);
  
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const debouncedSearch = useDebounce(localSearch, 500);
  
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Apply debounced search
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
      applyFilters();
      onFilterChange?.();
    }
  }, [debouncedSearch, filters.search, setFilters, applyFilters, onFilterChange]);

  // Handle category change
  const handleCategoryChange = (category: MissionCategory | 'all') => {
    setFilters({ category });
    applyFilters();
    onFilterChange?.();
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    setFilters({ sortBy: sortBy as typeof filters.sortBy });
    applyFilters();
    setShowSortMenu(false);
    onFilterChange?.();
  };

  // Handle reset
  const handleReset = () => {
    resetFilters();
    setLocalSearch('');
    onFilterChange?.();
  };

  // Count active filters
  const activeFilterCount = [
    filters.category !== 'all',
    filters.search && filters.search.length > 0,
    filters.sortBy !== 'newest',
    filters.featured,
    filters.urgent,
  ].filter(Boolean).length;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search and Sort Row */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="flex-1">
          <SearchInput
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="미션 검색..."
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className={cn(
              'flex items-center gap-2 px-4 h-12 rounded-lg border transition-all duration-normal',
              'hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
              showSortMenu
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-bg-secondary border-border text-text-primary'
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            <span className="font-medium whitespace-nowrap">
              {SORT_OPTIONS.find((opt) => opt.value === filters.sortBy)?.label || '정렬'}
            </span>
            <svg className={cn('w-4 h-4 transition-transform', showSortMenu && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Sort Menu */}
          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-bg-elevated rounded-lg shadow-xl border border-border z-20 overflow-hidden animate-scale-in">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      'w-full px-4 py-3 text-left transition-colors',
                      'hover:bg-primary/10',
                      filters.sortBy === option.value
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-text-primary'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap min-h-touch',
              'transition-all duration-normal font-medium text-sm',
              'hover:scale-105 active:scale-95',
              filters.category === category.value
                ? 'bg-primary text-white shadow-md'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            )}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-text-secondary">빠른 필터:</span>
        
        <button
          onClick={() => {
            setFilters({ featured: !filters.featured });
            applyFilters();
            onFilterChange?.();
          }}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-fast',
            filters.featured
              ? 'bg-primary text-white'
              : 'bg-bg-tertiary text-text-secondary hover:bg-bg-secondary'
          )}
        >
          추천 미션
        </button>
        
        <button
          onClick={() => {
            setFilters({ urgent: !filters.urgent });
            applyFilters();
            onFilterChange?.();
          }}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-fast',
            filters.urgent
              ? 'bg-danger text-white'
              : 'bg-bg-tertiary text-text-secondary hover:bg-bg-secondary'
          )}
        >
          급구 미션
        </button>

        {/* Active Filter Count */}
        {activeFilterCount > 0 && (
          <Badge variant="primary" className="ml-2">
            {activeFilterCount}개 필터 적용
          </Badge>
        )}

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="ml-auto text-xs text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            초기화
          </button>
        )}
      </div>
    </div>
  );
};

FilterBar.displayName = 'FilterBar';
