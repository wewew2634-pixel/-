# 🎨 Live Design Preview System - 사용 가이드

> **URL 변경 없이 5초 간격 자동 새로고침으로 디자인 검수를 할 수 있는 개발 도구**

---

## 🚀 빠른 시작

### 1️⃣ 개발 서버 실행
```bash
npm run dev
```

### 2️⃣ 브라우저에서 열기
```bash
# 방법 1: 자동 활성화 (권장)
http://localhost:3000/splash?live=1

# 방법 2: 수동 토글
http://localhost:3000/splash
# → 우측 하단 "Live 5s" 토글 클릭
```

### 3️⃣ 파일 수정 테스트
```bash
# 아무 감시 대상 파일이나 수정
vim src/components/Logo.tsx
vim src/styles/globals.css
vim public/logos/logo.svg

# → 5초 이내 자동 새로고침 확인
```

---

## 🎯 주요 기능

### ✅ URL 보존형 자동 새로고침
- 페이지 URL이 변경되지 않음
- 스크롤 위치 유지 (router.refresh)
- 개발 중인 페이지에서 계속 작업 가능

### ✅ 실시간 파일 감지
- **5초 간격** 폴링 (커스터마이징 가능)
- 감시 대상 디렉토리:
  - `src/styles` (디자인 토큰)
  - `src/components` (UI 컴포넌트)
  - `src/app` (페이지/레이아웃)
  - `public/og`, `public/logos`, `public/icons` (자산)
  - `public/manifest.json` (PWA)

### ✅ 사용자 친화적 UI
- 우측 하단 고정 토글
- ON/OFF 시각적 피드백
- 수동 강제 새로고침 버튼
- 마지막 체크 타임스탬프 표시

---

## 📁 시스템 구조

### 1. API 라우트: 변경 감지
**파일**: `src/app/api/live-hash/route.ts`

```typescript
GET /api/live-hash
→ { hash: "abc123...", updatedAt: 1234567890 }
```

- 감시 대상 디렉토리의 최신 mtime을 SHA-1 해시로 변환
- 캐시 무효화 헤더 적용
- Node.js 런타임 사용 (fs 모듈)

### 2. React Hook: 폴링 로직
**파일**: `src/hooks/useLivePreview.ts`

```typescript
const { active, enable, disable, lastChecked } = useLivePreview({
  enabled: false,
  intervalMs: 5000,
  mode: 'refresh'
});
```

**옵션**:
- `enabled`: 초기 활성화 상태 (기본: false)
- `intervalMs`: 폴링 간격 (기본: 5000ms)
- `mode`: 
  - `'refresh'` (기본): 부드러운 클라이언트 사이드 새로고침
  - `'reload'`: 강제 전체 페이지 리로드

### 3. UI 컴포넌트: 토글
**파일**: `src/components/dev/LiveToggle.tsx`

```tsx
<LiveToggle />
```

**기능**:
- ON/OFF 토글 버튼
- 수동 Reload 버튼
- 확장 가능한 정보 패널
- 개발 환경에서만 렌더링

### 4. 미들웨어: 캐시 무효화
**파일**: `src/middleware.ts`

```typescript
// 적용 대상 경로
- /splash
- /onboarding
- /creator/home
- /api/live-hash
```

---

## 🎮 사용 시나리오

### 시나리오 1: 디자인 토큰 수정
```bash
# 1. Splash 페이지를 ?live=1로 열기
open http://localhost:3000/splash?live=1

# 2. 디자인 토큰 수정
vim src/styles/tokens.css
# --primary: hsl(24 100% 50%) → hsl(24 100% 60%)

# 3. 자동 새로고침 확인 (5초 이내)
# → 색상 변경 즉시 반영
```

### 시나리오 2: 컴포넌트 수정
```bash
# 1. Onboarding 페이지 열기
open http://localhost:3000/onboarding?live=1

# 2. 버튼 컴포넌트 수정
vim src/components/ui/Button.tsx
# padding 변경

# 3. 자동 새로고침 확인
# → 레이아웃 변경 즉시 반영
```

### 시나리오 3: 로고 교체
```bash
# 1. Creator 홈 열기
open http://localhost:3000/creator/home?live=1

# 2. 로고 파일 교체
cp new-logo.svg public/logos/logo.svg

# 3. 자동 새로고침 확인
# → 새 로고 즉시 표시
```

---

## ⚙️ 고급 설정

### 폴링 간격 조정
**파일**: `src/components/dev/LiveToggle.tsx`

```tsx
const { active, enable, disable, lastChecked } = useLivePreview({ 
  enabled: false, 
  intervalMs: 10000, // 5초 → 10초로 변경
  mode: 'refresh' 
});
```

### 감시 대상 디렉토리 추가
**파일**: `src/app/api/live-hash/route.ts`

```typescript
const WATCH = [
  'src/styles',
  'src/components',
  'src/app',
  'public/og',
  'public/logos',
  'public/icons',
  'public/manifest.json',
  'src/lib',  // 추가: 유틸리티 라이브러리
  'public/fonts', // 추가: 폰트 파일
];
```

