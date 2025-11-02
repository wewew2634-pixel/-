# 🎨 찍먹(JJIKMEOK) Design System 2025

## 🎯 Design Philosophy

**"로컬 체험의 따뜻함 + 기술의 신뢰성"**

- **Local & Warm**: 로컬 비즈니스를 위한 따뜻하고 접근성 높은 디자인
- **Trust First**: 투명하고 신뢰를 주는 UI/UX
- **Mobile Perfect**: 손 안에서 완벽하게 작동하는 경험
- **Speed**: 60fps 네이티브 느낌, 즉각적 피드백

---

## 🎨 Color System

### Primary Colors (찍먹 전용)

```css
/* Brand Colors */
--jjik-primary: #FF6B35;      /* 따뜻한 오렌지 - 메인 */
--jjik-primary-light: #FF8C5F;
--jjik-primary-dark: #E55A28;

--jjik-secondary: #4ECDC4;    /* 민트 - 신뢰 */
--jjik-secondary-light: #7FE0D9;
--jjik-secondary-dark: #3AB6AD;

--jjik-accent: #FFE66D;        /* 노란색 - 강조/리워드 */
--jjik-accent-dark: #F5D942;
```

### Functional Colors

```css
/* Status Colors */
--jjik-success: #00C48C;       /* 승인/완료 */
--jjik-warning: #FFA94D;       /* 대기/주의 */
--jjik-danger: #FF6B6B;        /* 거절/오류 */
--jjik-info: #4A90E2;          /* 정보 */

/* Neutral Colors (Dark Theme Base) */
--jjik-bg-primary: #0A0E1A;    /* 메인 배경 */
--jjik-bg-secondary: #131825;  /* 카드 배경 */
--jjik-bg-elevated: #1A2234;   /* 상승 배경 */

--jjik-text-primary: #FFFFFF;  /* 메인 텍스트 */
--jjik-text-secondary: #B0B8C5; /* 보조 텍스트 */
--jjik-text-tertiary: #6B7280; /* 비활성 텍스트 */

--jjik-border: rgba(255, 255, 255, 0.08);
--jjik-border-hover: rgba(255, 107, 53, 0.3);
```

### Geo Map Colors

```css
--jjik-map-creator: #FF6B35;   /* Creator 마커 */
--jjik-map-merchant: #4ECDC4;  /* Merchant 마커 */
--jjik-map-radius: rgba(78, 205, 196, 0.15); /* 반경 표시 */
```

---

## 📝 Typography

### Font Stack

```css
--font-primary: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
--font-display: 'Pretendard Variable', sans-serif;
--font-mono: 'SF Mono', 'Consolas', monospace;
```

### Type Scale (모바일 최적화)

```css
/* Display */
--text-display-xl: 40px / 48px (2.5rem / 3rem)    /* 스플래시 */
--text-display-lg: 32px / 40px (2rem / 2.5rem)    /* 온보딩 헤드라인 */
--text-display-md: 28px / 36px (1.75rem / 2.25rem) /* 페이지 타이틀 */

/* Heading */
--text-h1: 24px / 32px (1.5rem / 2rem)    /* 섹션 헤드 */
--text-h2: 20px / 28px (1.25rem / 1.75rem) /* 카드 타이틀 */
--text-h3: 18px / 26px (1.125rem / 1.625rem) /* 서브 헤드 */

/* Body */
--text-lg: 16px / 24px (1rem / 1.5rem)     /* 중요 본문 */
--text-base: 15px / 22px (0.9375rem / 1.375rem) /* 기본 본문 */
--text-sm: 14px / 20px (0.875rem / 1.25rem) /* 보조 텍스트 */
--text-xs: 13px / 18px (0.8125rem / 1.125rem) /* 캡션 */

/* Special */
--text-caption: 12px / 16px (0.75rem / 1rem) /* 작은 설명 */
--text-button-lg: 17px / 24px (1.0625rem / 1.5rem) /* 큰 버튼 */
--text-button-md: 15px / 22px (0.9375rem / 1.375rem) /* 기본 버튼 */
--text-button-sm: 14px / 20px (0.875rem / 1.25rem) /* 작은 버튼 */
```

