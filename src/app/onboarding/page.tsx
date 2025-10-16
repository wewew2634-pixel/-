'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

/**
 * Onboarding Screen
 * - 3-step onboarding flow
 * - Shows key features of JJIKMEOK
 * - Skip or complete to proceed to auth
 */

const ONBOARDING_STEPS = [
  {
    icon: '🎥',
    title: '15초 촬영으로\n리워드 받기',
    description: '간단한 숏폼 영상 촬영으로\n로컬 비즈니스를 홍보하고\n수익을 창출하세요',
  },
  {
    icon: '🗺️',
    title: '내 주변 오퍼\n실시간 발견',
    description: '위치 기반으로\n가까운 곳의 체험 미션을\n바로 찾아보세요',
  },
  {
    icon: '💰',
    title: 'T+0 즉시 정산\n빠른 수익화',
    description: '미션 완료 후\n당일 또는 익일 정산으로\n빠르게 리워드를 받으세요',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      router.push('/auth/login');
    }
  };

  const handleSkip = () => {
    router.push('/auth/login');
  };

  const currentContent = ONBOARDING_STEPS[currentStep];

  if (!currentContent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col px-5 py-6 animate-fade-in">
      {/* Progress Indicators */}
      <div className="flex gap-2 mb-8">
        {ONBOARDING_STEPS.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-1 rounded-full transition-all duration-fast ${
              index === currentStep
                ? 'bg-primary'
                : index < currentStep
                ? 'bg-primary/50'
                : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 animate-slide-up">
        {/* Icon */}
        <div className="text-[80px] mb-8 animate-bounce-in">
          {currentContent.icon}
        </div>

        {/* Title */}
        <h2 className="text-h1 font-bold mb-4 whitespace-pre-line text-text-primary">
          {currentContent.title}
        </h2>

        {/* Description */}
        <p className="text-base text-text-secondary leading-relaxed whitespace-pre-line">
          {currentContent.description}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleNext}
        >
          {currentStep < ONBOARDING_STEPS.length - 1 ? '다음' : '시작하기'}
        </Button>
        
        {currentStep < ONBOARDING_STEPS.length - 1 && (
          <Button
            variant="ghost"
            fullWidth
            onClick={handleSkip}
          >
            건너뛰기
          </Button>
        )}
      </div>
    </div>
  );
}
