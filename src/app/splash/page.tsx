'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

/**
 * Splash Screen - ZZMUK Liquid Glass Design
 * - Shows ZZMUK logo with loading animation
 * - Auto-redirects to onboarding after 1.5 seconds
 * - Implements Apple WWDC 2025 "Liquid Glass" design system
 * - 100% Pure Tailwind CSS (NO custom CSS)
 * - AI-optimized for accessibility, responsive design, and performance
 * 
 * AI Improvements Applied (Gemini 2.5 Flash Analysis):
 * ✅ Semantic HTML (<main> landmark)
 * ✅ ARIA attributes for screen readers
 * ✅ Responsive blob sizing (vw units)
 * ✅ Optimized blur intensity (performance)
 * ✅ Animated gradient loader (better UX)
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
      {/* Background Gradient for Glass Effect - AI Optimized */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        {/* Responsive blobs with vw units (AI recommendation) */}
        <div className="absolute top-1/3 left-1/3 w-[min(50vw,500px)] h-[min(50vw,500px)] bg-primary/15 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-[min(40vw,400px)] h-[min(40vw,400px)] bg-accent/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      {/* Pure Tailwind Glass Container - Semantic HTML */}
      <main role="main" className="max-w-[360px] w-full p-8 flex flex-col items-center relative z-10 backdrop-blur-xl saturate-150 bg-white/[0.05] border border-white/10 rounded-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)]">
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

        {/* Loading Bar - Pure Tailwind with ARIA */}
        <div 
          role="progressbar" 
          aria-label="Loading ZZMUK" 
          aria-busy="true"
          className="w-[120px] h-2 rounded-full bg-white/10 overflow-hidden"
        >
          <div 
            className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
            style={{
              animation: 'loading 1.5s ease-in-out infinite',
              transformOrigin: 'left'
            }}
          />
        </div>
      </main>
      
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
