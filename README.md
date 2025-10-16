# 🧠 JJIKMEOK - Local Nano-Creator Short-Form Platform

**"로컬 상점 미션을 오늘 찍고, 오늘(조건부) 받는다."**

성수/홍대를 시작으로, 나노 크리에이터가 **템플릿(샷)·가드(광고고지/로고/지오)·정산(T+0/T+1)**을 **앱 하나**에서 끝낸다.

## 🚀 로컬 1줄 실행

```bash
docker compose up -d --build
```

## 📍 주요 경로

| 경로 | 설명 | 상태 |
|------|------|------|
| `http://localhost:3000/creator/home` | 미션 리스트 (B2C 메인) | 🚧 |
| `http://localhost:3000/creator/capture` | 샷 코치 + Proof-QA | 🚧 |
| `http://localhost:3000/creator/wallet` | T+0/T+1 정산 | 🚧 |
| `http://localhost:8000/docs` | FastAPI 문서 | 🚧 |
| `http://localhost:8000/pulse/today` | 실시간 지표 | 🚧 |

## 🎯 핵심 기능

- 🎬 **현장 생산성**: 샷 코치(링·진동·음성) + 자동 Proof-QA + 원클릭 재촬영
- 💰 **신속 정산**: T+0/T+1 상태머신 + 월렛 상태바 + 멱등/Failover
- 📍 **로컬 기반**: 지오펜스(반경·마감·예산) + 지도/필터
- ⚡ **오프라인**: IndexedDB 업로드 큐 + 지수 백오프 + 재전송 버튼

## 🏗️ 프로젝트 구조

```
jjikmeok/
├─ apps/web/                 # Next.js(App Router) + Tailwind + PWA
│  ├─ app/creator/           # B2C 5탭 (home/map/capture/uploads/wallet/me)
│  ├─ components/            # ShotCoach, UploadQueue, WalletBar 등
│  └─ lib/offline-queue.ts   # IndexedDB 큐 유틸
├─ services/api/             # FastAPI + SQLite (OLTP) + adapter hooks
│  ├─ db.py                  # missions/assignments/proofs/payments/...
│  └─ routes_*.py            # missions, assignments(state machine), proofs
├─ docker-compose.yml        # web + api
└─ .github/workflows/        # CI/CD
```

## 📱 B2C 크리에이터 앱 (5탭)

```
[미션]  [지도]  [●캡처]  [지갑]  [프로필]
```

### 핵심 UX 플로우
1. **미션 선택** (`/creator/home`) → 근처 미션 (가까움·급함·수익 필터)
2. **샷 코치** (`/creator/capture`) → 링·진동·음성 가이드 + 15초 녹화
3. **자동 QA** → 광고고지/로고/지오/영수증 검증
4. **오프라인 큐** (`/creator/uploads`) → IndexedDB + 백오프 재전송
5. **즉시 정산** (`/creator/wallet`) → T+0/T+1 상태바 + 최근 지급

## 🔧 기술 스택

**Frontend**: Next.js 14 (App Router) + Tailwind CSS + PWA + IndexedDB
**Backend**: FastAPI + SQLite + Pydantic + SQLAlchemy
**Deployment**: Docker Compose + Vercel (web) + Fly.io (api)
**CI/CD**: GitHub Actions + Playwright + Lighthouse

## 🛠️ 개발 환경 설정

### 필요 환경변수
```bash
# .env.local (Next.js)
NEXT_PUBLIC_API_BASE=http://localhost:8000

# .env (FastAPI)
OPENAI_API_KEY=sk-...
ASSIGN_EXPIRE_MIN=20
```

### 로컬 개발
```bash
# 전체 스택 실행
docker compose up -d --build

# 개별 실행 (개발용)
cd apps/web && npm run dev      # http://localhost:3000
cd services/api && uvicorn main:app --reload  # http://localhost:8000
```

## 📊 API 엔드포인트

### 미션 & 할당
- `GET /v1/missions/list` - 미션 리스트 (지역/필터)
- `POST /v1/assignments/accept` - 미션 수락 (상태머신)
- `POST /v1/assignments/cancel` - 미션 취소

### 업로드 & 검증
- `POST /api/direct_upload` - 직접 업로드 (dev)
- `POST /api/proofs/qa` - 자동 Proof-QA
- `POST /api/proofs/qa/vision/tuned` - Vision OCR + 로고매칭

### 정산 & 월렛
- `POST /api/payout/pay` - 멱등 정산 (X-Idempotency-Key)
- `GET /api/payout/recent` - 최근 지급 내역

### 모니터링
- `GET /pulse/today` - 오늘 지표
- `GET /pulse/roll7` - 7일 롤링 통계

## 🧪 테스트 & 품질

### E2E 스모크 테스트 (Playwright)
```bash
npm run test:e2e
# 미션 생성 → 수락 → 캡처 → 업로드 → QA → 정산 플로우 검증
```

### 성능 목표 (Lighthouse CI)
- Performance ≥ 75 (모바일)
- Accessibility ≥ 90
- 업로드 실패 복구 성공률 ≥ 99% (5회 백오프)

## 🔐 보안 & 정책

- **업로드 제한**: video/webm, ≤25MB, ≤15초
- **멱등성**: X-Idempotency-Key 필수 (지급 중복 방지)
- **레이트리밋**: 60rpm (사용자별 토큰버킷)
- **PII 마스킹**: 전화번호/주민번호 자동 마스킹
- **광고 고지**: "#광고 + 플랫폼 라벨" 필수

## 📦 배포

### Staging
```bash
docker compose -f docker-compose.yml up -d
```

### Production
- **Web**: Vercel (GitHub Actions)
- **API**: Fly.io (GitHub Actions)
- **Storage**: MinIO/S3 Presigned URLs

## 🚧 개발 상태

- [x] 프로젝트 구조 설정
- [ ] 데이터베이스 모델 (상태머신)
- [ ] FastAPI 백엔드 (핵심 API)
- [ ] Next.js 프론트엔드 (5탭 + 컴포넌트)
- [ ] 오프라인 큐 (IndexedDB)
- [ ] Proof-QA & Vision
- [ ] Docker & CI/CD
- [ ] E2E 테스트

---

> **목표**: `docker compose up -d --build` 로 **B2C 크리에이터 앱 + B2B 운영 도구 + 백엔드 API**를 완전 구동