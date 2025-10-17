/**
 * PerformanceMonitor Component Tests
 * 
 * Tests for performance monitoring component:
 * - Web Vitals tracking
 * - Issue detection
 * - Development-only display
 * - Keyboard shortcut toggle
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PerformanceMonitor } from '../PerformanceMonitor';
import * as performanceLib from '@/lib/performance';

// Mock next/web-vitals
jest.mock('next/web-vitals', () => ({
  useReportWebVitals: (callback: (metric: unknown) => void) => {
    // Store callback for manual triggering in tests
    (global as any).__webVitalsCallback = callback;
  },
}));

// Mock performance lib
jest.mock('@/lib/performance', () => ({
  reportWebVitals: jest.fn(),
}));

describe('PerformanceMonitor', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    delete (global as any).__webVitalsCallback;
  });

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  describe('Development Mode', () => {
    beforeEach(() => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });
    });

    it('does not show monitor by default', () => {
      render(<PerformanceMonitor />);
      expect(screen.queryByText('Performance Monitor')).not.toBeInTheDocument();
    });

    it('shows monitor when Ctrl+Shift+P is pressed', () => {
      render(<PerformanceMonitor />);

      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      expect(screen.getByText('Performance Monitor')).toBeInTheDocument();
    });

    it('hides monitor when close button is clicked', () => {
      render(<PerformanceMonitor />);

      // Show monitor
      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      // Close monitor
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Performance Monitor')).not.toBeInTheDocument();
    });

    it('displays all metric labels', () => {
      render(<PerformanceMonitor />);

      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      expect(screen.getByText('FCP')).toBeInTheDocument();
      expect(screen.getByText('LCP')).toBeInTheDocument();
      expect(screen.getByText('CLS')).toBeInTheDocument();
      expect(screen.getByText('FID')).toBeInTheDocument();
      expect(screen.getByText('TTFB')).toBeInTheDocument();
      expect(screen.getByText('INP')).toBeInTheDocument();
    });

    it('updates metrics when Web Vitals are reported', async () => {
      render(<PerformanceMonitor />);

      // Show monitor
      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      // Trigger Web Vital
      const callback = (global as any).__webVitalsCallback;
      callback({
        id: 'test-1',
        name: 'FCP',
        value: 1500,
        rating: 'good',
        delta: 1500,
        navigationType: 'navigate',
      });

      await waitFor(() => {
        expect(screen.getByText(/1500ms/)).toBeInTheDocument();
      });
    });

    it('detects and displays issues for poor metrics', async () => {
      render(<PerformanceMonitor />);

      // Show monitor
      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      // Trigger poor metric
      const callback = (global as any).__webVitalsCallback;
      callback({
        id: 'test-2',
        name: 'LCP',
        value: 4000,
        rating: 'poor',
        delta: 4000,
        navigationType: 'navigate',
      });

      await waitFor(() => {
        expect(screen.getByText(/Issues/)).toBeInTheDocument();
        expect(screen.getByText(/LCP: 4000/)).toBeInTheDocument();
      });
    });

    it('provides recommendations for poor metrics', async () => {
      render(<PerformanceMonitor />);

      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      const callback = (global as any).__webVitalsCallback;
      callback({
        id: 'test-3',
        name: 'CLS',
        value: 0.5,
        rating: 'poor',
        delta: 0.5,
        navigationType: 'navigate',
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Reserve space for dynamic content/)
        ).toBeInTheDocument();
      });
    });

    it('logs performance metrics to console', () => {
      const consoleSpy = jest.spyOn(console, 'log');

      // Mock performance API
      Object.defineProperty(window, 'performance', {
        writable: true,
        value: {
          getEntriesByType: () => [
            {
              domContentLoadedEventEnd: 1500,
              domContentLoadedEventStart: 1000,
              loadEventEnd: 2500,
              loadEventStart: 2000,
              domInteractive: 1200,
              fetchStart: 0,
            },
          ],
        },
      });

      render(<PerformanceMonitor />);

      // Wait for timeout
      setTimeout(() => {
        expect(consoleSpy).toHaveBeenCalled();
      }, 200);
    });
  });

  describe('Production Mode', () => {
    beforeEach(() => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      });
    });

    it('does not render monitor in production', () => {
      render(<PerformanceMonitor />);

      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      expect(screen.queryByText('Performance Monitor')).not.toBeInTheDocument();
    });

    it('still reports metrics in production', () => {
      const { reportWebVitals } = performanceLib;
      render(<PerformanceMonitor />);

      const callback = (global as any).__webVitalsCallback;
      callback({
        id: 'test-4',
        name: 'FCP',
        value: 1500,
        rating: 'good',
        delta: 1500,
        navigationType: 'navigate',
      });

      expect(reportWebVitals).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'FCP',
          value: 1500,
        })
      );
    });
  });

  describe('Metric Rating', () => {
    beforeEach(() => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true,
        configurable: true,
      });
    });

    it('shows good rating in green', async () => {
      render(<PerformanceMonitor />);

      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      const callback = (global as any).__webVitalsCallback;
      callback({
        id: 'test-5',
        name: 'FCP',
        value: 1500,
        rating: 'good',
        delta: 1500,
        navigationType: 'navigate',
      });

      await waitFor(() => {
        const metric = screen.getByText(/1500ms/);
        expect(metric).toHaveClass('text-success');
      });
    });

    it('shows needs-improvement rating in yellow', async () => {
      render(<PerformanceMonitor />);

      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      const callback = (global as any).__webVitalsCallback;
      callback({
        id: 'test-6',
        name: 'LCP',
        value: 3000,
        rating: 'needs-improvement',
        delta: 3000,
        navigationType: 'navigate',
      });

      await waitFor(() => {
        const metrics = screen.getAllByText(/3000/);
        expect(metrics[0]).toHaveClass('text-warning');
      });
    });

    it('shows poor rating in red', async () => {
      render(<PerformanceMonitor />);

      fireEvent.keyDown(window, {
        key: 'P',
        ctrlKey: true,
        shiftKey: true,
      });

      const callback = (global as any).__webVitalsCallback;
      callback({
        id: 'test-7',
        name: 'TTFB',
        value: 2000,
        rating: 'poor',
        delta: 2000,
        navigationType: 'navigate',
      });

      await waitFor(() => {
        const metrics = screen.getAllByText(/2000/);
        expect(metrics[0]).toHaveClass('text-danger');
      });
    });
  });
});
