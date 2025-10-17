import React from 'react';

interface LogoGlassJ6Props {
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
 * Logo Glass J6: "Rounded Square Glass"
 * 
 * Concept: 라운드 스퀘어 글라스
 * - iOS 앱 아이콘 스타일
 * - 둥근 사각형
 * - 오렌지 글라스
 */
export default function LogoGlassJ6({ 
  size = 'md', 
  className = ''
}: LogoGlassJ6Props) {
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
        <radialGradient id="sqOrange" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FF8C1A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E04E00" stopOpacity="0.7" />
        </radialGradient>

        <linearGradient id="jSquare" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </linearGradient>

        <filter id="sqBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Outer glow */}
      <rect
        x="12"
        y="12"
        width="104"
        height="104"
        rx="26"
        fill="none"
        stroke="#FF7A00"
        strokeWidth="3"
        opacity="0.25"
        filter="url(#sqBlur)"
      />

      {/* Outer glass layer */}
      <rect
        x="16"
        y="16"
        width="96"
        height="96"
        rx="24"
        fill="url(#sqOrange)"
        stroke="#FF7A00"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#sqBlur)"
      />

      {/* Middle layer */}
      <rect
        x="20"
        y="20"
        width="88"
        height="88"
        rx="22"
        fill="url(#sqOrange)"
        stroke="#FF8C1A"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Inner solid */}
      <rect
        x="26"
        y="26"
        width="76"
        height="76"
        rx="19"
        fill="url(#sqOrange)"
        opacity="0.8"
      />

      {/* J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jSquare)"
        opacity="0.98"
      />

      {/* iOS-style highlight */}
      <rect
        x="32"
        y="32"
        width="40"
        height="24"
        rx="12"
        fill="white"
        opacity="0.15"
      />

      {/* Corner sparkles */}
      <circle cx="90" cy="38" r="2" fill="white" opacity="0.5" />
      <circle cx="38" cy="90" r="2" fill="white" opacity="0.5" />
    </svg>
  );
}
