'use client';

import { useState } from 'react';
import Logo1stMinimal from '@/components/logos/Logo1stMinimal';
import Logo1stNeon from '@/components/logos/Logo1stNeon';
import Logo1stBrutal from '@/components/logos/Logo1stBrutal';
import Logo1stGradient from '@/components/logos/Logo1stGradient';
import Logo1st3D from '@/components/logos/Logo1st3D';
import Logo1stBadge from '@/components/logos/Logo1stBadge';
import Logo1stMotion from '@/components/logos/Logo1stMotion';
import Logo1stGlass from '@/components/logos/Logo1stGlass';
import Logo1stRetro from '@/components/logos/Logo1stRetro';
import Logo1stApp from '@/components/logos/Logo1stApp';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoConfig {
  id: string;
  name: string;
  style: string;
  font: string;
  description: string;
  component: React.ComponentType<any>;
  tags: string[];
  bestFor: string[];
  appStore: boolean;
}

const LOGOS: LogoConfig[] = [
  {
    id: '1st-minimal',
    name: 'Bold Minimalist',
    style: '대담한 미니멀',
    font: 'Poppins Bold',
    description: '극도로 깔끔한 기하학적 디자인. Sans-serif 폰트로 모던하고 프로페셔널',
    component: Logo1stMinimal,
    tags: ['미니멀', '깔끔', '모던'],
    bestFor: ['앱 아이콘', '프로필', '심플 브랜딩'],
    appStore: true,
  },
  {
    id: '1st-neon',
    name: 'Tech Neon',
    style: '네온 발광',
    font: 'Space Grotesk',
    description: '사이버펑크 감성의 네온 발광 효과. 다크모드에 완벽한 테크 브랜딩',
    component: Logo1stNeon,
    tags: ['네온', '테크', '사이버펑크'],
    bestFor: ['다크모드', '테크 브랜드', '게임'],
    appStore: false,
  },
  {
    id: '1st-brutal',
    name: 'Street Brutal',
    style: '스트릿 브루탈',
    font: 'Arial Black',
    description: '두꺼운 테두리와 오프셋 그림자. 성수동 로컬 힙한 감성 그대로',
    component: Logo1stBrutal,
    tags: ['브루탈', '스트릿', '힙'],
    bestFor: ['성수동 로컬', '스트릿 패션', '젊은 타겟'],
    appStore: true,
  },
  {
    id: '1st-gradient',
    name: 'Gradient Flow',
    style: '그라데이션 플로우',
    font: 'Inter',
    description: '복잡한 멀티 포인트 그라데이션. 유기적이고 흐르는 듯한 감성',
    component: Logo1stGradient,
    tags: ['그라데이션', '유기적', '소셜'],
    bestFor: ['인스타그램', '소셜미디어', '트렌디'],
    appStore: true,
  },
  {
    id: '1st-3d',
    name: '3D Isometric',
    style: '입체 아이소메트릭',
    font: 'Montserrat Bold',
    description: '3D 입체감 있는 아이소메트릭 디자인. 게임 감성',
    component: Logo1st3D,
    tags: ['3D', '입체', '게임'],
    bestFor: ['게임 앱', '3D 콘텐츠', '독특함'],
    appStore: true,
  },
  {
    id: '1st-badge',
    name: 'Stamp/Badge',
    style: '스탬프 배지',
    font: 'DM Sans Bold',
    description: '빈티지 스탬프 스타일. 원형 배지로 프리미엄 품질 강조',
    component: Logo1stBadge,
    tags: ['배지', '빈티지', '프리미엄'],
    bestFor: ['브랜딩', '상품 패키지', '인증'],
    appStore: false,
  },
  {
    id: '1st-motion',
    name: 'Dynamic Motion',
    style: '다이나믹 모션',
    font: 'Inter Black',
    description: '스피드 라인과 역동적인 움직임. 숏폼 비디오의 빠른 템포 표현',
    component: Logo1stMotion,
    tags: ['모션', '역동', '속도'],
    bestFor: ['숏폼 비디오', '동적 콘텐츠', '스포츠'],
    appStore: false,
  },
  {
    id: '1st-glass',
    name: 'Glassmorphism',
    style: '글라스모피즘',
    font: 'Poppins',
    description: '유리 효과와 반투명 레이어. iOS 스타일의 모던한 UI',
    component: Logo1stGlass,
    tags: ['글라스', '모던', 'iOS'],
    bestFor: ['모던 UI', 'iOS 앱', '프리미엄'],
    appStore: true,
  },
  {
    id: '1st-retro',
    name: 'Retro Future',
    style: '레트로 퓨처',
    font: 'Space Mono',
    description: '80s 레트로 감성과 미래적 요소의 조화. 유니크한 개성',
    component: Logo1stRetro,
    tags: ['레트로', '80s', '유니크'],
    bestFor: ['유니크 브랜딩', '빈티지', '아티스트'],
    appStore: false,
  },
  {
    id: '1st-app',
    name: 'App Icon Optimized',
    style: '앱 아이콘 최적화',
    font: 'SF Pro/System',
    description: '앱스토어 등록 최적화. 작은 사이즈에서도 명확한 인식',
    component: Logo1stApp,
    tags: ['앱 아이콘', '최적화', '공식'],
    bestFor: ['앱스토어 등록', '공식 아이콘', '프로필'],
    appStore: true,
  },
];

