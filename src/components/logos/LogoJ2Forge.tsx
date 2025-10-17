import React from 'react';

interface LogoJ2ForgeProps {
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
 * Logo J2-Forge: "Forged Orange Metal"
 * 
 * Concept: 단조(鍛造) 오렌지 금속
 * - 뜨겁게 달궈진 쇠 느낌
 * - 망치질 텍스처
 * - 불꽃/열기 효과
 * - 대장간 느낌
 */
export default function LogoJ2Forge({ 
  size = 'md', 
  className = ''
}: LogoJ2ForgeProps) {
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
        {/* Hot forged gradient - glowing */}
        <radialGradient id="forgeGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFEB3B" />
          <stop offset="20%" stopColor="#FFD54F" />
          <stop offset="40%" stopColor="#FFC107" />
          <stop offset="60%" stopColor="#FF9800" />
          <stop offset="80%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#E04E00" />
        </radialGradient>

        {/* Hot metal core */}
        <radialGradient id="hotCore">
          <stop offset="0%" stopColor="#FFF176" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FFB84D" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#FF7A00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C04000" stopOpacity="0.9" />
        </radialGradient>

        {/* Hammer texture pattern */}
        <pattern id="hammered" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#5C1F00" opacity="0.2" />
          <circle cx="9" cy="7" r="1.5" fill="#8B3000" opacity="0.15" />
          <circle cx="6" cy="10" r="1.8" fill="#5C1F00" opacity="0.18" />
        </pattern>

        {/* Ember/spark gradient */}
        <radialGradient id="ember">
          <stop offset="0%" stopColor="#FFE57F" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FF9800" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#E04E00" stopOpacity="0" />
        </radialGradient>

        {/* Cooled edge gradient */}
        <linearGradient id="cooledEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B3000" />
          <stop offset="50%" stopColor="#5C1F00" />
          <stop offset="100%" stopColor="#2E0F00" />
        </linearGradient>

        {/* Glowing J */}
        <linearGradient id="jGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="50%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFF176" />
        </linearGradient>

        <filter id="forgeBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>

        <filter id="heatGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          <feColorMatrix type="matrix" values="1.5 0 0 0 0  0 1.2 0 0 0  0 0 0.5 0 0  0 0 0 1.5 0"/>
        </filter>

        <filter id="sparkGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      {/* Heat haze/glow around metal */}
      <circle
        cx="64"
        cy="64"
        r="58"
        fill="url(#ember)"
        opacity="0.6"
        filter="url(#heatGlow)"
      />

      {/* Outer glow ring */}
      <circle
        cx="64"
        cy="64"
        r="54"
        fill="none"
        stroke="#FFD54F"
        strokeWidth="3"
        opacity="0.4"
        filter="url(#forgeBlur)"
      />

      {/* Main forged body */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="url(#forgeGlow)"
        opacity="0.95"
      />

      {/* Hammered texture */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="url(#hammered)"
      />

      {/* Hot metal center */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#hotCore)"
      />

      {/* Ember spots - random hot points */}
      {[
        [40, 45, 4],
        [75, 50, 3],
        [52, 78, 3.5],
        [82, 72, 2.5],
        [38, 70, 3],
      ].map(([x, y, r], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill="url(#ember)"
          opacity="0.7"
          filter="url(#sparkGlow)"
        />
      ))}

      {/* Cooled dark edge */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="none"
        stroke="url(#cooledEdge)"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* Inner hot ring */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="none"
        stroke="#FFE57F"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Glowing J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jGlow)"
        opacity="0.98"
        filter="url(#heatGlow)"
      />

      {/* J ultra bright edge - like heated metal */}
      <path
        d="M 54 46 L 72 46 L 72 47.5 L 54 47.5 Z"
        fill="#FFFDE7"
        opacity="0.95"
      />

      <path
        d="M 54 46 L 55.5 46 L 55.5 86 L 54 86 Z"
        fill="#FFFDE7"
        opacity="0.9"
      />

      {/* J glow halo */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="none"
        stroke="#FFE57F"
        strokeWidth="3"
        opacity="0.4"
        filter="url(#forgeBlur)"
      />

      {/* Hot sparks flying */}
      <circle cx="78" cy="48" r="2.5" fill="#FFEB3B" opacity="1" filter="url(#sparkGlow)" />
      <circle cx="46" cy="76" r="2" fill="#FFD54F" opacity="0.9" filter="url(#sparkGlow)" />
      <circle cx="86" cy="70" r="1.5" fill="#FFC107" opacity="0.85" />
      <circle cx="42" cy="54" r="2" fill="#FFE57F" opacity="0.8" filter="url(#sparkGlow)" />
      <circle cx="90" cy="84" r="1.8" fill="#FF9800" opacity="0.75" />
      <circle cx="38" cy="88" r="1.2" fill="#FFEB3B" opacity="0.7" />

      {/* Heat ripples */}
      <ellipse
        cx="64"
        cy="58"
        rx="30"
        ry="12"
        fill="#FFE57F"
        opacity="0.2"
        filter="url(#forgeBlur)"
      />

      <ellipse
        cx="64"
        cy="72"
        rx="28"
        ry="10"
        fill="#FF9800"
        opacity="0.15"
        filter="url(#forgeBlur)"
      />

      {/* Cooling marks - darker spots */}
      <path
        d="M 25 60 Q 30 55 35 60"
        stroke="#5C1F00"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />

      <path
        d="M 90 75 Q 95 70 100 75"
        stroke="#5C1F00"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
