/**
 * useLivePreview Hook
 * 
 * Real-time design review system for JJIKMEOK
 * Polls /api/live-hash every 5 seconds to detect file changes
 * 
 * Features:
 * - URL preservation (no page reload, just refresh)
 * - Toggle via localStorage or ?live=1 query param
 * - Soft refresh (router.refresh) or hard reload modes
 * - Last check timestamp tracking
 * 
 * Usage:
 * const { active, enable, disable, lastChecked } = useLivePreview({
 *   enabled: false,
 *   intervalMs: 5000,
 *   mode: 'refresh'
 * });
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'refresh' | 'reload';

interface UseLivePreviewOptions {
  enabled?: boolean;
  intervalMs?: number;
  mode?: Mode;
}

interface UseLivePreviewReturn {
  active: boolean;
  enable: () => void;
  disable: () => void;
  lastChecked: number;
}

const STORAGE_KEY = 'zzm.live';

export function useLivePreview(
  { 
    enabled = false, 
    intervalMs = 5000, 
    mode = 'refresh' as Mode 
  }: UseLivePreviewOptions = {}
): UseLivePreviewReturn {
  const router = useRouter();
  const lastHashRef = useRef<string>('');
  const [active, setActive] = useState(enabled);
  const [lastChecked, setLastChecked] = useState<number>(0);

  // Initialize from URL query or localStorage
  useEffect(() => {
    // Check for ?live=1 query parameter
    const searchParams = new URLSearchParams(window.location.search);
    const liveParam = searchParams.get('live');
    if (liveParam === '1') {
      setActive(true);
      return;
    }

    // Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') {
      setActive(true);
    }
  }, []);

  // Main polling effect
  useEffect(() => {
    if (!active) {
      return;
    }

    let timer: NodeJS.Timeout;

    const checkForChanges = async () => {
      try {
        const response = await fetch('/api/live-hash', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        
        if (!response.ok) {
          console.warn('[useLivePreview] API returned non-OK status:', response.status);
          return;
        }

        const data = await response.json();
        const { hash } = data;
        
        setLastChecked(Date.now());

        // Initialize hash on first check
        if (!lastHashRef.current) {
          lastHashRef.current = hash;
          console.log('[useLivePreview] Initial hash:', hash);
          return;
        }

        // Detect change
        if (lastHashRef.current !== hash) {
          console.log('[useLivePreview] Change detected! Old:', lastHashRef.current, 'New:', hash);
          lastHashRef.current = hash;

          if (mode === 'refresh') {
            // Soft refresh (preserves URL, client-side navigation)
            console.log('[useLivePreview] Performing router.refresh()');
            router.refresh();
          } else {
            // Hard reload (full page reload)
            console.log('[useLivePreview] Performing hard reload');
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('[useLivePreview] Error checking for changes:', error);
      }
    };

    // Immediate first check
    checkForChanges();

    // Then poll at interval
    timer = setInterval(checkForChanges, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [active, intervalMs, mode, router]);

  // Control functions
  const enable = () => {
    setActive(true);
    localStorage.setItem(STORAGE_KEY, '1');
    console.log('[useLivePreview] Enabled');
  };

  const disable = () => {
    setActive(false);
    localStorage.removeItem(STORAGE_KEY);
    lastHashRef.current = ''; // Reset hash
    console.log('[useLivePreview] Disabled');
  };

  return { 
    active, 
    enable, 
    disable, 
    lastChecked 
  };
}
