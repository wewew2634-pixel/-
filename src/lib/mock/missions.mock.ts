/**
 * Mission Mock Data Generator
 * 
 * Generates realistic mock mission data for development and testing.
 * Creates 100 diverse missions with Korean business names and locations.
 */

import type {
  Mission,
  MissionCategory,
  MissionStatus,
  DifficultyLevel,
  RewardType,
} from '@/types/mission.types';

// Korean business names by category
const businessNames: Record<MissionCategory, string[]> = {
  food: [
    '맛있는집', '삼겹살나라', '치킨마을', '피자천국', '한우명가',
    '김밥천국', '떡볶이타운', '국밥전문점', '회전초밥', '일식당',
    '중식당', '양식레스토랑', '한식뷔페', '분식전문점', '족발보쌈',
  ],
  cafe: [
    '카페라떼', '커피빈', '스타벅스', '투썸플레이스', '이디야커피',
    '카페베네', '할리스', '폴바셋', '탐앤탐스', '파스쿠찌',
    '엔제리너스', '커피베이', '드롭탑', '메가커피', '빽다방',
  ],
  activity: [
    '헬스클럽', '요가센터', '필라테스', '클라이밍짐', '볼링장',
    '당구장', '노래방', 'PC방', '스크린골프', '배드민턴장',
    '탁구장', '수영장', '테니스장', '스쿼시장', '복싱짐',
  ],
  shopping: [
    '패션몰', '신발가게', '가방숍', '액세서리샵', '화장품가게',
    '문구점', '서점', '꽃집', '인테리어샵', '가전제품',
    '핸드폰매장', '안경원', '시계가게', '보석상', '잡화점',
  ],
  beauty: [
    '헤어살롱', '네일샵', '피부관리실', '눈썹문신', '속눈썹연장',
    '왁싱샵', '마사지', '스파', '피팅모델', '메이크업샵',
    '성형외과', '피부과', '치과', '한의원', '요가원',
  ],
  etc: [
    '스터디카페', '공유오피스', '세탁소', '편의점', '약국',
    '안마의자', '동물병원', '애견샵', '자동차정비', '주유소',
    '세차장', '렌터카', '부동산', '학원', '도서관',
  ],
};

// Seoul districts (구)
const seoulDistricts = [
  '강남구', '강동구', '강북구', '강서구', '관악구',
  '광진구', '구로구', '금천구', '노원구', '도봉구',
  '동대문구', '동작구', '마포구', '서대문구', '서초구',
  '성동구', '성북구', '송파구', '양천구', '영등포구',
  '용산구', '은평구', '종로구', '중구', '중랑구',
];

// Sample image URLs (using placeholder images)
const sampleImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
];

// Tag samples by category
const tagsByCategory: Record<MissionCategory, string[]> = {
  food: ['맛집', '신메뉴', '할인', '배달', '포장'],
  cafe: ['카페', '디저트', '브런치', '테이크아웃', '분위기'],
  activity: ['운동', '취미', '레저', '체험', '건강'],
  shopping: ['쇼핑', '할인', '신상', '브랜드', '세일'],
  beauty: ['뷰티', '케어', '관리', '시술', '예약'],
  etc: ['서비스', '편의', '생활', '추천', '이용'],
};

/**
 * Generate random number between min and max
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random item from array
 */
function randomItem<T>(array: T[]): T {
  const item = array[Math.floor(Math.random() * array.length)];
  if (item === undefined) {
    throw new Error('Array is empty');
  }
  return item;
}

/**
 * Generate random date within range
 */
function randomDate(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(1, daysAhead));
  return date.toISOString();
}

/**
 * Generate a single mock mission
 */
