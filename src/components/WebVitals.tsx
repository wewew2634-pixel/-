'use client';

/**
 * Web Vitals Reporter Component
 * 
 * Monitors and reports Core Web Vitals metrics:
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint)
 * 
 * Uses Next.js built-in Web Vitals reporting and our custom performance utilities.
 */

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals as reportVitals } from '@/lib/performance';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Report to our custom analytics
    reportVitals({
      id: metric.id,
      name: metric.name as any,
      value: metric.value,
      rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
      delta: metric.delta,
      navigationType: metric.navigationType || 'navigate',
    });

    // In production, you can also send to external services
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_rating: metric.rating,
          metric_delta: Math.round(metric.delta),
        });
      }

      // Example: Send to custom endpoint
      // fetch('/api/analytics/vitals', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metric),
      // }).catch(console.error);
    }
  });

  // Log performance metrics on mount (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Wait for page to be fully loaded
      const timeout = setTimeout(() => {
        if (typeof window !== 'undefined' && window.performance) {
          const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            // eslint-disable-next-line no-console
            console.group('📊 Performance Metrics');
            // eslint-disable-next-line no-console
            console.log('DOM Content Loaded:', Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart), 'ms');
            // eslint-disable-next-line no-console
            console.log('Load Complete:', Math.round(navigation.loadEventEnd - navigation.loadEventStart), 'ms');
            // eslint-disable-next-line no-console
            console.log('DOM Interactive:', Math.round(navigation.domInteractive - navigation.fetchStart), 'ms');
            // eslint-disable-next-line no-console
            console.log('Total Page Load:', Math.round(navigation.loadEventEnd - navigation.fetchStart), 'ms');
            // eslint-disable-next-line no-console
            console.groupEnd();
          }
        }
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, []);

  return null;
}
