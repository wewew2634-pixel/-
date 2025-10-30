'use client';

import { useState } from 'react';
import LogoGlassJ1 from '@/components/logos/LogoGlassJ1';
import LogoGlassJ2 from '@/components/logos/LogoGlassJ2';
import LogoGlassJ3 from '@/components/logos/LogoGlassJ3';
import LogoGlassJ4 from '@/components/logos/LogoGlassJ4';
import LogoGlassJ5 from '@/components/logos/LogoGlassJ5';
import LogoGlassJ6 from '@/components/logos/LogoGlassJ6';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoConfig {
  id: string;
  name: string;
  colorScheme: string;
  shape: string;
  description: string;
  component: React.ComponentType<any>;
  tags: string[];
  bestFor: string[];
}

const LOGOS: LogoConfig[] = [
  {
    id: 'glass-j1',
    name: 'Bronze Glass Circle',
    colorScheme: '청동/브라운',
    shape: '원형',
    description: '스크린샷 원본 스타일. 청동빛 유리 원형 안의 베이지 J. 고급스럽고 클래식한 느낌',
    component: LogoGlassJ1,
    tags: ['원형', '청동', '클래식', '프리미엄'],
    bestFor: ['고급 브랜딩', '전통+모던 융합', '차분한 톤'],
  },
  {
    id: 'glass-j2',
    name: 'Orange Glass Circle',
    colorScheme: '오렌지',
    shape: '원형',
    description: 'JJIKMEOK 브랜드 컬러 활용. 오렌지 글라스로 브랜드 아이덴티티 강조. 밝고 에너지 넘침',
    component: LogoGlassJ2,
    tags: ['원형', '오렌지', '브랜드', '에너지'],
    bestFor: ['브랜드 일관성', '밝은 톤', '젊은 타겟'],
  },
  {
    id: 'glass-j3',
    name: 'Teal Glass Circle',
    colorScheme: '틸/청록',
    shape: '원형',
    description: '차가운 청록색 글라스. 테크 감성과 모던함. 신선하고 미래지향적',
    component: LogoGlassJ3,
    tags: ['원형', '틸', '테크', '모던'],
    bestFor: ['테크 브랜드', '혁신', '신선한 이미지'],
  },
  {
    id: 'glass-j4',
    name: 'Gradient Split Glass',
    colorScheme: '오렌지+틸',
    shape: '원형',
    description: '두 컬러가 만나는 그라데이션. 역동적이고 유니크. 오렌지와 틸의 조화',
    component: LogoGlassJ4,
    tags: ['원형', '그라데이션', '역동적', '유니크'],
    bestFor: ['차별화', '역동성', '트렌디'],
  },
  {
    id: 'glass-j5',
    name: 'Hexagon Glass',
    colorScheme: '오렌지',
    shape: '육각형',
    description: '테크 감성의 헥사곤. 미래적이고 기하학적. 게임/앱 아이콘 스타일',
    component: LogoGlassJ5,
    tags: ['육각형', '테크', '미래', '기하학'],
    bestFor: ['테크 서비스', '게임', '앱 아이콘'],
  },
  {
    id: 'glass-j6',
    name: 'Rounded Square Glass',
    colorScheme: '오렌지',
    shape: '라운드 스퀘어',
    description: 'iOS 앱 아이콘 스타일. 둥근 사각형. 친숙하고 모던한 느낌',
    component: LogoGlassJ6,
    tags: ['사각형', 'iOS', '앱', '친숙'],
    bestFor: ['모바일 앱', 'iOS 플랫폼', '범용성'],
  },
];

