/**
 * SEO Validation Utilities
 * 
 * Comprehensive validation for metadata, JSON-LD, and SEO best practices.
 * Helps ensure all pages meet SEO requirements before deployment.
 */

import type { Metadata } from 'next';

export interface SEOValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
  details: {
    title?: SEOFieldValidation;
    description?: SEOFieldValidation;
    openGraph?: SEOFieldValidation;
    twitter?: SEOFieldValidation;
    jsonLd?: SEOFieldValidation;
    images?: SEOFieldValidation;
    robots?: SEOFieldValidation;
    canonical?: SEOFieldValidation;
  };
}

export interface SEOFieldValidation {
  present: boolean;
  valid: boolean;
  value?: any;
  issues?: string[];
  suggestions?: string[];
}

/**
 * Validate metadata object
 */
export function validateMetadata(metadata: Metadata): SEOValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const details: SEOValidationResult['details'] = {};
  let score = 100;

  // Title validation
  const titleValidation = validateTitle(metadata.title);
  details.title = titleValidation;
  if (!titleValidation.valid) {
    if (titleValidation.issues) {
      // Separate critical errors from warnings based on content
      titleValidation.issues.forEach(issue => {
        if (issue.includes('missing') || issue.includes('empty') || issue.includes('invalid')) {
          errors.push(issue);
          score -= 15;
        } else {
          warnings.push(issue);
          score -= 5;
        }
      });
    }
  }

  // Description validation
  const descriptionValidation = validateDescription(metadata.description ?? undefined);
  details.description = descriptionValidation;
  if (!descriptionValidation.valid) {
    if (descriptionValidation.issues) {
      // Separate critical errors from warnings
      descriptionValidation.issues.forEach(issue => {
        if (issue.includes('missing') || issue.includes('empty')) {
          errors.push(issue);
          score -= 15;
        } else {
          warnings.push(issue);
          score -= 5;
        }
      });
    }
  }

  // Open Graph validation
  const ogValidation = validateOpenGraph(metadata.openGraph);
  details.openGraph = ogValidation;
  if (!ogValidation.valid) {
    if (ogValidation.issues) {
      warnings.push(...ogValidation.issues);
      score -= 10;
    }
  }

  // Twitter Card validation
  const twitterValidation = validateTwitterCard(metadata.twitter);
  details.twitter = twitterValidation;
  if (!twitterValidation.valid) {
    if (twitterValidation.issues) {
      warnings.push(...twitterValidation.issues);
      score -= 10;
    }
  }

  // Images validation
  const imagesValidation = validateImages(metadata);
  details.images = imagesValidation;
  if (!imagesValidation.valid) {
    if (imagesValidation.issues) {
      warnings.push(...imagesValidation.issues);
      score -= 5;
    }
  }

  // Robots validation
  const robotsValidation = validateRobots(metadata.robots);
  details.robots = robotsValidation;
  if (robotsValidation.warnings) {
    warnings.push(...robotsValidation.warnings);
  }

  // Canonical URL validation
  const canonicalValidation = validateCanonical(metadata.alternates);
  details.canonical = canonicalValidation;
  if (!canonicalValidation.valid) {
    if (canonicalValidation.issues) {
      warnings.push(...canonicalValidation.issues);
      score -= 5;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
    details,
  };
}

/**
 * Validate title
 */
