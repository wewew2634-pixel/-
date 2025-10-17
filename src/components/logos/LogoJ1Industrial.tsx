import React from 'react';

interface LogoJ1IndustrialProps {
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
 * Logo J1-Industrial: "Industrial Bronze Plate"
 * 
 * Concept: 산업용 청동 플레이트
 * - 헥사곤 볼트 패턴
 * - 용접 흔적
 * - 거친 금속 질감
 * - 공장/제조 느낌
 */
export default function LogoJ1Industrial({ 
  size = 'md', 
  className = ''
}: LogoJ1IndustrialProps) {
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
        {/* Industrial bronze */}
        <radialGradient id="indBronze">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="50%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#5C4A33" />
        </radialGradient>

        {/* Worn metal gradient */}
        <radialGradient id="wornMetal">
          <stop offset="0%" stopColor="#9B7E56" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5C4A33" stopOpacity="0.95" />
        </radialGradient>

        {/* Rust/patina overlay */}
        <pattern id="patina" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1" fill="#8B6914" opacity="0.3" />
          <circle cx="11" cy="7" r="1.5" fill="#7D6545" opacity="0.2" />
          <circle cx="7" cy="13" r="1" fill="#6B5644" opacity="0.25" />
        </pattern>

        {/* Industrial J */}
        <linearGradient id="indJ" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8D4C0" />
          <stop offset="100%" stopColor="#B8A490" />
        </linearGradient>

        {/* Welding glow */}
        <radialGradient id="weldGlow">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B7355" stopOpacity="0" />
        </radialGradient>

        <filter id="roughEdge">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" />
          <feDisplacementMap in="SourceGraphic" scale="2" />
        </filter>

        <filter id="indShadow">
          <feDropShadow dx="3" dy="4" stdDeviation="5" floodOpacity="0.7" floodColor="#000000"/>
        </filter>
      </defs>

      {/* Base industrial plate - hexagon */}
      <path
        d="M 64 10 L 108 34 L 108 82 L 64 106 L 20 82 L 20 34 Z"
        fill="url(#indBronze)"
        stroke="#3D2817"
        strokeWidth="3"
        filter="url(#indShadow)"
      />

      {/* Patina/wear overlay */}
      <path
        d="M 64 10 L 108 34 L 108 82 L 64 106 L 20 82 L 20 34 Z"
        fill="url(#patina)"
      />

      {/* Corner bolts - industrial hex bolts */}
      {[
        [64, 10],
        [108, 34],
        [108, 82],
        [64, 106],
        [20, 82],
        [20, 34],
      ].map(([x, y], i) => (
        <g key={i}>
          {/* Hex bolt head */}
          <path
            d={`M ${x} ${y - 6} L ${x + 5} ${y - 3} L ${x + 5} ${y + 3} L ${x} ${y + 6} L ${x - 5} ${y + 3} L ${x - 5} ${y - 3} Z`}
            fill="#7D6545"
            stroke="#3D2817"
            strokeWidth="1"
          />
          {/* Bolt center hole */}
          <circle cx={x} cy={y} r="2" fill="#1A1410" />
        </g>
      ))}

      {/* Welding marks - corners */}
      <circle cx="64" cy="10" r="8" fill="url(#weldGlow)" />
      <circle cx="108" cy="34" r="8" fill="url(#weldGlow)" />
      <circle cx="108" cy="82" r="8" fill="url(#weldGlow)" />

      {/* Inner plate */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#wornMetal)"
        stroke="#5C4A33"
        strokeWidth="2"
      />

      {/* Rivet pattern around inner circle */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = 64 + 42 * Math.cos(angle);
        const y = 64 + 42 * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3" fill="#6B5644" />
            <circle cx={x} cy={y} r="2" fill="#3D2817" />
            <circle cx={x} cy={y} r="1" fill="#1A1410" />
          </g>
        );
      })}

      {/* Warning stripes - industrial aesthetic */}
      <rect
        x="24"
        y="60"
        width="10"
        height="3"
        fill="#FFD700"
        opacity="0.3"
      />
      <rect
        x="24"
        y="65"
        width="10"
        height="3"
        fill="#1A1410"
        opacity="0.3"
      />

      <rect
        x="94"
        y="60"
        width="10"
        height="3"
        fill="#FFD700"
        opacity="0.3"
      />
      <rect
        x="94"
        y="65"
        width="10"
        height="3"
        fill="#1A1410"
        opacity="0.3"
      />

      {/* Central J - stamped/pressed effect */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#indJ)"
        stroke="#5C4A33"
        strokeWidth="2"
        opacity="0.95"
      />

      {/* J pressed shadow */}
      <path
        d="M 56 48 L 70 48 L 70 74 C 70 80 67 84 61 84 L 56 84 L 56 82 L 61 82 C 65 82 68 79 68 74 L 68 54 L 56 54 Z"
        fill="#1A1410"
        opacity="0.4"
      />

      {/* Serial number plate (bottom) */}
      <rect
        x="48"
        y="94"
        width="32"
        height="6"
        fill="#3D2817"
        stroke="#1A1410"
        strokeWidth="0.5"
      />
      <text
        x="64"
        y="98"
        fontFamily="monospace"
        fontSize="3"
        fill="#C9B8A8"
        textAnchor="middle"
        opacity="0.6"
      >
        JJ-2024
      </text>

      {/* Scratch marks - wear and tear */}
      <line x1="30" y1="40" x2="45" y2="35" stroke="#E8D4C0" strokeWidth="0.5" opacity="0.3" />
      <line x1="85" y1="75" x2="95" y2="85" stroke="#E8D4C0" strokeWidth="0.5" opacity="0.3" />
      <line x1="40" y1="80" x2="50" y2="90" stroke="#3D2817" strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}
