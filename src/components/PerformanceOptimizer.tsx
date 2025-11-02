'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Unified Performance Optimizer Component
 * 통합된 성능 모니터링 및 최적화 컴포넌트 (2025 최적화 버전)
 * - WebVitals와 PerformanceMonitor를 하나로 통합
 * - 프로덕션 환경에서만 작동
 * - 최소한의 오버헤드로 성능 측정
 */
export function PerformanceOptimizer() {
  // 프로덕션 환경에서만 활성화
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Web Vitals 리포팅 (프로덕션만)
  useReportWebVitals((metric) => {
    if (!isProduction) return;
    
    // 중요 지표만 선택적으로 추적
    const criticalMetrics = ['CLS', 'FCP', 'LCP', 'TTFB', 'INP'];
    
    if (criticalMetrics.includes(metric.name)) {
      // 성능 임계값 체크
      const thresholds = {
        CLS: 0.1,     // Good < 0.1
        FCP: 1800,    // Good < 1.8s
        LCP: 2500,    // Good < 2.5s
        TTFB: 800,    // Good < 0.8s
        INP: 200,     // Good < 200ms
      };
      
      const threshold = thresholds[metric.name as keyof typeof thresholds];
      const isGood = metric.value <= threshold;
      
      // 콘솔에 성능 경고 (개발 모드에서만)
      if (!isGood && process.env.NODE_ENV === 'development') {
        console.warn(
          `⚠️ Performance Warning: ${metric.name} = ${metric.value.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }
      
      // Analytics로 전송 (프로덕션만)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric.name,
          value: Math.round(metric.value),
          metric_rating: isGood ? 'good' : 'needs-improvement',
          non_interaction: true,
        });
      }
    }
  });

  useEffect(() => {
    if (!isProduction) return;
    
    // 초기 로드 성능 측정
    if (typeof window !== 'undefined' && window.performance) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            // 핵심 메트릭만 추적
            const metrics = {
              dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
              tcp: navEntry.connectEnd - navEntry.connectStart,
              request: navEntry.responseStart - navEntry.requestStart,
              response: navEntry.responseEnd - navEntry.responseStart,
              dom: navEntry.domComplete - navEntry.domInteractive,
              load: navEntry.loadEventEnd - navEntry.loadEventStart,
            };
            
            // 5초 이상 걸리는 항목만 경고
            Object.entries(metrics).forEach(([key, value]) => {
              if (value > 5000) {
                console.error(`🔴 Critical Performance Issue: ${key} took ${value}ms`);
              }
            });
          }
        }
      });
      
      // Navigation Timing만 관찰 (리소스 타이밍은 제외하여 오버헤드 감소)
      try {
        perfObserver.observe({ entryTypes: ['navigation'] });
      } catch (_e) {
        // 브라우저가 지원하지 않는 경우 무시
      }
      
      return () => {
        perfObserver.disconnect();
      };
    }
  }, [isProduction]);
  
  // 메모리 누수 감지 (프로덕션에서만, 10분마다 체크)
  useEffect(() => {
    if (!isProduction) return;
    
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
        const usage = (usedMB / limitMB) * 100;
        
        // 메모리 사용량이 80% 이상일 때만 경고
        if (usage > 80) {
          console.error(`🔴 Memory Warning: Using ${usedMB}MB of ${limitMB}MB (${usage.toFixed(1)}%)`);
        }
      }
    };
    
    const interval = setInterval(checkMemory, 600000); // 10분마다
    
    return () => clearInterval(interval);
  }, [isProduction]);
  
  // 렌더링 없음 (순수 모니터링 컴포넌트)
  return null;
}

// Window 타입 확장
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}