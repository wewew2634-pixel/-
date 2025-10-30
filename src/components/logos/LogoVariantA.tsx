'use client';

/**
 * Logo Variant A: Minimal Wordmark
 * 
 * 성수동 감성 - 미니멀 워드마크
 * - 한글 "찍먹" + 영문 조합
 * - 굵은 Pretendard Variable
 * - Orange gradient accent
 * - 카페/브랜드 감성
 */

interface LogoVariantAProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export default function LogoVariantA({ 
  size = 'md', 
  className = '',
  animated = false
}: LogoVariantAProps) {
  const sizeMap = {
    sm: { container: 'w-20 h-20', korean: 'text-2xl', english: 'text-[9px]' },
    md: { container: 'w-24 h-24', korean: 'text-3xl', english: 'text-[10px]' },
    lg: { container: 'w-32 h-32', korean: 'text-4xl', english: 'text-xs' },
    xl: { container: 'w-40 h-40', korean: 'text-5xl', english: 'text-sm' },
  };

  const { container, korean, english } = sizeMap[size];

  return (
    <div className={`${container} flex flex-col items-center justify-center ${className}`}>
      {/* 한글 "찍먹" - 메인 */}
      <div 
        className={`${korean} font-black tracking-tight leading-none ${animated ? 'animate-fade-in' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #FF7A00 0%, #FF5E00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em'
        }}
      >
        찍먹
      </div>
      
      {/* 영문 "JJIKMEOK" - 서브 */}
      <div 
        className={`${english} font-bold tracking-[0.3em] text-text-secondary mt-1 ${animated ? 'animate-fade-in' : ''}`}
        style={{
          animationDelay: animated ? '0.1s' : '0s'
        }}
      >
        JJIKMEOK
      </div>
    </div>
  );
}
