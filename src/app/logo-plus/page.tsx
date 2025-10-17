'use client';

import { useState } from 'react';
import LogoGlass from '@/components/logos/LogoGlass';
import LogoBrutal from '@/components/logos/LogoBrutal';
import LogoMesh from '@/components/logos/LogoMesh';
import LogoMinimal3D from '@/components/logos/LogoMinimal3D';

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoConfig {
  id: string;
  name: string;
  style: string;
  concept: string;
  description: string;
  component: React.ComponentType<any>;
  trend: string;
  pros: string[];
  cons: string[];
}

const LOGOS: LogoConfig[] = [
  {
    id: 'glass',
    name: 'Glassmorphism',
    style: '유리 효과',
    concept: '순간의 투명성',
    description: '반투명 유리 효과로 깊이감과 프리미엄 느낌을 표현. 여러 레이어가 겹쳐지며 블러 효과로 부드러움 강조',
    component: LogoGlass,
    trend: '2024 Hot Trend',
    pros: ['프리미엄 느낌', '현대적', '부드럽고 우아함', 'iOS/MacOS 트렌드'],
    cons: ['복잡도가 높음', '작은 사이즈에서 디테일 손실 가능'],
  },
  {
    id: 'brutal',
    name: 'Neubrutalism',
    style: '네오 브루탈',
    concept: '날것의 에너지',
    description: '두꺼운 테두리, 강렬한 대비, 오프셋 그림자로 날것의 반항적 에너지 표현. 의도적으로 "거칠게"',
    component: LogoBrutal,
    trend: '2024 Rising Trend',
    pros: ['강렬하고 기억에 남음', '힙하고 스트릿 감성', '성수동 로컬 정체성 강함', '트렌디'],
    cons: ['호불호가 갈림', '보수적 시장에는 부담'],
  },
  {
    id: 'mesh',
    name: 'Gradient Mesh',
    style: '그라데이션 메시',
    concept: '흐르는 순간',
    description: '복잡한 멀티 포인트 그라데이션으로 3D 깊이감 표현. 유기적이고 흐르는 듯한 유동성',
    component: LogoMesh,
    trend: 'Premium Aesthetic',
    pros: ['고급스러움', '유니크함', '시각적 임팩트 강함', '인스타그래머블'],
    cons: ['인쇄 시 색상 재현 어려움', '복잡함'],
  },
  {
    id: '3d',
    name: 'Minimal 3D',
    style: '미니멀 입체',
    concept: '입체적 순간',
    description: '아이소메트릭 3D 형태로 깊이감 표현. 클린하고 기하학적이면서도 입체적',
    component: LogoMinimal3D,
    trend: 'Modern Tech',
    pros: ['깔끔하고 모던', '기술적 느낌', '독특한 시점', '확장성 좋음'],
    cons: ['J 형태 인식이 어려울 수 있음', '추상적'],
  },
];

