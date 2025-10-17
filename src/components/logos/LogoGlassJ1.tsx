import React from 'react';

interface LogoGlassJ1Props {
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
 * Logo Glass J1: "Bronze Glass Circle"
 * 
 * Concept: 청동빛 유리 원형 안의 J
 * - 스크린샷과 동일한 스타일
 * - 여러 레이어의 원형 글라스
 * - 중앙에 베이지/화이트 J
 * - 청동/브라운 그라데이션
 */
export default function LogoGlassJ1({ 
  size = 'md', 
  className = ''
}: LogoGlassJ1Props) {
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
        {/* Bronze gradient for glass layers */}
        <radialGradient id="bronzeGlass">
          <stop offset="0%" stopColor="#8B7355" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#6B5644" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4A3F35" stopOpacity="0.6" />
        </radialGradient>

        {/* Inner bronze gradient */}
        <radialGradient id="bronzeInner">
          <stop offset="0%" stopColor="#A0826D" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6B5644" stopOpacity="0.8" />
        </radialGradient>

        {/* J letter gradient - beige/cream */}
        <linearGradient id="jLetter" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8D4C0" />
          <stop offset="100%" stopColor="#C9B8A8" />
        </linearGradient>

        {/* Blur for glass effect */}
        <filter id="glassBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>

        {/* Subtle glow */}
        <filter id="glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* Outer glow ring */}
      <circle
        cx="64"
        cy="64"
        r="54"
        fill="none"
        stroke="url(#bronzeGlass)"
        strokeWidth="2"
        opacity="0.3"
        filter="url(#glow)"
      />

      {/* Outer glass circle */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="url(#bronzeGlass)"
        stroke="#8B7355"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#glassBlur)"
      />

      {/* Middle glass circle */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#bronzeGlass)"
        stroke="#A0826D"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Inner solid circle */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#bronzeInner)"
      />

      {/* Highlight ring - top */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="none"
        stroke="#E8D4C0"
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="4 4"
      />

      {/* J letter - centered */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jLetter)"
        opacity="0.95"
      />

      {/* J letter shadow/depth */}
      <path
        d="M 56 48 L 70 48 L 70 74 C 70 80 67 84 61 84 L 56 84 L 56 81 L 61 81 C 64 81 65 79 65 76 L 65 54 L 56 54 Z"
        fill="#4A3F35"
        opacity="0.2"
      />

      {/* Top-left highlight for glass effect */}
      <ellipse
        cx="50"
        cy="50"
        rx="18"
        ry="14"
        fill="white"
        opacity="0.15"
      />

      {/* Subtle sparkle */}
      <circle cx="74" cy="54" r="2" fill="white" opacity="0.6" />
    </svg>
  );
}
