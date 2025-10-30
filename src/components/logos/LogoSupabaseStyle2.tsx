import React from 'react';

interface LogoSupabaseStyle2Props {
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
 * Logo: Supabase-Inspired Design V2
 * 
 * Philosophy: "Play Button + Forward Arrow" = 숏폼 재생
 * 
 * Design: Triangle play button with sharp, angular cut
 * - Based on Supabase's arrow/chevron design language
 * - Play = Video/Shortform
 * - Forward = Progress/Movement
 */
export default function LogoSupabaseStyle2({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoSupabaseStyle2Props) {
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
      {/* Sharp angular play button - Supabase style */}
      <path
        d="M 38 28 L 98 64 L 38 100 Z"
        fill={colors.primary}
      />
      
      {/* Cut-out to create depth and modern look */}
      <path
        d="M 52 46 L 74 64 L 52 82 Z"
        fill="white"
      />
    </svg>
  );
}
