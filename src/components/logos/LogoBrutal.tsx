import React from 'react';

interface LogoBrutalProps {
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
 * Logo: Neubrutalism Style
 * 
 * Philosophy: "날것의 에너지" - Raw, unpolished energy
 * 
 * Design: Bold, thick borders, high contrast
 * - Thick black outlines (4-6px)
 * - Bright solid colors (no gradients)
 * - Offset shadows for depth
 * - Intentionally "rough" aesthetic
 * - Strong, memorable, rebellious
 * 
 * Tailwind Plus Features:
 * - High contrast colors
 * - Thick borders
 * - Offset shadows
 * - Bold typography aesthetic
 */
export default function LogoBrutal({ 
  size = 'md', 
  className = ''
}: LogoBrutalProps) {
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
      {/* Shadow layer - offset down and right */}
      <rect
        x="30"
        y="30"
        width="68"
        height="68"
        fill="#000000"
        rx="8"
      />

      {/* Main shape - bright orange */}
      <rect
        x="26"
        y="26"
        width="68"
        height="68"
        fill="#FF7A00"
        stroke="#000000"
        strokeWidth="5"
        rx="8"
      />

      {/* Inner "J" symbol - white with black outline */}
      <g>
        {/* J stroke (outline) */}
        <path
          d="M 52 42 L 68 42 L 68 70 C 68 78 64 82 56 82 L 50 82 L 50 76 L 56 76 C 60 76 62 74 62 70 L 62 48 L 52 48 Z"
          stroke="#000000"
          strokeWidth="5"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        
        {/* J fill */}
        <path
          d="M 52 42 L 68 42 L 68 70 C 68 78 64 82 56 82 L 50 82 L 50 76 L 56 76 C 60 76 62 74 62 70 L 62 48 L 52 48 Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Accent dots - brutal style */}
      <circle cx="78" cy="42" r="4" fill="#000000" />
      <circle cx="42" cy="78" r="4" fill="#000000" />
    </svg>
  );
}
