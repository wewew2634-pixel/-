import React from 'react';

interface LogoMinimal3DProps {
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
 * Logo: Minimal 3D Isometric Style
 * 
 * Philosophy: "입체적 순간" - Dimensional moment
 * 
 * Design: Isometric 3D shape with depth
 * - Clean geometric forms
 * - 3D perspective (isometric)
 * - Gradient for depth
 * - Modern, tech-forward
 */
export default function LogoMinimal3D({ 
  size = 'md', 
  className = ''
}: LogoMinimal3DProps) {
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
        {/* 3D gradients for faces */}
        <linearGradient id="topFace" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>

        <linearGradient id="leftFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>

        <linearGradient id="rightFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF5E00" />
          <stop offset="100%" stopColor="#E04E00" />
        </linearGradient>
      </defs>

      {/* Isometric "J" shape - 3D extrusion */}
      
      {/* Top face */}
      <path
        d="M 64 32 L 80 42 L 80 56 L 72 60 L 72 72 L 68 74 L 60 70 L 60 66 L 66 66 L 66 56 L 58 52 L 58 42 Z"
        fill="url(#topFace)"
      />

      {/* Left face (darker) */}
      <path
        d="M 48 42 L 58 48 L 58 52 L 66 56 L 66 66 L 60 70 L 60 86 L 48 80 Z"
        fill="url(#leftFace)"
      />

      {/* Right face (darkest) */}
      <path
        d="M 80 42 L 80 56 L 72 60 L 72 72 L 68 74 L 68 90 L 60 86 L 60 70 L 66 66 L 66 56 L 58 52 L 58 48 L 68 42 Z"
        fill="url(#rightFace)"
      />

      {/* Bottom cube part */}
      <path
        d="M 48 80 L 60 86 L 68 90 L 68 96 L 56 90 L 48 86 Z"
        fill="#C04000"
      />

      {/* Subtle shadow */}
      <ellipse
        cx="64"
        cy="100"
        rx="24"
        ry="6"
        fill="#000000"
        opacity="0.15"
      />
    </svg>
  );
}
