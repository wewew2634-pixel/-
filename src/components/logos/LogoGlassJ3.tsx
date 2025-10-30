import React from 'react';

interface LogoGlassJ3Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: 48,
  md: 96,
  lg: 144,
  xl: 192,
};

/**
 * Logo Glass J3: "Teal Glass Circle"
 * 
 * Concept: 틸 글라스 - 액센트 컬러
 * - 청록색 글라스모피즘
 * - 모던하고 차가운 느낌
 * - 테크 감성
 */
export default function LogoGlassJ3({ 
  size = 'md', 
  className = ''
}: LogoGlassJ3Props) {
  const dimension = SIZE_MAP[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Teal gradient */}
        <radialGradient id="tealGlass">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#0891B2" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.5" />
        </radialGradient>

        <radialGradient id="tealInner">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.85" />
        </radialGradient>

        <linearGradient id="jCyan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0FDFA" />
          <stop offset="100%" stopColor="#CCFBF1" />
        </linearGradient>

        <filter id="tealBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Outer glow */}
      <circle
        cx="64"
        cy="64"
        r="54"
        fill="none"
        stroke="#14B8A6"
        strokeWidth="2"
        opacity="0.3"
        filter="url(#tealBlur)"
      />

      {/* Outer glass */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="url(#tealGlass)"
        stroke="#14B8A6"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#tealBlur)"
      />

      {/* Middle glass */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#tealGlass)"
        stroke="#2DD4BF"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Inner circle */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#tealInner)"
      />

      {/* J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jCyan)"
        opacity="0.98"
      />

      {/* Glass highlight */}
      <ellipse
        cx="50"
        cy="50"
        rx="18"
        ry="14"
        fill="white"
        opacity="0.25"
      />

      {/* Tech sparkles */}
      <circle cx="74" cy="54" r="2" fill="#F0FDFA" opacity="0.8" />
      <circle cx="78" cy="70" r="1.5" fill="#CCFBF1" opacity="0.6" />
    </svg>
  );
}
