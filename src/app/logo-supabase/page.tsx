'use client';

import { useState } from 'react';
import LogoSupabaseStyle from '@/components/logos/LogoSupabaseStyle';
import LogoSupabaseStyle2 from '@/components/logos/LogoSupabaseStyle2';
import LogoSupabaseStyle3 from '@/components/logos/LogoSupabaseStyle3';
import LogoSupabaseStyle4 from '@/components/logos/LogoSupabaseStyle4';

type LogoVariant = 'default' | 'mono' | 'colorful';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface LogoConfig {
  id: string;
  name: string;
  concept: string;
  description: string;
  component: React.ComponentType<any>;
}

const LOGOS: LogoConfig[] = [
  {
    id: 'supa-1',
    name: 'Lightning Shutter',
    concept: '번개 + 셔터',
    description: '순간을 포착하는 번개처럼 빠른 에너지. 위/아래 삼각형이 만나 화살표 형태를 만듦',
    component: LogoSupabaseStyle,
  },
  {
    id: 'supa-2',
    name: 'Play Forward',
    concept: '재생 버튼',
    description: '숏폼 비디오를 상징하는 플레이 버튼. 컷아웃으로 깊이감 표현',
    component: LogoSupabaseStyle2,
  },
  {
    id: 'supa-3',
    name: 'Fast Forward',
    concept: '빨리 감기 >>',
    description: '연속된 숏폼 피드. 두 개의 쉐브론으로 빠른 진행감 표현',
    component: LogoSupabaseStyle3,
  },
  {
    id: 'supa-4',
    name: 'Abstract J',
    concept: 'JJIKMEOK의 J',
    description: '각진 기하학적 J자 형태. 미니멀하고 전방향적',
    component: LogoSupabaseStyle4,
  },
];

export default function LogoSupabasePage() {
  const [selectedSize, setSelectedSize] = useState<LogoSize>('lg');
  const [selectedVariant, setSelectedVariant] = useState<LogoVariant>('default');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-background text-text' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">⚡ Supabase Style Logos</h1>
            <p className="text-text-secondary">Supabase 디자인 언어로 재해석한 JJIKMEOK 로고</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Supabase Design Principles */}
        <div className="mb-8 p-6 rounded-xl bg-surface border border-border">
          <h2 className="text-2xl font-bold mb-4">🎯 Supabase 디자인 원칙</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-bold mb-2">📐 기하학적 추상화</h3>
              <p className="text-sm text-text-secondary">삼각형, 화살표 등 기본 도형으로 추상화</p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-bold mb-2">🎨 단색/2컬러</h3>
              <p className="text-sm text-text-secondary">선명한 단색 또는 2컬러 조합. 그라데이션 없음</p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-bold mb-2">⚡ 날카로운 엣지</h3>
              <p className="text-sm text-text-secondary">정확하고 효율적인 느낌의 샤프한 라인</p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-bold mb-2">→ 전방향 움직임</h3>
              <p className="text-sm text-text-secondary">화살표, 방향성으로 진보와 움직임 표현</p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-bold mb-2">✨ 초미니멀</h3>
              <p className="text-sm text-text-secondary">불필요한 요소 제거. 본질만 남김</p>
            </div>
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-bold mb-2">📱 아이콘 최적화</h3>
              <p className="text-sm text-text-secondary">모든 사이즈에서 명확하게 인식 가능</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 rounded-xl bg-surface border border-border">
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
          <div className="flex-1 min-w-[250px]">
            <label className="text-sm font-semibold mb-2 block">Color Style</label>
            <div className="flex gap-2">
              {(['default', 'mono', 'colorful'] as const).map((variant) => (
                <button
                  key={variant}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedVariant === variant
                      ? 'bg-pri text-white'
                      : 'bg-background hover:bg-surface-hover'
                  }`}
                >
                  {variant === 'default' ? 'Orange' : variant === 'mono' ? 'Black' : 'Supabase'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {LOGOS.map((logo) => {
            const Logo = logo.component;
            const isSelected = selectedLogo === logo.id;

            return (
              <div
                key={logo.id}
                className={`p-8 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-success bg-success-background shadow-lg scale-105'
                    : 'border-border bg-surface hover:border-border-hover'
                }`}
                onClick={() => setSelectedLogo(logo.id)}
              >
                {/* Logo Display */}
                <div className="flex items-center justify-center mb-6 min-h-[220px]">
                  <Logo size={selectedSize} variant={selectedVariant} />
                </div>

                {/* Logo Info */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-xl font-bold">{logo.name}</h3>
                    <p className="text-sm font-semibold text-pri">{logo.concept}</p>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {logo.description}
                  </p>
                  
                  {isSelected && (
                    <div className="pt-3">
                      <div className="px-4 py-2 rounded-lg bg-success text-success-foreground text-center font-bold">
                        ✓ Selected
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Design Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Original Supabase */}
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-xl font-bold mb-4">🟢 Original Supabase</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ 두 개의 삼각형이 교차하는 화살표 형태</li>
              <li>✓ 선명한 그린 (#3ECF8E)</li>
              <li>✓ 날카로운 각도, 전방향 움직임</li>
              <li>✓ 데이터베이스의 빠른 처리 능력 상징</li>
              <li>✓ 극도로 단순하지만 강력한 인지도</li>
            </ul>
          </div>

          {/* JJIKMEOK Adaptation */}
          <div className="p-6 rounded-xl bg-surface border border-border">
            <h3 className="text-xl font-bold mb-4">🟠 JJIKMEOK 적용</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ "순간 포착" 컨셉을 기하학적으로 추상화</li>
              <li>✓ 브랜드 컬러 오렌지 (#FF7A00) 적용</li>
              <li>✓ 숏폼 비디오 (재생/빨리감기) 상징</li>
              <li>✓ 성수동 로컬 감성 + 테크 모던 융합</li>
              <li>✓ 앱 아이콘으로 최적화된 디자인</li>
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-6 rounded-xl bg-info-background border border-info">
          <h3 className="text-lg font-bold mb-3">💬 피드백 필요</h3>
          <p className="text-sm text-text-secondary mb-4">
            마음에 드는 로고를 클릭해서 선택하고, 추가로 수정하고 싶은 부분이 있다면 말씀해주세요:
          </p>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>• 형태/각도 조정이 필요한가요?</li>
            <li>• 색상을 바꾸고 싶으신가요?</li>
            <li>• 더 심플하게 or 더 복잡하게?</li>
            <li>• 완전히 다른 컨셉을 시도해볼까요?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
