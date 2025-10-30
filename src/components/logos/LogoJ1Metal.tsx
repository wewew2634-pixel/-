import React from 'react';

interface LogoJ1MetalProps {
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
 * Logo J1-Metal: "Polished Bronze Metal"
 * 
 * Concept: 광택 청동 금속
 * - 미러 폴리시 효과
 * - 강한 반사광
 * - 클린하고 세련된
 * - 럭셔리 메탈
 */
export default function LogoJ1Metal({ 
  size = 'md', 
  className = ''
}: LogoJ1MetalProps) {
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
        {/* Polished bronze gradient */}
        <linearGradient id="polishedBronze" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0D8B0" />
          <stop offset="15%" stopColor="#E8C89C" />
          <stop offset="30%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#C19A6B" />
          <stop offset="70%" stopColor="#B8860B" />
          <stop offset="85%" stopColor="#9B7E56" />
          <stop offset="100%" stopColor="#7D6545" />
        </linearGradient>

        {/* Mirror reflection */}
        <linearGradient id="mirror" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#F5E6D3" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#8B7355" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3D2817" stopOpacity="0.8" />
        </linearGradient>

        {/* Specular highlight */}
        <radialGradient id="specular" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F5E6D3" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>

        {/* J metal gradient */}
        <linearGradient id="jMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F5E6D3" />
          <stop offset="100%" stopColor="#E8D4C0" />
        </linearGradient>

        {/* Sharp reflection band */}
        <linearGradient id="sharpReflect" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <filter id="metalBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
        </filter>

        <filter id="sharpShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.5" floodColor="#1A1410"/>
        </filter>

        <filter id="chromeGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0"/>
        </filter>
      </defs>

      {/* Shadow base */}
      <circle
        cx="64"
        cy="68"
        r="50"
        fill="#000000"
        opacity="0.2"
        filter="url(#metalBlur)"
      />

      {/* Main polished metal body */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="url(#polishedBronze)"
        filter="url(#sharpShadow)"
      />

      {/* Mirror reflection overlay */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="url(#mirror)"
        opacity="0.6"
      />

      {/* Specular highlight - top left */}
      <ellipse
        cx="50"
        cy="50"
        rx="25"
        ry="20"
        fill="url(#specular)"
      />

      {/* Sharp reflection band - curved */}
      <ellipse
        cx="64"
        cy="45"
        rx="35"
        ry="8"
        fill="url(#sharpReflect)"
        transform="rotate(-20 64 45)"
      />

      {/* Another reflection band */}
      <ellipse
        cx="64"
        cy="80"
        rx="30"
        ry="6"
        fill="url(#sharpReflect)"
        opacity="0.4"
        transform="rotate(15 64 80)"
      />

      {/* Edge highlight - crisp */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="none"
        stroke="url(#jMetal)"
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Inner beveled circle */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#polishedBronze)"
        opacity="0.9"
      />

      {/* Inner specular */}
      <ellipse
        cx="64"
        cy="56"
        rx="28"
        ry="18"
        fill="url(#specular)"
        opacity="0.6"
      />

      {/* Polished J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jMetal)"
        opacity="0.98"
      />

      {/* J top edge highlight */}
      <path
        d="M 54 46 L 72 46 L 72 47 L 54 47 Z"
        fill="#FFFFFF"
        opacity="0.8"
      />

      {/* J left edge highlight */}
      <path
        d="M 54 46 L 55 46 L 55 86 L 54 86 Z"
        fill="#FFFFFF"
        opacity="0.7"
      />

      {/* J curve highlight */}
      <path
        d="M 66 74 C 66 78 64 80 60 80 L 60 81 C 65 81 67 79 67 74 L 67 52 L 66 52 Z"
        fill="#FFFFFF"
        opacity="0.5"
      />

      {/* J bottom shadow */}
      <path
        d="M 72 74 C 72 82 68 86 60 86 L 60 87 C 69 87 73 83 73 74 L 73 46 L 72 46 Z"
        fill="#1A1410"
        opacity="0.4"
      />

      {/* Chrome sparkles */}
      <circle cx="76" cy="52" r="2" fill="#FFFFFF" opacity="0.9" filter="url(#chromeGlow)" />
      <circle cx="48" cy="74" r="1.5" fill="#FFFFFF" opacity="0.8" filter="url(#chromeGlow)" />
      <circle cx="82" cy="70" r="1" fill="#FFFFFF" opacity="0.7" />

      {/* Rim reflection - bottom edge */}
      <path
        d="M 20 75 Q 64 100 108 75"
        stroke="#1A1410"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />

      {/* Rim highlight - top edge */}
      <path
        d="M 20 50 Q 64 30 108 50"
        stroke="#FFFFFF"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
