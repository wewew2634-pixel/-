'use client'

import { useEffect, useState } from 'react'
import styles from './Logo2025.module.css'

interface Logo2025Props {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
}

export default function Logo2025({ 
  className = '', 
  size = 'md',
  animated = true 
}: Logo2025Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  }

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  if (!isClient) {
    // 서버 사이드 렌더링시 간단한 버전
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <span className="text-white font-black">찍</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`${sizeClasses[size]} ${className} ${styles.logoContainer}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphism 배경 */}
      <div className={styles.glassmorphism}>
        {/* 3D 효과를 위한 레이어 */}
        <div className={`${styles.layer3d} ${isHovered ? styles.hovered : ''}`}>
          {/* 메인 로고 - 찍먹 아이콘 */}
          <div className={styles.mainLogo}>
            {/* 젓가락 아이콘 (3D 효과) */}
            <svg 
              viewBox="0 0 100 100" 
              className={`${styles.chopsticks} ${animated ? styles.animated : ''}`}
              width="100%"
              height="100%"
            >
              {/* 그라디언트 정의 */}
              <defs>
                <linearGradient id="chopstickGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="50%" stopColor="#FFE66D" />
                  <stop offset="100%" stopColor="#4ECDC4" />
                </linearGradient>
                <linearGradient id="chopstickGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A8E6CF" />
                  <stop offset="50%" stopColor="#FFD3B6" />
                  <stop offset="100%" stopColor="#FFAAA5" />
                </linearGradient>
                {/* 광택 효과 */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* 3D 그림자 */}
                <filter id="shadow3d">
                  <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
                </filter>
              </defs>
              
              {/* 젓가락 1 */}
              <rect 
                x="30" 
                y="20" 
                width="5" 
                height="60" 
                rx="2.5"
                fill="url(#chopstickGrad1)"
                filter="url(#shadow3d)"
                className={styles.chopstick1}
              />
              
              {/* 젓가락 2 */}
              <rect 
                x="45" 
                y="20" 
                width="5" 
                height="60" 
                rx="2.5"
                fill="url(#chopstickGrad2)"
                filter="url(#shadow3d)"
                className={styles.chopstick2}
              />
              
              {/* 소스 그릇 (3D 효과) */}
              <ellipse 
                cx="50" 
                cy="75" 
                rx="25" 
                ry="12"
                fill="url(#chopstickGrad1)"
                opacity="0.8"
                filter="url(#glow)"
                className={styles.sauceBowl}
              />
              
              {/* 소스 방울 (애니메이션) */}
              {animated && (
                <circle 
                  cx="40" 
                  cy="65" 
                  r="3"
                  fill="#FF6B6B"
                  className={styles.sauceDrop}
                  filter="url(#glow)"
                />
              )}
            </svg>
            
            {/* 텍스트 로고 (글래스모피즘) */}
            <div className={styles.textLogo}>
              <span className={styles.brandText}>
                <span className={styles.jjik}>찍</span>
                <span className={styles.meok}>먹</span>
              </span>
              <span className={`${styles.tagline} ${textSizes[size]}`}>
                JJIKMEOK
              </span>
            </div>
          </div>
          
          {/* 홀로그래픽 효과 오버레이 */}
          <div className={styles.holographic} />
          
          {/* 파티클 효과 (2025 트렌드) */}
          {animated && (
            <div className={styles.particles}>
              <span className={styles.particle1}></span>
              <span className={styles.particle2}></span>
              <span className={styles.particle3}></span>
              <span className={styles.particle4}></span>
            </div>
          )}
        </div>
      </div>
      
      {/* 네온 글로우 효과 */}
      <div className={styles.neonGlow} />
    </div>
  )
}