export default function Logo1stCollectionPage() {
  const [selectedSize, setSelectedSize] = useState<LogoSize>('lg');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLogos, setSelectedLogos] = useState<string[]>([]);
  const [filterAppStore, setFilterAppStore] = useState<'all' | 'yes' | 'no'>('all');

  const toggleSelection = (id: string) => {
    setSelectedLogos(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const filteredLogos = filterAppStore === 'all' 
    ? LOGOS
    : LOGOS.filter(logo => filterAppStore === 'yes' ? logo.appStore : !logo.appStore);

  const appStoreReady = LOGOS.filter(l => l.appStore);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-background text-text' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">🎯 JJIKMEOK 1ST Logo Collection</h1>
            <p className="text-text-secondary">10가지 트렌디한 스타일 - 영문 인기 폰트 + 찍먹 컨셉</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Concept Overview */}
        <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-pri/10 to-acc/10 border border-pri/20">
          <h2 className="text-3xl font-black mb-4">💡 디자인 컨셉</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 text-pri">찍먹 = 간단 & 빠름</h3>
              <p className="text-sm text-text-secondary">
                "찍어 먹다"처럼 간단하고 빠르게. 숏폼 비디오의 짧고 임팩트있는 특성 반영
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-acc">1ST = 최초 & 선도자</h3>
              <p className="text-sm text-text-secondary">
                1ST는 "퍼스트"로 최초, 선도자를 의미. 성수동 로컬 숏폼의 선구자
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-ok">영문 트렌디 폰트</h3>
              <p className="text-sm text-text-secondary">
                Poppins, Inter, Montserrat 등 2024 인기 폰트로 글로벌 감성
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 rounded-xl bg-surface border border-border">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">App Store Filter</label>
            <div className="flex gap-2">
              {(['all', 'yes', 'no'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterAppStore(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterAppStore === filter
                      ? 'bg-pri text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'yes' ? 'App Store ✓' : 'Creative Only'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">Size</label>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-acc text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* App Store Ready Summary */}
        <div className="mb-8 p-6 rounded-xl bg-success-background border border-success">
          <h3 className="text-xl font-bold mb-3">📱 앱스토어 등록 가능: {appStoreReady.length}개</h3>
          <div className="flex flex-wrap gap-2">
            {appStoreReady.map(logo => (
              <span key={logo.id} className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-medium">
                {logo.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-text-secondary mt-3">
            ✓ iOS/Android 앱스토어 가이드라인 준수 · 1024x1024 안전 영역 · 작은 사이즈 인식성
          </p>
        </div>

        {/* Selection Summary */}
        {selectedLogos.length > 0 && (
          <div className="mb-8 p-6 rounded-xl bg-info-background border border-info">
            <h3 className="text-lg font-bold mb-2">✓ {selectedLogos.length}개 선택됨</h3>
            <div className="flex flex-wrap gap-2">
              {selectedLogos.map(id => {
                const logo = LOGOS.find(l => l.id === id);
                return (
                  <span key={id} className="px-3 py-1 rounded-full bg-info text-info-foreground text-sm">
                    {logo?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredLogos.map((logo) => {
            const Logo = logo.component;
            const isSelected = selectedLogos.includes(logo.id);

            return (
              <div
                key={logo.id}
                onClick={() => toggleSelection(logo.id)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-success bg-success-background shadow-2xl scale-105'
                    : 'border-border bg-surface hover:border-border-hover hover:shadow-xl'
                }`}
              >
                {/* Tags & App Store Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-wrap gap-1">
                    {logo.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs font-bold bg-pri/20 text-pri">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {logo.appStore && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-success text-success-foreground">
                      앱스토어 OK
                    </span>
                  )}
                </div>

                {/* Logo Display */}
                <div className="flex items-center justify-center mb-6 min-h-[180px] rounded-xl bg-gradient-to-br from-background/50 to-surface/50 p-4">
                  <Logo size={selectedSize} />
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-black">{logo.name}</h3>
                    <p className="text-sm font-semibold text-pri">{logo.style}</p>
                    <p className="text-xs text-text-secondary mt-1">Font: {logo.font}</p>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {logo.description}
                  </p>

                  {/* Best For */}
                  <div className="p-3 rounded-lg bg-background/50">
                    <h4 className="text-xs font-bold mb-2 text-text-secondary">Best For:</h4>
                    <div className="flex flex-wrap gap-1">
                      {logo.bestFor.map((use, idx) => (
                        <span key={idx} className="text-xs text-text-secondary">
                          • {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="pt-2">
                      <div className="px-4 py-2 rounded-lg bg-success text-success-foreground text-center font-bold text-sm">
                        ✓ Selected
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-pri-background border border-pri">
            <h3 className="text-xl font-bold mb-4 text-pri">🥇 앱 아이콘 추천</h3>
            <p className="text-sm font-bold mb-2">App Icon Optimized</p>
            <p className="text-sm text-text-secondary">
              앱스토어 등록에 최적화. 작은 사이즈에서도 명확하고 iOS/Android 가이드라인 준수
            </p>
          </div>

          <div className="p-6 rounded-xl bg-acc-background border border-acc">
            <h3 className="text-xl font-bold mb-4 text-acc">🥈 성수동 로컬 추천</h3>
            <p className="text-sm font-bold mb-2">Street Brutal</p>
            <p className="text-sm text-text-secondary">
              두꺼운 테두리와 강렬한 오렌지. 성수동 힙한 스트릿 감성 완벽 표현
            </p>
          </div>

          <div className="p-6 rounded-xl bg-ok-background border border-ok">
            <h3 className="text-xl font-bold mb-4 text-ok">🥉 소셜미디어 추천</h3>
            <p className="text-sm font-bold mb-2">Gradient Flow</p>
            <p className="text-sm text-text-secondary">
              인스타그래머블한 그라데이션. 소셜미디어에서 눈에 띄는 비주얼
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-6 rounded-xl bg-info-background border border-info">
          <h3 className="text-lg font-bold mb-3">💬 다음 단계</h3>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>• 마음에 드는 로고를 클릭해서 선택하세요 (여러 개 가능)</li>
            <li>• 앱스토어 등록용은 "App Store OK" 배지가 있는 로고를 선택하세요</li>
            <li>• 추가 커스터마이징 (색상, 폰트 조정) 요청 가능</li>
            <li>• 선택한 로고로 스플래시 페이지, 프로필 등 전체 적용 가능</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