function generateMission(id: number): Mission {
  const category = randomItem<MissionCategory>([
    'food',
    'cafe',
    'activity',
    'shopping',
    'beauty',
    'etc',
  ]);
  
  const merchantName = randomItem(businessNames[category]);
  const district = randomItem(seoulDistricts);
  const difficulty = randomItem<DifficultyLevel>(['easy', 'medium', 'hard']);
  const rewardType = randomItem<RewardType>(['cash', 'points', 'product', 'discount']);
  
  // Generate reward amount based on type and difficulty
  let rewardAmount: number;
  if (rewardType === 'cash') {
    rewardAmount = difficulty === 'easy' ? randomInt(5000, 10000) :
                   difficulty === 'medium' ? randomInt(10000, 20000) :
                   randomInt(20000, 50000);
  } else if (rewardType === 'points') {
    rewardAmount = randomInt(1000, 5000);
  } else {
    rewardAmount = randomInt(10000, 30000);
  }
  
  const status = randomItem<MissionStatus>(['active', 'active', 'active', 'completed']);
  const totalSlots = randomInt(5, 20);
  const completed = status === 'completed' ? totalSlots : randomInt(0, totalSlots - 1);
  
  return {
    id: `mission-${id}`,
    merchant: {
      id: `merchant-${id}`,
      name: merchantName,
      category,
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
      reviewCount: randomInt(10, 500),
      verified: Math.random() > 0.3,
    },
    title: `${merchantName} 숏폼 영상 촬영 미션`,
    description: `${merchantName}의 매력을 담은 15초 숏폼 영상을 제작해주세요. ${category === 'food' ? '맛있는 음식과 분위기를 자연스럽게 담아주시면 됩니다.' : category === 'cafe' ? '카페의 아늑한 분위기와 시그니처 메뉴를 소개해주세요.' : '매장의 특징과 이용 방법을 재미있게 표현해주세요.'}`,
    category,
    status,
    location: {
      address: `서울특별시 ${district} ${randomItem(['역삼동', '신사동', '청담동', '삼성동', '대치동'])} ${randomInt(1, 999)}`,
      district,
      city: '서울특별시',
      latitude: 37.4979 + (Math.random() - 0.5) * 0.1,
      longitude: 127.0276 + (Math.random() - 0.5) * 0.1,
      distance: randomInt(100, 5000),
    },
    reward: {
      type: rewardType,
      amount: rewardAmount,
      currency: 'KRW',
      description: rewardType === 'product' ? '제품 무료 제공' :
                   rewardType === 'discount' ? `${rewardAmount}원 할인 쿠폰` :
                   undefined,
    },
    requirements: {
      minVideoDuration: 10,
      maxVideoDuration: 30,
      requiredShots: ['외관', '내부', '메뉴/제품'],
      guidelines: [
        '밝고 선명한 화질로 촬영해주세요',
        '자연스러운 분위기를 담아주세요',
        'BGM은 저작권 없는 음악을 사용해주세요',
      ],
      prohibited: [
        '경쟁사 언급 금지',
        '과도한 편집 효과 자제',
      ],
    },
    difficulty,
    estimatedTime: difficulty === 'easy' ? randomInt(30, 60) :
                    difficulty === 'medium' ? randomInt(60, 120) :
                    randomInt(120, 180),
    images: Array.from({ length: randomInt(1, 3) }, () => randomItem(sampleImages)),
    tags: Array.from({ length: randomInt(2, 4) }, () => randomItem(tagsByCategory[category])),
    deadline: randomDate(30),
    createdAt: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    stats: {
      views: randomInt(10, 1000),
      applications: completed + randomInt(0, 5),
      completed,
      remainingSlots: totalSlots - completed,
      totalSlots,
    },
    featured: Math.random() > 0.85,
    urgent: Math.random() > 0.9,
    newMerchant: Math.random() > 0.8,
  };
}

/**
 * Generate array of mock missions
 */
export function generateMockMissions(count: number = 100): Mission[] {
  return Array.from({ length: count }, (_, i) => generateMission(i + 1));
}

/**
 * Pre-generated 100 missions for consistent data
 */
export const MOCK_MISSIONS = generateMockMissions(100);

/**
 * Get paginated missions
 */
export function getPaginatedMissions(
  page: number = 1,
  pageSize: number = 10
): {
  missions: Mission[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
} {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const missions = MOCK_MISSIONS.slice(startIndex, endIndex);
  
  return {
    missions,
    total: MOCK_MISSIONS.length,
    page,
    pageSize,
    hasMore: endIndex < MOCK_MISSIONS.length,
  };
}

/**
 * Get mission by ID
 */
export function getMissionById(id: string): Mission | undefined {
  return MOCK_MISSIONS.find((mission) => mission.id === id);
}

/**
 * Filter missions
 */
export function filterMissions(
  filters: {
    category?: string;
    status?: MissionStatus[];
    search?: string;
    minReward?: number;
    maxDistance?: number;
  }
): Mission[] {
  let filtered = [...MOCK_MISSIONS];
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((m) => m.category === filters.category);
  }
  
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((m) => filters.status!.includes(m.status));
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(search) ||
        m.merchant.name.toLowerCase().includes(search) ||
        m.description.toLowerCase().includes(search)
    );
  }
  
  if (filters.minReward) {
    filtered = filtered.filter((m) => m.reward.amount >= filters.minReward!);
  }
  
  if (filters.maxDistance) {
    filtered = filtered.filter((m) => (m.location.distance || 0) <= filters.maxDistance!);
  }
  
  return filtered;
}