### Font Weights

```css
--weight-regular: 400;    /* 본문 */
--weight-medium: 500;     /* 강조 */
--weight-semibold: 600;   /* 헤드라인 */
--weight-bold: 700;       /* 매우 강조 */
```

---

## 📏 Spacing System (8px 기반)

```css
--space-0: 0px;
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */

/* Component Spacing */
--padding-page: 20px;           /* 페이지 여백 */
--padding-card: 16px;           /* 카드 내부 */
--padding-card-lg: 20px;        /* 큰 카드 */
--gap-items: 12px;              /* 아이템 간격 */
--gap-sections: 24px;           /* 섹션 간격 */
```

---

## 🔘 Border Radius

```css
--radius-sm: 8px;    /* 작은 요소 (뱃지, 태그) */
--radius-md: 12px;   /* 버튼, 인풋 */
--radius-lg: 16px;   /* 카드 */
--radius-xl: 20px;   /* 큰 카드, 모달 */
--radius-2xl: 24px;  /* 이미지 컨테이너 */
--radius-full: 9999px; /* 원형 */
```

---

## 🎭 Shadow System

```css
/* Elevation Shadows */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.08);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.12);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.16);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.24);

/* Brand Shadows */
--shadow-primary: 0 4px 16px rgba(255, 107, 53, 0.3);
--shadow-primary-hover: 0 8px 24px rgba(255, 107, 53, 0.4);
--shadow-success: 0 4px 12px rgba(0, 196, 140, 0.3);

/* Glass Effect */
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.3);
```

---

## ⚡ Animation

### Duration

```css
--duration-instant: 100ms;   /* 즉각 반응 */
--duration-fast: 200ms;      /* 빠른 전환 */
--duration-normal: 300ms;    /* 기본 */
--duration-slow: 500ms;      /* 느린 전환 */
```

### Easing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* 자연스러운 out */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* 부드러운 전환 */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* 탄성 */
```

### Transitions

```css
--transition-base: all 200ms var(--ease-out);
--transition-colors: color 150ms var(--ease-out), 
                     background-color 150ms var(--ease-out), 
                     border-color 150ms var(--ease-out);
--transition-transform: transform 200ms var(--ease-spring);
```

---

## 📱 Touch Targets (iOS HIG 기준)

```css
--touch-min: 44px;    /* 최소 터치 영역 */
--touch-comfortable: 48px; /* 편안한 터치 영역 */
--touch-large: 56px;  /* 큰 버튼 */
```

---

## 🎯 Component Tokens

### Button

```css
/* Primary Button */
.btn-primary {
  background: var(--jjik-primary);
  color: white;
  height: 48px;
  padding: 0 24px;
  border-radius: var(--radius-md);
  font-size: var(--text-button-md);
  font-weight: var(--weight-semibold);
  transition: var(--transition-base);
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover {
  background: var(--jjik-primary-dark);
  box-shadow: var(--shadow-primary-hover);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--jjik-text-primary);
  border: 1px solid var(--jjik-border);
  height: 48px;
  padding: 0 24px;
  border-radius: var(--radius-md);
}

