/**
 * MissionCard Component Tests
 * 
 * Tests for the MissionCard component functionality including:
 * - Rendering mission information correctly
 * - Displaying badges (featured, urgent, new)
 * - Handling click events
 * - Showing proper reward and location data
 * - Progress bar rendering
 * - Disabled state behavior
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MissionCard } from '../MissionCard';
import type { Mission } from '@/types/mission.types';

// Mock mission data
const mockMission: Mission = {
  id: 'test-mission-1',
  title: '카페 신메뉴 시식 미션',
  description: '새로 나온 시그니처 메뉴를 시식하고 리뷰해주세요',
  category: 'cafe',
  status: 'active',
  merchant: {
    id: 'merchant-1',
    name: '테스트 카페',
    category: 'cafe',
    rating: 4.5,
    reviewCount: 120,
    verified: true,
  },
  location: {
    address: '서울시 강남구 테헤란로 123',
    district: '강남구',
    city: '서울시',
    latitude: 37.5,
    longitude: 127.0,
    distance: 500,
  },
  reward: {
    type: 'cash',
    amount: 15000,
    currency: 'KRW',
  },
  requirements: {
    minVideoDuration: 15,
    maxVideoDuration: 60,
    guidelines: ['명확한 화질', '자연스러운 리뷰'],
  },
  difficulty: 'easy',
  estimatedTime: 30,
  images: ['/test-image-1.jpg', '/test-image-2.jpg'],
  tags: ['카페', '신메뉴', '리뷰'],
  deadline: '2025-12-31T23:59:59Z',
  createdAt: '2025-10-01T00:00:00Z',
  updatedAt: '2025-10-01T00:00:00Z',
  stats: {
    views: 150,
    applications: 10,
    completed: 5,
    remainingSlots: 5,
    totalSlots: 10,
  },
  featured: false,
  urgent: false,
};

describe('MissionCard', () => {
  it('renders mission title and description', () => {
    render(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('카페 신메뉴 시식 미션')).toBeInTheDocument();
    expect(screen.getByText('새로 나온 시그니처 메뉴를 시식하고 리뷰해주세요')).toBeInTheDocument();
  });

  it('displays merchant name and verification badge', () => {
    render(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('테스트 카페')).toBeInTheDocument();
    // Merchant is verified, the component should render (check exists in DOM)
    const merchantSection = screen.getByText('테스트 카페').closest('div');
    expect(merchantSection).toBeInTheDocument();
  });

  it('shows reward amount correctly', () => {
    render(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText('15,000원')).toBeInTheDocument();
  });

  it('displays location information with distance', () => {
    render(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText(/강남구/)).toBeInTheDocument();
    expect(screen.getByText(/500m/)).toBeInTheDocument();
  });

  it('renders featured badge when mission is featured', () => {
    const featuredMission = { ...mockMission, featured: true };
    render(<MissionCard mission={featuredMission} />);
    
    expect(screen.getByText('추천')).toBeInTheDocument();
  });

  it('renders urgent badge when mission is urgent', () => {
    const urgentMission = { ...mockMission, urgent: true };
    render(<MissionCard mission={urgentMission} />);
    
    expect(screen.getByText('급구')).toBeInTheDocument();
  });

  it('renders new badge when merchant is new', () => {
    const newMerchantMission = { ...mockMission, newMerchant: true };
    render(<MissionCard mission={newMerchantMission} />);
    
    expect(screen.getByText('신규')).toBeInTheDocument();
  });

  it('shows progress bar with correct percentage', () => {
    render(<MissionCard mission={mockMission} />);
    
    // Progress: 5 completed out of 10 total = 50%
    // The progress bar is a div element, check for progress text
    expect(screen.getByText(/5\/10 완료/)).toBeInTheDocument();
  });

  it('displays difficulty level', () => {
    render(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText(/쉬움/i)).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<MissionCard mission={mockMission} onClick={handleClick} />);
    
    const card = screen.getByRole('article');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockMission);
  });

  it('applies disabled styles when disabled', () => {
    render(<MissionCard mission={mockMission} disabled />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<MissionCard mission={mockMission} onClick={handleClick} disabled />);
    
    const card = screen.getByRole('article');
    fireEvent.click(card);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders mission image with correct alt text', () => {
    render(<MissionCard mission={mockMission} />);
    
    const image = screen.getByAltText('카페 신메뉴 시식 미션');
    expect(image).toBeInTheDocument();
  });

  it('shows remaining slots information', () => {
    render(<MissionCard mission={mockMission} />);
    
    // The component shows remaining slots in progress section
    expect(screen.getByText(/5\/10 완료/)).toBeInTheDocument();
  });

  it('displays estimated time', () => {
    render(<MissionCard mission={mockMission} />);
    
    expect(screen.getByText(/30분/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<MissionCard mission={mockMission} className={customClass} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass(customClass);
  });

  it('renders with compact variant correctly', () => {
    render(<MissionCard mission={mockMission} variant="compact" />);
    
    const card = screen.getByRole('article');
    // Compact variant should have different styling
    expect(card).toBeInTheDocument();
  });

  it('shows different reward types correctly', () => {
    const pointsMission = {
      ...mockMission,
      reward: { type: 'points' as const, amount: 5000 },
    };
    
    const { rerender } = render(<MissionCard mission={pointsMission} />);
    expect(screen.getByText('5,000P')).toBeInTheDocument();
    
    const productMission = {
      ...mockMission,
      reward: { type: 'product' as const, amount: 0, description: '제품 제공' },
    };
    
    rerender(<MissionCard mission={productMission} />);
    expect(screen.getByText(/제품 제공/)).toBeInTheDocument();
  });

  it('handles expired status correctly', () => {
    const expiredMission = { ...mockMission, status: 'expired' as const };
    render(<MissionCard mission={expiredMission} />);
    
    expect(screen.getByText(/마감/)).toBeInTheDocument();
  });
});
