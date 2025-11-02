/**
 * Bookmark Button Component
 * 
 * Allows users to bookmark/favorite missions.
 * Shows filled/unfilled heart icon based on bookmark status.
 */

'use client';

import React, { memo } from 'react';
import { useBookmarkStore } from '@/store/bookmark.store';
import { cn } from '@/lib/utils';

export interface BookmarkButtonProps {
  missionId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onToggle?: (isBookmarked: boolean) => void;
}

export const BookmarkButton = memo(function BookmarkButton({
  missionId,
  className,
  size = 'md',
  showLabel = false,
  onToggle,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked(missionId));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    toggleBookmark(missionId);
    onToggle?.(!isBookmarked);
  };

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const buttonSizeClasses = {
    sm: 'p-3',
    md: 'p-3',
    lg: 'p-3',
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'rounded-full transition-all duration-fast',
        'hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-primary/20',
        isBookmarked
          ? 'bg-danger/10 text-danger hover:bg-danger/20'
          : 'bg-bg-tertiary text-text-tertiary hover:bg-bg-secondary hover:text-text-primary',
        buttonSizeClasses[size],
        className
      )}
      aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
      aria-pressed={isBookmarked}
      title={isBookmarked ? '북마크 제거' : '북마크 추가'}
    >
      <div className="flex items-center gap-2">
        <svg
          className={cn(sizeClasses[size], 'transition-transform duration-fast')}
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={isBookmarked ? 0 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {showLabel && (
          <span className="text-xs font-medium whitespace-nowrap">
            {isBookmarked ? '저장됨' : '저장'}
          </span>
        )}
      </div>
    </button>
  );
});

BookmarkButton.displayName = 'BookmarkButton';
