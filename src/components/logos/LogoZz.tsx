'use client';

/**
 * Logo Zz - Supabase Inspired Design
 * 
 * 디자인 컨셉:
 * - "Zz" 2글자 워드마크 (찍먹의 Z)
 * - Supabase 스타일: 미니멀, 기하학적, 모던
 * - 색상: Orange (#FF7A00) + Teal (#14B8A6) gradient
 * - 타이포: 굵은 sans-serif (Pretendard Black)
 * - 심볼: 각진 기하학 + 라운드 처리
 * 
 * 특징:
 * ✅ 2글자만으로 강력한 브랜드 인지도
 * ✅ 기하학적 단순함 (Supabase처럼)
 * ✅ 성수동 + 개발자 감성
 * ✅ SVG 기반 무한 확장
 */

interface LogoZzProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'outline' | 'icon-only';
  className?: string;
  animated?: boolean;
}

export default function LogoZz({ 
  size = 'md',
  variant = 'default',
  className = '',
  animated = false
}: LogoZzProps) {
  const sizeMap = {
    sm: { 
      container: 'w-16 h-16', 
      text: 'text-2xl',
      iconSize: 48,
      sub: 'text-[8px]'
    },
    md: { 
      container: 'w-20 h-20', 
      text: 'text-3xl',
      iconSize: 64,
      sub: 'text-[9px]'
    },
    lg: { 
      container: 'w-28 h-28', 
      text: 'text-5xl',
      iconSize: 88,
      sub: 'text-[10px]'
    },
    xl: { 
      container: 'w-36 h-36', 
      text: 'text-6xl',
      iconSize: 112,
      sub: 'text-xs'
    },
  };

  const { container, text, iconSize, sub } = sizeMap[size];

  // Variant: Icon Only (Symbol)
  if (variant === 'icon-only') {
    return (
      <div className={`${container} flex items-center justify-center ${className}`}>
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 112 112" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'animate-scale-in' : ''}
        >
          {/* Background Square with Gradient */}
          <rect 
            x="8" 
            y="8" 
            width="96" 
            height="96" 
            rx="20" 
            fill="url(#zzGradient)"
          />
          
          {/* "Zz" Typography */}
          <text
            x="56"
            y="75"
            fontFamily="Pretendard Variable, sans-serif"
            fontSize="56"
            fontWeight="900"
            textAnchor="middle"
            fill="white"
            letterSpacing="-0.05em"
          >
            Zz
          </text>
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="zzGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Variant: Outline (Stroke Only)
  if (variant === 'outline') {
    return (
      <div className={`${container} flex flex-col items-center justify-center gap-1 ${className}`}>
        <div 
          className={`${text} font-black tracking-tighter leading-none ${animated ? 'animate-fade-in' : ''}`}
          style={{
            WebkitTextStroke: '2px transparent',
            WebkitTextFillColor: 'transparent',
            backgroundImage: 'linear-gradient(135deg, #FF7A00 0%, #14B8A6 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            textShadow: '0 0 20px rgba(255, 122, 0, 0.3)',
          }}
        >
          Zz
        </div>
        <div className={`${sub} font-medium tracking-[0.3em] text-text-secondary`}>
          찍먹
        </div>
      </div>
    );
  }

  // Variant: Default (Full Logo)
  return (
    <div className={`${container} flex flex-col items-center justify-center gap-2 ${className}`}>
      {/* Main "Zz" Typography */}
      <div 
        className={`${text} font-black tracking-tighter leading-none ${animated ? 'animate-scale-in' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #FF7A00 0%, #14B8A6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.08em',
          textShadow: '0 4px 12px rgba(255, 122, 0, 0.2)',
        }}
      >
        Zz
      </div>
      
      {/* Subtitle */}
      <div className={`${sub} font-semibold tracking-[0.25em] text-text-secondary ${animated ? 'animate-fade-in' : ''}`}>
        JJIKMEOK
      </div>
    </div>
  );
}
