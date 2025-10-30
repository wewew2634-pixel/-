import React from 'react';

interface LogoPulseC3Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'mono' | 'accent';
}

const SIZE_MAP = {
  sm: 48,
  md: 96,
  lg: 144,
  xl: 192,
};

/**
 * Logo Concept C3: "Pulse" - Progressive Fade Lines
 * 
 * Philosophy: Echo of a moment, fading energy
 * Form: Three vertical lines with decreasing opacity/height
 * Style: Minimal, rhythmic, elegant
 */
export default function LogoPulseC3({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoPulseC3Props) {
  const dimension = SIZE_MAP[size];
  
  const getColors = () => {
    switch (variant) {
      case 'mono':
        return { base: '#000000' };
      case 'accent':
        return { base: '#FF7A00' };
      default:
        return { base: '#000000' };
    }
  };

  const colors = getColors();

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* First line - tallest, full opacity */}
      <line
        x1="44"
        y1="32"
        x2="44"
        y2="96"
        stroke={colors.base}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="1"
      />
      
      {/* Second line - medium */}
      <line
        x1="64"
        y1="44"
        x2="64"
        y2="84"
        stroke={colors.base}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* Third line - shortest */}
      <line
        x1="84"
        y1="52"
        x2="84"
        y2="76"
        stroke={colors.base}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
