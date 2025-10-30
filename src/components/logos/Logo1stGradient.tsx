import React from 'react';

interface Logo1stGradientProps {
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
 * Logo Style 4: "Gradient Flow"
 * 
 * Concept: JJIKMEOK 1ST - 그라데이션 플로우
 * Font: Inter
 * Style: 복잡한 그라데이션, 유기적
 * Best for: 인스타그램, 소셜미디어
 */
export default function Logo1stGradient({ 
  size = 'md', 
  className = ''
}: Logo1stGradientProps) {
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
        <radialGradient id="bgGrad" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFE5CC" />
          <stop offset="50%" stopColor="#FFB366" />
          <stop offset="100%" stopColor="#FF7A00" />
        </radialGradient>

        <linearGradient id="textGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFE5CC" />
          <stop offset="100%" stopColor="#FFC999" />
        </linearGradient>

        <linearGradient id="textGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF5E00" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FF9F40" />
        </linearGradient>

        <filter id="softGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* Gradient background */}
      <circle cx="64" cy="64" r="62" fill="url(#bgGrad)" />

      {/* Soft glow layer */}
      <circle cx="64" cy="64" r="58" fill="#FF7A00" opacity="0.3" filter="url(#softGlow)" />

      {/* JJIKMEOK - gradient text */}
      <text
        x="64"
        y="56"
        fontFamily="system-ui, sans-serif"
        fontSize="19"
        fontWeight="800"
        fill="url(#textGrad1)"
        textAnchor="middle"
        letterSpacing="-0.5"
      >
        JJIKMEOK
      </text>

      {/* 1ST - gradient text */}
      <text
        x="64"
        y="82"
        fontFamily="system-ui, sans-serif"
        fontSize="26"
        fontWeight="900"
        fill="url(#textGrad2)"
        textAnchor="middle"
        letterSpacing="2"
      >
        1ST
      </text>

      {/* Flowing divider */}
      <path
        d="M 28 64 Q 48 60 64 64 T 100 64"
        stroke="url(#textGrad1)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />

      {/* Gradient circles */}
      <circle cx="24" cy="40" r="3" fill="url(#textGrad1)" opacity="0.7" />
      <circle cx="104" cy="88" r="3" fill="url(#textGrad2)" opacity="0.7" />
    </svg>
  );
}
