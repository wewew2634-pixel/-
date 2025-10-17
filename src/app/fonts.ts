import localFont from 'next/font/local'

/**
 * Pretendard Variable Font 설정
 * - Next.js 내장 폰트 최적화 사용
 * - 로컬 폰트로 제공하여 CDN 의존성 제거
 * - 자동 서브셋, 프리로드, 폴백 처리
 */
export const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/PretendardVariable.woff2',
      weight: '45 920',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif',
  ],
  preload: true,
  adjustFontFallback: 'Arial',
})