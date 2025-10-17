import React from 'react';

interface LogoFrameB3Props {
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
 * Logo Concept B3: "Raw Frame" - Double Frame Offset
 * 
 * Philosophy: Layered reality, depth, dimension
 * Form: Two square frames slightly offset
 * Style: Modern, geometric, dynamic
 */
export default function LogoFrameB3({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoFrameB3Props) {
  const dimension = SIZE_MAP[size];
  
  const getColors = () => {
    switch (variant) {
      case 'mono':
        return {
          primary: '#000000',
          accent: '#666666',
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
      {/* Back frame - offset */}
      <rect
        x="34"
        y="34"
        width="60"
        height="60"
        stroke={colors.accent}
        strokeWidth="6"
        fill="none"
        rx="2"
      />
      
      {/* Front frame - main */}
      <rect
        x="28"
        y="28"
        width="60"
        height="60"
        stroke={colors.primary}
        strokeWidth="8"
        fill="none"
        rx="2"
      />
    </svg>
  );
}
