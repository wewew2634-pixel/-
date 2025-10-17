import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { WebVitals } from '@/components/WebVitals';
import { PerformanceMonitor } from '@/components/PerformanceMonitor';
import { JsonLd, generateOrganizationJsonLd } from '@/lib/metadata';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: '찍먹 - 로컬 체험으로 수익 만들기',
    template: '%s | 찍먹',
  },
  description: 'B2B2C 미션 기반 숏폼 영상 플랫폼. 로컬 비즈니스와 마이크로 인플루언서를 연결합니다.',
  keywords: ['찍먹', 'JJIKMEOK', '크리에이터', '인플루언서', '로컬 마케팅', '숏폼', 'TikTok', 'YouTube', 'Instagram'],
  authors: [{ name: 'JJIKMEOK Team' }],
  creator: 'JJIKMEOK',
  publisher: 'JJIKMEOK',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    title: '찍먹 - 로컬 체험으로 수익 만들기',
    description: 'B2B2C 미션 기반 숏폼 영상 플랫폼',
    siteName: '찍먹',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '찍먹 OG Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '찍먹 - 로컬 체험으로 수익 만들기',
    description: 'B2B2C 미션 기반 숏폼 영상 플랫폼',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0E1A' },
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationData = generateOrganizationJsonLd();
  
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        
        {/* Pretendard Variable Font */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        
        {/* Organization Structured Data */}
        <JsonLd data={organizationData} />
      </head>
      <body className="font-pretendard antialiased bg-bg-primary text-text-primary min-h-screen">
        {children}
        <ToastContainer />
        <Modal />
        <Analytics />
        <WebVitals />
        <PerformanceMonitor />
      </body>
    </html>
  );
}
