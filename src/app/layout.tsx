import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer } from '@/components/ui/Toast';
import { BannerProvider } from '@/components/ui/BannerProvider';
import { Modal } from '@/components/ui/Modal';
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
import { LiveToggle } from '@/components/dev/LiveToggle';
import { JsonLd, generateOrganizationJsonLd } from '@/lib/metadata';
import { pretendard } from './fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ZZMUK - Create, Earn, Explore',
    template: '%s | ZZMUK',
  },
  description: 'Mission-based short-form video platform connecting local businesses with micro-influencers.',
  keywords: ['쯤먹', 'ZZMUK', '크리에이터', '인플루언서', '로컬 마케팅', '숏폼', 'TikTok', 'YouTube', 'Instagram'],
  authors: [{ name: 'ZZMUK Team' }],
  creator: 'ZZMUK',
  publisher: 'ZZMUK',
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
    title: 'ZZMUK - Create, Earn, Explore',
    description: 'Mission-based short-form video platform',
    siteName: 'ZZMUK',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZZMUK OG Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZZMUK - Create, Earn, Explore',
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
    <html lang="ko" suppressHydrationWarning className={pretendard.variable}>
      <head>
        {/* Organization Structured Data */}
        <JsonLd data={organizationData} />
      </head>
      <body 
        className={`${pretendard.className} antialiased bg-bg-primary text-text-primary min-h-screen`}
        suppressHydrationWarning
      >
        <BannerProvider />
        {children}
        <ToastContainer />
        <Modal />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <PerformanceOptimizer />
        {/* Live Design Preview Toggle - Development Tool */}
        {process.env.NODE_ENV === 'development' && <LiveToggle />}
      </body>
    </html>
  );
}
