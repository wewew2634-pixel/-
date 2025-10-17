import React from 'react';

interface LogoGapA2Props {
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
 * Logo Concept A2: "The Gap" - Diagonal Slash Intersection
 * 
 * Philosophy: The crossing of moments, dynamic energy
 * Form: Two diagonal lines that almost cross but have a gap
 * Style: Bold, energetic, street
 */
export default function LogoGapA2({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoGapA2Props) {
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
      {/* Top-left to center-right diagonal */}
      <line
        x1="32"
        y1="32"
        x2="74"
        y2="74"
        stroke={colors.primary}
        strokeWidth="10"
        strokeLinecap="round"
      />
      
      {/* Center-left to bottom-right diagonal (with gap) */}
      <line
        x1="54"
        y1="54"
        x2="96"
        y2="96"
        stroke={colors.secondary}
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}
