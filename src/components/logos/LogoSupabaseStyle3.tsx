import React from 'react';

interface LogoSupabaseStyle3Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'mono' | 'colorful';
}

const SIZE_MAP = {
  sm: 48,
  md: 96,
  lg: 144,
  xl: 192,
};

/**
 * Logo: Supabase-Inspired Design V3 - "Forward Chevron Stack"
 * 
 * Philosophy: "Multiple moments stacked" = 연속된 숏폼
 * 
 * Design: Two forward-pointing chevrons
 * - Inspired by Supabase's directional design
 * - >> = Fast forward, multiple clips, continuous feed
 * - Sharp, minimal, instantly recognizable
 */
export default function LogoSupabaseStyle3({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoSupabaseStyle3Props) {
  const dimension = SIZE_MAP[size];
  
  const getColors = () => {
    switch (variant) {
      case 'mono':
        return {
          primary: '#000000',
          secondary: '#000000',
        };
      case 'colorful':
        return {
          primary: '#3ECF8E',  // Supabase green
          secondary: '#FF7A00', // JJIKMEOK orange
        };
      default:
        return {
          primary: '#FF7A00',   // JJIKMEOK orange
          secondary: '#FF5E00', // Darker orange
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
      {/* First chevron */}
      <path
        d="M 32 32 L 62 64 L 32 96 L 40 96 L 70 64 L 40 32 Z"
        fill={colors.primary}
      />
      
      {/* Second chevron - offset */}
      <path
        d="M 58 32 L 88 64 L 58 96 L 66 96 L 96 64 L 66 32 Z"
        fill={colors.secondary}
      />
    </svg>
  );
}
