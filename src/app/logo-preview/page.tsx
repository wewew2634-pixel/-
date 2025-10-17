'use client';

import { useState } from 'react';
import LogoVariantA from '@/components/logos/LogoVariantA';
import LogoVariantB from '@/components/logos/LogoVariantB';
import LogoVariantC from '@/components/logos/LogoVariantC';

/**
 * Logo Preview & Comparison Page
 * 
 * 3가지 성수동 감성 로고 비교
 * - Variant A: 미니멀 워드마크
 * - Variant B: 카메라 셔터 모티프
 * - Variant C: 플레이 버튼 + 타이포
 */
export default function LogoPreviewPage() {
  const [selectedVariant, setSelectedVariant] = useState<'A' | 'B' | 'C' | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const variants = [
    {
      id: 'A' as const,
      name: '미니멀 워드마크',
      component: LogoVariantA,
      description: '한글 + 영문 조합, 카페 감성',
      pros: ['✅ 가장 심플', '✅ 브랜드 인지도 최고', '✅ 확장성 좋음'],
      cons: ['⚠️ 독특함은 적음'],
    },
    {
      id: 'B' as const,
      name: '카메라 셔터',
      component: LogoVariantB,
      description: '[ 찍 ] 프레임, 15초 촬영 콘셉트',
      pros: ['✅ 가장 독창적', '✅ 기능 명확', '✅ 뷰파인더 감성'],
      cons: ['⚠️ 복잡할 수 있음'],
    },
    {
      id: 'C' as const,
      name: '플레이 버튼',
      component: LogoVariantC,
      description: '▶ 찍먹, 숏폼 강조',
      pros: ['✅ 가장 직관적', '✅ 숏폼 연상', '✅ 임팩트 강함'],
      cons: ['⚠️ 틱톡과 유사할 수 있음'],
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-bg-primary' : 'bg-white'} transition-colors`}>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-black mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              🎨 성수동 감성 로고 비교
            </h1>
            <p className={`${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
              3가지 디자인을 비교하고 최적의 로고를 선택하세요
            </p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-surface text-white hover:bg-surface-2 transition-colors"
          >
            {darkMode ? '☀️ 라이트' : '🌙 다크'}
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {variants.map((variant) => {
            const LogoComponent = variant.component;
            const isSelected = selectedVariant === variant.id;
            
            return (
              <div
                key={variant.id}
                onClick={() => setSelectedVariant(variant.id)}
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
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    선택됨 ✓
                  </div>
                )}
                
                {/* Logo Preview */}
                <div className="flex items-center justify-center h-40 mb-6">
                  <LogoComponent size="xl" animated={isSelected} />
                </div>
                
                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Variant {variant.id}: {variant.name}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
                    {variant.description}
                  </p>
                </div>
                
                {/* Pros & Cons */}
                <div className="space-y-2">
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

        {/* Size Variations */}
        {selectedVariant && (
          <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-surface border-border' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              사이즈 미리보기 - Variant {selectedVariant}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => {
                const LogoComponent = variants.find(v => v.id === selectedVariant)!.component;
                return (
                  <div key={size} className="flex flex-col items-center gap-3">
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

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              if (selectedVariant) {
                alert(`Variant ${selectedVariant} 선택됨! 이제 스플래시 페이지에 적용하겠습니다.`);
              } else {
                alert('로고를 먼저 선택해주세요!');
              }
            }}
            disabled={!selectedVariant}
            className={`
              px-8 py-4 rounded-2xl font-bold text-lg transition-all
              ${selectedVariant 
                ? 'bg-primary text-white hover:brightness-110 shadow-xl' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {selectedVariant ? `Variant ${selectedVariant} 적용하기 →` : '로고를 선택하세요'}
          </button>
        </div>

        {/* Specs */}
        <div className={`mt-12 p-6 rounded-xl ${darkMode ? 'bg-surface/50' : 'bg-gray-100'}`}>
          <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📐 기술 스펙
          </h3>
          <ul className={`text-xs space-y-1 ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
            <li>• SVG 기반 (무한 확장 가능)</li>
            <li>• 4가지 사이즈: sm, md, lg, xl</li>
            <li>• 다크/라이트 모드 지원</li>
            <li>• Gradient: #FF7A00 → #FF5E00 (Brand Orange)</li>
            <li>• 애니메이션: 미니멀하게 (성능 최적화)</li>
            <li>• Pretendard Variable 폰트</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
