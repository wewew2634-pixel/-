import React from 'react';

interface LogoGapA1Props {
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
 * Logo Concept A1: "The Gap" - Vertical Parallel Lines with Offset
 * 
 * Philosophy: The gap between moments, the instant of capture
 * Form: Two parallel lines slightly rotated/offset
 * Style: Minimal, geometric, modern
 */
export default function LogoGapA1({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoGapA1Props) {
  const dimension = SIZE_MAP[size];
  
  const getColors = () => {
    switch (variant) {
      case 'mono':
        return {
          primary: '#000000',
          secondary: '#000000',
        };
      case 'accent':
        return {
          primary: '#FF7A00',
          secondary: '#FF7A00',
        };
      default:
        return {
          primary: '#000000',
          secondary: '#FF7A00',
        };
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
      {/* Left line - straight */}
      <line
        x1="42"
        y1="32"
        x2="42"
        y2="96"
        stroke={colors.primary}
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Right line - slightly rotated */}
      <line
        x1="86"
        y1="28"
        x2="86"
        y2="100"
        stroke={colors.secondary}
        strokeWidth="8"
        strokeLinecap="round"
        transform="rotate(3 86 64)"
      />
    </svg>
  );
}
