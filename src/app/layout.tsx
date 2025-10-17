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
    default: 'JJIKMEOK - Create, Earn, Explore',
    template: '%s | JJIKMEOK',
  },
  description: 'Mission-based short-form video platform connecting local businesses with micro-influencers.',
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
    title: 'JJIKMEOK - Create, Earn, Explore',
    description: 'Mission-based short-form video platform',
    siteName: 'JJIKMEOK',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JJIKMEOK OG Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JJIKMEOK - Create, Earn, Explore',
    description: 'Mission-based short-form video platform',
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
