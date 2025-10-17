import React from 'react';

interface Logo1stNeonProps {
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
 * Logo Style 2: "Tech Neon"
 * 
 * Concept: JJIKMEOK 1ST - 네온 발광
 * Font: Space Grotesk
 * Style: Glowing neon, cyberpunk
 * Best for: 다크모드, 테크 브랜딩
 */
export default function Logo1stNeon({ 
  size = 'md', 
  className = ''
}: Logo1stNeonProps) {
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
        <filter id="neonGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feFlood floodColor="#FF7A00" floodOpacity="1" />
          <feComposite in2="blur" operator="in" result="color" />
          <feMerge>
            <feMergeNode in="color" />
            <feMergeNode in="color" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="neonGlow2">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feFlood floodColor="#00F0FF" floodOpacity="1" />
          <feComposite in2="blur" operator="in" result="color" />
          <feMerge>
            <feMergeNode in="color" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dark background */}
      <rect width="128" height="128" fill="#0A0A0A" />

      {/* JJIKMEOK - orange neon */}
      <text
        x="64"
        y="54"
        fontFamily="monospace"
        fontSize="16"
        fontWeight="700"
        fill="#FF7A00"
        textAnchor="middle"
        letterSpacing="1"
        filter="url(#neonGlow)"
      >
        JJIKMEOK
      </text>

      {/* 1ST - cyan neon */}
      <text
        x="64"
        y="80"
        fontFamily="monospace"
        fontSize="28"
        fontWeight="900"
        fill="#00F0FF"
        textAnchor="middle"
        letterSpacing="3"
        filter="url(#neonGlow2)"
      >
        1ST
      </text>

      {/* Neon underline */}
      <line
        x1="28"
        y1="86"
        x2="100"
        y2="86"
        stroke="#00F0FF"
        strokeWidth="2"
        filter="url(#neonGlow2)"
      />

      {/* Tech dots */}
      <circle cx="24" cy="64" r="2" fill="#FF7A00" filter="url(#neonGlow)" />
      <circle cx="104" cy="64" r="2" fill="#00F0FF" filter="url(#neonGlow2)" />
    </svg>
  );
}
