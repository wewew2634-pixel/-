import React from 'react';

interface Logo1st3DProps {
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
 * Logo Style 5: "3D Isometric"
 * 
 * Concept: JJIKMEOK 1ST - 입체 아이소메트릭
 * Font: Montserrat Bold
 * Style: 3D 효과, 깊이감
 * Best for: 게임, 앱 아이콘
 */
export default function Logo1st3D({ 
  size = 'md', 
  className = ''
}: Logo1st3DProps) {
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
        <linearGradient id="top3d" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB84D" />
          <stop offset="100%" stopColor="#FF9F40" />
        </linearGradient>

        <linearGradient id="left3d" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#E04E00" />
        </linearGradient>

        <linearGradient id="right3d" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E04E00" />
          <stop offset="100%" stopColor="#B83800" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="128" height="128" fill="#1A1A1A" />

      {/* 3D Box - top face */}
      <path
        d="M 64 24 L 104 44 L 104 72 L 64 92 L 24 72 L 24 44 Z"
        fill="url(#top3d)"
      />

      {/* 3D Box - left face */}
      <path
        d="M 24 44 L 64 24 L 64 92 L 24 72 Z"
        fill="url(#left3d)"
      />

      {/* 3D Box - right face */}
      <path
        d="M 64 24 L 104 44 L 104 72 L 64 92 Z"
        fill="url(#right3d)"
      />

      {/* JJIKMEOK on top face */}
      <text
        x="64"
        y="52"
        fontFamily="system-ui, sans-serif"
        fontSize="12"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="1"
      >
        JJIKMEOK
      </text>

      {/* 1ST on top face - large */}
      <text
        x="64"
        y="72"
        fontFamily="system-ui, sans-serif"
        fontSize="22"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="2"
      >
        1ST
      </text>

      {/* 3D Shadow */}
      <ellipse
        cx="64"
        cy="102"
        rx="36"
        ry="8"
        fill="#000000"
        opacity="0.4"
      />

      {/* Highlight edges */}
      <line x1="24" y1="44" x2="64" y2="24" stroke="#FFD9B3" strokeWidth="1" opacity="0.5" />
      <line x1="64" y1="24" x2="104" y2="44" stroke="#FFD9B3" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
