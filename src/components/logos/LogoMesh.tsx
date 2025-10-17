import React from 'react';

interface LogoMeshProps {
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
 * Logo: Gradient Mesh Style
 * 
 * Philosophy: "흐르는 순간" - Flowing moment
 * 
 * Design: Complex multi-point gradients creating 3D depth
 * - Radial and mesh gradients
 * - Multiple color stops
 * - Soft organic shapes
 * - Premium, modern, fluid
 * 
 * Tailwind Plus Features:
 * - Complex gradient meshes
 * - Smooth color transitions
 * - 3D depth illusion
 */
export default function LogoMesh({ 
  size = 'md', 
  className = ''
}: LogoMeshProps) {
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
        {/* Complex mesh gradient - orange to teal */}
        <radialGradient id="meshGrad1" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFB800" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FF5E00" />
        </radialGradient>

        <radialGradient id="meshGrad2" cx="70%" cy="70%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="50%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#0369A1" />
        </radialGradient>

        {/* Center glow */}
        <radialGradient id="centerGlow">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.2" />
        </radialGradient>

        {/* Blur for soft edges */}
        <filter id="softBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>

      {/* Background blob - orange */}
      <ellipse
        cx="45"
        cy="45"
        rx="42"
        ry="38"
        fill="url(#meshGrad1)"
        opacity="0.9"
        filter="url(#softBlur)"
        transform="rotate(-15 45 45)"
      />

      {/* Overlapping blob - teal */}
      <ellipse
        cx="75"
        cy="75"
        rx="38"
        ry="42"
        fill="url(#meshGrad2)"
        opacity="0.8"
        filter="url(#softBlur)"
        transform="rotate(20 75 75)"
      />

      {/* Center glow overlay */}
      <circle
        cx="64"
        cy="64"
        r="32"
        fill="url(#centerGlow)"
        opacity="0.6"
      />

      {/* Symbol "J" - crisp white */}
      <path
        d="M 56 44 L 70 44 L 70 76 C 70 82 67 86 60 86 L 54 86 L 54 80 L 60 80 C 63 80 66 78 66 76 L 66 48 L 56 48 Z"
        fill="white"
        opacity="0.95"
      />

      {/* Subtle top highlight */}
      <ellipse
        cx="64"
        cy="50"
        rx="28"
        ry="16"
        fill="white"
        opacity="0.15"
      />
    </svg>
  );
}
