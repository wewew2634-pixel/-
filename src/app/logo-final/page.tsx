'use client';

import { useState } from 'react';
import LogoGapA1 from '@/components/logos/LogoGapA1';
import LogoGapA2 from '@/components/logos/LogoGapA2';
import LogoGapA3 from '@/components/logos/LogoGapA3';
import LogoFrameB1 from '@/components/logos/LogoFrameB1';
import LogoFrameB2 from '@/components/logos/LogoFrameB2';
import LogoFrameB3 from '@/components/logos/LogoFrameB3';
import LogoPulseC1 from '@/components/logos/LogoPulseC1';
import LogoPulseC2 from '@/components/logos/LogoPulseC2';
import LogoPulseC3 from '@/components/logos/LogoPulseC3';

type LogoVariant = 'default' | 'mono' | 'accent';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoConfig {
  id: string;
  name: string;
  concept: string;
  description: string;
  component: React.ComponentType<any>;
  category: 'gap' | 'frame' | 'pulse';
}

const LOGOS: LogoConfig[] = [
  {
    id: 'gap-a1',
    name: 'The Gap A1',
    concept: '순간의 틈 - 평행선',
    description: '두 순간 사이의 간극. 평행선이 살짝 회전되어 있어 역동성을 표현',
    component: LogoGapA1,
    category: 'gap',
  },
  {
    id: 'gap-a2',
    name: 'The Gap A2',
    concept: '순간의 틈 - 교차',
    description: '순간들이 교차하는 에너지. 대각선이 거의 만날 듯 말 듯한 긴장감',
    component: LogoGapA2,
    category: 'gap',
  },
  {
    id: 'gap-a3',
    name: 'The Gap A3',
    concept: '순간의 틈 - 원형',
    description: '불완전한 원. 닫히기 직전의 순간을 표현',
    component: LogoGapA3,
    category: 'gap',
  },
  {
    id: 'frame-b1',
    name: 'Raw Frame B1',
    concept: '날것의 프레임 - 깨진 모서리',
    description: '불완전함의 아름다움. 스트릿 감성의 깨진 프레임',
    component: LogoFrameB1,
    category: 'frame',
  },
  {
    id: 'frame-b2',
    name: 'Raw Frame B2',
    concept: '날것의 프레임 - 브러시',
    description: '손으로 그린 듯한 유기적 느낌. 날것 그대로의 에너지',
    component: LogoFrameB2,
    category: 'frame',
  },
  {
    id: 'frame-b3',
    name: 'Raw Frame B3',
    concept: '날것의 프레임 - 이중 프레임',
    description: '레이어드된 현실. 깊이와 차원을 표현',
    component: LogoFrameB3,
    category: 'frame',
  },
  {
    id: 'pulse-c1',
    name: 'Pulse C1',
    concept: '순간의 펄스 - 심전도',
    description: '생명의 순간. ECG처럼 정확하게 포착된 에너지',
    component: LogoPulseC1,
    category: 'pulse',
  },
  {
    id: 'pulse-c2',
    name: 'Pulse C2',
    concept: '순간의 펄스 - 삼각파',
    description: '디지털 정밀함. 날카롭고 명확한 순간',
    component: LogoPulseC2,
    category: 'pulse',
  },
  {
    id: 'pulse-c3',
    name: 'Pulse C3',
    concept: '순간의 펄스 - 페이드',
    description: '순간의 여운. 점점 사라지는 에너지',
    component: LogoPulseC3,
    category: 'pulse',
  },
];

