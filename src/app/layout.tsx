import type { Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer } from '@/components/ui/Toast';
import { BannerProvider } from '@/components/ui/BannerProvider';
import { Modal } from '@/components/ui/Modal';
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
import { LiveToggle } from '@/components/dev/LiveToggle';
import { JsonLd, generateOrganizationJsonLd } from '@/lib/metadata';
import { pretendard } from './fonts';
import '@/styles/globals.css';

// Import unified metadata from lib
export { metadata } from '@/lib/metadata';

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
