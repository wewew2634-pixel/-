import React from 'react';

interface LogoGlassJ2Props {
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
 * Logo Glass J2: "Orange Glass Circle"
 * 
 * Concept: 오렌지 글라스 - 브랜드 컬러 활용
 * - J1과 동일한 구조
 * - 청동 대신 오렌지 그라데이션
 * - JJIKMEOK 브랜드 아이덴티티
 */
export default function LogoGlassJ2({ 
  size = 'md', 
  className = ''
}: LogoGlassJ2Props) {
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
        {/* Orange gradient for glass layers */}
        <radialGradient id="orangeGlass">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#FF5E00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E04E00" stopOpacity="0.5" />
        </radialGradient>

        {/* Inner orange gradient */}
        <radialGradient id="orangeInner">
          <stop offset="0%" stopColor="#FF8C1A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.85" />
        </radialGradient>

        {/* J letter - white to cream */}
        <linearGradient id="jWhite" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </linearGradient>

        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>

        <filter id="glow2">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* Outer glow */}
      <circle
        cx="64"
        cy="64"
        r="54"
        fill="none"
        stroke="#FF7A00"
        strokeWidth="2"
        opacity="0.25"
        filter="url(#glow2)"
      />

      {/* Outer glass circle */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="url(#orangeGlass)"
        stroke="#FF7A00"
        strokeWidth="1.5"
        opacity="0.45"
        filter="url(#blur)"
      />

      {/* Middle glass circle */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#orangeGlass)"
        stroke="#FF8C1A"
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Inner solid circle */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#orangeInner)"
      />

      {/* Decorative ring */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.25"
      />

      {/* J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jWhite)"
        opacity="0.98"
      />

      {/* J shadow */}
      <path
        d="M 56 48 L 70 48 L 70 74 C 70 80 67 84 61 84 L 56 84 L 56 81 L 61 81 C 64 81 65 79 65 76 L 65 54 L 56 54 Z"
        fill="#C04000"
        opacity="0.15"
      />

      {/* Glass highlight */}
      <ellipse
        cx="50"
        cy="50"
        rx="18"
        ry="14"
        fill="white"
        opacity="0.2"
      />

      {/* Sparkles */}
      <circle cx="74" cy="54" r="2" fill="white" opacity="0.7" />
      <circle cx="78" cy="70" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}