.btn-ghost:hover {
  border-color: var(--jjik-primary);
  background: rgba(255, 107, 53, 0.08);
}
```

### Card

```css
.card {
  background: var(--jjik-bg-secondary);
  border: 1px solid var(--jjik-border);
  border-radius: var(--radius-lg);
  padding: var(--padding-card);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.card:hover {
  border-color: var(--jjik-border-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-elevated {
  background: var(--jjik-bg-elevated);
  box-shadow: var(--shadow-lg);
}
```

### Input

```css
.input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: var(--jjik-bg-secondary);
  border: 1px solid var(--jjik-border);
  border-radius: var(--radius-md);
  color: var(--jjik-text-primary);
  font-size: var(--text-base);
  transition: var(--transition-colors);
}

.input:focus {
  outline: none;
  border-color: var(--jjik-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.input::placeholder {
  color: var(--jjik-text-tertiary);
}
```

### Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
}

.badge-success {
  background: rgba(0, 196, 140, 0.15);
  color: var(--jjik-success);
  border: 1px solid rgba(0, 196, 140, 0.3);
}

.badge-warning {
  background: rgba(255, 169, 77, 0.15);
  color: var(--jjik-warning);
  border: 1px solid rgba(255, 169, 77, 0.3);
}
```

---

## 📐 Layout Grid

### Mobile (375px - 428px)

```css
--container-mobile: 100%;
--padding-mobile: 20px;
--gap-mobile: 16px;
```

### Tablet (768px+)

```css
--container-tablet: 720px;
--padding-tablet: 32px;
```

### Desktop (1024px+)

```css
--container-desktop: 1200px;
--padding-desktop: 48px;
```

---

## 🎯 Safe Area (iOS Notch 대응)

```css
.safe-top {
  padding-top: max(20px, env(safe-area-inset-top));
}

.safe-bottom {
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}

.tab-bar {
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}
```

---

## 🎨 Glassmorphism

```css
.glass {
  background: rgba(19, 24, 37, 0.7);
  backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-glass);
}

.glass-light {
  background: rgba(26, 34, 52, 0.5);
  backdrop-filter: blur(16px) saturate(120%);
}
```

---

## 🌐 Geo Map Styles

```css
/* Mapbox Style */
--map-style: "mapbox://styles/mapbox/dark-v11";

/* Custom Markers */
.marker-creator {
  width: 40px;
  height: 40px;
  background: var(--jjik-primary);
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
}

.marker-merchant {
  width: 40px;
  height: 40px;
  background: var(--jjik-secondary);
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
}

/* Cluster */
.marker-cluster {
  background: rgba(255, 107, 53, 0.8);
  border-radius: 50%;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 🔍 Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-fixed: 1200;
--z-modal-backdrop: 1300;
--z-modal: 1400;
--z-popover: 1500;
--z-toast: 1600;
```

---

## 📱 Breakpoints

```css
--breakpoint-xs: 375px;   /* iPhone SE */
--breakpoint-sm: 428px;   /* iPhone 14 Pro Max */
--breakpoint-md: 768px;   /* iPad Mini */
--breakpoint-lg: 1024px;  /* iPad Pro */
--breakpoint-xl: 1280px;  /* Desktop */
```

---

## ✨ Accessibility

```css
/* Focus States */
:focus-visible {
  outline: 2px solid var(--jjik-primary);
  outline-offset: 2px;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast */
@media (prefers-contrast: high) {
  .card {
    border-width: 2px;
  }
}
```

---

## 🎯 Usage Examples

### Primary CTA Button
```tsx
<button className="btn-primary">
  오퍼 보내기
</button>
```

### Creator Card
```tsx
<div className="card">
  <div className="flex items-center gap-3">
    <img className="w-12 h-12 rounded-full" />
    <div>
      <h3 className="text-h3 font-semibold">@creator_name</h3>
      <p className="text-sm text-secondary">12.5k followers</p>
    </div>
  </div>
  <div className="flex gap-2 mt-4">
    <span className="badge badge-success">카페</span>
    <span className="badge badge-success">디저트</span>
  </div>
</div>
```

### Status Badge
```tsx
<span className="badge badge-success">승인됨</span>
<span className="badge badge-warning">대기중</span>
<span className="badge-danger">거절됨</span>
```

---

## 📚 Resources

- [Pretendard Font](https://github.com/orioncactus/pretendard)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Last Updated**: 2025-10-16  
**Version**: 1.0.0  
**Designer**: Claude (찍먹 전용 최적화)
