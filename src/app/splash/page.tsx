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
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-5">
      {/* 2025 트렌드 로고 - No animation for faster load */}
      <div className="mb-6">
        <Logo size="xl" animated={false} />
      </div>

      {/* Title */}
      <h1 className="text-[32px] font-black mb-2 text-text-primary tracking-tight">
        JJIKMEOK
      </h1>

      {/* Subtitle */}
      <p className="text-[14px] text-text-secondary mb-8 tracking-wide uppercase font-medium">
        Create • Earn • Explore
      </p>

      {/* Loading Bar - Simplified animation */}
      <div className="w-[120px] h-1 bg-border rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary"
          style={{
            animation: 'loading 1.5s ease-in-out infinite',
            transformOrigin: 'left'
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: scaleX(0.3); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
