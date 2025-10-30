import React from 'react';

interface LogoSupabaseStyleProps {
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
 * Logo: Supabase-Inspired Design
 * 
 * Philosophy: "순간 포착" - Sharp, forward-moving, minimal
 * 
 * Design Elements:
 * - Geometric abstraction inspired by Supabase's arrow/lightning bolt
 * - "Capture moment" = Lightning bolt + Camera shutter fusion
 * - Sharp angles, clean lines, no gradients
 * - Single solid color (or 2-color variant)
 * 
 * Supabase Principles Applied:
 * 1. Minimal complexity - essential shapes only
 * 2. Sharp edges - precision and efficiency
 * 3. Forward momentum - directional energy
 * 4. Tech-modern aesthetic
 * 5. Works perfectly as app icon at any size
 */
export default function LogoSupabaseStyle({ 
  size = 'md', 
  className = '',
  variant = 'default'
}: LogoSupabaseStyleProps) {
  const dimension = SIZE_MAP[size];
  
  const getColors = () => {
    switch (variant) {
      case 'mono':
        return {
          primary: '#000000',
          accent: '#000000',
        };
      case 'colorful':
        return {
          primary: '#3ECF8E', // Supabase green
          accent: '#FF7A00',   // JJIKMEOK orange
        };
      default:
        return {
          primary: '#FF7A00',  // JJIKMEOK orange as primary
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
      {/* 
        Abstract "Lightning Shutter" Symbol
        - Top triangle: Lightning/Speed (순간)
        - Bottom inverted triangle: Shutter/Capture (포착)
        - Creates arrow-like forward momentum
      */}
      
      {/* Top lightning bolt triangle */}
      <path
        d="M 64 20 L 90 64 L 64 58 Z"
        fill={colors.primary}
      />
      
      {/* Bottom shutter triangle (inverted, offset) */}
      <path
        d="M 64 108 L 38 64 L 64 70 Z"
        fill={colors.accent}
      />
      
      {/* Central connecting line - creates "Z" or lightning effect */}
      <rect
        x="60"
        y="58"
        width="8"
        height="12"
        fill={variant === 'colorful' ? colors.accent : colors.primary}
      />
    </svg>
  );
}
