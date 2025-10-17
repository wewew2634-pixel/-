'use client';

import { useState } from 'react';
import LogoJ1Steel from '@/components/logos/LogoJ1Steel';
import LogoJ1Industrial from '@/components/logos/LogoJ1Industrial';
import LogoJ1Metal from '@/components/logos/LogoJ1Metal';
import LogoJ2Steel from '@/components/logos/LogoJ2Steel';
import LogoJ2Chrome from '@/components/logos/LogoJ2Chrome';
import LogoJ2Forge from '@/components/logos/LogoJ2Forge';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoConfig {
  id: string;
  name: string;
  series: 'Bronze' | 'Orange';
  style: string;
  description: string;
  component: React.ComponentType<any>;
  tags: string[];
  features: string[];
}

const LOGOS: LogoConfig[] = [
  {
    id: 'j1-steel',
    name: 'Bronze Steel Art',
    series: 'Bronze',
    style: '브러시드 메탈',
    description: '청동색 강철 아트. 브러시드 메탈 텍스처, 엠보싱 J, 산업적 리벳과 볼트. 정교한 메탈릭 그라데이션',
    component: LogoJ1Steel,
    tags: ['메탈릭', '브러시드', '산업', '리벳'],
    features: ['브러시드 텍스처', '크롬 반사', '산업용 리벳', '엠보싱 효과'],
  },
  {
    id: 'j1-industrial',
    name: 'Industrial Bronze',
    series: 'Bronze',
    style: '산업용 플레이트',
    description: '공장/제조 감성. 육각형 플레이트, 헥사 볼트, 용접 흔적, 녹/파티나 효과. 거친 금속 질감',
    component: LogoJ1Industrial,
    tags: ['산업', '육각형', '용접', '거칠'],
    features: ['헥사곤 볼트', '용접 마크', '파티나', '시리얼 넘버'],
  },
  {
    id: 'j1-metal',
    name: 'Polished Bronze',
    series: 'Bronze',
    style: '광택 금속',
    description: '미러 폴리시 청동. 극강의 반사광, 여러 레이어 스펙큘러 하이라이트. 럭셔리 메탈 마감',
    component: LogoJ1Metal,
    tags: ['광택', '미러', '반사', '럭셔리'],
    features: ['미러 폴리시', '다층 반사', '크롬 스파클', '클린 마감'],
  },
  {
    id: 'j2-steel',
    name: 'Orange Steel Art',
    series: 'Orange',
    style: '열처리 강철',
    description: '오렌지 강철 아트. 열처리된 강철 색감, 메탈릭 오렌지, 브러시드 텍스처, 산업적 리벳',
    component: LogoJ2Steel,
    tags: ['오렌지', '열처리', '강철', '메탈릭'],
    features: ['열처리 컬러', '브러시드 오렌지', '산업 리벳', '화이트 J'],
  },
  {
    id: 'j2-chrome',
    name: 'Orange Chrome',
    series: 'Orange',
    style: '크롬 마감',
    description: '오렌지 크롬 피니시. 자동차 페인트급 광택, 거울 반사, 다층 스펙큘러. 극강의 반사 효과',
    component: LogoJ2Chrome,
    tags: ['크롬', '거울', '자동차', '광택'],
    features: ['미러 크롬', '다층 반사', '인텐스 스파클', '오토모티브'],
  },
  {
    id: 'j2-forge',
    name: 'Forged Orange',
    series: 'Orange',
    style: '단조 금속',
    description: '뜨겁게 단조된 금속. 불꽃/열기 효과, 발광하는 J, 해머 텍스처, 대장간 감성. 스파크 비산',
    component: LogoJ2Forge,
    tags: ['단조', '발광', '불꽃', '열기'],
    features: ['히트 글로우', '단조 텍스처', '스파크 효과', '엠버 컬러'],
  },
];

