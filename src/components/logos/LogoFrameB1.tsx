import React from 'react';

interface LogoFrameB1Props {
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
 * Logo Concept B1: "Raw Frame" - Open Corner Frame
 * 
 * Philosophy: Imperfection, raw street aesthetic
 * Form: Square frame with one corner open/broken
 * Style: Bold, brutalist, street
 */
export default function LogoFrameB1({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoFrameB1Props) {
  const dimension = SIZE_MAP[size];
  
  const getColors = () => {
    switch (variant) {
      case 'mono':
        return {
          primary: '#000000',
          accent: '#000000',
        };
      case 'accent':
        return {
          primary: '#FF7A00',
          accent: '#FF7A00',
        };
      default:
        return {
          primary: '#000000',
          accent: '#FF7A00',
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
      {/* Top line */}
      <line
        x1="28"
        y1="28"
        x2="100"
        y2="28"
        stroke={colors.primary}
        strokeWidth="8"
        strokeLinecap="square"
      />
      
      {/* Right line */}
      <line
        x1="100"
        y1="28"
        x2="100"
        y2="100"
        stroke={colors.primary}
        strokeWidth="8"
        strokeLinecap="square"
      />
      
      {/* Bottom line (shorter, broken) */}
      <line
        x1="100"
        y1="100"
        x2="48"
        y2="100"
        stroke={colors.primary}
        strokeWidth="8"
        strokeLinecap="square"
      />
      
      {/* Left line (shorter, broken) - with accent color */}
      <line
        x1="28"
        y1="28"
        x2="28"
        y2="80"
        stroke={colors.accent}
        strokeWidth="8"
        strokeLinecap="square"
      />
    </svg>
  );
}