export default function LogoFinalPage() {
  const [selectedSize, setSelectedSize] = useState<LogoSize>('lg');
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>('default');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'gap' | 'frame' | 'pulse'>('all');
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  const handleVote = (id: string) => {
    setVotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    setSelectedLogo(id);
  };

  const filteredLogos = selectedCategory === 'all' 
    ? LOGOS 
    : LOGOS.filter(logo => logo.category === selectedCategory);

  const topVoted = Object.entries(votes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-background text-text' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">🎨 Final Logo Review</h1>
            <p className="text-text-secondary">9개 컨셉 교차검증 - 최상의 로고를 선택하세요</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Design Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-xl font-bold mb-2">🎯 Concept A: The Gap</h3>
            <p className="text-text-secondary text-sm">두 순간 사이의 간극, 찰나를 표현. 평행선, 교차, 원형 변형</p>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-xl font-bold mb-2">🖼️ Concept B: Raw Frame</h3>
            <p className="text-text-secondary text-sm">불완전한 것의 아름다움. 스트릿 감성의 날것 프레임</p>
          </div>
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-xl font-bold mb-2">⚡ Concept C: Pulse</h3>
            <p className="text-text-secondary text-sm">순간 포착의 에너지. 바이탈 사인, 리듬, 여운</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 rounded-xl bg-surface border border-border">
          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">Category</label>
            <div className="flex gap-2">
              {(['all', 'gap', 'frame', 'pulse'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-pri text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Size Control */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">Size</label>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? 'bg-pri text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Variant Control */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-semibold mb-2 block">Style</label>
            <div className="flex gap-2">
              {(['default', 'mono', 'accent'] as const).map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedVariant === variant
                      ? 'bg-pri text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Voting Results */}
        {topVoted.length > 0 && (
          <div className="mb-8 p-6 rounded-xl bg-success-background border border-success">
            <h3 className="text-xl font-bold mb-4">🏆 Top Voted</h3>
            <div className="flex gap-4">
              {topVoted.map(([id, count], index) => {
                const logo = LOGOS.find(l => l.id === id);
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                    <span className="font-bold">{logo?.name}</span>
                    <span className="text-text-secondary">({count} votes)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogos.map((logo) => {
            const Logo = logo.component;
            const voteCount = votes[logo.id] || 0;
            const isSelected = selectedLogo === logo.id;

            return (
              <div
                key={logo.id}
                className={`p-8 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-success bg-success-background shadow-lg scale-105'
                    : 'border-border bg-surface hover:border-border-hover'
                }`}
              >
                {/* Logo Display */}
                <div className="flex items-center justify-center mb-6 min-h-[200px]">
                  <Logo size={selectedSize} variant={selectedVariant} />
                </div>

                {/* Logo Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">{logo.name}</h3>
                    <p className="text-sm font-semibold text-text-secondary">{logo.concept}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {logo.description}
                  </p>

                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(logo.id)}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      isSelected
                        ? 'bg-success text-white'
                        : 'bg-pri text-white hover:bg-pri-hover'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Vote'} {voteCount > 0 && `(${voteCount})`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Design Rationale */}
        <div className="mt-12 p-8 rounded-xl bg-surface border border-border">
          <h2 className="text-2xl font-black mb-6">💭 Design Rationale</h2>
          <div className="space-y-4 text-text-secondary">
            <p>
              <strong className="text-text">기존 로고의 문제점:</strong> 너무 리터럴하고 설명적임 ("찍먹", "Zz", 카메라). 
              성수동 로컬 숏폼의 정체성이 약하고 일반적인 비디오 앱처럼 보임.
            </p>
            <p>
              <strong className="text-text">새로운 접근:</strong> 추상적 심볼로 전환. "순간"이라는 핵심 가치를 
              세 가지 시각 언어로 표현 - 간극(Gap), 프레임(Frame), 펄스(Pulse).
            </p>
            <p>
              <strong className="text-text">심볼 중심 전략:</strong> 앱 아이콘으로 강력한 심볼에 집중. 
              워드마크는 제거하거나 최소화. Instagram, TikTok처럼 기억하기 쉬운 형태.
            </p>
            <p>
              <strong className="text-text">성수동 감성:</strong> 힙하고 로컬, 스트릿 감성. 
              완벽하지 않은(Raw) 것의 아름다움. 날것의 에너지.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 rounded-xl bg-info-background border border-info">
          <h3 className="text-lg font-bold mb-2">📋 Instructions</h3>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>• 각 카테고리(Gap, Frame, Pulse)의 컨셉을 이해하고 비교하세요</li>
            <li>• Size, Style 옵션을 조정하며 다양한 상황에서의 모습을 확인하세요</li>
            <li>• 마음에 드는 로고에 투표하세요 (여러 개 가능)</li>
            <li>• 최종 선택 후 피드백을 주시면 해당 로고로 진행합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
