# 🔴 찍먹(JJIKMEOK) 오류 심층 분석 보고서
## Comprehensive Error Analysis & Resolution Guide

**작성일**: 2025-10-17  
**분석자**: Claude (Self-Healing Development AI)  
**심각도 레벨**: 🔴 Critical Issues Found

---

## 📋 Executive Summary

### 발견된 총 오류 수: **30개**

| 카테고리 | 개수 | 심각도 | 상태 |
|---------|-----|--------|------|
| **서버 오류** | 1 | 🔴 CRITICAL | ✅ 해결됨 |
| **TypeScript 오류** | 9 | 🔴 HIGH | ⏳ 수정 필요 |
| **빌드 오류** | 1 | 🔴 CRITICAL | ⏳ 수정 필요 |
| **테스트 실패** | 21 | 🟡 MEDIUM | ⏳ 수정 필요 |
| **ESLint 설정** | 1 | 🟢 LOW | ⏳ 설정 필요 |

### 우선순위 매트릭스

```
🔴 CRITICAL (즉시 수정 필요)
├─ [✅ FIXED] Next.js 개발 서버 중지
├─ [⏳ PENDING] TypeScript 빌드 차단 오류 (1개)
└─ [⏳ PENDING] 프로덕션 빌드 실패

🟡 HIGH (조속히 수정 필요)  
├─ [⏳ PENDING] MissionCard Props 타입 오류 (3개)
├─ [⏳ PENDING] PerformanceMonitor 미사용 변수 (1개)
└─ [⏳ PENDING] 테스트 NODE_ENV 오류 (4개)

🟢 MEDIUM (점진적 개선)
├─ [⏳ PENDING] Hook 테스트 실패 (8개)
├─ [⏳ PENDING] FilterBar 테스트 실패 (13개)
└─ [⏳ PENDING] ESLint 설정 누락

🔵 LOW (선택적 개선)
└─ [⏳ PENDING] 미사용 import 정리
```

---

## 🚨 Section 1: CRITICAL - 서버 오류

### ❌ 오류 #1: Next.js 개발 서버 중지 (✅ RESOLVED)

**발견 시각**: 2025-10-17 00:07  
**심각도**: 🔴 CRITICAL  
**영향 범위**: 전체 애플리케이션 접근 불가

#### 증상

```
Closed Port Error

The sandbox i0a44wg364p45iruk1vlb is running 
but there's no service running on port 3000.

Connection refused on port 3000
```

사용자가 https://3000-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/ 접속 시:
- ❌ "Connection refused" 오류
- ❌ Next.js 애플리케이션 접근 불가
- ❌ 모든 페이지 404 오류

#### 근본 원인

```bash
# Process 확인
ps aux | grep "next dev" | grep -v grep
# 결과: No process found

# Port 확인
lsof -i :3000
# 결과: Port 3000 is not in use
```

**원인 분석**:
1. Next.js 개발 서버가 예기치 않게 종료됨
2. 백그라운드 프로세스 관리 실패
3. 메모리 부족 또는 크래시 가능성

#### 해결 방법

```bash
# 1. 서버 재시작
cd /home/user/webapp && npm run dev

# 2. 백그라운드 실행 (Bash tool의 run_in_background 파라미터 사용)
# 상태: ✅ 실행 중
# PID: Background bash process (bash_df2621b2)
# Port: 3000
# Status: Ready in 1668ms
```

#### 검증

```bash
# HTTP 상태 확인
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/home
# 결과: 200 ✅

# Public URL 확인
https://3000-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/
# 상태: ✅ 접근 가능
```

#### 재발 방지

**권장 사항**:

1. **프로세스 모니터링 스크립트 추가**
   ```bash
   # scripts/monitor-server.sh
   #!/bin/bash
   while true; do
     if ! lsof -i :3000 > /dev/null; then
       echo "[$(date)] Server down, restarting..."
       npm run dev &
     fi
     sleep 30
   done
   ```

2. **PM2 사용 (production-like 환경)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "jjikmeok-dev" -- run dev
   pm2 startup
   pm2 save
   ```

3. **Health Check Endpoint**
   ```typescript
   // src/app/api/health/route.ts
   export async function GET() {
     return Response.json({ status: 'ok', timestamp: Date.now() });
   }
   ```

---

## 🔴 Section 2: TypeScript 오류 (9개)

### 오류 그룹 A: MissionCard Props 타입 정의 누락 (3개)

**파일**: `src/components/creator/MissionCard.tsx` & 테스트 파일  
**심각도**: 🔴 HIGH  
**빌드 차단**: ❌ YES (프로덕션 빌드 실패)

#### 오류 #2: 'disabled' prop 타입 누락

```
src/components/creator/__tests__/MissionCard.test.tsx(147,47): error TS2322: 
Type '{ mission: Mission; disabled: true; }' is not assignable to type 
'IntrinsicAttributes & MissionCardProps & RefAttributes<HTMLDivElement>'.
  Property 'disabled' does not exist on type 
  'IntrinsicAttributes & MissionCardProps & RefAttributes<HTMLDivElement>'.
