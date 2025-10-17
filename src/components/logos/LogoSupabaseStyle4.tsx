import React from 'react';

interface LogoSupabaseStyle4Props {
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
 * Logo: Supabase-Inspired Design V4 - "Abstract J"
 * 
 * Philosophy: "JJIKMEOK의 'J'" in Supabase geometric style
 * 
 * Design: Highly abstracted "J" shape with angular, arrow-like form
 * - J = JJIKMEOK initial
 * - Angular, forward-leaning for momentum
 * - Minimal, geometric, tech-forward
 */
export default function LogoSupabaseStyle4({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoSupabaseStyle4Props) {
  const dimension = SIZE_MAP[size];
  
  const getColors = () => {
    switch (variant) {
      case 'mono':
        return {
          primary: '#000000',
        };
      case 'colorful':
        return {
          primary: '#3ECF8E', // Supabase green
        };
      default:
        return {
          primary: '#FF7A00',  // JJIKMEOK orange
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
      {/* Abstract angular "J" shape */}
      <path
        d="M 70 24 L 78 24 L 78 84 L 84 90 L 84 98 L 72 98 L 56 82 L 56 74 L 70 88 L 70 24 Z"
        fill={colors.primary}
      />
      
      {/* Top accent - creates arrow-like pointing */}
      <path
        d="M 62 24 L 70 24 L 70 32 L 62 32 Z"
        fill={colors.primary}
        opacity="0.6"
      />
    </svg>
  );
}
