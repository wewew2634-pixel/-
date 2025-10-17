/**
 * Mission Types
 * 
 * Type definitions for mission-related data structures.
 * Supports creator mission browsing, filtering, and participation.
 */

export type MissionStatus = 'active' | 'completed' | 'expired' | 'pending';
export type MissionCategory = 'food' | 'cafe' | 'activity' | 'shopping' | 'beauty' | 'etc';
export type RewardType = 'cash' | 'points' | 'product' | 'discount';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Merchant (Business) Profile
 */
export interface Merchant {
  id: string;
  name: string;
  category: MissionCategory;
  logo?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

/**
 * Location Information
 */
export interface Location {
  address: string;
  district: string; // 구/군
  city: string; // 시/도
  latitude: number;
  longitude: number;
  distance?: number; // Distance from user (in meters)
}

/**
 * Reward Information
 */
export interface Reward {
  type: RewardType;
  amount: number;
  currency?: string; // KRW, USD, etc.
  description?: string;
}

/**
 * Mission Requirements
 */
export interface MissionRequirements {
  minVideoDuration: number; // seconds
  maxVideoDuration: number; // seconds
  requiredShots?: string[]; // e.g., ['exterior', 'interior', 'product']
  guidelines?: string[];
  prohibited?: string[];
}

/**
 * Mission Statistics
 */
export interface MissionStats {
  views: number;
  applications: number;
  completed: number;
  remainingSlots: number;
  totalSlots: number;
}

/**
 * Main Mission Interface
 */
export interface Mission {
  id: string;
  merchant: Merchant;
  title: string;
  description: string;
  category: MissionCategory;
  status: MissionStatus;
  
  location: Location;
  reward: Reward;
  requirements: MissionRequirements;
  
  difficulty: DifficultyLevel;
  estimatedTime: number; // minutes
  
  images: string[];
  tags: string[];
  
  deadline: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  
  stats: MissionStats;
  
  featured?: boolean;
  urgent?: boolean;
  newMerchant?: boolean;
}

/**
 * Mission Filter Options
 */
export interface MissionFilters {
  category?: MissionCategory | 'all';
  status?: MissionStatus[];
  difficulty?: DifficultyLevel[];
  rewardType?: RewardType[];
  minReward?: number;
  maxReward?: number;
  maxDistance?: number; // meters
  search?: string;
  sortBy?: 'newest' | 'reward' | 'distance' | 'popular' | 'deadline';
  featured?: boolean;
  urgent?: boolean;
}

/**
 * Mission List Response
 */
export interface MissionListResponse {
  missions: Mission[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Creator Mission Application
 */
export interface MissionApplication {
  id: string;
  missionId: string;
  creatorId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'submitted';
  appliedAt: string;
  completedAt?: string;
  videoUrl?: string;
  notes?: string;
}
