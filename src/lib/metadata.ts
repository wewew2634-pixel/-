/**
 * SEO Metadata Utilities
 * 
 * Generate consistent Open Graph, Twitter Card, and JSON-LD metadata
 * for all pages to improve social sharing and search engine optimization.
 */

import type { Metadata } from 'next';
import React from 'react';

/**
 * Base site configuration
 */
export const SITE_CONFIG = {
  name: 'ZZMUK',
  title: 'ZZMUK - 숏폼으로 수익 창출하는 로컬 크리에이터 플랫폼',
  description: '15초 촬영으로 수익을 얻으세요. 주변 가게를 홍보하고 즉시 리워드를 받는 크리에이터 플랫폼',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zzmuk.com',
  ogImage: '/og-image.png',
  twitterHandle: '@zzmuk',
  locale: 'ko_KR',
  themeColor: '#10B981', // primary color
} as const;

/**
 * Generate basic metadata
 */
export function generateMetadata({
  title,
  description,
  image,
  path = '',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.title;
  const pageDescription = description || SITE_CONFIG.description;
  const pageImage = image || SITE_CONFIG.ogImage;
  const pageUrl = `${SITE_CONFIG.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),

    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },

    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * Generate mission detail metadata
 */
export function generateMissionMetadata({
  title,
  description,
  image,
  merchantName,
  reward,
  location,
}: {
  title: string;
  description: string;
  image: string;
  merchantName: string;
  reward: string;
  location: string;
}): Metadata {
  const pageTitle = `${title} - ${merchantName}`;
  const pageDescription = `${description} | ${reward} 리워드 | ${location}`;

  return {
    ...generateMetadata({
      title: pageTitle,
      description: pageDescription,
      image,
    }),
    
    // Additional structured data
    other: {
      'mission:merchant': merchantName,
      'mission:reward': reward,
      'mission:location': location,
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    sameAs: [
      'https://www.facebook.com/zzmuk',
      'https://www.instagram.com/zzmuk',
      'https://www.youtube.com/@zzmuk',
    ],
  };
}

/**
 * Generate JSON-LD for local business
 */
export function generateLocalBusinessJsonLd({
  name,
  description,
  address,
  phone,
  rating,
  reviewCount,
  image,
}: {
  name: string;
  description: string;
  address: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressLocality: address,
    },
    ...(phone && { telephone: phone }),
    ...(image && { image }),
    ...(rating && reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount,
      },
    }),
  };
}

/**
 * Generate JSON-LD for job posting (mission)
 */
export function generateJobPostingJsonLd({
  title,
  description,
  datePosted,
  validThrough,
  employmentType = 'CONTRACTOR',
  baseSalary,
  location,
}: {
  title: string;
  description: string;
  datePosted: string;
  validThrough: string;
  employmentType?: string;
  baseSalary: number;
  location: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted,
    validThrough,
    employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      sameAs: SITE_CONFIG.url,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: location,
        addressCountry: 'KR',
      },
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'KRW',
      value: {
        '@type': 'QuantitativeValue',
        value: baseSalary,
        unitText: 'HOUR',
      },
    },
  };
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * Render JSON-LD script tag
 * 
 * Note: This returns a React element using createElement to avoid JSX in .ts file
 */
export function JsonLd({ data }: { data: Record<string, any> }): React.ReactElement {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}

/**
 * Common metadata for auth pages
 */
export const AUTH_METADATA: Metadata = generateMetadata({
  title: '로그인',
  description: 'ZZMUK 크리에이터로 시작하세요',
  noIndex: true, // Don't index auth pages
});

/**
 * Common metadata for onboarding
 */
export const ONBOARDING_METADATA: Metadata = generateMetadata({
  title: '시작하기',
  description: '15초 촬영으로 수익 창출하는 방법을 알아보세요',
  noIndex: true,
});

/**
 * Splash page metadata
 */
export const SPLASH_METADATA: Metadata = generateMetadata({
  title: 'ZZMUK',
  description: '15초로 수익을 창출하세요. 로컬 크리에이터 플랫폼',
  path: '/splash',
});

/**
 * Common metadata for creator home
 */
export const CREATOR_HOME_METADATA: Metadata = generateMetadata({
  title: '크리에이터 홈',
  description: '내 주변의 미션을 찾고 수익을 창출하세요',
  path: '/home',
});

/**
 * Generate RSS feed item
 */
export function generateRssFeedItem({
  title,
  description,
  link,
  pubDate,
  guid,
}: {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  guid: string;
}) {
  return `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
    </item>
  `;
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry({
  url,
  lastmod,
  changefreq = 'daily',
  priority = 0.7,
}: {
  url: string;
  lastmod?: Date;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}) {
  return {
    url: `${SITE_CONFIG.url}${url}`,
    lastModified: lastmod || new Date(),
    changeFrequency: changefreq,
    priority,
  };
}