export default function LogoGlassCollectionPage() {
  const [selectedSize, setSelectedSize] = useState<LogoSize>('lg');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLogos, setSelectedLogos] = useState<string[]>([]);
  const [filterShape, setFilterShape] = useState<'all' | '원형' | '육각형' | '사각형'>('all');

  const toggleSelection = (id: string) => {
    setSelectedLogos(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const filteredLogos = filterShape === 'all' 
    ? LOGOS
    : LOGOS.filter(logo => logo.shape.includes(filterShape));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-background text-text' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">💎 Glassmorphism "J" Collection</h1>
            <p className="text-text-secondary">6가지 Glassmorphism 스타일 - Tailwind Plus 디자인 토큰 활용</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Design Philosophy */}
        <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-pri/5 to-acc/5 border border-pri/10">
          <h2 className="text-3xl font-black mb-4">🎨 Glassmorphism 디자인 철학</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3 text-pri">핵심 요소</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>✓ <strong>반투명 레이어</strong> - 여러 겹의 투명한 유리 층</li>
                <li>✓ <strong>블러 효과</strong> - backdrop-blur로 부드러운 배경</li>
                <li>✓ <strong>서브틀한 그림자</strong> - 깊이감 표현</li>
                <li>✓ <strong>하이라이트</strong> - 유리 표면의 빛 반사</li>
                <li>✓ <strong>다층 구조</strong> - 3-4개 레이어로 깊이 생성</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-acc">Tailwind Plus 토큰</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• <code className="text-pri">--pri</code>: 브랜드 오렌지 (#FF7A00)</li>
                <li>• <code className="text-acc">--acc</code>: 액센트 틸 (#14B8A6)</li>
                <li>• <code>--elev-1~4</code>: 그림자 레벨</li>
                <li>• <code>--r-sm~2xl</code>: 라운드 radius</li>
                <li>• <code>opacity layers</code>: 0.3~0.8 범위</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 rounded-xl bg-surface border border-border">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">Shape Filter</label>
            <div className="flex gap-2">
              {(['all', '원형', '육각형', '사각형'] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => setFilterShape(shape)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterShape === shape
                      ? 'bg-pri text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {shape === 'all' ? 'All' : shape}
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

        {/* Selection Summary */}
        {selectedLogos.length > 0 && (
          <div className="mb-8 p-6 rounded-xl bg-success-background border border-success">
            <h3 className="text-lg font-bold mb-2">✓ {selectedLogos.length}개 선택됨</h3>
            <div className="flex flex-wrap gap-2">
              {selectedLogos.map(id => {
                const logo = LOGOS.find(l => l.id === id);
                return (
                  <span key={id} className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm">
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
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {logo.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded text-xs font-bold bg-pri/20 text-pri">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Logo Display */}
                <div className="flex items-center justify-center mb-6 min-h-[200px] rounded-xl bg-gradient-to-br from-background/50 to-surface/50 p-6">
                  <Logo size={selectedSize} />
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-black">{logo.name}</h3>
                    <p className="text-sm font-semibold">
                      <span className="text-pri">{logo.colorScheme}</span>
                      {' · '}
                      <span className="text-acc">{logo.shape}</span>
                    </p>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {logo.description}
                  </p>

                  {/* Best For */}
                  <div className="p-3 rounded-lg bg-background/50">
                    <h4 className="text-xs font-bold mb-2 text-text-secondary">Best For:</h4>
                    <ul className="text-xs text-text-secondary space-y-1">
                      {logo.bestFor.map((use, idx) => (
                        <li key={idx}>• {use}</li>
                      ))}
                    </ul>
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

        {/* Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-pri-background border border-pri">
            <h3 className="text-xl font-bold mb-4 text-pri">🥇 Top Pick: Orange Glass Circle</h3>
            <p className="text-sm text-text-secondary mb-4">
              JJIKMEOK 브랜드 컬러를 활용한 오렌지 글라스 원형이 가장 추천됩니다.
            </p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>✓ 브랜드 아이덴티티와 완벽한 일치</li>
              <li>✓ 밝고 에너지 넘치는 느낌</li>
              <li>✓ 젊은 타겟층에게 어필</li>
              <li>✓ 모든 사이즈에서 명확하게 인식</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-acc-background border border-acc">
            <h3 className="text-xl font-bold mb-4 text-acc">🥈 Runner-up: Bronze Glass Circle</h3>
            <p className="text-sm text-text-secondary mb-4">
              고급스러운 청동 컬러로 차별화된 프리미엄 이미지.
            </p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>✓ 클래식하고 고급스러움</li>
              <li>✓ 성수동의 힙한 감성</li>
              <li>✓ 독특한 컬러 선택으로 차별화</li>
              <li>✓ 전통+모던 융합</li>
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-6 rounded-xl bg-info-background border border-info">
          <h3 className="text-lg font-bold mb-3">💬 다음 단계</h3>
          <p className="text-sm text-text-secondary mb-4">
            마음에 드는 로고를 클릭해서 선택하고, 추가 요청사항을 말씀해주세요:
          </p>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>• 컬러 조정 (더 밝게/어둡게)</li>
            <li>• 레이어 수 변경</li>
            <li>• J 글자 스타일 변경</li>
            <li>• 다른 형태 조합 (예: 육각형 + 틸 컬러)</li>
            <li>• 애니메이션 효과 추가</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
