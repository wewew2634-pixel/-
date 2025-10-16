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
      <div className="w-[100px] h-[100px] bg-gradient-to-br from-primary to-secondary rounded-[24px] flex items-center justify-center text-[48px] mb-6 animate-scale-in shadow-primary">
        찍
      </div>

      {/* Title */}
      <h1 className="text-[32px] font-bold mb-2 text-text-primary">
        찍먹
      </h1>

      {/* Subtitle */}
      <p className="text-[18px] text-text-secondary mb-8">
        로컬 체험으로 수익 만들기
      </p>

      {/* Loading Bar */}
      <div className="w-[120px] h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary animate-loading-bar" />
      </div>
    </div>
  );
}
