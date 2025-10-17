'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <Logo size="lg" />
        <h1 className="text-4xl font-bold text-gray-900">ZZMUK</h1>
        <p className="text-gray-600">Create • Earn • Explore</p>
      </div>
    </div>
  );
}
