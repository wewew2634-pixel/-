import React from 'react';

interface Logo1stMotionProps {
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
 * Logo Style 7: "Dynamic Motion"
 * 
 * Concept: JJIKMEOK 1ST - 다이나믹 모션
 * Font: Inter Black
 * Style: 스피드 라인, 역동적
 * Best for: 숏폼 비디오, 동적 콘텐츠
 */
export default function Logo1stMotion({ 
  size = 'md', 
  className = ''
}: Logo1stMotionProps) {
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
        <linearGradient id="motionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF7A00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="textMotion" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB84D" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="128" height="128" fill="#000000" />

      {/* Speed lines - background */}
      {[36, 44, 52, 60, 68, 76, 84, 92].map((y, i) => (
        <line
          key={i}
          x1="10"
          y1={y}
          x2={90 + i * 3}
          y2={y}
          stroke="url(#motionGrad)"
          strokeWidth="2"
          opacity={0.3 + i * 0.05}
        />
      ))}

      {/* JJIKMEOK - italic/skewed */}
      <text
        x="72"
        y="52"
        fontFamily="system-ui, sans-serif"
        fontSize="18"
        fontWeight="900"
        fill="url(#textMotion)"
        textAnchor="middle"
        letterSpacing="0"
        transform="skewX(-10)"
      >
        JJIKMEOK
      </text>

      {/* Motion blur effect for JJIKMEOK */}
      <text
        x="70"
        y="52"
        fontFamily="system-ui, sans-serif"
        fontSize="18"
        fontWeight="900"
        fill="#FF7A00"
        textAnchor="middle"
        letterSpacing="0"
        transform="skewX(-10)"
        opacity="0.3"
      />

      {/* 1ST - huge, skewed */}
      <text
        x="72"
        y="90"
        fontFamily="system-ui, sans-serif"
        fontSize="36"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="3"
        transform="skewX(-10)"
      >
        1ST
      </text>

      {/* Motion blur for 1ST */}
      <text
        x="70"
        y="90"
        fontFamily="system-ui, sans-serif"
        fontSize="36"
        fontWeight="900"
        fill="#FF7A00"
        textAnchor="middle"
        letterSpacing="3"
        transform="skewX(-10)"
        opacity="0.4"
      />

      {/* Forward arrows */}
      <path d="M 102 58 L 112 64 L 102 70 Z" fill="#FF7A00" />
      <path d="M 108 58 L 118 64 L 108 70 Z" fill="#FF5E00" opacity="0.6" />

      {/* Spark particles */}
      <circle cx="92" cy="48" r="2" fill="#FFB84D" opacity="0.8" />
      <circle cx="96" cy="54" r="1.5" fill="#FF9F40" opacity="0.7" />
      <circle cx="88" cy="62" r="1" fill="#FF7A00" opacity="0.6" />
    </svg>
  );
}
