import React from 'react';

interface LogoJ2ChromeProps {
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
 * Logo J2-Chrome: "Orange Chrome Finish"
 * 
 * Concept: 오렌지 크롬 마감
 * - 거울같은 크롬 표면
 * - 오렌지 컬러 입혀진 크롬
 * - 극강의 반사광
 * - 자동차 페인트 느낌
 */
export default function LogoJ2Chrome({ 
  size = 'md', 
  className = ''
}: LogoJ2ChromeProps) {
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
        {/* Chrome orange gradient */}
        <linearGradient id="chromeOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4E6" />
          <stop offset="20%" stopColor="#FFD9B3" />
          <stop offset="40%" stopColor="#FFB84D" />
          <stop offset="60%" stopColor="#FF7A00" />
          <stop offset="80%" stopColor="#E04E00" />
          <stop offset="100%" stopColor="#B83800" />
        </linearGradient>

        {/* Mirror reflection */}
        <linearGradient id="chromeMirror" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#FFF4E6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="75%" stopColor="#C04000" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5C1F00" stopOpacity="0.85" />
        </linearGradient>

        {/* Specular highlight */}
        <radialGradient id="orangeSpecular" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="30%" stopColor="#FFF4E6" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#FFD9B3" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
        </radialGradient>

        {/* Sharp reflection bands */}
        <linearGradient id="sharpOrange" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* J chrome gradient */}
        <linearGradient id="jChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF4E6" />
          <stop offset="100%" stopColor="#FFE6CC" />
        </linearGradient>

        <filter id="chromeBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
        </filter>

        <filter id="chromeShadow">
          <feDropShadow dx="0" dy="5" stdDeviation="8" floodOpacity="0.5" floodColor="#2E0F00"/>
        </filter>

        <filter id="chromeGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          <feColorMatrix type="matrix" values="1.5 0 0 0 0  0 1.5 0 0 0  0 0 1.5 0 0  0 0 0 2 0"/>
        </filter>
      </defs>

      {/* Shadow */}
      <circle
        cx="64"
        cy="68"
        r="52"
        fill="#000000"
        opacity="0.25"
        filter="url(#chromeBlur)"
      />

      {/* Main chrome body */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="url(#chromeOrange)"
        filter="url(#chromeShadow)"
      />

      {/* Mirror overlay */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="url(#chromeMirror)"
        opacity="0.7"
      />

      {/* Primary specular highlight */}
      <ellipse
        cx="48"
        cy="48"
        rx="28"
        ry="22"
        fill="url(#orangeSpecular)"
      />

      {/* Sharp reflection band 1 */}
      <ellipse
        cx="64"
        cy="42"
        rx="38"
        ry="10"
        fill="url(#sharpOrange)"
        transform="rotate(-25 64 42)"
      />

      {/* Sharp reflection band 2 */}
      <ellipse
        cx="70"
        cy="75"
        rx="32"
        ry="8"
        fill="url(#sharpOrange)"
        opacity="0.6"
        transform="rotate(20 70 75)"
      />

      {/* Sharp reflection band 3 - vertical */}
      <ellipse
        cx="85"
        cy="64"
        rx="8"
        ry="35"
        fill="url(#sharpOrange)"
        opacity="0.4"
      />

      {/* Edge chrome highlight */}
      <circle
        cx="64"
        cy="64"
        r="50"
        fill="none"
        stroke="url(#jChrome)"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Inner beveled circle */}
      <circle
        cx="64"
        cy="64"
        r="42"
        fill="url(#chromeOrange)"
        opacity="0.95"
      />

      {/* Inner specular */}
      <ellipse
        cx="64"
        cy="54"
        rx="32"
        ry="20"
        fill="url(#orangeSpecular)"
        opacity="0.7"
      />

      {/* Chrome J letter */}
      <path
        d="M 54 46 L 72 46 L 72 74 C 72 82 68 86 60 86 L 54 86 L 54 80 L 60 80 C 64 80 66 78 66 74 L 66 52 L 54 52 Z"
        fill="url(#jChrome)"
        opacity="0.98"
      />

      {/* J ultra-bright edge */}
      <path
        d="M 54 46 L 72 46 L 72 47 L 54 47 Z"
        fill="#FFFFFF"
        opacity="0.95"
      />

      <path
        d="M 54 46 L 55 46 L 55 86 L 54 86 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* J chrome reflection */}
      <path
        d="M 56 48 L 70 48 L 70 50 L 58 50 L 58 52 L 68 52 L 68 74 C 68 79 65 82 61 82 L 58 82 L 58 80 L 61 80 C 64 80 66 78 66 74 L 66 54 L 56 54 Z"
        fill="#FFFFFF"
        opacity="0.6"
      />

      {/* J shadow */}
      <path
        d="M 72 74 C 72 82 68 86 60 86 L 60 87 C 69 87 73 83 73 74 L 73 46 L 72 46 Z"
        fill="#2E0F00"
        opacity="0.5"
      />

      {/* Chrome sparkles - intense */}
      <circle cx="78" cy="50" r="3" fill="#FFFFFF" opacity="1" filter="url(#chromeGlow)" />
      <circle cx="46" cy="72" r="2" fill="#FFFFFF" opacity="0.95" filter="url(#chromeGlow)" />
      <circle cx="84" cy="68" r="1.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="50" cy="48" r="2.5" fill="#FFE6CC" opacity="0.8" filter="url(#chromeGlow)" />

      {/* Bottom rim reflection */}
      <path
        d="M 18 78 Q 64 105 110 78"
        stroke="#2E0F00"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Top rim highlight */}
      <path
        d="M 18 48 Q 64 25 110 48"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />

      {/* Secondary smaller sparkles */}
      <circle cx="92" cy="56" r="1" fill="#FFF4E6" opacity="0.7" />
      <circle cx="40" cy="86" r="1" fill="#FFD9B3" opacity="0.6" />
    </svg>
  );
}
