/**
 * Mission Card Component
 * 
 * Displays individual mission in the feed.
 * Shows merchant info, reward, location, and mission details.
 */

'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookmarkButton } from './BookmarkButton';
import type { Mission } from '@/types/mission.types';

export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

const categoryLabels: Record<Mission['category'], string> = {
  food: '음식점',
  cafe: '카페',
  activity: '액티비티',
  shopping: '쇼핑',
  beauty: '뷰티',
  etc: '기타',
};

const difficultyLabels: Record<Mission['difficulty'], { label: string; color: string }> = {
  easy: { label: '쉬움', color: 'bg-success/10 text-success' },
  medium: { label: '보통', color: 'bg-warning/10 text-warning' },
  hard: { label: '어려움', color: 'bg-danger/10 text-danger' },
};

export const MissionCard = memo(React.forwardRef<HTMLDivElement, MissionCardProps>(
  ({ mission, className, onClick, disabled = false, variant = 'default' }, ref) => {
    const isExpired = mission.status === 'expired' || mission.stats.remainingSlots === 0;
    const isDisabled = disabled || isExpired;
    const isCompact = variant === 'compact';
    
    const difficultyInfo = difficultyLabels[mission.difficulty];
    const remainingDays = Math.ceil(
      (new Date(mission.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    const formatReward = () => {
      if (mission.reward.type === 'cash') {
        return `${mission.reward.amount.toLocaleString()}원`;
      }
      if (mission.reward.type === 'points') {
        return `${mission.reward.amount.toLocaleString()}P`;
      }
      if (mission.reward.type === 'product') {
        return '제품 제공';
      }
      return `${mission.reward.amount.toLocaleString()}원 할인`;
    };

    const formatDistance = (meters: number) => {
      if (meters < 1000) {
        return `${Math.round(meters)}m`;
      }
      return `${(meters / 1000).toFixed(1)}km`;
    };

    return (
      <article
        ref={ref}
        className={cn(
          'group relative flex flex-col gap-4 rounded-xl border border-border bg-bg-secondary',
          'transition-all duration-normal',
          !isDisabled && 'hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1 cursor-pointer',
          isDisabled && 'opacity-50 cursor-not-allowed',
          isCompact ? 'p-3' : 'p-4',
          className
        )}
        onClick={() => !isDisabled && onClick?.(mission)}
        aria-label={`미션: ${mission.title}`}
      >
        {/* Badges and Bookmark */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <BookmarkButton missionId={mission.id} size="sm" />
          {mission.featured && (
            <Badge variant="primary" className="font-semibold">
              추천
            </Badge>
          )}
          {mission.urgent && (
            <Badge variant="danger" className="font-semibold animate-pulse">
              급구
            </Badge>
          )}
          {mission.newMerchant && (
            <Badge variant="success" className="font-semibold">
              신규
            </Badge>
          )}
        </div>

        {/* Header: Merchant Info */}
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-bg-tertiary">
            {mission.merchant.logo ? (
              <Image
                src={mission.merchant.logo}
                alt={mission.merchant.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xl font-bold text-text-tertiary">
                {mission.merchant.name[0]}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary truncate">
                {mission.merchant.name}
              </h3>
              {mission.merchant.verified && (
                <svg className="h-4 w-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="flex items-center gap-1">
                <span>⭐</span>
                <span>{mission.merchant.rating.toFixed(1)}</span>
              </span>
              <span>·</span>
              <span>{categoryLabels[mission.category]}</span>
            </div>
          </div>
          
          <div className={cn('px-2 py-1 rounded-md text-xs font-medium', difficultyInfo.color)}>
            {difficultyInfo.label}
          </div>
        </div>

        {/* Image */}
        {mission.images[0] && (
          <Link href={`/home/${mission.id}`} className="relative w-full aspect-video rounded-lg overflow-hidden bg-bg-tertiary">
            <Image
              src={mission.images[0]}
              alt={mission.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-slow"
            />
          </Link>
        )}

        {/* Content */}
        <div className="space-y-2">
          <Link href={`/home/${mission.id}`}>
            <h4 className="font-semibold text-base text-text-primary line-clamp-1 group-hover:text-primary transition-colors">
              {mission.title}
            </h4>
          </Link>
          
          <p className="text-sm text-text-secondary line-clamp-2">
            {mission.description}
          </p>
          
          {/* Tags */}
          {mission.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mission.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-md bg-bg-tertiary text-xs text-text-secondary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-text-tertiary text-xs">리워드</span>
            <span className="font-bold text-primary text-base">{formatReward()}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-text-tertiary text-xs">위치</span>
            <span className="font-medium text-text-primary truncate">
              {mission.location.district} {mission.location.distance && `· ${formatDistance(mission.location.distance)}`}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-text-tertiary text-xs">소요 시간</span>
            <span className="font-medium text-text-primary">
              약 {mission.estimatedTime}분
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-text-tertiary text-xs">마감</span>
            <span className={cn(
              'font-medium',
              remainingDays <= 3 ? 'text-danger' : 'text-text-primary'
            )}>
              {remainingDays}일 남음
            </span>
          </div>
        </div>

        {/* Progress - Plus-Polish Enhanced */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted">
            <span>모집 현황</span>
            <span className="font-medium text-foreground">
              {mission.stats.completed}/{mission.stats.totalSlots} 완료
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-2 overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-primary via-primary-hover to-primary"
              style={{
                width: `${(mission.stats.completed / mission.stats.totalSlots) * 100}%`,
              }}
              role="progressbar"
              aria-label={`모집 진행률: ${mission.stats.completed}/${mission.stats.totalSlots} 완료`}
              aria-valuenow={mission.stats.completed}
              aria-valuemin={0}
              aria-valuemax={mission.stats.totalSlots}
            />
          </div>
        </div>

        {/* Action Button - Plus-Polish Enhanced */}
        <button
          className={cn(
            "inline-flex items-center justify-center gap-2 h-14 px-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] w-full",
            mission.stats.remainingSlots === 0 ? "bg-surface-2 text-foreground border border-border hover:bg-surface-hover hover:border-primary/30" : "bg-primary text-primary-foreground shadow-lg hover:brightness-105 hover:shadow-xl hover:-translate-y-0.5"
          )}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/home/${mission.id}`;
          }}
          disabled={mission.stats.remainingSlots === 0}
          aria-label={mission.stats.remainingSlots === 0 ? '마감된 미션' : `${mission.title} 상세 보기`}
        >
          {mission.stats.remainingSlots === 0 ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              마감되었습니다
            </>
          ) : (
            <>
              자세히 보기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </article>
    );
  }
));

MissionCard.displayName = 'MissionCard';
