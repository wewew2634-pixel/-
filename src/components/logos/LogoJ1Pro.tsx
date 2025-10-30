import React from 'react';

interface LogoJ1ProProps {
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
 * Logo J1-Pro: "Premium Bronze Glass"
 * 
 * Upgrade: J1의 프리미엄 버전
 * - 더 많은 레이어 (5-6개)
 * - 정교한 그라데이션
 * - 텍스처 패턴 추가
 * - 고급 하이라이트
 */
export default function LogoJ1Pro({ 
  size = 'md', 
  className = ''
}: LogoJ1ProProps) {
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
        {/* Enhanced bronze gradients */}
        <radialGradient id="bronzePro1" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#B89968" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#9B7E56" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#7D6545" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5C4A33" stopOpacity="0.6" />
        </radialGradient>

        <radialGradient id="bronzePro2" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#C9A876" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#A0826D" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#7D6545" stopOpacity="0.8" />
        </radialGradient>

        {/* Premium J gradient */}
        <linearGradient id="jPro" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5E6D3" />
          <stop offset="30%" stopColor="#E8D4C0" />
          <stop offset="70%" stopColor="#D4BFA8" />
          <stop offset="100%" stopColor="#C9B8A8" />
        </linearGradient>

        {/* Texture pattern */}
        <pattern id="bronzeTexture" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.5" fill="#C9A876" opacity="0.1" />
        </pattern>

        <filter id="proBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
        </filter>

        <filter id="proGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>

        <filter id="softShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" floodColor="#3D2817"/>
        </filter>
      </defs>

      {/* Outermost glow ring */}
      <circle
        cx="64"
        cy="64"
        r="58"
        fill="none"
        stroke="#C9A876"
        strokeWidth="3"
        opacity="0.2"
        filter="url(#proGlow)"
      />

      {/* Layer 5 - Outermost glass */}
      <circle
        cx="64"
        cy="64"
        r="52"
        fill="url(#bronzePro1)"
        stroke="#B89968"
        strokeWidth="1"
        opacity="0.35"
        filter="url(#proBlur)"
      />

      {/* Layer 4 */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="url(#bronzePro1)"
        stroke="#9B7E56"
        strokeWidth="1.5"
        opacity="0.45"
        filter="url(#proBlur)"
      />

      {/* Layer 3 */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#bronzePro1)"
        stroke="#A0826D"
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Layer 2 - with texture */}
      <circle
        cx="64"
        cy="64"
        r="38"
        fill="url(#bronzePro2)"
        opacity="0.7"
      />
      <circle
        cx="64"
        cy="64"
        r="38"
        fill="url(#bronzeTexture)"
        opacity="0.4"
      />

      {/* Layer 1 - Inner solid */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#bronzePro2)"
      />

      {/* Decorative rings */}
      <circle
        cx="64"
        cy="64"
        r="40"
        fill="none"
        stroke="#F5E6D3"
        strokeWidth="0.5"
        opacity="0.3"
        strokeDasharray="2 3"
      />

      <circle
        cx="64"
        cy="64"
        r="36"
        fill="none"
        stroke="#E8D4C0"
        strokeWidth="0.5"
        opacity="0.25"
      />

      {/* J letter with shadow */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jPro)"
        opacity="0.98"
        filter="url(#softShadow)"
      />

      {/* J inner highlight */}
      <path
        d="M 56 48 L 70 48 L 70 50 L 58 50 L 58 52 L 68 52 L 68 74 C 68 78 66 80 62 80 L 58 80 L 58 82 L 62 82 C 67 82 70 79 70 74 L 70 48 Z"
        fill="#FFFFFF"
        opacity="0.2"
      />

      {/* Multiple glass highlights */}
      <ellipse
        cx="48"
        cy="48"
        rx="20"
        ry="16"
        fill="white"
        opacity="0.18"
      />

      <ellipse
        cx="52"
        cy="52"
        rx="12"
        ry="10"
        fill="white"
        opacity="0.12"
      />

      {/* Premium sparkles */}
      <circle cx="74" cy="52" r="2.5" fill="#F5E6D3" opacity="0.7" />
      <circle cx="78" cy="68" r="2" fill="#E8D4C0" opacity="0.6" />
      <circle cx="50" cy="76" r="1.5" fill="#D4BFA8" opacity="0.5" />

      {/* Outer decorative ring */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="none"
        stroke="url(#jPro)"
        strokeWidth="0.5"
        opacity="0.4"
      />
    </svg>
  );
}
