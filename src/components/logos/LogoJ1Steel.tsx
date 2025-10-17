import React from 'react';

interface LogoJ1SteelProps {
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
 * Logo J1-Steel: "Bronze Steel Art"
 * 
 * Concept: 청동색 강철 아트
 * - 메탈릭 청동 그라데이션
 * - 브러시드 메탈 텍스처
 * - 엠보싱 효과
 * - 산업적 디테일 (볼트, 리벳)
 */
export default function LogoJ1Steel({ 
  size = 'md', 
  className = ''
}: LogoJ1SteelProps) {
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
        {/* Metallic bronze gradient */}
        <linearGradient id="bronzeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#C19A6B" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="75%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5644" />
        </linearGradient>

        {/* Chrome-like reflective gradient */}
        <linearGradient id="chromeReflect" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="20%" stopColor="#E8D4C0" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#C9B8A8" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#8B7355" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#6B5644" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#4A3F35" stopOpacity="0.8" />
        </linearGradient>

        {/* Brushed metal texture */}
        <pattern id="brushedMetal" x="0" y="0" width="4" height="100" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.1" />
          <line x1="2" y1="0" x2="2" y2="100" stroke="#000000" strokeWidth="0.3" opacity="0.05" />
        </pattern>

        {/* Embossed J gradient */}
        <linearGradient id="embossedJ" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6D3" />
          <stop offset="50%" stopColor="#E8D4C0" />
          <stop offset="100%" stopColor="#D4BFA8" />
        </linearGradient>

        {/* Metal shadow */}
        <filter id="metalShadow">
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodOpacity="0.6" floodColor="#1A1410"/>
        </filter>

        {/* Bevel effect */}
        <filter id="bevel">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="2" dy="2" result="offsetBlur" />
          <feFlood floodColor="#FFFFFF" floodOpacity="0.5" />
          <feComposite in2="offsetBlur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base metal plate - circular */}
      <circle
        cx="64"
        cy="64"
        r="52"
        fill="url(#bronzeMetal)"
        filter="url(#metalShadow)"
      />

      {/* Brushed metal texture overlay */}
      <circle
        cx="64"
        cy="64"
        r="52"
        fill="url(#brushedMetal)"
      />

      {/* Chrome reflection band */}
      <ellipse
        cx="64"
        cy="48"
        rx="40"
        ry="20"
        fill="url(#chromeReflect)"
        opacity="0.4"
      />

      {/* Inner beveled ring */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="none"
        stroke="url(#chromeReflect)"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* Industrial rivet holes - 8 positions */}
      <circle cx="64" cy="16" r="3" fill="#3D2817" />
      <circle cx="64" cy="16" r="2" fill="#1A1410" />
      
      <circle cx="108" cy="44" r="3" fill="#3D2817" />
      <circle cx="108" cy="44" r="2" fill="#1A1410" />
      
      <circle cx="108" cy="84" r="3" fill="#3D2817" />
      <circle cx="108" cy="84" r="2" fill="#1A1410" />
      
      <circle cx="64" cy="112" r="3" fill="#3D2817" />
      <circle cx="64" cy="112" r="2" fill="#1A1410" />
      
      <circle cx="20" cy="84" r="3" fill="#3D2817" />
      <circle cx="20" cy="84" r="2" fill="#1A1410" />
      
      <circle cx="20" cy="44" r="3" fill="#3D2817" />
      <circle cx="20" cy="44" r="2" fill="#1A1410" />

      {/* Central inset panel */}
      <circle
        cx="64"
        cy="64"
        r="38"
        fill="#4A3F35"
        opacity="0.8"
      />

      {/* Inner metal gradient */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#bronzeMetal)"
        opacity="0.9"
      />

      {/* Embossed J letter */}
      <g filter="url(#bevel)">
        <path
          d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
          fill="url(#embossedJ)"
          opacity="0.95"
        />
      </g>

      {/* J top highlight (embossed effect) */}
      <path
        d="M 54 46 L 72 46 L 72 48 L 56 48 L 56 52 L 68 52 L 68 74 C 68 80 65 84 60 84 L 56 84 L 56 82 L 60 82 C 63 82 66 79 66 74 L 66 50 L 54 50 Z"
        fill="#FFFFFF"
        opacity="0.3"
      />

      {/* J bottom shadow (debossed effect) */}
      <path
        d="M 56 48 L 70 48 L 70 74 C 70 80 67 84 61 84 L 56 84 L 56 81 L 61 81 C 64 81 68 78 68 74 L 68 54 L 56 54 Z"
        fill="#1A1410"
        opacity="0.3"
      />

      {/* Edge highlight - top */}
      <path
        d="M 64 12 A 52 52 0 0 1 112 64"
        stroke="#F5E6D3"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      {/* Edge shadow - bottom */}
      <path
        d="M 64 116 A 52 52 0 0 1 16 64"
        stroke="#1A1410"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />

      {/* Decorative screws on inner ring */}
      <circle cx="64" cy="28" r="2" fill="#C9B8A8" />
      <circle cx="64" cy="28" r="1" fill="#3D2817" />
      <line x1="63" y1="27" x2="65" y2="29" stroke="#1A1410" strokeWidth="0.5" />
      <line x1="65" y1="27" x2="63" y2="29" stroke="#1A1410" strokeWidth="0.5" />

      <circle cx="92" cy="64" r="2" fill="#C9B8A8" />
      <circle cx="92" cy="64" r="1" fill="#3D2817" />
      <line x1="91" y1="63" x2="93" y2="65" stroke="#1A1410" strokeWidth="0.5" />
      <line x1="93" y1="63" x2="91" y2="65" stroke="#1A1410" strokeWidth="0.5" />

      <circle cx="64" cy="100" r="2" fill="#C9B8A8" />
      <circle cx="64" cy="100" r="1" fill="#3D2817" />
      <line x1="63" y1="99" x2="65" y2="101" stroke="#1A1410" strokeWidth="0.5" />
      <line x1="65" y1="99" x2="63" y2="101" stroke="#1A1410" strokeWidth="0.5" />

      <circle cx="36" cy="64" r="2" fill="#C9B8A8" />
      <circle cx="36" cy="64" r="1" fill="#3D2817" />
      <line x1="35" y1="63" x2="37" y2="65" stroke="#1A1410" strokeWidth="0.5" />
      <line x1="37" y1="63" x2="35" y2="65" stroke="#1A1410" strokeWidth="0.5" />
    </svg>
  );
}
