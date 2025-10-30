/**
 * Core Types for JJIKMEOK Platform
 */

// ============================================================================
// User & Auth Types
// ============================================================================

export type UserRole = 'creator' | 'merchant' | 'admin';

export type AuthProvider = 'tiktok' | 'youtube' | 'instagram' | 'email';

export interface User {
  id: string;
  role: UserRole;
  email?: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatorProfile extends User {
  role: 'creator';
  socialAccounts: SocialAccount[];
  categories: CreatorCategory[];
  location: Location;
  stats: CreatorStats;
  portfolio: PortfolioItem[];
  verified: boolean;
  tier: 'nano' | 'micro' | 'mid' | 'macro';
}

export interface MerchantProfile extends User {
  role: 'merchant';
  businessName: string;
  businessNumber: string; // 사업자등록번호
  businessType: string;
  location: Location;
  verified: boolean;
}

// ============================================================================
// Social Account Types
// ============================================================================

export interface SocialAccount {
  platform: 'tiktok' | 'youtube' | 'instagram';
  platformId: string;
  username: string;
  displayName: string;
  profileUrl: string;
  avatarUrl?: string;
  followerCount: number;
  verified: boolean;
  stats: SocialStats;
  connectedAt: Date;
}

export interface SocialStats {
  posts: number;
  followers: number;
  following: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  engagementRate: number; // percentage
  lastUpdated: Date;
}

// ============================================================================
// Location Types
// ============================================================================

export interface Location {
  address: string;
  addressDetail?: string;
  city: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius?: number; // in meters, for search
}

// ============================================================================
// Category Types
// ============================================================================

export type CreatorCategory =
  | 'food'
  | 'beauty'
  | 'fashion'
  | 'lifestyle'
  | 'travel'
  | 'fitness'
  | 'tech'
  | 'entertainment'
  | 'education'
  | 'other';

export const CREATOR_CATEGORIES: Record<CreatorCategory, string> = {
  food: '맛집',
  beauty: '뷰티',
  fashion: '패션',
  lifestyle: '라이프스타일',
  travel: '여행',
  fitness: '운동',
  tech: '테크',
  entertainment: '엔터테인먼트',
  education: '교육',
  other: '기타',
};

// ============================================================================
// Offer Types
// ============================================================================

export type OfferStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Offer {
  id: string;
  merchantId: string;
  merchant: MerchantProfile;
  title: string;
  description: string;
  category: CreatorCategory;
  location: Location;
  reward: number; // in KRW
  requirements: OfferRequirements;
  guidelines: string[];
  examples?: string[]; // URLs to example videos
  status: OfferStatus;
  slots: number; // total slots
  slotsAvailable: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfferRequirements {
  minFollowers: number;
  preferredPlatforms: ('tiktok' | 'youtube' | 'instagram')[];
  preferredCategories: CreatorCategory[];
  videoLength: number; // in seconds
  mustInclude: string[]; // hashtags, mentions, etc.
}

// ============================================================================
// Mission Types
// ============================================================================

export type MissionStatus =
  | 'pending' // creator accepted, not started
  | 'in_progress' // filming in progress
  | 'submitted' // video submitted, awaiting verification
  | 'verified' // auto-verified by AI
  | 'approved' // manually approved by merchant
  | 'rejected' // rejected by merchant
  | 'completed' // payment processed
  | 'failed'; // failed verification

export interface Mission {
  id: string;
  offerId: string;
  offer: Offer;
  creatorId: string;
  creator: CreatorProfile;
  status: MissionStatus;
  video?: MissionVideo;
  proof?: MissionProof;
  feedback?: string;
  reward: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface MissionVideo {
  url: string;
  thumbnailUrl: string;
  duration: number;
  platform: 'tiktok' | 'youtube' | 'instagram';
  platformUrl?: string;
  uploadedAt: Date;
  aiScore?: number; // 0-100, from AI analysis
  aiAnalysis?: {
    quality: number;
    guidelinesFollowed: boolean;
    detectedElements: string[];
  };
}

export interface MissionProof {
  type: 'screenshot' | 'link' | 'ai';
  screenshots?: string[];
  link?: string;
  verifiedAt: Date;
  verificationMethod: 'ocr' | 'api' | 'manual';
  followerCount?: number;
  viewCount?: number;
  likeCount?: number;
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 't0' | 't1'; // T+0 (same day) or T+1 (next day)

export interface Payment {
  id: string;
  missionId: string;
  creatorId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  bankAccount?: BankAccount;
  processedAt?: Date;
  completedAt?: Date;
  failReason?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

// ============================================================================
// Stats & Analytics Types
// ============================================================================

export interface CreatorStats {
  totalMissions: number;
  completedMissions: number;
  successRate: number; // percentage
  totalEarnings: number;
  averageRating: number;
  responseTime: number; // in hours
  categories: CreatorCategory[];
}

export interface MerchantStats {
  totalOffers: number;
  activeOffers: number;
  totalMissions: number;
  completedMissions: number;
  totalSpent: number;
  averageROI: number; // percentage
  topCategories: CreatorCategory[];
}

// ============================================================================
// Portfolio Types
// ============================================================================

export interface PortfolioItem {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  platform: 'tiktok' | 'youtube' | 'instagram';
  platformUrl: string;
  views: number;
  likes: number;
  comments: number;
  category: CreatorCategory;
  createdAt: Date;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | 'offer_new'
  | 'offer_accepted'
  | 'mission_started'
  | 'mission_submitted'
  | 'mission_verified'
  | 'mission_approved'
  | 'mission_rejected'
  | 'payment_processed'
  | 'message_received';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
