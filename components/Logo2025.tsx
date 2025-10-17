'use client'

import Image from 'next/image'

interface Logo2025Props {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

/**
 * JJIKMEOK 2025 Logo - Variant 4: Stacked GG
 * 
 * Performance Optimized:
 * - Uses appropriate image size per viewport
 * - No loading state (faster perceived load)
 * - Minimal animations (reduced stuttering)
 * - Priority loading for critical path
 */
export default function Logo2025({ 
  className = '', 
  size = 'md',
  animated = false // Disabled by default for performance
}: Logo2025Props) {
  const sizeMap = {
    sm: { width: 48, height: 48, src: '/logos/variant4-stacked/logo-stacked-64.png' },
    md: { width: 64, height: 64, src: '/logos/variant4-stacked/logo-stacked-64.png' },
    lg: { width: 80, height: 80, src: '/logos/variant4-stacked/logo-stacked-96.png' },
    xl: { width: 96, height: 96, src: '/logos/variant4-stacked/logo-stacked-128.png' }
  }

  const { width, height, src } = sizeMap[size]

  return (
    <div 
      className={`relative ${className}`}
      style={{ width, height }}
    >
      <Image
        src={src}
        alt="JJIKMEOK Logo"
        width={width}
        height={height}
        priority
        quality={90}
        style={{
          objectFit: 'contain'
        }}
      />
    </div>
  )
}