### 하드 리로드 모드
URL이 초기화되어도 괜찮다면:

```tsx
const { active } = useLivePreview({ 
  mode: 'reload' // router.refresh 대신 window.location.reload
});
```

---

## 🧪 테스트 명령어

### API 응답 확인
```bash
curl -s http://localhost:3000/api/live-hash | jq
```

**예상 출력**:
```json
{
  "hash": "abc123def456...",
  "updatedAt": 1697543210000,
  "watched": [
    "src/styles",
    "src/components",
    ...
  ],
  "timestamp": "2025-10-17T15:30:00.000Z"
}
```

### 파일 변경 시뮬레이션
```bash
# 파일 touch로 mtime 변경
touch src/components/Logo.tsx

# 다시 API 확인 (hash가 변경되어야 함)
curl -s http://localhost:3000/api/live-hash | jq .hash
```

---

## 📊 성능 영향

### 네트워크
- **요청 크기**: ~0.2-0.5kB/5초
- **응답 크기**: ~200-300 bytes
- **대역폭**: ~1.2-3kB/분

### CPU
- **파일 시스템 체크**: mtime 읽기만 (매우 가벼움)
- **해시 계산**: SHA-1 (밀리초 단위)

### 메모리
- **훅 상태**: ~10KB
- **컴포넌트**: ~5KB

### Next.js HMR 충돌
- **없음**: HMR과 독립적으로 동작
- HMR이 먼저 갱신하면 폴링은 idle 상태

---

## ⚠️ 주의사항

### 1. 개발 환경 전용
```tsx
// src/app/layout.tsx
{process.env.NODE_ENV === 'development' && <LiveToggle />}
```
- 프로덕션 빌드에서는 자동으로 제외됨

### 2. Node.js 런타임 필요
API 라우트는 `fs` 모듈을 사용하므로 Edge 런타임에서 실행 불가

```typescript
// src/app/api/live-hash/route.ts
export const runtime = 'nodejs';
```

### 3. 배포 환경 고려
프로덕션 배포 시에는 감시 전략을 변경 권장:
- 빌드 해시 사용
- 버전 파일 비교
- WebSocket 기반 실시간 감지

---

## 🔄 향후 개선사항

### Phase 1 (1주 관찰 후)
- [ ] 폴링 간격 동적 조정 (사용 패턴 분석)
- [ ] 변경 없을 시 10-30초로 완화

### Phase 2 (선택적)
- [ ] WebSocket 기반 실시간 감지
- [ ] 파일별 변경 감지 디버깅 UI
- [ ] 변경 내역 히스토리 표시

### Phase 3 (고급)
- [ ] Chokidar 기반 파일 감시
- [ ] 선택적 디렉토리 감시 토글
- [ ] 팀 동기화 (멀티 개발자)

---

## 🐛 트러블슈팅

### Q: 자동 새로고침이 작동하지 않아요
**A**: 다음을 확인하세요:
1. 토글이 ON 상태인지 확인
2. 브라우저 콘솔에서 에러 확인
3. API 응답 확인: `curl http://localhost:3000/api/live-hash`
4. 감시 대상 디렉토리에 파일을 수정했는지 확인

### Q: 새로고침이 너무 느려요
**A**: 폴링 간격을 줄이세요:
```tsx
intervalMs: 3000 // 5초 → 3초
```

### Q: CPU 사용률이 높아요
**A**: 폴링 간격을 늘리세요:
```tsx
intervalMs: 10000 // 5초 → 10초
```

### Q: URL이 ?live=1인데 자동 활성화 안 돼요
**A**: 페이지를 새로고침하세요. useEffect는 마운트 시 한 번만 실행됩니다.

---

## 📚 관련 파일

| 파일 | 설명 | 크기 |
|------|------|------|
| `src/app/api/live-hash/route.ts` | 변경 감지 API | 2.9 KB |
| `src/hooks/useLivePreview.ts` | 실시간 프리뷰 훅 | 3.9 KB |
| `src/components/dev/LiveToggle.tsx` | 토글 UI | 4.7 KB |
| `src/middleware.ts` | 캐시 무효화 | 1.2 KB |
| `src/app/layout.tsx` | 루트 레이아웃 (수정) | - |

**총 추가 코드**: ~12.7 KB

---

## 🎓 학습 자료

### 관련 기술
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [File System mtime](https://nodejs.org/api/fs.html#statsmtimems)
- [SHA-1 Hashing](https://nodejs.org/api/crypto.html)

### 유사 도구
- [Next.js Fast Refresh](https://nextjs.org/docs/architecture/fast-refresh)
- [Vite HMR](https://vitejs.dev/guide/api-hmr.html)
- [Webpack Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)

---

## 📞 지원

문제가 발생하면:
1. 브라우저 콘솔 확인
2. API 응답 확인 (`curl /api/live-hash`)
3. GitHub Issues에 버그 리포트
4. 팀 슬랙 채널에 문의

---

**Made with ❤️ for JJIKMEOK Design Team**

*Last updated: 2025-10-17*
