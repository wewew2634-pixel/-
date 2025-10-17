import React from 'react';

interface LogoFrameB2Props {
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
 * Logo Concept B2: "Raw Frame" - Brush Stroke Frame
 * 
 * Philosophy: Hand-made, authentic, organic
 * Form: Rough square frame with brush-like strokes
 * Style: Expressive, artistic, raw
 */
export default function LogoFrameB2({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoFrameB2Props) {
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
      {/* Top stroke - rough edge */}
      <path
        d="M 26 30 L 34 28 L 94 28 L 102 30"
        stroke={colors.primary}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Right stroke */}
      <path
        d="M 100 32 L 102 40 L 102 88 L 100 96"
        stroke={colors.primary}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Bottom stroke - with accent */}
      <path
        d="M 98 100 L 90 102 L 38 102 L 30 100"
        stroke={colors.accent}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Left stroke */}
      <path
        d="M 28 98 L 26 90 L 26 40 L 28 32"
        stroke={colors.primary}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