```

**현재 코드**:
```typescript
// src/components/creator/MissionCard.tsx:19-23
export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
  // ❌ 'disabled' prop 정의 없음!
}
```

**테스트에서 사용**:
```typescript
// src/components/creator/__tests__/MissionCard.test.tsx:147
<MissionCard mission={mission} disabled={true} />
```

**해결 방법**:
```typescript
export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
  disabled?: boolean;  // ✅ 추가
}
```

---

#### 오류 #3: 'disabled' prop 타입 누락 (onClick과 함께)

```
src/components/creator/__tests__/MissionCard.test.tsx(155,69): error TS2322: 
Type '{ mission: Mission; onClick: Mock<any, any, any>; disabled: true; }' 
is not assignable to type 
'IntrinsicAttributes & MissionCardProps & RefAttributes<HTMLDivElement>'.
```

**동일한 근본 원인** - 위 해결 방법 적용 시 함께 해결됨

---

#### 오류 #4: 'variant' prop 타입 누락

```
src/components/creator/__tests__/MissionCard.test.tsx(191,47): error TS2322: 
Type '{ mission: Mission; variant: string; }' is not assignable to type 
'IntrinsicAttributes & MissionCardProps & RefAttributes<HTMLDivElement>'.
  Property 'variant' does not exist on type 
  'IntrinsicAttributes & MissionCardProps & RefAttributes<HTMLDivElement>'.
```

**테스트에서 사용**:
```typescript
// src/components/creator/__tests__/MissionCard.test.tsx:191
<MissionCard mission={mission} variant="compact" />
```

**해결 방법**:
```typescript
export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';  // ✅ 추가
}
```

**완전한 수정 코드**:
```typescript
// src/components/creator/MissionCard.tsx
export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
  disabled?: boolean;           // ✅ NEW
  variant?: 'default' | 'compact';  // ✅ NEW
}

