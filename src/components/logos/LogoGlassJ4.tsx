import React from 'react';

interface LogoGlassJ4Props {
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
 * Logo Glass J4: "Gradient Split Glass"
 * 
 * Concept: 반반 나뉜 그라데이션 글라스
 * - 왼쪽 오렌지, 오른쪽 틸
 * - 두 컬러가 만나는 효과
 * - 역동적이고 모던
 */
export default function LogoGlassJ4({ 
  size = 'md', 
  className = ''
}: LogoGlassJ4Props) {
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
        {/* Split gradient - orange to teal */}
        <linearGradient id="splitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#FF8C66" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#66D9D0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.5" />
        </linearGradient>

        {/* Inner split */}
        <linearGradient id="splitInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFA040" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#40D9CC" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.8" />
        </linearGradient>

        {/* J - white */}
        <linearGradient id="jSplit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F0F0" />
        </linearGradient>

        <filter id="splitBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
        </filter>
      </defs>

      {/* Outer glow */}
      <circle
        cx="64"
        cy="64"
        r="54"
        fill="none"
        stroke="url(#splitGrad)"
        strokeWidth="3"
        opacity="0.3"
        filter="url(#splitBlur)"
      />

      {/* Outer glass */}
      <circle
        cx="64"
        cy="64"
        r="48"
        fill="url(#splitGrad)"
        stroke="url(#splitGrad)"
        strokeWidth="1.5"
        opacity="0.5"
        filter="url(#splitBlur)"
      />

      {/* Middle glass */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#splitGrad)"
        opacity="0.6"
      />

      {/* Inner circle */}
      <circle
        cx="64"
        cy="64"
        r="36"
        fill="url(#splitInner)"
      />

      {/* Split line decoration */}
      <line
        x1="40"
        y1="40"
        x2="88"
        y2="88"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jSplit)"
        opacity="0.98"
      />

      {/* Dual highlights */}
      <ellipse
        cx="48"
        cy="48"
        rx="16"
        ry="12"
        fill="#FFB366"
        opacity="0.15"
      />
      <ellipse
        cx="80"
        cy="80"
        rx="16"
        ry="12"
        fill="#66D9D0"
        opacity="0.15"
      />
    </svg>
  );
}
