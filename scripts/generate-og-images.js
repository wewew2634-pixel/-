#!/usr/bin/env node
/**
 * OG Image Generator for JJIKMEOK
 * 
 * Generates Open Graph images (1200x630) for social media sharing.
 * Uses SVG to create branded images with gradient backgrounds.
 * 
 * Usage: node scripts/generate-og-images.js
 */

const fs = require('fs');
const path = require('path');

console.log('📸 OG Image Generator for JJIKMEOK');
console.log('=====================================\n');

const ogDir = path.join(__dirname, '..', 'public', 'og');

// Ensure og directory exists
if (!fs.existsSync(ogDir)) {
  fs.mkdirSync(ogDir, { recursive: true });
}

// Create a simple SVG placeholder (can be replaced with canvas-based generation)
const svgTemplate = (title, subtitle) => `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0A0E1A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1E293B;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad)"/>
  
  <!-- Logo text with gradient -->
  <text x="600" y="280" 
        font-family="Arial, sans-serif" 
        font-size="120" 
        font-weight="900" 
        text-anchor="middle" 
        fill="white">
    ${title}
  </text>
  
  <!-- Subtitle -->
  <text x="600" y="360" 
        font-family="Arial, sans-serif" 
        font-size="36" 
        font-weight="400" 
        text-anchor="middle" 
        fill="#94A3B8">
    ${subtitle}
  </text>
  
  <!-- Brand tagline -->
  <text x="600" y="480" 
        font-family="Arial, sans-serif" 
        font-size="28" 
        font-weight="600" 
        text-anchor="middle" 
        fill="#60A5FA"
        letter-spacing="2">
    로컬 미션 • 즉시 정산 • 나노 크리에이터
  </text>
</svg>`;

// Generate splash OG image
const splashSvg = svgTemplate('JJIKMEOK', 'Create • Earn • Explore');
fs.writeFileSync(path.join(ogDir, 'splash.svg'), splashSvg);

console.log('✅ Generated: public/og/splash.svg');
console.log('\n📝 Note: SVG files work for OG images. For PNG conversion, install:');
console.log('   npm install sharp');
console.log('   Then update this script to convert SVG to PNG.');
console.log('\nAlternatively, use Next.js ImageResponse API for dynamic OG images:');
console.log('   app/api/og/route.tsx');
console.log('\n✨ Done!\n');
