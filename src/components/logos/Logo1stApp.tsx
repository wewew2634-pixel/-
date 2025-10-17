import React from 'react';

interface Logo1stAppProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: 48,
  md: 96,
  lg: 144,
  xl: 192,
};

/**
 * Logo Style 10: "App Icon Optimized"
 * 
 * Concept: JJIKMEOK 1ST - 앱 아이콘 최적화
 * Font: SF Pro/System
 * Style: iOS/Android 앱스토어 최적화
 * Best for: 실제 앱 아이콘, 프로필
 * 
 * Features:
 * - 1024x1024 안전 영역 준수
 * - 단순하고 명확한 형태
 * - 작은 사이즈에서도 인식 가능
 * - 라운드 코너 적용
 */
export default function Logo1stApp({ 
  size = 'md', 
  className = ''
}: Logo1stAppProps) {
  const dimension = SIZE_MAP[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="appGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9F40" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>

        <filter id="appShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.3" floodColor="#000000"/>
        </filter>
      </defs>

      {/* iOS-style rounded square background */}
      <rect
        x="4"
        y="4"
        width="120"
        height="120"
        rx="26"
        fill="url(#appGrad)"
        filter="url(#appShadow)"
      />

      {/* Inner subtle glow */}
      <rect
        x="8"
        y="8"
        width="112"
        height="112"
        rx="24"
        fill="url(#appGrad)"
        opacity="0.3"
      />

      {/* Top light reflection */}
      <rect
        x="12"
        y="12"
        width="104"
        height="40"
        rx="22"
        fill="#FFFFFF"
        opacity="0.15"
      />

      {/* JJIKMEOK - clear, readable */}
      <text
        x="64"
        y="54"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="17"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="-0.3"
      >
        JJIKMEOK
      </text>

      {/* 1ST - large, bold */}
      <text
        x="64"
        y="80"
        fontFamily="-apple-system, system-ui, sans-serif"
        fontSize="30"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        1ST
      </text>

      {/* Subtle divider */}
      <line
        x1="36"
        y1="62"
        x2="92"
        y2="62"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        opacity="0.4"
        strokeLinecap="round"
      />

      {/* Small decorative dots */}
      <circle cx="32" cy="62" r="2" fill="#FFFFFF" opacity="0.5" />
      <circle cx="96" cy="62" r="2" fill="#FFFFFF" opacity="0.5" />

      {/* Bottom subtle shadow inside */}
      <rect
        x="12"
        y="92"
        width="104"
        height="20"
        rx="10"
        fill="#000000"
        opacity="0.1"
      />
    </svg>
  );
}
