/**
 * Bookmarks Page
 * 
 * Shows all bookmarked missions for the user.
 * Allows filtering and sorting of bookmarked missions.
 */

'use client';

import React, { useMemo } from 'react';
import { MissionCard } from '@/components/creator/MissionCard';
import { Button } from '@/components/ui/Button';
import { useBookmarkStore } from '@/store/bookmark.store';
import { useMissionStore } from '@/store/mission.store';
import type { Mission } from '@/types/mission.types';

export default function BookmarksPage() {
  const bookmarkedIds = useBookmarkStore((state) => state.getBookmarkedIds());
  const clearBookmarks = useBookmarkStore((state) => state.clearBookmarks);
  const allMissions = useMissionStore((state) => state.missions);

  // Filter missions to only bookmarked ones
  const bookmarkedMissions = useMemo(() => {
    return allMissions.filter((mission) => bookmarkedIds.includes(mission.id));
  }, [allMissions, bookmarkedIds]);

  // Handle mission click
  const handleMissionClick = (mission: Mission) => {
    window.location.href = `/home/${mission.id}`;
  };

  // Handle clear all
  const handleClearAll = () => {
    if (confirm('모든 북마크를 삭제하시겠습니까?')) {
      clearBookmarks();
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="p-3 rounded-lg hover:bg-bg-secondary transition-colors"
                aria-label="뒤로 가기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary flex items-center gap-2">
                  <span>❤️</span>
                  북마크
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  {bookmarkedMissions.length}개의 미션을 저장했습니다
                </p>
              </div>
            </div>

            {bookmarkedMissions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-danger hover:bg-danger/10"
              >
                전체 삭제
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {bookmarkedMissions.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 space-y-4 animate-fade-in">
            <div className="text-6xl animate-bounce-in">💔</div>
            <h2 className="text-xl font-bold text-text-primary animate-slide-up">
              북마크한 미션이 없습니다
            </h2>
            <p className="text-text-secondary">
              관심있는 미션을 발견하면 하트 아이콘을 눌러 저장해보세요
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => (window.location.href = '/home')}
            >
              미션 둘러보기
            </Button>
          </div>
        ) : (
          /* Mission Cards Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClick={handleMissionClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
