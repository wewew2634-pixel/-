'use client';

/**
 * Logo Zz Minimal - Ultra Clean Version
 * 
 * 초미니멀 버전:
 * - "Zz" 글자만 (가장 심플)
 * - Monochrome 옵션
 * - 작은 사이즈에 최적화
 * - App icon으로 사용 가능
 */

interface LogoZzMinimalProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  monochrome?: boolean;
  className?: string;
  animated?: boolean;
}

export default function LogoZzMinimal({ 
  size = 'md',
  monochrome = false,
  className = '',
  animated = false
}: LogoZzMinimalProps) {
  const sizeMap = {
    sm: { text: 'text-3xl' },
    md: { text: 'text-5xl' },
    lg: { text: 'text-7xl' },
    xl: { text: 'text-8xl' },
  };

  const { text } = sizeMap[size];

  const gradientStyle = monochrome 
    ? {
        color: 'currentColor',
      }
    : {
        background: 'linear-gradient(135deg, #FF7A00 0%, #14B8A6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <span
        className={`${text} font-black ${animated ? 'animate-scale-in' : ''}`}
        style={{
          ...gradientStyle,
          letterSpacing: '-0.08em',
          lineHeight: 1,
          fontFamily: 'Pretendard Variable, -apple-system, sans-serif',
          fontWeight: 900,
        }}
      >
        Zz
      </span>
    </div>
  );
}
