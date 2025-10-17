/**
 * Creator Home Page
 * 
 * Main feed for creators to browse and discover missions.
 * Features infinite scroll, filtering, search, and real-time updates.
 */

'use client';

import React, { useEffect, useRef, useCallback, memo } from 'react';
import { MissionCard } from '@/components/creator/MissionCard';
import { FilterBar } from '@/components/creator/FilterBar';
import { InlineLoading } from '@/components/ui/Loading';
import { SkeletonMissionCard } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useMissionStore } from '@/store/mission.store';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { throttle } from '@/lib/utils';
import type { Mission } from '@/types/mission.types';

export default function CreatorHomePage() {
  const missions = useMissionStore((state) => state.filteredMissions);
  const isLoading = useMissionStore((state) => state.isLoading);
  const isLoadingMore = useMissionStore((state) => state.isLoadingMore);
  const hasMore = useMissionStore((state) => state.hasMore);
  const error = useMissionStore((state) => state.error);
  
  const fetchMissions = useMissionStore((state) => state.fetchMissions);
  const fetchMoreMissions = useMissionStore((state) => state.fetchMoreMissions);
  const refreshMissions = useMissionStore((state) => state.refreshMissions);
  
  const hasFetchedRef = useRef(false);

  // Initial fetch
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchMissions();
    }
  }, [fetchMissions]);

  // Infinite scroll
  const { ref: infiniteScrollRef } = useInfiniteScroll({
    onLoadMore: fetchMoreMissions,
    hasMore,
    isLoading: isLoadingMore,
    threshold: 0.5,
    rootMargin: '200px',
  });

  // Handle mission click - Memoized to prevent recreation
  const handleMissionClick = useCallback((mission: Mission) => {
    // Navigate to mission detail page
    window.location.href = `/home/${mission.id}`;
  }, []);

  // Error State
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary p-6 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">😢</div>
          <h2 className="text-xl font-bold text-text-primary">
            미션을 불러올 수 없습니다
          </h2>
          <p className="text-text-secondary">{error}</p>
          <Button
            variant="primary"
            size="md"
            onClick={() => refreshMissions()}
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  // Initial Loading State
  if (isLoading && missions.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border">
          <div className="max-w-screen-xl mx-auto px-4 py-4">
            <div className="h-12 w-48 bg-bg-tertiary rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Filter Skeleton */}
        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-4">
          <div className="h-12 w-full bg-bg-tertiary rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 bg-bg-tertiary rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Mission Cards Skeleton */}
        <div className="max-w-screen-xl mx-auto px-4 pb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonMissionCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">
              미션 피드
            </h1>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm md:text-base font-semibold">
              {missions.length}개
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => (window.location.href = '/bookmarks')}
              className="p-3 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary hover:text-danger"
              aria-label="북마크 보기"
              title="북마크"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button
              onClick={() => refreshMissions()}
              className="p-3 rounded-lg hover:bg-bg-secondary transition-colors text-text-secondary hover:text-primary"
              aria-label="새로고침"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <FilterBar />
      </div>

      {/* Mission Feed */}
      <main className="max-w-screen-xl mx-auto px-4 pb-8">
        {missions.length === 0 && !isLoading ? (
          /* Empty State */
          <div className="text-center py-16 space-y-4 animate-fade-in">
            <div className="text-6xl animate-bounce-in">🔍</div>
            <h2 className="text-lg md:text-xl font-bold text-text-primary animate-slide-up">
              미션을 찾을 수 없습니다
            </h2>
            <p className="text-text-secondary">
              다른 필터나 검색어로 다시 시도해보세요
            </p>
            <Button
              variant="ghost"
              size="md"
              onClick={() => useMissionStore.getState().resetFilters()}
            >
              필터 초기화
            </Button>
          </div>
        ) : (
          /* Mission Cards Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={handleMissionClick}
              />
            ))}
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {hasMore && missions.length > 0 && (
          <div ref={infiniteScrollRef} className="flex justify-center py-8">
            {isLoadingMore ? (
              <InlineLoading text="더 불러오는 중..." />
            ) : (
              <div className="h-10" />
            )}
          </div>
        )}

        {/* End of List */}
        {!hasMore && missions.length > 0 && (
          <div className="text-center py-8 text-text-tertiary text-sm">
            모든 미션을 확인했습니다 🎉
          </div>
        )}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}

/**
 * Scroll to Top Button
 * Shows when user scrolls down
 * Optimized with throttled scroll handler
 */
const ScrollToTopButton = memo(function ScrollToTopButton() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    // Throttle scroll handler to improve performance
    const handleScroll = throttle(() => {
      setShow(window.scrollY > 500);
    }, 200);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-fast animate-bounce-in"
      aria-label="맨 위로"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
});