export default function LogoPlusPage() {
  const [selectedSize, setSelectedSize] = useState<LogoSize>('lg');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-background text-text' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">✨ Tailwind Plus Logo Collection</h1>
            <p className="text-text-secondary">2024 트렌드 스타일로 재해석한 고급 로고</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Trend Overview */}
        <div className="mb-8 p-8 rounded-xl bg-gradient-to-br from-pri/10 to-acc/10 border border-pri/20">
          <h2 className="text-3xl font-black mb-4">🎨 2024 UI Design Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-background/80 backdrop-blur">
              <h3 className="text-xl font-bold mb-2">🪟 Glassmorphism</h3>
              <p className="text-sm text-text-secondary">
                반투명 유리 효과, 블러 백드롭, 레이어드 깊이감. Apple의 iOS/macOS 디자인 언어에서 영감
              </p>
            </div>
            <div className="p-6 rounded-xl bg-background/80 backdrop-blur">
              <h3 className="text-xl font-bold mb-2">🧱 Neubrutalism</h3>
              <p className="text-sm text-text-secondary">
                두꺼운 테두리, 고대비, 의도적 거칠기. 1950-70년대 브루탈리즘 건축에서 영감받은 디지털 해석
              </p>
            </div>
            <div className="p-6 rounded-xl bg-background/80 backdrop-blur">
              <h3 className="text-xl font-bold mb-2">🌈 Gradient Mesh</h3>
              <p className="text-sm text-text-secondary">
                복잡한 멀티 포인트 그라데이션, 유기적 형태. Instagram, Figma 등 현대 브랜드들의 시그니처 스타일
              </p>
            </div>
          </div>
        </div>

        {/* Size Control */}
        <div className="flex gap-4 mb-8 p-6 rounded-xl bg-surface border border-border">
          <div className="flex-1">
            <label className="text-sm font-semibold mb-2 block">Logo Size</label>
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
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {LOGOS.map((logo) => {
            const Logo = logo.component;
            const isSelected = selectedLogo === logo.id;

            return (
              <div
                key={logo.id}
                className={`p-8 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-success bg-success-background shadow-2xl scale-105'
                    : 'border-border bg-surface hover:border-border-hover hover:shadow-xl'
                }`}
                onClick={() => setSelectedLogo(logo.id)}
              >
                {/* Trend Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-pri text-white">
                    {logo.trend}
                  </span>
                </div>

                {/* Logo Display */}
                <div className="flex items-center justify-center mb-6 min-h-[240px] rounded-xl bg-background/50 p-8">
                  <Logo size={selectedSize} />
                </div>

                {/* Logo Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black">{logo.name}</h3>
                    <p className="text-sm font-bold text-pri">{logo.style} - {logo.concept}</p>
                  </div>
                  
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {logo.description}
                  </p>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-success-background/50">
                      <h4 className="text-xs font-bold mb-2 text-success">장점</h4>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {logo.pros.map((pro, idx) => (
                          <li key={idx}>✓ {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-error-background/50">
                      <h4 className="text-xs font-bold mb-2 text-error">단점</h4>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {logo.cons.map((con, idx) => (
                          <li key={idx}>✗ {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="pt-2">
                      <div className="px-4 py-3 rounded-lg bg-success text-success-foreground text-center font-bold">
                        ✓ 선택됨
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tailwind Plus Features */}
        <div className="p-8 rounded-xl bg-surface border border-border">
          <h2 className="text-2xl font-black mb-6">💎 Tailwind Plus-Polish Pack 활용</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3">사용된 고급 기능</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• <strong>backdrop-blur</strong> - Glassmorphism 블러 효과</li>
                <li>• <strong>gradient meshes</strong> - 복잡한 멀티 포인트 그라데이션</li>
                <li>• <strong>layered shadows</strong> - 깊이감 있는 그림자 레이어링</li>
                <li>• <strong>opacity layering</strong> - 투명도 레이어로 깊이 표현</li>
                <li>• <strong>semantic tokens</strong> - --pri, --acc 등 디자인 토큰 시스템</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">디자인 원칙</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• <strong>Trend-forward</strong> - 2024 최신 트렌드 반영</li>
                <li>• <strong>Premium feel</strong> - 고급스러운 시각적 품질</li>
                <li>• <strong>Brand identity</strong> - JJIKMEOK 오렌지 컬러 유지</li>
                <li>• <strong>App icon ready</strong> - 모든 사이즈에서 작동</li>
                <li>• <strong>Memorable</strong> - 강한 시각적 인상</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-8 p-6 rounded-xl bg-info-background border border-info">
          <h3 className="text-lg font-bold mb-3">🎯 추천</h3>
          <p className="text-sm text-text-secondary mb-4">
            <strong>성수동 로컬 숏폼 서비스</strong>의 정체성에 가장 잘 맞는 스타일:
          </p>
          <div className="p-4 rounded-lg bg-background/50">
            <p className="text-sm font-bold mb-2">1순위: 🧱 Neubrutalism (네오 브루탈)</p>
            <p className="text-xs text-text-secondary">
              성수동의 힙하고 스트릿한 감성과 완벽하게 매치. 날것의 로컬 감성 + 반항적 에너지. 
              TikTok, BeReal 같은 숏폼 플랫폼의 젊은 사용자층에게 어필.
            </p>
          </div>
          <div className="mt-3 p-4 rounded-lg bg-background/50">
            <p className="text-sm font-bold mb-2">2순위: 🌈 Gradient Mesh (그라데이션 메시)</p>
            <p className="text-xs text-text-secondary">
              고급스럽고 인스타그래머블. 시각적 임팩트 강함. 프리미엄 브랜딩에 적합.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
