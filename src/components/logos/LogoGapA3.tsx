import React from 'react';

interface LogoGapA3Props {
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
 * Logo Concept A3: "The Gap" - Circular Segments with Separation
 * 
 * Philosophy: Incomplete circle, the moment before closure
 * Form: Two arc segments separated by a gap
 * Style: Organic, modern, balanced
 */
export default function LogoGapA3({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoGapA3Props) {
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
      {/* Left arc segment (270 degrees) */}
      <path
        d="M 64 24 A 40 40 0 1 1 24 64"
        stroke={colors.primary}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Right arc segment (90 degrees) with gap */}
      <path
        d="M 104 64 A 40 40 0 0 1 64 104"
        stroke={colors.secondary}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
