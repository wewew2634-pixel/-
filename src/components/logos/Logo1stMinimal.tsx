import React from 'react';

interface Logo1stMinimalProps {
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
 * Logo Style 1: "Bold Minimalist"
 * 
 * Concept: JJIKMEOK 1ST - 대담한 미니멀
 * Font: Poppins Bold
 * Style: Ultra clean, geometric, sans-serif
 * Best for: 앱 아이콘, 프로필
 */
export default function Logo1stMinimal({ 
  size = 'md', 
  className = ''
}: Logo1stMinimalProps) {
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
        <linearGradient id="minGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="64" cy="64" r="60" fill="#000000" />

      {/* JJIKMEOK - top */}
      <text
        x="64"
        y="58"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="url(#minGrad)"
        textAnchor="middle"
        letterSpacing="-0.5"
      >
        JJIKMEOK
      </text>

      {/* 1ST - bottom */}
      <text
        x="64"
        y="78"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="24"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="2"
      >
        1ST
      </text>

      {/* Divider line */}
      <line
        x1="32"
        y1="64"
        x2="96"
        y2="64"
        stroke="url(#minGrad)"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}
