import React from 'react';

interface LogoGlassJ5Props {
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
 * Logo Glass J5: "Hexagon Glass"
 * 
 * Concept: 육각형 글라스
 * - 원형 대신 헥사곤
 * - 테크/미래적 느낌
 * - 오렌지 글라스
 */
export default function LogoGlassJ5({ 
  size = 'md', 
  className = ''
}: LogoGlassJ5Props) {
  const dimension = SIZE_MAP[size];

  // Hexagon points
  const hexPath = "M 64 20 L 94 38 L 94 74 L 64 92 L 34 74 L 34 38 Z";

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
        <radialGradient id="hexOrange">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E04E00" stopOpacity="0.6" />
        </radialGradient>

        <linearGradient id="jHex" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </linearGradient>

        <filter id="hexBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Outer hex glow */}
      <path
        d={hexPath}
        fill="none"
        stroke="#FF7A00"
        strokeWidth="3"
        opacity="0.25"
        filter="url(#hexBlur)"
        transform="scale(1.15) translate(-9.6, -9.6)"
      />

      {/* Outer hex glass */}
      <path
        d={hexPath}
        fill="url(#hexOrange)"
        stroke="#FF7A00"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#hexBlur)"
        transform="scale(1.05) translate(-3.2, -3.2)"
      />

      {/* Middle hex */}
      <path
        d={hexPath}
        fill="url(#hexOrange)"
        stroke="#FF8C1A"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Inner hex */}
      <path
        d="M 64 30 L 86 42 L 86 70 L 64 82 L 42 70 L 42 42 Z"
        fill="url(#hexOrange)"
        opacity="0.75"
      />

      {/* J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jHex)"
        opacity="0.98"
      />

      {/* Hex tech corners */}
      <circle cx="64" cy="20" r="2" fill="white" opacity="0.4" />
      <circle cx="94" cy="38" r="2" fill="white" opacity="0.4" />
      <circle cx="94" cy="74" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}
