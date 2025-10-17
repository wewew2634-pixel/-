'use client';

import { useState } from 'react';
import LogoZz from '@/components/logos/LogoZz';
import LogoZzPro from '@/components/logos/LogoZzPro';
import LogoZzMinimal from '@/components/logos/LogoZzMinimal';

/**
 * Logo Zz Preview Page
 * 
 * Supabase 스타일 "Zz" 로고 3가지 버전
 * - Default: 워드마크 + gradient
 * - Pro: 기하학적 심볼 + 워드마크
 * - Minimal: 초미니멀 (앱 아이콘용)
 */
export default function LogoZzPreviewPage() {
  const [selected, setSelected] = useState<'default' | 'pro' | 'minimal' | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const variants = [
    {
      id: 'default' as const,
      name: 'Zz Default',
      component: LogoZz,
      description: '워드마크 기반, gradient',
      pros: [
        '✅ 가장 읽기 쉬움',
        '✅ 브랜드 명확',
        '✅ 모든 사이즈 적합',
        '✅ Supabase 감성 100%'
      ],
      cons: ['⚠️ 심볼 없음'],
    },
    {
      id: 'pro' as const,
      name: 'Zz Pro',
      component: LogoZzPro,
      description: '기하학적 심볼 + 3D depth',
      pros: [
        '✅ 가장 프리미엄',
        '✅ 독창적 심볼',
        '✅ 3D/Glassmorphism',
        '✅ 임팩트 강함'
      ],
      cons: ['⚠️ 작은 사이즈에서 복잡할 수 있음'],
    },
    {
      id: 'minimal' as const,
      name: 'Zz Minimal',
      component: LogoZzMinimal,
      description: '초미니멀, 앱 아이콘 최적화',
      pros: [
        '✅ 가장 심플',
        '✅ 앱 아이콘 완벽',
        '✅ 로딩 빠름',
        '✅ 확장성 최고'
      ],
      cons: ['⚠️ 심볼 없음'],
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-bg-primary' : 'bg-white'} transition-colors`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ⚡ Zz Logo - Supabase Style
            </h1>
            <p className={`text-lg ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
              2글자 워드마크 | 미니멀 | 모던 | 기하학적
            </p>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface text-white hover:bg-surface-2 transition-colors"
          >
            {darkMode ? '☀️ 라이트' : '🌙 다크'}
          </button>
        </div>

        {/* Design Principles - Supabase Style */}
        <div className={`mb-12 p-6 rounded-2xl border ${darkMode ? 'bg-surface/50 border-border' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎨 Design Principles (Supabase Inspired)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-primary' : 'text-orange-600'}`}>
                Minimal
              </div>
              <div className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                불필요한 장식 제거
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-accent' : 'text-teal-600'}`}>
                Geometric
              </div>
              <div className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                기하학적 단순함
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-primary' : 'text-orange-600'}`}>
                Modern
              </div>
              <div className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                트렌디하고 타임리스
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold mb-1 ${darkMode ? 'text-accent' : 'text-teal-600'}`}>
                Tech
              </div>
              <div className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                개발자 친화적
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {variants.map((variant) => {
            const LogoComponent = variant.component;
            const isSelected = selected === variant.id;
            
            return (
              <div
                key={variant.id}
                onClick={() => setSelected(variant.id)}
                className={`
                  relative p-8 rounded-2xl border-2 cursor-pointer transition-all
                  ${darkMode ? 'bg-surface' : 'bg-gray-50'}
                  ${isSelected 
                    ? 'border-primary shadow-2xl scale-105' 
                    : darkMode 
                      ? 'border-border hover:border-primary/50' 
                      : 'border-gray-200 hover:border-orange-300'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    SELECTED ✓
                  </div>
                )}
                
                {/* Logo Preview */}
                <div className="flex items-center justify-center h-48 mb-6">
                  <LogoComponent size="xl" animated={isSelected} />
                </div>
                
                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {variant.name}
                  </h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                    {variant.description}
                  </p>
                </div>
                
                {/* Pros & Cons */}
                <div className="space-y-1.5">
                  {variant.pros.map((pro, idx) => (
                    <div key={idx} className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      {pro}
                    </div>
                  ))}
                  {variant.cons.map((con, idx) => (
                    <div key={idx} className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                      {con}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Size Showcase */}
        {selected && (
          <div className={`p-8 rounded-2xl border mb-12 ${darkMode ? 'bg-surface border-border' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              사이즈 미리보기 - {variants.find(v => v.id === selected)?.name}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => {
                const LogoComponent = variants.find(v => v.id === selected)!.component;
                return (
                  <div key={size} className="flex flex-col items-center gap-4">
                    <LogoComponent size={size} />
                    <span className={`text-xs font-medium ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                      {size.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Variants Showcase (Default only) */}
        {selected === 'default' && (
          <div className={`p-8 rounded-2xl border mb-12 ${darkMode ? 'bg-surface border-border' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              스타일 바리에이션
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center gap-4">
                <LogoZz size="lg" variant="default" />
                <span className={`text-sm font-medium ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                  Default
                </span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <LogoZz size="lg" variant="icon-only" />
                <span className={`text-sm font-medium ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                  Icon Only
                </span>
              </div>
              <div className="flex flex-col items-center gap-4">
                <LogoZz size="lg" variant="outline" />
                <span className={`text-sm font-medium ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                  Outline
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => {
              if (selected) {
                alert(`✅ ${variants.find(v => v.id === selected)?.name} 선택됨!\n\n이제 스플래시 페이지에 적용하겠습니다.`);
              } else {
                alert('⚠️ 로고를 먼저 선택해주세요!');
              }
            }}
            disabled={!selected}
            className={`
              px-10 py-5 rounded-2xl font-bold text-lg transition-all
              ${selected 
                ? 'bg-primary text-white hover:brightness-110 shadow-2xl' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {selected ? `✨ ${variants.find(v => v.id === selected)?.name} 적용하기` : '로고를 선택하세요'}
          </button>
        </div>

        {/* Color Palette */}
        <div className={`mt-12 p-6 rounded-xl ${darkMode ? 'bg-surface/50' : 'bg-gray-100'}`}>
          <h3 className={`text-sm font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎨 Color Palette (Supabase Inspired)
          </h3>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ background: '#FF7A00' }}></div>
              <span className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>#FF7A00 (Orange)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ background: '#14B8A6' }}></div>
              <span className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>#14B8A6 (Teal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #14B8A6 100%)' }}></div>
              <span className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>Gradient</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
