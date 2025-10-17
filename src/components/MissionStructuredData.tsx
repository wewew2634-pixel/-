'use client';

/**
 * Mission Structured Data Component
 * 
 * Adds JSON-LD structured data for better SEO and rich snippets.
 * Renders schema.org JobPosting and LocalBusiness markup.
 */

import React from 'react';
import { JsonLd, generateJobPostingJsonLd, generateLocalBusinessJsonLd } from '@/lib/metadata';
import type { Mission } from '@/types/mission.types';

interface MissionStructuredDataProps {
  mission: Mission;
}

export function MissionStructuredData({ mission }: MissionStructuredDataProps) {
  // Generate JobPosting structured data
  const jobPostingData = generateJobPostingJsonLd({
    title: mission.title,
    description: mission.description,
    datePosted: mission.createdAt,
    validThrough: mission.deadline,
    baseSalary: mission.reward.amount,
    location: mission.location.address,
  });

  // Generate LocalBusiness structured data for the merchant
  const localBusinessData = generateLocalBusinessJsonLd({
    name: mission.merchant.name,
    description: `${mission.merchant.name}의 미션: ${mission.title}`,
    address: mission.location.address,
    rating: mission.merchant.rating,
    reviewCount: mission.merchant.reviewCount,
  });

  return (
    <>
      <JsonLd data={jobPostingData} />
      <JsonLd data={localBusinessData} />
    </>
  );
}
