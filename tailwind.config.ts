import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === Plus-Polish Token System ===
        // Primary (Brand Orange)
        primary: {
          DEFAULT: 'hsl(var(--pri))',
          foreground: 'hsl(var(--pri-fg))',
          hover: 'hsl(var(--pri-hover))',
          disabled: 'hsl(var(--pri-disabled))',
        },
        // Accent (Teal - Progress)
        accent: {
          DEFAULT: 'hsl(var(--acc))',
          foreground: 'hsl(var(--acc-fg))',
          hover: 'hsl(var(--acc-hover))',
        },
        // Background & Surface
        background: 'hsl(var(--bg))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          2: 'hsl(var(--surface-2))',
          hover: 'hsl(var(--surface-hover))',
        },
        // Text
        foreground: 'hsl(var(--text))',
        muted: {
          DEFAULT: 'hsl(var(--text-muted))',
          foreground: 'hsl(var(--text-muted))',
        },
        // Semantic Status
        success: {
          DEFAULT: 'hsl(var(--ok))',
          foreground: 'hsl(var(--ok-fg))',
          background: 'hsl(var(--ok-bg))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warn))',
          foreground: 'hsl(var(--warn-fg))',
          background: 'hsl(var(--warn-bg))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--err))',
          foreground: 'hsl(var(--err-fg))',
          background: 'hsl(var(--err-bg))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-fg))',
          background: 'hsl(var(--info-bg))',
        },
        // Border & Ring
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        
        // === Legacy Aliases (Backwards Compatibility) ===
        secondary: {
          DEFAULT: 'hsl(var(--acc))',
          light: 'hsl(var(--acc-hover))',
          dark: 'hsl(var(--acc))',
        },
        danger: 'hsl(var(--err))',
        bg: {
          primary: 'hsl(var(--bg))',
          secondary: 'hsl(var(--surface))',
          elevated: 'hsl(var(--surface-2))',
        },
        text: {
          primary: 'hsl(var(--text))',
          secondary: 'hsl(var(--text-muted))',
          tertiary: 'hsl(var(--text-disabled))',
        },
        // Social Platform Colors (preserved)
        social: {
          tiktok: 'var(--social-tiktok)',
          'tiktok-hover': 'var(--social-tiktok-hover)',
          youtube: 'var(--social-youtube)',
          'youtube-hover': 'var(--social-youtube-hover)',
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['40px', '48px'],
        'display-lg': ['32px', '40px'],
        'display-md': ['28px', '36px'],
        'h1': ['24px', '32px'],
        'h2': ['20px', '28px'],
        'h3': ['18px', '26px'],
        'lg': ['16px', '24px'],
        'base': ['15px', '22px'],
        'sm': ['14px', '20px'],
        'xs': ['13px', '18px'],
        'caption': ['12px', '16px'],
      },
      spacing: {
        '0': 'var(--space-0)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
      },
      borderRadius: {
        'sm': 'var(--r-sm, 0.5rem)',
        'md': 'var(--r-md, 0.75rem)',
        'lg': 'var(--r-lg, 1rem)',
        'xl': 'var(--r-xl, 1.25rem)',
        '2xl': 'var(--r-2xl, 1.5rem)',
        'full': '9999px',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'zzik': 'var(--shadow-lg)', // Alias for ZZIK components
        'xs': 'var(--shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
        'primary': 'var(--shadow-primary)',
        'primary-hover': 'var(--shadow-primary-hover)',
        'success': 'var(--shadow-success)',
        'glass': 'var(--shadow-glass)',
      },
      ringOffsetColor: {
        DEFAULT: 'hsl(var(--ring-offset))',
      },
      transitionDuration: {
        'instant': 'var(--duration-instant)',
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        'spring': 'var(--ease-spring)',
      },
      zIndex: {
        'base': '0',
        'dropdown': '1000',
        'sticky': '1100',
        'fixed': '1200',
        'modal-backdrop': '1300',
        'modal': '1400',
        'popover': '1500',
        'toast': '1600',
      },
      minHeight: {
        'touch': 'var(--touch-min)',
        'touch-comfortable': 'var(--touch-comfortable)',
        'touch-large': 'var(--touch-large)',
      },
      maxWidth: {
        'mobile': '428px',
        'tablet': '720px',
        'desktop': '1200px',
      },
      backdropBlur: {
        'glass': '20px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'loading-bar': {
          '0%': { width: '0%', marginLeft: '0%' },
          '50%': { width: '50%', marginLeft: '25%' },
          '100%': { width: '0%', marginLeft: '100%' },
        },
        'spin': {
          'to': { transform: 'rotate(360deg)' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in': 'bounce-in 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'loading-bar': 'loading-bar 1.5s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
