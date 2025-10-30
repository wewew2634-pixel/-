'use client';

/**
 * Logo Zz Pro - Advanced Supabase Style
 * 
 * 프리미엄 버전:
 * - "Zz" 글자 + 기하학적 심볼 조합
 * - Supabase의 산 모양처럼 추상화된 "Z" 심볼
 * - 3D depth effect
 * - Glassmorphism
 */

interface LogoZzProProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export default function LogoZzPro({ 
  size = 'md',
  className = '',
  animated = false
}: LogoZzProProps) {
  const sizeMap = {
    sm: { container: 'w-20 h-20', iconSize: 64, text: 'text-xs' },
    md: { container: 'w-24 h-24', iconSize: 80, text: 'text-sm' },
    lg: { container: 'w-32 h-32', iconSize: 104, text: 'text-base' },
    xl: { container: 'w-40 h-40', iconSize: 128, text: 'text-lg' },
  };

  const { container, iconSize, text } = sizeMap[size];

  return (
    <div className={`${container} flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Geometric Symbol + Typography */}
      <div className="relative">
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 128 128" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'animate-scale-in' : ''}
        >
          {/* Background Circle with Gradient */}
          <circle 
            cx="64" 
            cy="64" 
            r="58" 
            fill="url(#proGradient)"
            opacity="0.15"
          />
          
          {/* Geometric "Z" Symbol - Abstract Mountains */}
          <g className={animated ? 'animate-pulse' : ''}>
            {/* First Z stroke */}
            <path 
              d="M 32 38 L 96 38 L 32 90 L 96 90" 
              stroke="url(#proGradient)" 
              strokeWidth="10" 
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            
            {/* Inner accent line */}
            <path 
              d="M 40 46 L 88 46" 
              stroke="url(#accentGradient)" 
              strokeWidth="4" 
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
          
          {/* Glassmorphism overlay */}
          <circle 
            cx="64" 
            cy="64" 
            r="58" 
            fill="white"
            opacity="0.05"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="proGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="50%" stopColor="#FF5E00" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
            
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Brand Text */}
      <div className={`${text} font-bold tracking-wider text-text-primary`}>
        JJIKMEOK
      </div>
    </div>
  );
}
