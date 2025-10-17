import React from 'react';

interface LogoGlassProps {
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
 * Logo: Glassmorphism Style
 * 
 * Philosophy: "순간의 투명성" - Transparent moment capture
 * 
 * Design: Frosted glass effect with blur and depth
 * - Multiple layered transparent shapes
 * - Blur backdrop filter simulation with opacity
 * - Soft borders and subtle shadows
 * - Modern, premium, elegant
 * 
 * Tailwind Plus Features:
 * - backdrop-blur (glassmorphism)
 * - Subtle gradients
 * - Layered depth
 */
export default function LogoGlass({ 
  size = 'md', 
  className = ''
}: LogoGlassProps) {
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
        {/* Gradient for glass effect */}
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#FF5E00" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.3" />
        </linearGradient>
        
        {/* Shimmer gradient */}
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>

        {/* Blur filter simulation */}
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
        </filter>
      </defs>

      {/* Background glass layer - largest */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="url(#glassGradient)"
        stroke="white"
        strokeWidth="1"
        opacity="0.4"
        filter="url(#blur)"
      />

      {/* Middle glass layer */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#glassGradient)"
        stroke="white"
        strokeWidth="1.5"
        opacity="0.5"
      />

      {/* Inner symbol - "J" for JJIKMEOK */}
      <path
        d="M 58 40 L 70 40 L 70 76 C 70 84 66 88 58 88 L 54 88 L 54 82 L 58 82 C 62 82 64 80 64 76 L 64 46 L 58 46 Z"
        fill="url(#shimmer)"
        opacity="0.9"
      />

      {/* Highlight - top left corner for glass effect */}
      <ellipse
        cx="48"
        cy="48"
        rx="20"
        ry="16"
        fill="white"
        opacity="0.3"
      />

      {/* Border glow */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="none"
        stroke="url(#shimmer)"
        strokeWidth="0.5"
        opacity="0.6"
      />
    </svg>
  );
}
