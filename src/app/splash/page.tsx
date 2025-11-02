'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

/**
 * Splash Screen
 * - Shows JJIKMEOK logo with loading animation
 * - Auto-redirects to onboarding after 1.5 seconds
 * - Implements the splash screen from UX_UI_SPEC.md
 * - Now with 2025 trending logo design
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
      {/* 2025 트렌드 로고 */}
      <div className="mb-6 animate-scale-in">
        <Logo size="xl" animated={true} />
      </div>

      {/* Title - 로고에 포함되어 있으므로 선택적으로 표시 */}
      <h1 className="text-[32px] font-black mb-2 text-text-primary tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        JJIKMEOK
      </h1>

      {/* Subtitle */}
      <p className="text-[14px] text-text-secondary mb-8 tracking-wide uppercase font-medium">
        Create • Earn • Explore
      </p>

      {/* Loading Bar with enhanced animation */}
      <div className="w-[120px] h-1 bg-border rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-loading-bar" />
      </div>
    </div>
  );
}
