/**
 * useInfiniteScroll Hook
 * 
 * Custom hook for implementing infinite scroll functionality.
 * Triggers callback when user scrolls near the bottom of the page.
 * 
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useInfiniteScroll({
 *   onLoadMore: fetchMoreMissions,
 *   hasMore: true,
 *   isLoading: false,
 * });
 * 
 * return (
 *   <div>
 *     {missions.map(m => <MissionCard key={m.id} mission={m} />)}
 *     <div ref={ref}>Loading...</div>
 *   </div>
 * );
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number; // 0-1, how much of target should be visible
  rootMargin?: string; // CSS margin values
  enabled?: boolean;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Setup intersection observer
  const setupObserver = useCallback(() => {
    if (!enabled || !targetRef.current) return;

    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        
        setIsIntersecting(entry.isIntersecting);

        // Trigger load more when intersecting
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe target
    observerRef.current.observe(targetRef.current);
  }, [enabled, hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  // Setup observer when dependencies change
  useEffect(() => {
    setupObserver();
  }, [setupObserver]);

  return {
    ref: targetRef,
    isIntersecting,
  };
}

/**
 * useScrollToTop Hook
 * 
 * Utility hook to scroll to top of page.
 */
export function useScrollToTop() {
  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  return scrollToTop;
}

/**
 * useScrollPosition Hook
 * 
 * Track current scroll position.
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up');
      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, scrollDirection };
}

/**
 * useDebounce Hook
 * 
 * Debounces a value with specified delay.
 * Useful for search inputs and filter changes.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
