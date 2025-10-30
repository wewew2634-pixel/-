/**
 * Performance Utilities
 * 
 * Tools for measuring and optimizing application performance.
 * Includes Web Vitals monitoring, lazy loading helpers, and optimization utilities.
 */

import { useEffect, useRef } from 'react';

/**
 * Web Vitals Metrics
 */
export interface WebVitalsMetric {
  id: string;
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

/**
 * Report Web Vitals to analytics
 * Usage: Add to app/layout.tsx or _app.tsx
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('📊 Web Vitals:', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    });
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.value),
    //   metric_id: metric.id,
    //   metric_rating: metric.rating,
    //   metric_delta: Math.round(metric.delta),
    // });

    // Example: Custom analytics endpoint
    // fetch('/api/analytics/vitals', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    // });
  }
}

/**
 * Lazy load images with Intersection Observer
 */
export function useLazyLoad<T extends HTMLElement>(
  threshold: number = 0.1,
  rootMargin: string = '50px'
) {
  const ref = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          // Element is visible
          ref.current?.setAttribute('data-loaded', 'true');
          observerRef.current?.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(ref.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * Measure component render time
 */
export function useRenderTime(componentName: string) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `⚠️ Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`
      );
    }
  });
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Preload critical resources
 */
export function preloadResource(
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch'
) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

/**
 * Prefetch next page
 */
export function prefetchPage(href: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    // Page load metrics
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    request: navigation.responseStart - navigation.requestStart,
    response: navigation.responseEnd - navigation.responseStart,
    dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    load: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Total time
    total: navigation.loadEventEnd - navigation.fetchStart,
    
    // Time to Interactive
    tti: navigation.domInteractive - navigation.fetchStart,
  };
}

/**
 * Optimize image loading
 */
export const IMAGE_SIZES = {
  thumbnail: 150,
  small: 300,
  medium: 640,
  large: 1024,
  xlarge: 1920,
} as const;

export function getOptimalImageSize(containerWidth: number): number {
  if (containerWidth <= IMAGE_SIZES.thumbnail) return IMAGE_SIZES.thumbnail;
  if (containerWidth <= IMAGE_SIZES.small) return IMAGE_SIZES.small;
  if (containerWidth <= IMAGE_SIZES.medium) return IMAGE_SIZES.medium;
  if (containerWidth <= IMAGE_SIZES.large) return IMAGE_SIZES.large;
  return IMAGE_SIZES.xlarge;
}

/**
 * Memory usage monitoring (Chrome only)
 */
export function getMemoryUsage() {
  if (typeof window === 'undefined') return null;
  
  // @ts-expect-error - Chrome specific API
  const memory = performance.memory;
  
  if (!memory) return null;
  
  return {
    used: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    total: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    limit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
  };
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for browsers without requestIdleCallback
  // Use type assertion to avoid TypeScript narrowing issue
  return (window as any).setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 50,
    } as IdleDeadline);
  }, 1) as unknown as number;
}

/**
 * Cancel idle callback wrapper
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    // Use type assertion to avoid TypeScript narrowing issue
    (window as any).clearTimeout(id);
  }
}
