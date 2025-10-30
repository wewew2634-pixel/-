import React from 'react';

interface LogoPulseC2Props {
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
 * Logo Concept C2: "Pulse" - Triangle Wave
 * 
 * Philosophy: Sharp moment, digital precision
 * Form: Sawtooth/triangle wave pattern
 * Style: Digital, electronic, modern
 */
export default function LogoPulseC2({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoPulseC2Props) {
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
      {/* Triangle wave pattern */}
      <path
        d="M 24 64 L 48 32 L 64 96 L 80 32 L 104 64"
        stroke={colors.accent}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
