import React from 'react';

interface Logo1stBrutalProps {
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
 * Logo Style 3: "Street Brutal"
 * 
 * Concept: JJIKMEOK 1ST - 스트릿 브루탈
 * Font: Impact/Arial Black
 * Style: 두꺼운 테두리, 오프셋 그림자
 * Best for: 성수동 로컬, 힙한 감성
 */
export default function Logo1stBrutal({ 
  size = 'md', 
  className = ''
}: Logo1stBrutalProps) {
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
      {/* White background */}
      <rect width="128" height="128" fill="#FFFFFF" />

      {/* Shadow layer - offset */}
      <rect x="18" y="24" width="96" height="80" fill="#000000" rx="4" />

      {/* Main orange box */}
      <rect x="14" y="20" width="96" height="80" fill="#FF7A00" stroke="#000000" strokeWidth="6" rx="4" />

      {/* JJIKMEOK - top, black stroke */}
      <text
        x="62"
        y="52"
        fontFamily="Arial Black, sans-serif"
        fontSize="18"
        fontWeight="900"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="4"
        textAnchor="middle"
        letterSpacing="0"
      >
        JJIKMEOK
      </text>
      <text
        x="62"
        y="52"
        fontFamily="Arial Black, sans-serif"
        fontSize="18"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="0"
      >
        JJIKMEOK
      </text>

      {/* 1ST - bottom, huge */}
      <text
        x="62"
        y="88"
        fontFamily="Arial Black, sans-serif"
        fontSize="36"
        fontWeight="900"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="5"
        textAnchor="middle"
        letterSpacing="2"
      >
        1ST
      </text>
      <text
        x="62"
        y="88"
        fontFamily="Arial Black, sans-serif"
        fontSize="36"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="2"
      >
        1ST
      </text>

      {/* Divider - brutal */}
      <rect x="28" y="60" width="68" height="4" fill="#000000" />

      {/* Corner dots */}
      <circle cx="24" cy="30" r="4" fill="#000000" />
      <circle cx="104" cy="30" r="4" fill="#000000" />
      <circle cx="24" cy="90" r="4" fill="#000000" />
      <circle cx="104" cy="90" r="4" fill="#000000" />
    </svg>
  );
}