function validateTitle(title: Metadata['title']): SEOFieldValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!title) {
    issues.push('Title is missing');
    return { present: false, valid: false, issues, suggestions };
  }

  let titleString: string;
  
  if (typeof title === 'string') {
    titleString = title;
  } else if (typeof title === 'object' && title !== null) {
    if ('default' in title) {
      titleString = title.default;
    } else if ('absolute' in title) {
      titleString = title.absolute || '';
    } else {
      issues.push('Title object must have "default" or "absolute" property');
      return { present: true, valid: false, value: title, issues, suggestions };
    }
  } else {
    issues.push('Title has invalid type');
    return { present: true, valid: false, value: title, issues, suggestions };
  }

  // Length validation
  if (titleString.length < 30) {
    issues.push('Title is too short (< 30 characters)');
    suggestions.push('Aim for 50-60 characters for optimal display');
  } else if (titleString.length > 60) {
    issues.push('Title is too long (> 60 characters)');
    suggestions.push('Title may be truncated in search results');
  }

  // Content validation
  if (!titleString.trim()) {
    issues.push('Title is empty');
  }

  const valid = issues.length === 0;
  
  return {
    present: true,
    valid,
    value: titleString,
    issues: issues.length > 0 ? issues : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validate description
 */
function validateDescription(description: string | undefined): SEOFieldValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!description) {
    issues.push('Description is missing');
    return { present: false, valid: false, issues, suggestions };
  }

  if (description.length < 120) {
    issues.push('Description is too short (< 120 characters)');
    suggestions.push('Aim for 150-160 characters for optimal display');
  } else if (description.length > 160) {
    issues.push('Description is too long (> 160 characters)');
    suggestions.push('Description may be truncated in search results');
  }

  if (!description.trim()) {
    issues.push('Description is empty');
  }

  const valid = issues.length === 0;
  
  return {
    present: true,
    valid,
    value: description,
    issues: issues.length > 0 ? issues : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validate Open Graph metadata
 */
function validateOpenGraph(og: Metadata['openGraph']): SEOFieldValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!og) {
    issues.push('Open Graph metadata is missing');
    suggestions.push('Add Open Graph tags for better social media sharing');
    return { present: false, valid: false, issues, suggestions };
  }

  // Check required OG fields
  if (typeof og === 'object') {
    if (!og.title) issues.push('Open Graph title is missing');
    if (!og.description) issues.push('Open Graph description is missing');
    if (!og.images || (Array.isArray(og.images) && og.images.length === 0)) {
      issues.push('Open Graph image is missing');
    }
    if (!og.url) issues.push('Open Graph URL is missing');
    // Note: type property is not available in Next.js 15 OpenGraph type
    if (!og.siteName) issues.push('Open Graph siteName is missing');
    if (!og.locale) issues.push('Open Graph locale is missing');
  }

  const valid = issues.length === 0;
  
  return {
    present: true,
    valid,
    value: og,
    issues: issues.length > 0 ? issues : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validate Twitter Card metadata
 */
function validateTwitterCard(twitter: Metadata['twitter']): SEOFieldValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!twitter) {
    issues.push('Twitter Card metadata is missing');
    suggestions.push('Add Twitter Card tags for better Twitter sharing');
    return { present: false, valid: false, issues, suggestions };
  }

  if (typeof twitter === 'object') {
    // Note: card property is not available in Next.js 15 Twitter type
    if (!twitter.title) issues.push('Twitter title is missing');
    if (!twitter.description) issues.push('Twitter description is missing');
    if (!twitter.images || (Array.isArray(twitter.images) && twitter.images.length === 0)) {
      issues.push('Twitter image is missing');
    }
  }

  const valid = issues.length === 0;
  
  return {
    present: true,
    valid,
    value: twitter,
    issues: issues.length > 0 ? issues : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validate images
 */
function validateImages(metadata: Metadata): SEOFieldValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  const ogImages = metadata.openGraph && typeof metadata.openGraph === 'object' 
    ? metadata.openGraph.images 
    : null;
  
  const twitterImages = metadata.twitter && typeof metadata.twitter === 'object' 
    ? metadata.twitter.images 
    : null;

  if (!ogImages && !twitterImages) {
    issues.push('No social media images defined');
    return { present: false, valid: false, issues, suggestions };
  }

  // Check OG image dimensions
  if (ogImages && Array.isArray(ogImages)) {
    const firstImage = ogImages[0];
    if (typeof firstImage === 'object' && 'width' in firstImage && 'height' in firstImage) {
      if (firstImage.width !== 1200 || firstImage.height !== 630) {
        issues.push('Open Graph image dimensions should be 1200x630 for optimal display');
      }
    } else {
      suggestions.push('Specify image dimensions (width/height) for better rendering');
    }
  }

  const valid = issues.length === 0;
  
  return {
    present: true,
    valid,
    value: { openGraph: ogImages, twitter: twitterImages },
    issues: issues.length > 0 ? issues : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validate robots metadata
 */
function validateRobots(robots: Metadata['robots']): SEOFieldValidation & { warnings?: string[] } {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  if (!robots) {
    suggestions.push('Consider adding robots metadata for explicit indexing control');
    return { present: false, valid: true, suggestions };
  }

  if (typeof robots === 'object') {
    if (robots.index === false || robots.follow === false) {
      warnings.push('Page is configured to not be indexed or followed by search engines');
    }
  }

  return {
    present: true,
    valid: true,
    value: robots,
    warnings: warnings.length > 0 ? warnings : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validate canonical URL
 */
function validateCanonical(alternates: Metadata['alternates']): SEOFieldValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!alternates || !alternates.canonical) {
    issues.push('Canonical URL is missing');
    suggestions.push('Add canonical URL to prevent duplicate content issues');
    return { present: false, valid: false, issues, suggestions };
  }

  const valid = issues.length === 0;
  
  return {
    present: true,
    valid,
    value: alternates.canonical,
    issues: issues.length > 0 ? issues : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validate JSON-LD structured data
 */
export function validateJsonLd(jsonLd: Record<string, any>): SEOFieldValidation {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  if (!jsonLd || typeof jsonLd !== 'object') {
    issues.push('JSON-LD data is missing or invalid');
    return { present: false, valid: false, issues, suggestions };
  }

  // Check for required schema.org properties
  if (!jsonLd['@context']) {
    issues.push('JSON-LD missing @context');
  } else if (jsonLd['@context'] !== 'https://schema.org') {
    issues.push('JSON-LD @context should be https://schema.org');
  }

  if (!jsonLd['@type']) {
    issues.push('JSON-LD missing @type');
  }

  // Type-specific validation
  if (jsonLd['@type'] === 'Organization') {
    if (!jsonLd.name) issues.push('Organization missing name');
    if (!jsonLd.url) issues.push('Organization missing url');
  } else if (jsonLd['@type'] === 'JobPosting') {
    if (!jsonLd.title) issues.push('JobPosting missing title');
    if (!jsonLd.description) issues.push('JobPosting missing description');
    if (!jsonLd.datePosted) issues.push('JobPosting missing datePosted');
  } else if (jsonLd['@type'] === 'LocalBusiness') {
    if (!jsonLd.name) issues.push('LocalBusiness missing name');
    if (!jsonLd.address) issues.push('LocalBusiness missing address');
  }

  const valid = issues.length === 0;
  
  return {
    present: true,
    valid,
    value: jsonLd,
    issues: issues.length > 0 ? issues : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Generate SEO report
 */
export function generateSEOReport(results: SEOValidationResult): string {
  const { isValid, errors, warnings, score, details } = results;
  
  let report = '📊 SEO Validation Report\n';
  report += '='.repeat(50) + '\n\n';
  
  report += `Overall Score: ${score}/100 ${getScoreEmoji(score)}\n`;
  report += `Status: ${isValid ? '✅ PASSED' : '❌ FAILED'}\n\n`;
  
  if (errors.length > 0) {
    report += '🔴 ERRORS (Critical Issues)\n';
    report += '-'.repeat(50) + '\n';
    errors.forEach((error, i) => {
      report += `${i + 1}. ${error}\n`;
    });
    report += '\n';
  }
  
  if (warnings.length > 0) {
    report += '🟡 WARNINGS (Recommendations)\n';
    report += '-'.repeat(50) + '\n';
    warnings.forEach((warning, i) => {
      report += `${i + 1}. ${warning}\n`;
    });
    report += '\n';
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    report += '✨ No issues found! Great job!\n\n';
  }
  
  // Detailed breakdown
  report += '📝 Detailed Breakdown\n';
  report += '-'.repeat(50) + '\n';
  
  Object.entries(details).forEach(([field, validation]) => {
    if (validation) {
      const status = validation.valid ? '✅' : '❌';
      const present = validation.present ? 'Present' : 'Missing';
      report += `${status} ${field}: ${present}\n`;
      
      if (validation.issues && validation.issues.length > 0) {
        validation.issues.forEach(issue => {
          report += `  - ${issue}\n`;
        });
      }
      
      if (validation.suggestions && validation.suggestions.length > 0) {
        validation.suggestions.forEach(suggestion => {
          report += `  💡 ${suggestion}\n`;
        });
      }
    }
  });
  
  return report;
}

function getScoreEmoji(score: number): string {
  if (score >= 90) return '🌟';
  if (score >= 75) return '👍';
  if (score >= 60) return '⚠️';
  return '❌';
}
