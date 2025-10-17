'use client';

import React from 'react';
import { Banner, BannerProps } from './Banner';
import { useUIStore } from '@/store/ui.store';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * BannerProvider Component
 * 
 * Global provider for displaying persistent banner notifications.
 * Integrates with Zustand store for centralized state management.
 * 
 * Features:
 * - Stacks multiple banners vertically
 * - Smooth enter/exit animations
 * - Persistent banners stay until dismissed
 * - Auto-dismiss for non-persistent banners
 * - Accessible with ARIA attributes
 */
export function BannerProvider() {
  const banners = useUIStore((state) => state.banners);
  const dismissBanner = useUIStore((state) => state.dismissBanner);

  if (banners.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="알림 배너"
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="max-w-screen-xl mx-auto px-4 pt-4 space-y-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Banner
                {...banner.props}
                id={banner.id}
                onDismiss={() => dismissBanner(banner.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
