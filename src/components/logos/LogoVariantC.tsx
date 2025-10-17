'use client';

/**
 * Logo Variant C: Play Button + Typography
 * 
 * 성수동 감성 - 플레이 버튼
 * - ▶ 숏폼 비디오 강조
 * - 심플하고 임팩트
 * - 틱톡/유튜브 숏츠 연상
 * - 가장 직관적
 */

interface LogoVariantCProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export default function LogoVariantC({ 
  size = 'md', 
  className = '',
  animated = false
}: LogoVariantCProps) {
  const sizeMap = {
    sm: { container: 'w-24 h-16', play: 24, text: 'text-xl', sub: 'text-[8px]' },
    md: { container: 'w-32 h-20', play: 32, text: 'text-2xl', sub: 'text-[9px]' },
    lg: { container: 'w-40 h-24', play: 40, text: 'text-3xl', sub: 'text-[10px]' },
    xl: { container: 'w-48 h-28', play: 48, text: 'text-4xl', sub: 'text-xs' },
  };

  const { container, play, text, sub } = sizeMap[size];

  return (
    <div className={`${container} flex flex-col items-center justify-center gap-1 ${className}`}>
      {/* Main Logo: Play + Text */}
      <div className="flex items-center gap-2">
        {/* Modern Play Button */}
        <svg 
          width={play} 
          height={play} 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={animated ? 'animate-scale-in' : ''}
        >
          {/* Outer Circle with Gradient */}
          <circle 
            cx="24" 
            cy="24" 
            r="22" 
            fill="url(#playGradient)"
            className={animated ? 'animate-pulse' : ''}
          />
          
          {/* Play Triangle */}
          <path 
            d="M 18 14 L 18 34 L 34 24 Z" 
            fill="white"
            className="drop-shadow-md"
          />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FF5E00" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Korean Text */}
        <div className="flex flex-col leading-none">
          <span 
            className={`${text} font-black tracking-tight`}
            style={{
              background: 'linear-gradient(135deg, #FF7A00 0%, #FF5E00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            찍먹
          </span>
        </div>
      </div>
      
      {/* Subtitle */}
      <div className={`${sub} font-semibold tracking-[0.25em] text-text-secondary`}>
        15초 촬영, 즉시 수익
      </div>
    </div>
  );
}
