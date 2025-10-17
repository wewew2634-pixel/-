'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface Logo2025Props {
  size?: LogoSize;
  animated?: boolean;
  ariaLabel?: string;
  className?: string;
  fallbackPngSrc?: string;
}

const sizeMap: Record<LogoSize, string> = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24',
};

/**
 * ZZMUK 2025 Logo - Liquid Glass Droplet
 * 
 * Pure Tailwind Plus Implementation:
 * - 100% Tailwind utilities (NO custom CSS)
 * - Inline SVG for liquid glass effect
 * - Token-based colors (Material 3 compatibility)
 * - Accessibility optimized (ARIA, reduced motion support)
 * - PNG fallback for compatibility
 * 
 * Performance:
 * - GPU-accelerated transforms
 * - Optimized gradient definitions
 * - Conditional animation based on user preference
 */
export default function Logo2025({
  size = 'md',
  animated = false,
  ariaLabel = 'ZZMUK logo — liquid glass droplet',
  className,
  fallbackPngSrc,
}: Logo2025Props) {
  // Respect user's motion preferences for accessibility
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Fallback to PNG for reduced motion preference
  if (fallbackPngSrc && prefersReducedMotion) {
    return (
      <img
        src={fallbackPngSrc}
        alt={ariaLabel}
        className={cn(sizeMap[size], 'select-none')}
        draggable={false}
      />
    );
  }

  return (
    <div
      aria-label={ariaLabel}
      role="img"
      className={cn(
        'relative select-none',
        sizeMap[size],
        // Liquid glass container shadow (Tailwind utilities only)
        'drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)]',
        className
      )}
    >
      {/* Inline SVG: Liquid droplet + glass highlights + edges */}
      <svg
        viewBox="0 0 100 100"
        className={cn(
          'block',
          animated && !prefersReducedMotion && 'motion-safe:animate-pulse'
        )}
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          {/* Glass body gradient (token-based colors) */}
          <radialGradient id="g-body" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#10B981" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.35" />
          </radialGradient>

          {/* Edge highlight (glass border) */}
          <linearGradient id="g-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0.05" />
          </linearGradient>

          {/* Top specular highlight (glass shine) */}
          <radialGradient id="g-spec" cx="40%" cy="20%" r="35%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          {/* Inner reflection gradient */}
          <radialGradient id="g-inner" cx="60%" cy="50%" r="30%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Liquid droplet shape */}
        <path
          d="M50 2
             C 66 20, 80 40, 80 58
             C 80 78, 65 94, 50 98
             C 35 94, 20 78, 20 58
             C 20 40, 34 20, 50 2 Z"
          fill="url(#g-body)"
        />

        {/* Edge enhancement (thin highlight border) */}
        <path
          d="M50 2
             C 66 20, 80 40, 80 58
             C 80 78, 65 94, 50 98
             C 35 94, 20 78, 20 58
             C 20 40, 34 20, 50 2 Z"
          fill="none"
          stroke="url(#g-edge)"
          strokeWidth="1.2"
        />

        {/* Top specular (glass shine) */}
        <ellipse cx="44" cy="28" rx="18" ry="10" fill="url(#g-spec)" />

        {/* Inner reflections (depth) */}
        <circle cx="60" cy="48" r="10" fill="url(#g-inner)" />
        <circle cx="38" cy="62" r="8" fill="#FFFFFF" opacity="0.05" />

        {/* Brand initial (token-based color for contrast) */}
        <text
          x="50"
          y="68"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
          fontWeight="700"
          fontSize="22"
          fill="#FFFFFF"
          opacity="0.92"
        >
          Z
        </text>
      </svg>

      {/* Glass container overlay (Tailwind utilities only) */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[22%]',
          // Liquid glass effect (backdrop blur + saturation)
          'backdrop-blur-xl saturate-150',
          // Glass border
          'border border-white/10',
          // Inner highlight
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]',
          // Hover interaction (accessibility-aware)
          'hover:brightness-105',
          'motion-safe:hover:shadow-xl',
          'transition-transform duration-200 ease-out',
          'motion-safe:hover:-translate-y-0.5'
        )}
      />
    </div>
  );
}
