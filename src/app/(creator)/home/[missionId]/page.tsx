/**
 * Mission Detail Page
 * 
 * Displays comprehensive mission information with:
 * - Image gallery
 * - Merchant details
 * - Requirements & guidelines
 * - Location & map
 * - Application flow
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/Loading';

// Dynamic imports for heavy components
const ImageGallery = dynamic(
  () => import('@/components/ui/ImageGallery').then((mod) => ({ default: mod.ImageGallery })),
  { ssr: false, loading: () => <div className="h-64 bg-bg-tertiary animate-pulse rounded-lg" /> }
);
import { MissionStructuredData } from '@/components/MissionStructuredData';
import { getMissionById } from '@/lib/mock/missions.mock';
import { useToast } from '@/store/ui.store';
import { cn } from '@/lib/utils';
import type { Mission } from '@/types/mission.types';

// Dynamic import for BottomSheet (only loaded when needed)
const BottomSheet = dynamic(
  () => import('@/components/ui/BottomSheet').then((mod) => ({ default: mod.BottomSheet })),
  { ssr: false, loading: () => null }
);

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const missionId = params.missionId as string;
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationSheet, setShowApplicationSheet] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Fetch mission data
  useEffect(() => {
    const fetchMission = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = getMissionById(missionId);
      if (data) {
        setMission(data);
      }
      setIsLoading(false);
    };

    fetchMission();
  }, [missionId]);

  // Handle application submission
  const handleApply = async () => {
    setIsApplying(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('미션 신청이 완료되었습니다!', '승인 대기 중');
      setShowApplicationSheet(false);
      
      // Navigate back or to applications list
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (_error) {
      toast.error('신청 중 오류가 발생했습니다.', '다시 시도해주세요');
    } finally {
      setIsApplying(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <LoadingSpinner size="xl" variant="primary" />
      </div>
    );
  }

  // Not found state
  if (!mission) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-xl font-bold text-text-primary">
            미션을 찾을 수 없습니다
          </h2>
          <p className="text-text-secondary">
            해당 미션이 삭제되었거나 존재하지 않습니다
          </p>
          <Button variant="primary" onClick={() => router.push('/home')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Structured Data for SEO */}
      <MissionStructuredData mission={mission} />
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-3 -ml-2 hover:bg-bg-secondary rounded-lg transition-colors"
            aria-label="뒤로 가기"
          >
            <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-text-primary">미션 상세</h1>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          {mission.featured && (
            <Badge variant="primary" className="font-semibold">추천 미션</Badge>
          )}
          {mission.urgent && (
            <Badge variant="danger" className="font-semibold animate-pulse">급구</Badge>
          )}
          {mission.newMerchant && (
            <Badge variant="success" className="font-semibold">신규 상점</Badge>
          )}
        </div>

        {/* Image Gallery */}
        {mission.images.length > 0 && (
          <ImageGallery
            images={mission.images}
            alt={mission.title}
            aspectRatio="video"
          />
        )}

        {/* Title & Description */}
        <div className="space-y-3">
          <h2 className="text-lg md:text-xl font-bold text-text-primary">
            {mission.title}
          </h2>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            {mission.description}
          </p>
        </div>

        {/* Merchant Info */}
        <div className="p-4 rounded-xl bg-bg-secondary border border-border">
          <h3 className="text-sm font-semibold text-text-tertiary mb-3">상점 정보</h3>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-bg-tertiary flex-shrink-0">
              {mission.merchant.logo ? (
                <Image
                  src={mission.merchant.logo}
                  alt={mission.merchant.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-text-tertiary">
                  {mission.merchant.name[0]}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-text-primary">
                  {mission.merchant.name}
                </h4>
                {mission.merchant.verified && (
                  <svg className="h-5 w-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                <span className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{mission.merchant.rating.toFixed(1)}</span>
                </span>
                <span>·</span>
                <span>리뷰 {mission.merchant.reviewCount}개</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border">
            <div className="text-sm text-text-tertiary mb-1">리워드</div>
            <div className="text-xl font-bold text-primary">{formatReward()}</div>
          </div>
          
          <div className="p-4 rounded-xl bg-bg-secondary border border-border">
            <div className="text-sm text-text-tertiary mb-1">소요 시간</div>
            <div className="text-xl font-bold text-text-primary">약 {mission.estimatedTime}분</div>
          </div>
          
          <div className="p-4 rounded-xl bg-bg-secondary border border-border">
            <div className="text-sm text-text-tertiary mb-1">난이도</div>
            <div className="text-xl font-bold text-text-primary capitalize">
              {mission.difficulty === 'easy' ? '쉬움' : mission.difficulty === 'medium' ? '보통' : '어려움'}
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-bg-secondary border border-border">
            <div className="text-sm text-text-tertiary mb-1">마감</div>
            <div className={cn(
              "text-xl font-bold",
              remainingDays <= 3 ? "text-danger" : "text-text-primary"
            )}>
              {remainingDays}일 남음
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="p-4 rounded-xl bg-bg-secondary border border-border space-y-3">
          <h3 className="text-sm font-semibold text-text-tertiary">위치</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="font-medium text-text-primary">{mission.location.address}</p>
                <p className="text-sm text-text-secondary">
                  {mission.location.district}, {mission.location.city}
                </p>
              </div>
            </div>
            {mission.location.distance && (
              <div className="text-sm text-text-secondary">
                현재 위치에서 약 {mission.location.distance < 1000 
                  ? `${Math.round(mission.location.distance)}m` 
                  : `${(mission.location.distance / 1000).toFixed(1)}km`}
              </div>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="p-4 rounded-xl bg-bg-secondary border border-border space-y-3">
          <h3 className="text-sm font-semibold text-text-tertiary">촬영 요구사항</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-text-secondary mb-1">영상 길이</div>
              <div className="text-base font-medium text-text-primary">
                {mission.requirements.minVideoDuration}초 ~ {mission.requirements.maxVideoDuration}초
              </div>
            </div>
            
            {mission.requirements.requiredShots && mission.requirements.requiredShots.length > 0 && (
              <div>
                <div className="text-sm text-text-secondary mb-2">필수 촬영 구도</div>
                <div className="flex flex-wrap gap-2">
                  {mission.requirements.requiredShots.map((shot, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {shot}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {mission.requirements.guidelines && mission.requirements.guidelines.length > 0 && (
              <div>
                <div className="text-sm text-text-secondary mb-2">가이드라인</div>
                <ul className="space-y-2">
                  {mission.requirements.guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="text-success mt-0.5">✓</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {mission.requirements.prohibited && mission.requirements.prohibited.length > 0 && (
              <div>
                <div className="text-sm text-text-secondary mb-2">주의사항</div>
                <ul className="space-y-2">
                  {mission.requirements.prohibited.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-primary">
                      <span className="text-danger mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {mission.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {mission.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-lg bg-bg-tertiary text-sm text-text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="p-4 rounded-xl bg-bg-secondary border border-border space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-text-tertiary">진행 현황</h3>
            <span className="text-sm font-medium text-text-primary">
              {mission.stats.completed}/{mission.stats.totalSlots} 완료
            </span>
          </div>
          <div className="zzik-bar">
            <div
              className="zzik-bar__fill zzik-bar__fill--primary"
              style={{
                width: `${(mission.stats.completed / mission.stats.totalSlots) * 100}%`,
              }}
              role="progressbar"
              aria-valuenow={mission.stats.completed}
              aria-valuemin={0}
              aria-valuemax={mission.stats.totalSlots}
              aria-label={`미션 진행률: ${mission.stats.completed}/${mission.stats.totalSlots} 완료`}
            />
          </div>
          <div className="text-sm text-text-secondary">
            {mission.stats.remainingSlots}개 자리 남음
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action - Plus-Polish Enhanced */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border/50 p-4 safe-bottom">
        <div className="max-w-screen-xl mx-auto">
          <button
            className={cn(
              "zzik-btn zzik-btn--primary w-full",
              mission.stats.remainingSlots === 0 && "zzik-btn--secondary"
            )}
            onClick={() => setShowApplicationSheet(true)}
            disabled={mission.stats.remainingSlots === 0}
            aria-label={mission.stats.remainingSlots === 0 ? '미션 마감됨' : '미션 신청 모달 열기'}
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                미션 신청하기
              </>
            )}
          </button>
        </div>
      </div>

      {/* Application Bottom Sheet */}
      <BottomSheet
        isOpen={showApplicationSheet}
        onClose={() => setShowApplicationSheet(false)}
        title="미션 신청"
        height="auto"
      >
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-4xl">🎥</div>
            <h3 className="text-lg font-bold text-text-primary">
              이 미션에 참여하시겠습니까?
            </h3>
            <p className="text-sm text-text-secondary">
              신청 후 승인되면 촬영을 시작할 수 있습니다
            </p>
          </div>

          <div className="p-4 rounded-lg bg-bg-tertiary space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">리워드</span>
              <span className="font-semibold text-primary">{formatReward()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">소요 시간</span>
              <span className="font-medium text-text-primary">약 {mission.estimatedTime}분</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">마감일</span>
              <span className="font-medium text-text-primary">
                {new Date(mission.deadline).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              className="zzik-btn zzik-btn--primary w-full"
              onClick={handleApply}
              disabled={isApplying}
              aria-label="미션 신청 확인"
            >
              {isApplying ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  신청 중...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  신청하기
                </>
              )}
            </button>
            <button
              className="zzik-btn zzik-btn--ghost w-full"
              onClick={() => setShowApplicationSheet(false)}
              disabled={isApplying}
              aria-label="신청 취소"
            >
              취소
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

