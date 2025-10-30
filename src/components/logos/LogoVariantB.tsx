'use client';

/**
 * Logo Variant B: Camera Shutter Motif
 * 
 * 성수동 감성 - 카메라 모티프
 * - [ 찍 ] 셔터 프레임
 * - 15초 촬영 콘셉트
 * - 모던하고 직관적
 * - 숏폼 크리에이터 타겟
 */

interface LogoVariantBProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export default function LogoVariantB({ 
  size = 'md', 
  className = '',
  animated = false
}: LogoVariantBProps) {
  const sizeMap = {
    sm: { container: 'w-20 h-20', frame: 40, text: 'text-lg', sub: 'text-[8px]' },
    md: { container: 'w-24 h-24', frame: 48, text: 'text-xl', sub: 'text-[9px]' },
    lg: { container: 'w-32 h-32', frame: 64, text: 'text-2xl', sub: 'text-[10px]' },
    xl: { container: 'w-40 h-40', frame: 80, text: 'text-3xl', sub: 'text-xs' },
  };

  const { container, frame, text, sub } = sizeMap[size];

  return (
    <div className={`${container} flex flex-col items-center justify-center ${className}`}>
      {/* Camera Frame */}
      <div className="relative">
        {/* Shutter Frame - SVG */}
        <svg 
          width={frame} 
          height={frame} 
          viewBox="0 0 80 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'animate-scale-in' : ''}
        >
          {/* Outer Frame */}
          <rect 
            x="4" 
            y="4" 
            width="72" 
            height="72" 
            rx="12" 
            stroke="url(#gradient)" 
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Corner Brackets (카메라 뷰파인더 감성) */}
          <path d="M 12 12 L 12 20" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 12 12 L 20 12" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          
          <path d="M 68 12 L 68 20" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 68 12 L 60 12" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          
          <path d="M 12 68 L 12 60" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 12 68 L 20 68" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          
          <path d="M 68 68 L 68 60" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M 68 68 L 60 68" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Text Inside Frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className={`${text} font-black`}
            style={{
              background: 'linear-gradient(135deg, #FF7A00 0%, #14B8A6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            찍
          </span>
        </div>
      </div>
      
      {/* Bottom Text */}
      <div className={`${sub} font-bold tracking-[0.3em] text-text-secondary mt-2`}>
        먹 · JJIKMEOK
      </div>
    </div>
  );
}
