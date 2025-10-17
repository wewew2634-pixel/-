'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/store/ui.store';

/**
 * Login / Auth Page
 * - OAuth login with TikTok, YouTube
 * - Guest mode option
 * - Terms & Privacy links
 */
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const { setGuestMode } = useAuthStore();
  const toast = useToast();

  const handleTikTokLogin = async () => {
    setLoading('tiktok');
    
    try {
      // TODO: Implement TikTok OAuth flow
      // For now, simulate loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success toast
      toast.success('TikTok 로그인 성공!', '환영합니다');
      
      router.push('/creator/home');
    } catch (_error) {
      toast.error('로그인 실패', 'TikTok 로그인에 실패했습니다. 다시 시도해주세요.');
      setLoading(null);
    }
  };

  const handleYouTubeLogin = async () => {
    setLoading('youtube');
    
    try {
      // TODO: Implement YouTube OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('YouTube 로그인 성공!', '환영합니다');
      
      router.push('/creator/home');
    } catch (_error) {
      toast.error('로그인 실패', 'YouTube 로그인에 실패했습니다. 다시 시도해주세요.');
      setLoading(null);
    }
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    toast.info('게스트 모드로 입장합니다', '일부 기능이 제한될 수 있습니다');
    router.push('/creator/home?guest=true');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col px-5 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12 pt-8">
        {/* Logo */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center mx-auto mb-4 animate-scale-in shadow-primary overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
          
          {/* Camera Icon */}
          <svg className="w-11 h-11 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          
          {/* Sparkle effect */}
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-h1 font-bold mb-2 text-text-primary">
          Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">SNAP</span>
        </h1>
        
        <p className="text-sm text-text-secondary">
          SNS 계정으로 빠르게 시작하세요
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="flex-1 flex flex-col gap-3">
        {/* TikTok Login */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading === 'tiktok'}
          onClick={handleTikTokLogin}
          className="bg-social-tiktok hover:bg-social-tiktok-hover border-0"
          leftIcon={<span className="text-xl">🎵</span>}
        >
          TikTok으로 시작하기
        </Button>

        {/* YouTube Login */}
        <Button
          variant="danger"
          size="lg"
          fullWidth
          loading={loading === 'youtube'}
          onClick={handleYouTubeLogin}
          className="bg-social-youtube hover:bg-social-youtube-hover border-0"
          leftIcon={<span className="text-xl">▶️</span>}
        >
          YouTube로 시작하기
        </Button>

        {/* Guest Mode */}
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={handleGuestMode}
        >
          게스트로 둘러보기
        </Button>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-bg-elevated border border-border rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1 text-text-primary">
                왜 SNS 연동이 필요한가요?
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                크리에이터 프로필 생성을 위해 팔로워 수, 콘텐츠 통계 등을 자동으로 가져옵니다. 
                계정 정보는 안전하게 보호됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Terms */}
      <div className="text-center py-4 text-xs text-text-tertiary leading-relaxed">
        계속 진행하면{' '}
        <a href="/terms" className="text-primary underline">
          이용약관
        </a>
        {' '}및{'\n'}
        <a href="/privacy" className="text-primary underline">
          개인정보처리방침
        </a>
        에 동의하는 것으로 간주됩니다
      </div>
    </div>
  );
}
