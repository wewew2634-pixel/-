import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const splashMetadata: Metadata = {
  title: 'ZZMUK — Create, Earn, Explore',
  description: '로컬 미션으로 오늘 찍고 오늘 정산. 가까운 크리에이터와 즉시 매칭. 나노 크리에이터를 위한 로컬 숏폼 플랫폼.',
  alternates: {
    canonical: `${siteUrl}/splash`,
  },
  keywords: ['쯤먹', 'ZZMUK', '크리에이터', '나노 크리에이터', '로컬 미션', '숏폼', '로컬 마케팅', '즉시 정산', 'T+0 정산'],
  openGraph: {
    title: 'ZZMUK — Create, Earn, Explore',
    description: '로컬 미션으로 오늘 찍고 오늘 정산. 가까운 크리에이터와 즉시 매칭.',
    url: `${siteUrl}/splash`,
    siteName: 'ZZMUK',
    images: [
      {
        url: `${siteUrl}/api/og?title=ZZMUK&subtitle=Create%20%E2%80%A2%20Earn%20%E2%80%A2%20Explore`,
        width: 1200,
        height: 630,
        alt: 'ZZMUK - 로컬 미션 플랫폼',
        type: 'image/png',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZZMUK — Create, Earn, Explore',
    description: '로컬 미션으로 오늘 찍고 오늘 정산. 가까운 크리에이터와 즉시 매칭.',
    images: [`${siteUrl}/api/og?title=ZZMUK&subtitle=Create%20%E2%80%A2%20Earn%20%E2%80%A2%20Explore`],
    creator: '@zzmuk',
    site: '@zzmuk',
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
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
  },
  verification: {
    google: 'google-site-verification-placeholder',
    yandex: 'yandex-verification-placeholder',
    other: {
      'naver-site-verification': 'naver-verification-placeholder',
    },
  },
  authors: [{ name: 'ZZMUK Team', url: `${siteUrl}` }],
  creator: 'ZZMUK',
  publisher: 'ZZMUK',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'technology',
};
