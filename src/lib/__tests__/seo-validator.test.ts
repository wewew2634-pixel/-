/**
 * SEO Validator Tests
 * 
 * Tests for SEO validation utilities
 */

import { describe, it, expect } from '@jest/globals';
import type { Metadata } from 'next';
import {
  validateMetadata,
  validateJsonLd,
  generateSEOReport,
} from '../seo-validator';

describe('SEO Validator', () => {
  describe('validateMetadata', () => {
    it('should validate complete metadata successfully', () => {
      const metadata: Metadata = {
        title: 'Test Page - Great SEO Title for Testing Purposes',
        description: 'This is a comprehensive description that provides detailed information about the test page content and helps with SEO optimization.',
        openGraph: {
          title: 'Test Page - Great SEO Title',
          description: 'Comprehensive description for Open Graph',
          type: 'website',
          url: 'https://example.com/test',
          siteName: 'Test Site',
          locale: 'ko_KR',
          images: [
            {
              url: 'https://example.com/og-image.png',
              width: 1200,
              height: 630,
              alt: 'Test OG Image',
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Test Page',
          description: 'Description for Twitter',
          images: ['https://example.com/twitter-image.png'],
        },
        robots: {
          index: true,
          follow: true,
        },
        alternates: {
          canonical: 'https://example.com/test',
        },
      };

      const result = validateMetadata(metadata);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.score).toBeGreaterThanOrEqual(90);
    });

    it('should detect missing title', () => {
      const metadata: Metadata = {
        description: 'Description without title',
      };

      const result = validateMetadata(metadata);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is missing');
      expect(result.details.title?.present).toBe(false);
    });

    it('should detect missing description', () => {
      const metadata: Metadata = {
        title: 'Title without description',
      };

      const result = validateMetadata(metadata);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description is missing');
      expect(result.details.description?.present).toBe(false);
    });

    it('should validate title template object', () => {
      const metadata: Metadata = {
        title: {
          default: 'Default Title for SEO Testing and Validation',
          template: '%s | Site Name',
        },
        description: 'This is a good description that meets the minimum length requirements for optimal SEO performance and user experience.',
      };

      const result = validateMetadata(metadata);
      
      expect(result.details.title?.present).toBe(true);
      expect(result.details.title?.valid).toBe(true);
    });

    it('should warn about short title', () => {
      const metadata: Metadata = {
        title: 'Short',
        description: 'A comprehensive description that provides enough context and information to help search engines understand the page content properly.',
      };

      const result = validateMetadata(metadata);
      
      expect(result.warnings).toContain('Title is too short (< 30 characters)');
      expect(result.details.title?.suggestions).toContain('Aim for 50-60 characters for optimal display');
    });

    it('should warn about long title', () => {
      const metadata: Metadata = {
        title: 'This is a very long title that exceeds the recommended character limit',
        description: 'Good description that meets all the requirements for proper SEO optimization and provides valuable information to users.',
      };

      const result = validateMetadata(metadata);
      
      expect(result.warnings).toContain('Title is too long (> 60 characters)');
      expect(result.details.title?.suggestions).toContain('Title may be truncated in search results');
    });

    it('should warn about short description', () => {
      const metadata: Metadata = {
        title: 'Good Title That Meets Length Requirements',
        description: 'Too short',
      };

      const result = validateMetadata(metadata);
      
      expect(result.warnings).toContain('Description is too short (< 120 characters)');
    });

    it('should warn about missing Open Graph', () => {
      const metadata: Metadata = {
        title: 'Title Without Social Media Optimization Tags',
        description: 'Description that lacks Open Graph metadata which is important for social media sharing and preview generation.',
      };

      const result = validateMetadata(metadata);
      
      expect(result.warnings).toContain('Open Graph metadata is missing');
      expect(result.details.openGraph?.present).toBe(false);
    });

    it('should detect incomplete Open Graph', () => {
      const metadata: Metadata = {
        title: 'Title With Incomplete Open Graph Metadata',
        description: 'Description with incomplete Open Graph tags that will result in suboptimal social media sharing experience.',
        openGraph: {
          type: 'website',
        },
      };

      const result = validateMetadata(metadata);
      
      expect(result.details.openGraph?.issues).toContain('Open Graph title is missing');
      expect(result.details.openGraph?.issues).toContain('Open Graph description is missing');
      expect(result.details.openGraph?.issues).toContain('Open Graph image is missing');
    });
  });

  describe('validateJsonLd', () => {
    it('should validate Organization JSON-LD', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Test Organization',
        url: 'https://example.com',
        logo: 'https://example.com/logo.png',
      };

      const result = validateJsonLd(jsonLd);
      
      expect(result.valid).toBe(true);
      expect(result.present).toBe(true);
      expect(result.issues).toBeUndefined();
    });

    it('should validate JobPosting JSON-LD', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: 'Test Job',
        description: 'Job description',
        datePosted: '2024-01-01',
        validThrough: '2024-12-31',
      };

      const result = validateJsonLd(jsonLd);
      
      expect(result.valid).toBe(true);
      expect(result.present).toBe(true);
    });

    it('should validate LocalBusiness JSON-LD', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Test Business',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'KR',
          addressLocality: 'Seoul',
        },
      };

      const result = validateJsonLd(jsonLd);
      
      expect(result.valid).toBe(true);
      expect(result.present).toBe(true);
    });

    it('should detect missing @context', () => {
      const jsonLd = {
        '@type': 'Organization',
        name: 'Test',
      };

      const result = validateJsonLd(jsonLd);
      
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('JSON-LD missing @context');
    });

    it('should detect missing @type', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        name: 'Test',
      };

      const result = validateJsonLd(jsonLd);
      
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('JSON-LD missing @type');
    });

    it('should detect missing Organization fields', () => {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
      };

      const result = validateJsonLd(jsonLd);
      
      expect(result.valid).toBe(false);
      expect(result.issues).toContain('Organization missing name');
      expect(result.issues).toContain('Organization missing url');
    });
  });

  describe('generateSEOReport', () => {
    it('should generate comprehensive report', () => {
      const validationResult = {
        isValid: true,
        errors: [],
        warnings: ['Test warning'],
        score: 95,
        details: {
          title: {
            present: true,
            valid: true,
            value: 'Test Title',
          },
        },
      };

      const report = generateSEOReport(validationResult);
      
      expect(report).toContain('SEO Validation Report');
      expect(report).toContain('Overall Score: 95/100');
      expect(report).toContain('Status: ✅ PASSED');
      expect(report).toContain('WARNINGS');
      expect(report).toContain('Test warning');
    });

    it('should show failures in report', () => {
      const validationResult = {
        isValid: false,
        errors: ['Critical error 1', 'Critical error 2'],
        warnings: [],
        score: 45,
        details: {},
      };

      const report = generateSEOReport(validationResult);
      
      expect(report).toContain('Status: ❌ FAILED');
      expect(report).toContain('ERRORS');
      expect(report).toContain('Critical error 1');
      expect(report).toContain('Critical error 2');
    });

    it('should show success message when no issues', () => {
      const validationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        score: 100,
        details: {},
      };

      const report = generateSEOReport(validationResult);
      
      expect(report).toContain('No issues found');
      expect(report).toContain('Great job');
    });
  });
});
