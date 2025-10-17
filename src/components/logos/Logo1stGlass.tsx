import React from 'react';

interface Logo1stGlassProps {
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
 * Logo Style 8: "Glassmorphism"
 * 
 * Concept: JJIKMEOK 1ST - 글라스모피즘
 * Font: Poppins
 * Style: 유리 효과, 반투명, 블러
 * Best for: 모던 UI, iOS 스타일
 */
export default function Logo1stGlass({ 
  size = 'md', 
  className = ''
}: Logo1stGlassProps) {
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
        <radialGradient id="glassOrange">
          <stop offset="0%" stopColor="#FF9F40" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF5E00" stopOpacity="0.6" />
        </radialGradient>

        <linearGradient id="glassText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFE5CC" />
        </linearGradient>

        <filter id="glassBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Background gradient */}
      <rect width="128" height="128" fill="#1A1A1A" />
      <rect width="128" height="128" fill="url(#glassOrange)" opacity="0.3" />

      {/* Outer glass circle */}
      <circle
        cx="64"
        cy="64"
        r="54"
        fill="url(#glassOrange)"
        opacity="0.3"
        filter="url(#glassBlur)"
      />

      <circle
        cx="64"
        cy="64"
        r="50"
        fill="url(#glassOrange)"
        stroke="#FF7A00"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Middle glass layer */}
      <circle
        cx="64"
        cy="64"
        r="46"
        fill="url(#glassOrange)"
        opacity="0.6"
      />

      {/* Glass highlight - top left */}
      <ellipse
        cx="50"
        cy="50"
        rx="24"
        ry="18"
        fill="#FFFFFF"
        opacity="0.15"
      />

      {/* JJIKMEOK text */}
      <text
        x="64"
        y="56"
        fontFamily="system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="url(#glassText)"
        textAnchor="middle"
        letterSpacing="0"
        opacity="0.95"
      >
        JJIKMEOK
      </text>

      {/* 1ST text */}
      <text
        x="64"
        y="80"
        fontFamily="system-ui, sans-serif"
        fontSize="28"
        fontWeight="900"
        fill="url(#glassText)"
        textAnchor="middle"
        letterSpacing="3"
        opacity="0.98"
      >
        1ST
      </text>

      {/* Glass border ring */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* Sparkles */}
      <circle cx="78" cy="52" r="2" fill="#FFFFFF" opacity="0.7" />
      <circle cx="48" cy="76" r="1.5" fill="#FFE5CC" opacity="0.6" />
    </svg>
  );
}
