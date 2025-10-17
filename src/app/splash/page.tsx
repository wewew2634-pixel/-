'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Splash Screen
 * - Shows JJIKMEOK logo with loading animation
 * - Auto-redirects to onboarding after 1.5 seconds
 * - Implements the splash screen from UX_UI_SPEC.md
 */
export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to onboarding after 1.5 seconds
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-5 animate-fade-in">
      {/* Logo */}
      <div className="relative w-[100px] h-[100px] bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center mb-6 animate-scale-in shadow-primary overflow-hidden group">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
        
        {/* Camera Icon */}
        <svg className="w-14 h-14 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        
        {/* Sparkle effect */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping" />
      </div>

      {/* Title */}
      <h1 className="text-display-lg font-bold mb-2 text-text-primary tracking-tight">
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SNAP</span>
      </h1>

      {/* Subtitle */}
      <p className="text-h3 text-text-secondary mb-2 font-medium">
        Snap & Earn
      </p>
      <p className="text-sm text-text-tertiary mb-8">
        로컬 체험으로 수익 만들기
      </p>

      {/* Loading Bar */}
      <div className="w-[120px] h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary animate-loading-bar" />
      </div>
    </div>
  );
}
