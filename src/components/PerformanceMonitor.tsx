'use client';

/**
 * Performance Monitor Component
 * 
 * Real-time performance monitoring and optimization
 * Tracks Web Vitals and provides actionable insights
 */

import { useEffect, useState } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals as reportVitals } from '@/lib/performance';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  inp?: number;
}

interface PerformanceIssue {
  metric: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  recommendation: string;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [showMonitor, setShowMonitor] = useState(false);

  useReportWebVitals((metric) => {
    // Report to analytics
    reportVitals({
      id: metric.id,
      name: metric.name as any,
      value: metric.value,
      rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
      delta: metric.delta,
      navigationType: metric.navigationType || 'navigate',
    });

    // Update local metrics
    setMetrics((prev) => ({
      ...prev,
      [metric.name.toLowerCase()]: metric.value,
    }));

    // Track issues
    if (metric.rating !== 'good') {
      const issue: PerformanceIssue = {
        metric: metric.name,
        value: metric.value,
        rating: metric.rating as any,
        recommendation: getRecommendation(metric.name, metric.value),
      };

      setIssues((prev) => {
        // Remove old issue for same metric
        const filtered = prev.filter((i) => i.metric !== metric.name);
        return [...filtered, issue];
      });
    }

    // Production analytics
    if (process.env.NODE_ENV === 'production') {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_rating: metric.rating,
          metric_delta: Math.round(metric.delta),
        });
      }
    }
  });

  // Show monitor in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
          setShowMonitor((prev) => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  // Log performance on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
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
            console.log('Press Ctrl+Shift+P to toggle performance monitor');
            // eslint-disable-next-line no-console
            console.groupEnd();
          }
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, []);

  if (process.env.NODE_ENV !== 'development' || !showMonitor) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-bg-elevated border border-border rounded-lg shadow-2xl p-4 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <span>📊</span>
          Performance Monitor
        </h3>
        <button
          onClick={() => setShowMonitor(false)}
          className="text-text-tertiary hover:text-text-primary transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Metrics */}
      <div className="space-y-2 mb-3">
        <MetricRow label="FCP" value={metrics.fcp} unit="ms" threshold={1800} />
        <MetricRow label="LCP" value={metrics.lcp} unit="ms" threshold={2500} />
        <MetricRow label="CLS" value={metrics.cls} unit="" threshold={0.1} />
        <MetricRow label="FID" value={metrics.fid} unit="ms" threshold={100} />
        <MetricRow label="TTFB" value={metrics.ttfb} unit="ms" threshold={800} />
        <MetricRow label="INP" value={metrics.inp} unit="ms" threshold={200} />
      </div>

      {/* Issues */}
      {issues.length > 0 && (
        <div className="border-t border-border pt-3">
          <h4 className="text-xs font-semibold text-text-secondary mb-2">
            Issues ({issues.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs ${
                  issue.rating === 'poor'
                    ? 'bg-danger/10 text-danger'
                    : 'bg-warning/10 text-warning'
                }`}
              >
                <div className="font-semibold mb-1">
                  {issue.metric}: {Math.round(issue.value)}
                </div>
                <div className="text-[10px] opacity-80">
                  {issue.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-[10px] text-text-tertiary mt-2">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  unit,
  threshold,
}: {
  label: string;
  value?: number;
  unit: string;
  threshold: number;
}) {
  if (value === undefined) {
    return (
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-tertiary">Measuring...</span>
      </div>
    );
  }

  const rating = value <= threshold ? 'good' : value <= threshold * 1.5 ? 'needs-improvement' : 'poor';
  const color = rating === 'good' ? 'text-success' : rating === 'needs-improvement' ? 'text-warning' : 'text-danger';

  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-text-secondary">{label}</span>
      <span className={`font-mono ${color}`}>
        {Math.round(value)}{unit}
      </span>
    </div>
  );
}

function getRecommendation(metric: string, value: number): string {
  switch (metric) {
    case 'FCP':
      return `FCP ${Math.round(value)}ms - Optimize initial render. Use code splitting and lazy loading.`;
    case 'LCP':
      return `LCP ${Math.round(value)}ms - Optimize largest content. Preload images and use Next.js Image.`;
    case 'CLS':
      return `CLS ${value.toFixed(3)} - Reserve space for dynamic content. Set image dimensions.`;
    case 'FID':
      return `FID ${Math.round(value)}ms - Reduce JavaScript execution time. Use web workers.`;
    case 'TTFB':
      return `TTFB ${Math.round(value)}ms - Improve server response time. Use caching and CDN.`;
    case 'INP':
      return `INP ${Math.round(value)}ms - Optimize event handlers. Debounce/throttle interactions.`;
    default:
      return `${metric}: ${value} - Check performance best practices.`;
  }
}