export default function LogoSteelArtPage() {
  const [selectedSize, setSelectedSize] = useState<LogoSize>('lg');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLogos, setSelectedLogos] = useState<string[]>([]);
  const [filterSeries, setFilterSeries] = useState<'all' | 'Bronze' | 'Orange'>('all');

  const toggleSelection = (id: string) => {
    setSelectedLogos(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const filteredLogos = filterSeries === 'all' 
    ? LOGOS
    : LOGOS.filter(logo => logo.series === filterSeries);

  const bronzeLogos = LOGOS.filter(l => l.series === 'Bronze');
  const orangeLogos = LOGOS.filter(l => l.series === 'Orange');

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-background text-text' : 'bg-white text-black'}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">🔩 Steel Art Collection</h1>
            <p className="text-text-secondary">Bronze & Orange - 스틸아트 메탈릭 업그레이드</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Steel Art Philosophy */}
        <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
          <h2 className="text-3xl font-black mb-4">⚙️ Steel Art 디자인 철학</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-800/50">
              <h3 className="text-xl font-bold mb-3 text-amber-400">🔨 Industrial Design</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• 메탈릭 그라데이션</li>
                <li>• 브러시드/해머드 텍스처</li>
                <li>• 산업용 리벳/볼트</li>
                <li>• 용접 흔적</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/50">
              <h3 className="text-xl font-bold mb-3 text-blue-400">✨ Chrome Effect</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• 미러 폴리시</li>
                <li>• 다층 스펙큘러 반사</li>
                <li>• 크롬 하이라이트</li>
                <li>• 샤프한 엣지</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/50">
              <h3 className="text-xl font-bold mb-3 text-orange-400">🔥 Forge Effect</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• 열처리 컬러</li>
                <li>• 발광/히트 글로우</li>
                <li>• 스파크/엠버</li>
                <li>• 단조 텍스처</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 rounded-xl bg-surface border border-border">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">Series Filter</label>
            <div className="flex gap-2">
              {(['all', 'Bronze', 'Orange'] as const).map((series) => (
                <button
                  key={series}
                  onClick={() => setFilterSeries(series)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterSeries === series
                      ? 'bg-pri text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {series}
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
                  <span key={id} className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-bold">
                    {logo?.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Series Sections */}
        <div className="space-y-12">
          {/* Bronze Series */}
          {(filterSeries === 'all' || filterSeries === 'Bronze') && (
            <div>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <span className="text-amber-600">🟤</span> Bronze Steel Series
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bronzeLogos.map((logo) => {
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
                      <div className="flex flex-wrap gap-1 mb-4">
                        {logo.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-xs font-bold bg-amber-900/30 text-amber-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-center mb-6 min-h-[200px] rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-6">
                        <Logo size={selectedSize} />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-black">{logo.name}</h3>
                          <p className="text-sm font-semibold text-amber-500">{logo.style}</p>
                        </div>

                        <p className="text-sm text-text-secondary leading-relaxed">
                          {logo.description}
                        </p>

                        <div className="p-3 rounded-lg bg-background/50">
                          <h4 className="text-xs font-bold mb-2">Features:</h4>
                          <ul className="text-xs text-text-secondary space-y-1">
                            {logo.features.map((feature, idx) => (
                              <li key={idx}>• {feature}</li>
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
            </div>
          )}

          {/* Orange Series */}
          {(filterSeries === 'all' || filterSeries === 'Orange') && (
            <div>
              <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                <span className="text-orange-500">🟠</span> Orange Steel Series
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orangeLogos.map((logo) => {
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
                      <div className="flex flex-wrap gap-1 mb-4">
                        {logo.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded text-xs font-bold bg-orange-900/30 text-orange-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-center mb-6 min-h-[200px] rounded-xl bg-gradient-to-br from-orange-950/50 to-red-950/50 p-6">
                        <Logo size={selectedSize} />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-black">{logo.name}</h3>
                          <p className="text-sm font-semibold text-orange-500">{logo.style}</p>
                        </div>

                        <p className="text-sm text-text-secondary leading-relaxed">
                          {logo.description}
                        </p>

                        <div className="p-3 rounded-lg bg-background/50">
                          <h4 className="text-xs font-bold mb-2">Features:</h4>
                          <ul className="text-xs text-text-secondary space-y-1">
                            {logo.features.map((feature, idx) => (
                              <li key={idx}>• {feature}</li>
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
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-amber-950/30 border border-amber-700/50">
            <h3 className="text-xl font-bold mb-4 text-amber-400">🥇 Bronze 추천: Polished Bronze</h3>
            <p className="text-sm text-text-secondary mb-4">
              미러 폴리시 청동. 극강의 광택과 반사로 가장 럭셔리한 느낌. 고급 브랜딩에 최적.
            </p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>✓ 최고급 메탈릭 마감</li>
              <li>✓ 다층 스펙큘러 반사</li>
              <li>✓ 클린하고 세련됨</li>
              <li>✓ 프리미엄 포지셔닝</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-orange-950/30 border border-orange-700/50">
            <h3 className="text-xl font-bold mb-4 text-orange-400">🥇 Orange 추천: Orange Chrome</h3>
            <p className="text-sm text-text-secondary mb-4">
              오렌지 크롬 피니시. 자동차급 광택으로 브랜드 컬러를 극대화. 시각적 임팩트 최강.
            </p>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>✓ 브랜드 컬러 + 크롬 조합</li>
              <li>✓ 극강의 광택 효과</li>
              <li>✓ 인텐스한 반사</li>
              <li>✓ 모던하고 스포티</li>
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-6 rounded-xl bg-info-background border border-info">
          <h3 className="text-lg font-bold mb-3">💬 피드백</h3>
          <p className="text-sm text-text-secondary mb-4">
            마음에 드는 Steel Art 로고를 선택하고 말씀해주세요:
          </p>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>• 메탈 효과를 더 강하게 or 부드럽게?</li>
            <li>• 다른 컬러 조합 시도? (예: 실버, 골드)</li>
            <li>• 애니메이션 효과 추가? (반짝임, 회전)</li>
            <li>• 특정 디테일 조정?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
