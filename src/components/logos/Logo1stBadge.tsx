import React from 'react';

interface Logo1stBadgeProps {
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
 * Logo Style 6: "Stamp/Badge"
 * 
 * Concept: JJIKMEOK 1ST - 스탬프/배지
 * Font: DM Sans Bold
 * Style: 빈티지 스탬프, 원형 배지
 * Best for: 브랜딩, 상품, 패키지
 */
export default function Logo1stBadge({ 
  size = 'md', 
  className = ''
}: Logo1stBadgeProps) {
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
        <linearGradient id="badgeGrad">
          <stop offset="0%" stopColor="#FF9F40" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="128" height="128" fill="#F5F5F5" />

      {/* Outer circle - double stroke */}
      <circle
        cx="64"
        cy="64"
        r="56"
        fill="none"
        stroke="#FF7A00"
        strokeWidth="6"
      />

      <circle
        cx="64"
        cy="64"
        r="50"
        fill="none"
        stroke="#FF7A00"
        strokeWidth="2"
      />

      {/* Inner fill */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="url(#badgeGrad)"
      />

      {/* Est. text - top curve */}
      <path id="topCurve" d="M 24 64 A 40 40 0 0 1 104 64" fill="none" />
      <text fontFamily="serif" fontSize="10" fill="#FFFFFF" fontWeight="600">
        <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
          ESTABLISHED 2024
        </textPath>
      </text>

      {/* JJIKMEOK - center top */}
      <text
        x="64"
        y="58"
        fontFamily="system-ui, sans-serif"
        fontSize="16"
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        JJIKMEOK
      </text>

      {/* 1ST - center, large */}
      <text
        x="64"
        y="78"
        fontFamily="system-ui, sans-serif"
        fontSize="24"
        fontWeight="900"
        fill="#FFFFFF"
        textAnchor="middle"
        letterSpacing="3"
      >
        1ST
      </text>

      {/* Bottom curve text */}
      <path id="bottomCurve" d="M 104 64 A 40 40 0 0 1 24 64" fill="none" />
      <text fontFamily="serif" fontSize="9" fill="#FFFFFF" fontWeight="500">
        <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
          PREMIUM QUALITY
        </textPath>
      </text>

      {/* Star decorations */}
      <text x="28" y="68" fontSize="12" fill="#FFFFFF">★</text>
      <text x="96" y="68" fontSize="12" fill="#FFFFFF">★</text>

      {/* Outer stamp pattern */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x = 64 + 58 * Math.cos(angle);
        const y = 64 + 58 * Math.sin(angle);
        return (
          <rect
            key={i}
            x={x - 1}
            y={y - 3}
            width="2"
            height="6"
            fill="#FF7A00"
            transform={`rotate(${i * 15} ${x} ${y})`}
          />
        );
      })}
    </svg>
  );
}
