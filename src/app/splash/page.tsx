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
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-5 relative">
      {/* Background Gradient for Glass Effect */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      {/* Pure Tailwind Glass Container */}
      <div className="max-w-[360px] w-full p-8 flex flex-col items-center relative z-10 backdrop-blur-2xl saturate-150 bg-white/[0.05] border border-white/10 rounded-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)]">
        {/* 2025 트렌드 로고 - No animation for faster load */}
        <div className="mb-6">
        <Logo size="xl" animated={false} />
      </div>

        {/* Title */}
        <h1 className="text-[32px] font-black mb-2 text-text-primary tracking-tight">
          ZZMUK
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] text-text-secondary mb-8 tracking-wide uppercase font-medium">
          Create • Earn • Explore
        </p>

        {/* Loading Bar - Pure Tailwind */}
        <div className="w-[120px] h-2 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
            style={{
              animation: 'loading 1.5s ease-in-out infinite',
              transformOrigin: 'left'
            }}
          />
        </div>
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