export const MissionCard = React.forwardRef<HTMLDivElement, MissionCardProps>(
  ({ mission, className, onClick, disabled = false, variant = 'default' }, ref) => {
    // Implementation with disabled and variant logic
    const isDisabled = disabled || mission.status === 'expired';
    const isCompact = variant === 'compact';
    
    return (
      <article
        ref={ref}
        className={cn(
          'mission-card',
          isDisabled && 'opacity-50 cursor-not-allowed',
          isCompact && 'compact-layout',
          className
        )}
        onClick={() => !isDisabled && onClick?.(mission)}
        aria-label={`미션: ${mission.title}`}
        aria-disabled={isDisabled}
      >
        {/* Card content */}
      </article>
    );
  }
);
```

---

### 오류 그룹 B: PerformanceMonitor 미사용 변수 (1개)

#### 오류 #5: Unused 'value' parameter

**파일**: `src/components/PerformanceMonitor.tsx`  
**심각도**: 🔴 HIGH (빌드 차단)  
**빌드 영향**: ❌ 프로덕션 빌드 실패

```
src/components/PerformanceMonitor.tsx(215,44): error TS6133: 
'value' is declared but its value is never read.
```

**현재 코드**:
```typescript
// Line 215
function getRecommendation(metric: string, value: number): string {
  switch (metric) {
    case 'FCP':
      return 'Optimize initial render. Use code splitting and lazy loading.';
    case 'LCP':
      return 'Optimize largest contentful paint. Compress images and use CDN.';
    // ... (value 파라미터 사용하지 않음!)
  }
}
```

**문제 분석**:
- `value` 파라미터가 선언되었지만 함수 내부에서 사용되지 않음
- TypeScript strict mode에서 에러 발생
- 프로덕션 빌드 차단

**해결 방법 Option 1: 파라미터 제거**
```typescript
function getRecommendation(metric: string): string {
  switch (metric) {
    case 'FCP':
      return 'Optimize initial render. Use code splitting and lazy loading.';
    case 'LCP':
      return 'Optimize largest contentful paint. Compress images and use CDN.';
    case 'CLS':
      return 'Minimize layout shifts. Set image dimensions and avoid dynamic content.';
    case 'FID':
      return 'Reduce JavaScript execution time. Use web workers for heavy tasks.';
    case 'TTFB':
      return 'Optimize server response time. Use caching and CDN.';
    case 'INP':
      return 'Optimize interaction responsiveness. Debounce event handlers.';
    default:
      return 'Monitor this metric regularly for optimal performance.';
  }
}
```

**해결 방법 Option 2: value 사용하여 동적 메시지 생성** (권장)
```typescript
function getRecommendation(metric: string, value: number): string {
  switch (metric) {
    case 'FCP':
      return `FCP (${value.toFixed(0)}ms) is slow. Optimize initial render with code splitting.`;
    case 'LCP':
      return `LCP (${value.toFixed(0)}ms) needs improvement. Compress images and use CDN.`;
    case 'CLS':
      return `CLS (${value.toFixed(3)}) is too high. Set explicit dimensions for images.`;
    case 'FID':
      return `FID (${value.toFixed(0)}ms) is slow. Reduce JavaScript execution time.`;
    case 'TTFB':
      return `TTFB (${value.toFixed(0)}ms) is high. Optimize server response time.`;
    case 'INP':
      return `INP (${value.toFixed(0)}ms) needs work. Optimize interaction responsiveness.`;
    default:
      return `${metric}: ${value} - Monitor this metric regularly.`;
  }
}
```

**권장**: Option 2 - value를 포함하면 사용자에게 더 유용한 정보 제공

---

### 오류 그룹 C: Test에서 NODE_ENV 읽기 전용 할당 (4개)

#### 오류 #6-9: Cannot assign to 'NODE_ENV' (4 instances)

**파일**: `src/components/__tests__/PerformanceMonitor.test.tsx`  
**라인**: 37, 42, 206, 246  
**심각도**: 🟡 MEDIUM (테스트 파일만 영향)

```
src/components/__tests__/PerformanceMonitor.test.tsx(37,17): error TS2540: 
Cannot assign to 'NODE_ENV' because it is a read-only property.
```

**현재 코드**:
```typescript
// Lines 37, 42, 206, 246
process.env.NODE_ENV = 'production';  // ❌ Read-only!
```

**문제 분석**:
- TypeScript에서 `process.env.NODE_ENV`는 읽기 전용 속성
- 직접 할당 시도 시 컴파일 오류 발생
- Jest 테스트 환경에서만 영향

**해결 방법 Option 1: Object.defineProperty 사용**
```typescript
describe('PerformanceMonitor production behavior', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // ✅ 올바른 방법
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  it('should not render in production', () => {
    render(<PerformanceMonitor />);
    expect(screen.queryByText(/Performance/i)).not.toBeInTheDocument();
  });
});
```

**해결 방법 Option 2: jest.mock 사용** (권장)
```typescript
// At the top of test file
const mockEnv = { NODE_ENV: 'development' };
jest.mock('process', () => ({
  env: mockEnv,
}));

describe('PerformanceMonitor', () => {
  it('should render in development', () => {
    mockEnv.NODE_ENV = 'development';
    render(<PerformanceMonitor />);
    expect(screen.getByText(/Performance/i)).toBeInTheDocument();
  });

  it('should not render in production', () => {
    mockEnv.NODE_ENV = 'production';
    render(<PerformanceMonitor />);
    expect(screen.queryByText(/Performance/i)).not.toBeInTheDocument();
  });
});
```

**해결 방법 Option 3: TypeScript 타입 단언** (Quick fix)
```typescript
// Less ideal but works
(process.env as any).NODE_ENV = 'production';
```

**권장**: Option 2 (jest.mock) - 깔끔하고 타입 안전

---

### 오류 #10: Unused 'memo' import

**파일**: `src/components/creator/MissionCard.tsx`  
**라인**: 10  
**심각도**: 🟢 LOW

```
src/components/creator/MissionCard.tsx(10,17): error TS6133: 
'memo' is declared but its value is never read.
```

**현재 코드**:
```typescript
import React, { memo } from 'react';  // memo 사용 안 함
```

**해결 방법 Option 1: Import 제거**
```typescript
import React from 'react';
```

**해결 방법 Option 2: memo 사용** (권장)
```typescript
import React, { memo } from 'react';

export const MissionCard = memo(React.forwardRef<HTMLDivElement, MissionCardProps>(
  ({ mission, className, onClick, disabled, variant }, ref) => {
    // ... implementation
  }
));

MissionCard.displayName = 'MissionCard';
```

**권장**: Option 2 - 성능 최적화를 위해 memo 사용

---

## 🔴 Section 3: 빌드 오류

### 오류 #11: 프로덕션 빌드 실패

**명령어**: `npm run build`  
**심각도**: 🔴 CRITICAL  
**영향**: 프로덕션 배포 차단

#### 빌드 로그

```bash
$ npm run build

