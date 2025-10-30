import React from 'react';

interface LogoPulseC1Props {
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
 * Logo Concept C1: "Pulse" - Single Peak Heartbeat
 * 
 * Philosophy: The moment of capture, vital energy
 * Form: ECG-like single peak
 * Style: Clean, medical-tech, precise
 */
export default function LogoPulseC1({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoPulseC1Props) {
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
      {/* Baseline - left */}
      <line
        x1="20"
        y1="64"
        x2="44"
        y2="64"
        stroke={colors.primary}
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Rise */}
      <line
        x1="44"
        y1="64"
        x2="54"
        y2="28"
        stroke={colors.accent}
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Peak to valley */}
      <line
        x1="54"
        y1="28"
        x2="64"
        y2="80"
        stroke={colors.accent}
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Recovery */}
      <line
        x1="64"
        y1="80"
        x2="74"
        y2="64"
        stroke={colors.accent}
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Baseline - right */}
      <line
        x1="74"
        y1="64"
        x2="108"
        y2="64"
        stroke={colors.primary}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
