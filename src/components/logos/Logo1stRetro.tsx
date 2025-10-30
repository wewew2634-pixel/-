import React from 'react';

interface Logo1stRetroProps {
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
 * Logo Style 9: "Retro Future"
 * 
 * Concept: JJIKMEOK 1ST - 레트로 퓨처
 * Font: Space Mono/Courier
 * Style: 80s 레트로, 미래적
 * Best for: 유니크 브랜딩, 빈티지 감성
 */
export default function Logo1stRetro({ 
  size = 'md', 
  className = ''
}: Logo1stRetroProps) {
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
        <linearGradient id="retroSun" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF5E00" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#FFB84D" />
        </linearGradient>

        <linearGradient id="retroText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF00FF" />
          <stop offset="50%" stopColor="#00FFFF" />
          <stop offset="100%" stopColor="#FFFF00" />
        </linearGradient>
      </defs>

      {/* Background - purple gradient */}
      <rect width="128" height="128" fill="#1A0033" />
      <rect width="128" height="128" fill="url(#retroSun)" opacity="0.2" />

      {/* Retro sun */}
      <circle cx="64" cy="28" r="18" fill="url(#retroSun)" />

      {/* Sun rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 64 + 20 * Math.cos(angle);
        const y1 = 28 + 20 * Math.sin(angle);
        const x2 = 64 + 28 * Math.cos(angle);
        const y2 = 28 + 28 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FF7A00"
            strokeWidth="2"
            opacity="0.6"
          />
        );
      })}

      {/* Grid lines - perspective */}
      {[55, 65, 75, 85, 95, 105].map((y, i) => (
        <line
          key={`h${i}`}
          x1="10"
          y1={y}
          x2="118"
          y2={y}
          stroke="#FF00FF"
          strokeWidth="1"
          opacity={0.3 - i * 0.04}
        />
      ))}

      {[30, 45, 60, 75, 90, 105].map((x, i) => (
        <line
          key={`v${i}`}
          x1={x}
          y1="55"
          x2={64 + (x - 64) * 1.5}
          y2="110"
          stroke="#00FFFF"
          strokeWidth="1"
          opacity={0.25}
        />
      ))}

      {/* JJIKMEOK - retro font style */}
      <text
        x="64"
        y="60"
        fontFamily="monospace"
        fontSize="16"
        fontWeight="700"
        fill="url(#retroText)"
        stroke="#000000"
        strokeWidth="2"
        textAnchor="middle"
        letterSpacing="1"
      >
        JJIKMEOK
      </text>
      <text
        x="64"
        y="60"
        fontFamily="monospace"
        fontSize="16"
        fontWeight="700"
        fill="url(#retroText)"
        textAnchor="middle"
        letterSpacing="1"
      >
        JJIKMEOK
      </text>

      {/* 1ST - large retro */}
      <text
        x="64"
        y="88"
        fontFamily="monospace"
        fontSize="28"
        fontWeight="900"
        fill="#FFFF00"
        stroke="#FF00FF"
        strokeWidth="2"
        textAnchor="middle"
        letterSpacing="4"
      >
        1ST
      </text>
      <text
        x="64"
        y="88"
        fontFamily="monospace"
        fontSize="28"
        fontWeight="900"
        fill="#FFFF00"
        textAnchor="middle"
        letterSpacing="4"
      >
        1ST
      </text>

      {/* Retro stars */}
      <text x="20" y="30" fontSize="10" fill="#FFFF00">★</text>
      <text x="105" y="35" fontSize="8" fill="#FF00FF">★</text>
      <text x="15" y="90" fontSize="9" fill="#00FFFF">★</text>
    </svg>
  );
}
