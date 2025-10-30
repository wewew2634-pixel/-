import React from 'react';

interface LogoJ2SteelProps {
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
 * Logo J2-Steel: "Orange Steel Art"
 * 
 * Concept: 오렌지 강철 아트
 * - 열처리된 강철 오렌지 색감
 * - 메탈릭 오렌지 그라데이션
 * - 산업적 디테일
 */
export default function LogoJ2Steel({ 
  size = 'md', 
  className = ''
}: LogoJ2SteelProps) {
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
        {/* Heat-treated orange steel */}
        <linearGradient id="orangeSteel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB84D" />
          <stop offset="25%" stopColor="#FF9F40" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="75%" stopColor="#E04E00" />
          <stop offset="100%" stopColor="#B83800" />
        </linearGradient>

        {/* Chrome reflection on orange */}
        <linearGradient id="orangeChrome" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF4E6" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#FFD9B3" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#FF7A00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C04000" stopOpacity="0.7" />
        </linearGradient>

        {/* Brushed orange metal */}
        <pattern id="orangeBrushed" x="0" y="0" width="4" height="100" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="100" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.15" />
          <line x1="2" y1="0" x2="2" y2="100" stroke="#8B3000" strokeWidth="0.3" opacity="0.08" />
        </pattern>

        {/* White J on orange metal */}
        <linearGradient id="jWhiteSteel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF4E6" />
          <stop offset="100%" stopColor="#FFE6CC" />
        </linearGradient>

        <filter id="orangeShadow">
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodOpacity="0.6" floodColor="#5C1F00"/>
        </filter>

        <filter id="orangeBevel">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="2" dy="2" result="offsetBlur" />
          <feFlood floodColor="#FFFFFF" floodOpacity="0.6" />
          <feComposite in2="offsetBlur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base steel plate */}
      <circle
        cx="64"
        cy="64"
        r="52"
        fill="url(#orangeSteel)"
        filter="url(#orangeShadow)"
      />

      {/* Brushed texture */}
      <circle
        cx="64"
        cy="64"
        r="52"
        fill="url(#orangeBrushed)"
      />

      {/* Chrome reflection */}
      <ellipse
        cx="64"
        cy="48"
        rx="40"
        ry="20"
        fill="url(#orangeChrome)"
        opacity="0.5"
      />

      {/* Beveled ring */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="none"
        stroke="url(#orangeChrome)"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Corner rivets - 6 positions */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180 - Math.PI / 2;
        const x = 64 + 48 * Math.cos(angle);
        const y = 64 + 48 * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#8B3000" />
            <circle cx={x} cy={y} r="3" fill="#5C1F00" />
            <circle cx={x} cy={y} r="1.5" fill="#2E0F00" />
          </g>
        );
      })}

      {/* Inner panel */}
      <circle
        cx="64"
        cy="64"
        r="38"
        fill="#B83800"
        opacity="0.8"
      />

      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#orangeSteel)"
        opacity="0.95"
      />

      {/* Decorative rings */}
      <circle
        cx="64"
        cy="64"
        r="40"
        fill="none"
        stroke="#FFF4E6"
        strokeWidth="0.5"
        opacity="0.4"
        strokeDasharray="3 3"
      />

      {/* J letter - embossed white */}
      <g filter="url(#orangeBevel)">
        <path
          d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
          fill="url(#jWhiteSteel)"
          opacity="0.98"
        />
      </g>

      {/* J highlight */}
      <path
        d="M 54 46 L 72 46 L 72 48 L 56 48 L 56 52 L 68 52 L 68 74 C 68 80 65 84 60 84 L 56 84 L 56 82 L 60 82 C 63 82 66 79 66 74 L 66 50 L 54 50 Z"
        fill="#FFFFFF"
        opacity="0.4"
      />

      {/* J shadow */}
      <path
        d="M 56 48 L 70 48 L 70 74 C 70 80 67 84 61 84 L 56 84 L 56 81 L 61 81 C 64 81 68 78 68 74 L 68 54 L 56 54 Z"
        fill="#5C1F00"
        opacity="0.3"
      />

      {/* Edge highlights */}
      <path
        d="M 64 12 A 52 52 0 0 1 112 64"
        stroke="#FFE6CC"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />

      <path
        d="M 64 116 A 52 52 0 0 1 16 64"
        stroke="#5C1F00"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />

      {/* Inner screws */}
      {[
        [64, 28],
        [92, 64],
        [64, 100],
        [36, 64],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.5" fill="#FFD9B3" />
          <circle cx={x} cy={y} r="1.5" fill="#8B3000" />
          <line x1={x - 1} y1={y - 1} x2={x + 1} y2={y + 1} stroke="#2E0F00" strokeWidth="0.6" />
          <line x1={x + 1} y1={y - 1} x2={x - 1} y2={y + 1} stroke="#2E0F00" strokeWidth="0.6" />
        </g>
      ))}

      {/* Heat treatment color bands */}
      <ellipse
        cx="64"
        cy="60"
        rx="32"
        ry="8"
        fill="#FFB84D"
        opacity="0.2"
      />
    </svg>
  );
}