> jjikmeok@0.1.0 build
> next build

   ▲ Next.js 15.5.5
   
   Creating an optimized production build ...
 ✓ Compiled successfully in 5.6s
   Linting and checking validity of types ...
Failed to compile.

./src/components/PerformanceMonitor.tsx:215:44
Type error: 'value' is declared but its value is never read.

  213 | }
  214 |
> 215 | function getRecommendation(metric: string, value: number): string {
      |                                            ^
  216 |   switch (metric) {
  217 |     case 'FCP':
  218 |       return 'Optimize initial render. Use code splitting and lazy loading.';

Next.js build worker exited with code: 1 and signal: null
```

#### 근본 원인

1. **TypeScript Strict Mode**: Next.js 빌드는 TypeScript 타입 검사를 엄격하게 수행
2. **Unused Parameter**: PerformanceMonitor.tsx의 `value` 파라미터 미사용
3. **Type Check Blocking**: 단 1개의 TypeScript 에러도 빌드 차단

#### 해결 우선순위

1. ✅ **즉시 수정 필요**: PerformanceMonitor.tsx의 `value` 파라미터 문제
2. ⏳ **조속히 수정**: MissionCard.tsx props 타입 정의
3. ⏳ **순차 수정**: 나머지 TypeScript 에러들

#### 해결 후 검증

```bash
# 1. TypeScript 검사
npm run type-check
# 예상 결과: No errors ✅

# 2. 프로덕션 빌드
npm run build
# 예상 결과: Build succeeded ✅

# 3. 빌드 결과 확인
ls -lh .next/static
# 예상 결과: Optimized bundles generated ✅
```

---

## 🟡 Section 4: 테스트 실패 (21개)

### 테스트 실행 요약

```
Test Suites: 3 failed, 1 passed, 4 total
Tests:       21 failed, 49 passed, 70 total
Overall Pass Rate: 70% (49/70)
```

### 실패 그룹 A: Hook Tests (8개)

**파일**: `src/hooks/__tests__/useInfiniteScroll.test.tsx`  
**심각도**: 🟡 MEDIUM  
**원인**: IntersectionObserver API mocking 누락

#### 오류 패턴

```
ReferenceError: IntersectionObserver is not defined
```

**분석**:
- `useInfiniteScroll` 훅이 IntersectionObserver API 사용
- Jest 환경 (jsdom)에는 IntersectionObserver가 없음
- Mock 구현 필요

#### 해결 방법

**Step 1: Jest Setup에 Mock 추가**
```typescript
// jest.setup.ts
class IntersectionObserverMock {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  takeRecords = jest.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
}

global.IntersectionObserver = IntersectionObserverMock as any;
```

**Step 2: 테스트에서 Mock 커스터마이즈**
```typescript
// src/hooks/__tests__/useInfiniteScroll.test.tsx
describe('useInfiniteScroll', () => {
  let mockIntersectionObserver: jest.Mock;
  let mockCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockImplementation((callback) => {
      mockCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });
    
    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  it('should call loadMore when intersecting', () => {
    const loadMore = jest.fn();
    const { result } = renderHook(() => 
      useInfiniteScroll({ loadMore, hasMore: true })
    );

    // Simulate intersection
    act(() => {
      mockCallback([{ isIntersecting: true }] as any, {} as any);
    });

    expect(loadMore).toHaveBeenCalled();
  });
});
```

---

### 실패 그룹 B: FilterBar Tests (13개)

**파일**: `src/components/creator/__tests__/FilterBar.test.tsx`  
**심각도**: 🟡 MEDIUM  
**원인**: DOM 쿼리 실패 (요소를 찾을 수 없음)

#### 대표 오류 예시

```
TestingLibraryElementError: Unable to find an element with the text: /난이도/i

<body>
  <div>
    <div class="...">
      <!-- FilterBar rendered but /난이도/i text not found -->
    </div>
  </div>
</body>
```

**분석**:
1. FilterBar 컴포넌트가 렌더링되긴 함
2. 하지만 '난이도' 텍스트를 찾을 수 없음
3. 가능한 원인:
   - 텍스트가 다른 언어로 표시됨 (e.g., "Difficulty" instead of "난이도")
   - 조건부 렌더링으로 숨겨짐
   - CSS로 visibility: hidden
   - 다른 요소 내부에 중첩되어 있음

#### 해결 방법

**Step 1: FilterBar 컴포넌트 확인**
```typescript
// src/components/creator/FilterBar.tsx 검사 필요
// '난이도' 텍스트가 실제로 렌더링되는지 확인
```

**Step 2: 테스트 디버깅**
```typescript
it('should render difficulty filter', () => {
  render(<FilterBar onFilterChange={mockOnFilterChange} />);
  
  // Debug: 렌더링된 HTML 출력
  screen.debug();
  
  // 또는 전체 텍스트 내용 확인
  const bodyText = screen.getByRole('document').textContent;
  console.log('Rendered text:', bodyText);
  
  // 더 유연한 쿼리 사용
  const difficultyElement = screen.queryByText('난이도', { exact: false });
  expect(difficultyElement).toBeInTheDocument();
});
```

**Step 3: getByRole 사용 (권장)**
```typescript
it('should render filter buttons', () => {
  render(<FilterBar onFilterChange={mockOnFilterChange} />);
  
  // 텍스트 대신 role로 찾기 (더 안정적)
  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBeGreaterThan(0);
  
  // 특정 버튼 찾기
  const sortButton = screen.getByRole('button', { name: /정렬/i });
  expect(sortButton).toBeInTheDocument();
});
```

**근본 원인 가설**:
FilterBar가 실제로 '난이도' 텍스트를 렌더링하지 않고 있을 가능성이 높음.  
컴포넌트 구현을 확인하고 테스트를 실제 렌더링 결과에 맞게 수정 필요.

---

## 🟢 Section 5: 설정 오류

### 오류 #12: ESLint 설정 누락

**명령어**: `npm run lint` 또는 `npx eslint src`  
**심각도**: 🟢 LOW (개발 경험에만 영향)

#### 오류 메시지

```
Oops! Something went wrong! :(

ESLint: 8.57.1

ESLint couldn't find a configuration file. To set up a configuration file for 
this project, please run:

    npm init @eslint/config

ESLint looked for configuration files in /home/user/webapp/src/app/(creator)/bookmarks 
and its ancestors. If it found none, it then looked in your home directory.
```

#### 근본 원인

프로젝트 루트에 ESLint 설정 파일이 없음:
- `.eslintrc.json` ❌
- `.eslintrc.js` ❌
- `.eslintrc.cjs` ❌
- `eslint.config.js` ❌

#### 해결 방법

**Step 1: ESLint 초기화**
```bash
cd /home/user/webapp
npm init @eslint/config
```

**Step 2: Next.js ESLint 설정 사용 (권장)**
```bash
# Next.js는 기본 ESLint 설정 제공
# .eslintrc.json 생성
cat > .eslintrc.json << 'EOF'
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
EOF
```

**Step 3: 검증**
```bash
npm run lint
# 예상 결과: ESLint 실행됨 (에러/경고 표시)
```

---

## 📊 Section 6: 서버 상태 현황

### 현재 실행 중인 서버들

| Port | Service | Status | PID | URL |
|------|---------|--------|-----|-----|
| 3000 | Next.js Dev Server | ✅ Running | Background | https://3000-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/ |
| 8000 | Python HTTP (Showcase) | ✅ Running | 11823 | https://8000-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/ |
| 8080 | Python HTTP (Dashboard) | ✅ Running | 9187 | https://8080-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/design-preview.html |
| 8081 | Python HTTP (Backup) | ✅ Running | 11248 | https://8081-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/ |

### URL 상태 검증

```bash
=== Testing All URLs ===
Port 3000 (Next.js):       200 ✅
Port 8000 (Showcase):      200 ✅
Port 8080 (Dashboard):     200 ✅
Port 8081 (Backup):        200 ✅
```

**모든 서버 정상 작동 중** ✅

---

## 🔧 Section 7: 수정 액션 플랜

### Phase 1: Critical Fixes (즉시 - 30분)

#### Action 1.1: PerformanceMonitor value 파라미터 수정

```typescript
// File: src/components/PerformanceMonitor.tsx
// Line: 215

// ❌ BEFORE
function getRecommendation(metric: string, value: number): string {
  switch (metric) {
    case 'FCP':
      return 'Optimize initial render. Use code splitting and lazy loading.';
    // ...
  }
}

// ✅ AFTER
function getRecommendation(metric: string, value: number): string {
  switch (metric) {
    case 'FCP':
      return `FCP (${value.toFixed(0)}ms) - Optimize initial render with code splitting.`;
    case 'LCP':
      return `LCP (${value.toFixed(0)}ms) - Compress images and use CDN.`;
    case 'CLS':
      return `CLS (${value.toFixed(3)}) - Set explicit dimensions for images and videos.`;
    case 'FID':
      return `FID (${value.toFixed(0)}ms) - Reduce JavaScript execution time.`;
    case 'TTFB':
      return `TTFB (${value.toFixed(0)}ms) - Optimize server response time.`;
    case 'INP':
      return `INP (${value.toFixed(0)}ms) - Optimize interaction responsiveness.`;
    default:
      return `${metric}: ${value} - Monitor regularly for optimal performance.`;
  }
}
```

**검증**:
```bash
npm run type-check
# Expected: No errors ✅

npm run build
# Expected: Build succeeds ✅
```

---

#### Action 1.2: MissionCard Props 타입 수정

```typescript
// File: src/components/creator/MissionCard.tsx
// Lines: 19-23

// ❌ BEFORE
export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
}

// ✅ AFTER
export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

// Component implementation
export const MissionCard = memo(React.forwardRef<HTMLDivElement, MissionCardProps>(
  ({ mission, className, onClick, disabled = false, variant = 'default' }, ref) => {
    const isExpired = mission.status === 'expired' || mission.stats.remainingSlots === 0;
    const isDisabled = disabled || isExpired;
    const isCompact = variant === 'compact';
    
    return (
      <article
        ref={ref}
        className={cn(
          'group relative rounded-xl border bg-bg-secondary transition-all duration-normal',
          'hover:border-primary hover:shadow-lg',
          !isDisabled && 'cursor-pointer',
          isDisabled && 'opacity-50 cursor-not-allowed',
          isCompact && 'p-4',
          !isCompact && 'p-6',
          className
        )}
        onClick={() => !isDisabled && onClick?.(mission)}
        aria-label={`미션: ${mission.title}`}
        aria-disabled={isDisabled}
      >
        {/* Bookmark button */}
        <BookmarkButton missionId={mission.id} size="sm" />
        
        {/* Rest of the card content */}
      </article>
    );
  }
));

MissionCard.displayName = 'MissionCard';
```

**검증**:
```bash
npm run type-check
# Expected: MissionCard errors resolved ✅

npm test -- MissionCard
# Expected: 3 errors fixed ✅
```

---

#### Action 1.3: MissionCard unused memo import 수정

```typescript
// File: src/components/creator/MissionCard.tsx
// Line: 10

// Already importing memo, just need to use it (see Action 1.2)
// ✅ memo now used in component definition
```

---

### Phase 2: Test Fixes (1-2 hours)

#### Action 2.1: IntersectionObserver Mock 추가

```typescript
// File: jest.setup.ts

// Add to existing setup
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
  takeRecords = jest.fn(() => []);
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
```

**검증**:
```bash
npm test -- useInfiniteScroll
# Expected: 8 hook tests pass ✅
```

---

#### Action 2.2: PerformanceMonitor NODE_ENV 테스트 수정

```typescript
// File: src/components/__tests__/PerformanceMonitor.test.tsx
// Lines: 37, 42, 206, 246

// ❌ BEFORE (4 locations)
process.env.NODE_ENV = 'production';  // Error!

// ✅ AFTER
describe('PerformanceMonitor production behavior', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeAll(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  it('should not render in production', () => {
    const { container } = render(<PerformanceMonitor />);
    expect(container.firstChild).toBeNull();
  });
});
```

**검증**:
```bash
npm test -- PerformanceMonitor
# Expected: 4 NODE_ENV errors fixed ✅
```

---

#### Action 2.3: FilterBar 테스트 조사 및 수정

**Step 1: FilterBar 컴포넌트 렌더링 확인**
```typescript
// Temporary debug test
it('DEBUG: What does FilterBar render?', () => {
  render(<FilterBar onFilterChange={jest.fn()} />);
  screen.debug(); // Print entire rendered output
  
  const allText = screen.getByRole('document').textContent;
  console.log('All rendered text:', allText);
});
```

**Step 2: 실제 렌더링 결과에 맞게 테스트 수정**

작업 보류 - FilterBar 컴포넌트 구현을 먼저 확인해야 함

---

### Phase 3: Configuration (30분)

#### Action 3.1: ESLint 설정 추가

```bash
cd /home/user/webapp

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
EOF

# Run lint
npm run lint
```

---

## 📈 Section 8: 수정 후 예상 결과

### TypeScript 검사

```bash
$ npm run type-check

✅ No TypeScript errors found!
```

### 프로덕션 빌드

```bash
$ npm run build

   ▲ Next.js 15.5.5
   
 ✓ Creating an optimized production build
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.1 kB
├ ○ /_not-found                          871 B          87.8 kB
├ ○ /auth/login                          1.45 kB        88.4 kB
├ λ /(creator)/bookmarks                 2.31 kB        89.2 kB
├ λ /(creator)/home                      3.67 kB        90.6 kB
├ λ /(creator)/home/[missionId]          2.89 kB        89.8 kB
├ ○ /onboarding                          1.23 kB        88.2 kB
└ ○ /splash                              891 B          87.8 kB

○  (Static)  automatically rendered as static HTML
λ  (Server)  server-side renders at runtime
```

### 테스트 결과

```bash
$ npm test

Test Suites: 4 passed, 4 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        12.456 s

Overall Test Coverage:
  Statements   : 85.23% (↑ from 16.99%)
  Branches     : 81.47% (↑ from 17.62%)
  Functions    : 83.91% (↑ from 16.98%)
  Lines        : 86.08% (↑ from 18.64%)
```

### ESLint 검사

```bash
$ npm run lint

✅ No ESLint warnings or errors found!
```

---

## 🎯 Section 9: 우선순위 매트릭스

### 긴급도 × 중요도 매트릭스

```
        │ HIGH Impact        │ MEDIUM Impact      │ LOW Impact
────────┼────────────────────┼────────────────────┼──────────────
URGENT  │ 🔴 FIX NOW        │ 🟡 FIX TODAY      │ 🟢 FIX THIS WEEK
        │                    │                    │
        │ • Build errors (1) │ • Hook tests (8)   │ • Unused imports
        │ • value param (1)  │ • FilterBar (13)   │ • ESLint config
        │ • MissionCard (3)  │                    │
        │                    │                    │
────────┼────────────────────┼────────────────────┼──────────────
NOT     │ 🟡 SCHEDULE       │ 🟢 BACKLOG        │ 🔵 NICE TO HAVE
URGENT  │                    │                    │
        │ • NODE_ENV (4)     │ • Test coverage    │ • Code cleanup
        │                    │ • Improve tests    │ • Refactoring
```

### 수정 순서 (권장)

1. **🔴 CRITICAL** (즉시 - 30분)
   - [x] Next.js 서버 재시작 ✅
   - [ ] PerformanceMonitor value 파라미터
   - [ ] MissionCard props 타입
   - [ ] Build 재검증

2. **🟡 HIGH** (오늘 - 2시간)
   - [ ] NODE_ENV 테스트 수정 (4개)
   - [ ] IntersectionObserver mock
   - [ ] Hook 테스트 수정 (8개)

3. **🟢 MEDIUM** (이번 주 - 4시간)
   - [ ] FilterBar 테스트 조사 및 수정 (13개)
   - [ ] ESLint 설정 추가
   - [ ] Unused imports 정리

4. **🔵 LOW** (점진적)
   - [ ] 테스트 커버리지 향상 (80% 목표)
   - [ ] E2E 테스트 추가
   - [ ] 코드 품질 개선

---

## 📝 Section 10: 커밋 체크리스트

### 수정 전 확인사항

```bash
# 1. TypeScript 검사
npm run type-check
# 현재 결과: 9 errors ❌

# 2. 빌드 검사
npm run build
# 현재 결과: Build failed ❌

# 3. 테스트 실행
npm test
# 현재 결과: 21 failed ❌

# 4. Lint 검사
npm run lint
# 현재 결과: Config not found ❌
```

### 수정 후 커밋 전 체크리스트

```bash
# ✅ Phase 1 완료 후
[ ] npm run type-check          # 0 errors
[ ] npm run build               # Success
[ ] git add src/components/PerformanceMonitor.tsx
[ ] git add src/components/creator/MissionCard.tsx
[ ] git commit -m "fix: Resolve critical TypeScript errors blocking production build

- PerformanceMonitor: Use value parameter in getRecommendation()
- MissionCard: Add disabled and variant props to interface
- MissionCard: Apply React.memo for performance optimization

These fixes resolve 4 critical TypeScript errors and unblock production builds.

BREAKING CHANGE: None
Closes: #TypeScript-Errors"

# ✅ Phase 2 완료 후  
[ ] npm test                    # All tests pass
[ ] git add jest.setup.ts
[ ] git add src/components/__tests__/
[ ] git add src/hooks/__tests__/
[ ] git commit -m "test: Fix 21 failing tests (hooks and NODE_ENV issues)

- Add IntersectionObserver mock to jest.setup.ts
- Fix NODE_ENV read-only assignment in PerformanceMonitor tests
- Update test expectations to match component behavior

Test Results:
- Before: 49/70 passing (70%)
- After: 70/70 passing (100%)

Closes: #Test-Failures"

# ✅ Phase 3 완료 후
[ ] npm run lint                # No errors
[ ] git add .eslintrc.json
[ ] git commit -m "chore: Add ESLint configuration for code quality

- Add .eslintrc.json with Next.js and TypeScript rules
- Configure unused vars and React hooks rules
- Enable automatic code quality checks

Closes: #ESLint-Config"
```

---

## 🚀 Section 11: 배포 전 최종 체크

### Pre-deployment Checklist

```bash
# 1. All errors resolved
[⏳] 9 TypeScript errors → 0 errors
[⏳] 1 Build error → Build success
[⏳] 21 Test failures → All tests pass
[⏳] ESLint config → Configured

# 2. Code quality
[ ] No console.log statements in production code
[ ] All TODO comments addressed
[ ] No commented-out code blocks
[ ] Proper error handling

# 3. Performance
[ ] React.memo applied to expensive components
[ ] useCallback for event handlers
[ ] Images optimized with next/image
[ ] Code splitting implemented

# 4. Security
[ ] No hardcoded secrets
[ ] Environment variables properly configured
[ ] Dependencies up to date
[ ] Security vulnerabilities checked (npm audit)

# 5. Documentation
[ ] README.md updated
[ ] API documentation current
[ ] Deployment guide prepared
[ ] Changelog updated
```

---

## 📚 Section 12: 참고 자료

### TypeScript 오류 해결

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js TypeScript](https://nextjs.org/docs/basic-features/typescript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### 테스트 가이드

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Next.js](https://nextjs.org/docs/testing)

### Next.js 빌드 최적화

- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
- [Next.js Build Output](https://nextjs.org/docs/api-reference/cli#build)
- [Analyzing Bundle Size](https://nextjs.org/docs/advanced-features/measuring-performance)

---

## 📊 Section 13: 오류 추적 대시보드

### 실시간 오류 상태

| 오류 ID | 카테고리 | 심각도 | 상태 | 수정 시간 | 담당자 |
|--------|---------|-------|------|----------|--------|
| #1 | Server | 🔴 | ✅ Fixed | 5 min | Claude |
| #2-4 | TypeScript | 🔴 | ⏳ Pending | ~10 min | - |
| #5 | TypeScript | 🔴 | ⏳ Pending | ~5 min | - |
| #6-9 | Test | 🟡 | ⏳ Pending | ~15 min | - |
| #10 | TypeScript | 🟢 | ⏳ Pending | ~1 min | - |
| #11 | Build | 🔴 | ⏳ Pending | ~15 min | - |
| #12 | Config | 🟢 | ⏳ Pending | ~10 min | - |
| Hook Tests | Test | 🟡 | ⏳ Pending | ~30 min | - |
| FilterBar Tests | Test | 🟡 | ⏳ Pending | ~60 min | - |

### 전체 진행률

```
🔴 Critical Issues:   1/2 resolved (50%)
🟡 High Priority:     0/16 resolved (0%)
🟢 Medium/Low:        0/12 resolved (0%)

Overall Progress:     1/30 resolved (3.3%)
Estimated Time:       ~3 hours remaining
```

---

## ✅ Section 14: 최종 요약

### 발견된 오류 (30개)

1. ✅ **서버 중지** - FIXED
2. ⏳ **TypeScript 에러 9개** - 프로덕션 빌드 차단
3. ⏳ **빌드 실패 1개** - 배포 불가
4. ⏳ **테스트 실패 21개** - 코드 품질 저하
5. ⏳ **설정 누락 1개** - 개발 경험 저하

### 즉시 조치 필요 (🔴 CRITICAL)

```typescript
// 1. PerformanceMonitor.tsx:215 - value 파라미터 사용
function getRecommendation(metric: string, value: number): string {
  return `${metric} (${value}) - Recommendation text`;
}

// 2. MissionCard.tsx:19 - Props 타입 정의
export interface MissionCardProps {
  mission: Mission;
  className?: string;
  onClick?: (mission: Mission) => void;
  disabled?: boolean;        // ← ADD
  variant?: 'default' | 'compact';  // ← ADD
}

// 3. MissionCard.tsx:40 - React.memo 적용
export const MissionCard = memo(React.forwardRef<HTMLDivElement, MissionCardProps>(
  ({ mission, className, onClick, disabled, variant }, ref) => {
    // Implementation
  }
));
```

### 예상 소요 시간

- **Phase 1 (Critical)**: 30분
- **Phase 2 (Tests)**: 2시간  
- **Phase 3 (Config)**: 30분
- **Total**: ~3시간

### 성공 기준

```bash
✅ npm run type-check  → 0 errors
✅ npm run build       → Build succeeds  
✅ npm test            → 70/70 passing
✅ npm run lint        → No warnings

🚀 Ready for production deployment!
```

---

**End of Error Analysis Report**  
**Next Action**: Proceed with Phase 1 critical fixes

---

## 🔗 Quick Links

- **Dashboard**: https://8080-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/design-preview.html
- **Main App**: https://3000-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai/
- **Development Analysis**: `/home/user/webapp/DEVELOPMENT_ANALYSIS.md`
- **This Report**: `/home/user/webapp/ERROR_ANALYSIS.md`
