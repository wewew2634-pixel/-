# 🎨 찍먹 UX/UI 상세 설계 문서

## 📱 **Creator App UX Flow**

---

## 1️⃣ **Splash Screen** (첫 진입)

### Layout (375x812 기준 - iPhone 13 mini)

```
┌─────────────────────────────────┐
│                                 │ ← Safe Area Top (44px)
│                                 │
│          [찍먹 로고]             │ ← 중앙 배치
│                                 │   100x100px
│                                 │
│      로컬 체험으로 수익 만들기    │ ← Subtitle
│                                 │   text-lg, text-secondary
│                                 │
│                                 │
│       ────────────────          │ ← Loading indicator
│                                 │   width: 120px
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Specs

```css
/* Container */
background: radial-gradient(
  circle at 50% 30%, 
  rgba(255, 107, 53, 0.15), 
  transparent 70%
),
var(--jjik-bg-primary);

/* Logo */
width: 100px;
height: 100px;
animation: fade-in 600ms ease-out, scale-in 400ms ease-out;

/* Subtitle */
font-size: 18px;
line-height: 26px;
color: var(--jjik-text-secondary);
margin-top: 16px;

/* Loading Bar */
width: 120px;
height: 4px;
background: var(--jjik-border);
border-radius: 2px;
position: relative;
overflow: hidden;

.loading-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--jjik-primary),
    var(--jjik-secondary)
  );
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% { left: -50%; width: 50%; }
  50% { left: 50%; width: 50%; }
  100% { left: 100%; width: 50%; }
}
```

### Timing

- Display: 1.5초 (로고 애니메이션 + 로딩)
- 자동 전환 → Onboarding (첫 방문) 또는 Login

---

## 2️⃣ **Onboarding Flow** (첫 사용자만)

### Screen 1: Value Proposition

```
┌─────────────────────────────────┐
│  [Skip]                         │ ← Right: text-sm, text-tertiary
│                                 │
│                                 │
│                                 │
│        [일러스트레이션]           │ ← 280x280px
│      카페에서 커피 마시는         │   Lottie 애니메이션
│         크리에이터               │
│                                 │
│                                 │
│    무료 체험하고 리워드 받기      │ ← text-display-md (28px)
│                                 │   font-semibold
│  좋아하는 로컬 카페와 레스토랑을   │ ← text-base (15px)
│   무료로 체험하고 영상 하나만      │   text-secondary
│      올리면 리워드까지!           │   line-height: 22px
│                                 │
│                                 │
│        ● ○ ○                    │ ← Pagination dots
│                                 │
│     [다음]                       │ ← Primary button
│                                 │   height: 56px
└─────────────────────────────────┘
```

### Screen 2: Trust

```
┌─────────────────────────────────┐
│  [Skip]                         │
│                                 │
│                                 │
│        [일러스트레이션]           │
│       스마트폰 + 체크마크         │
│                                 │
│                                 │
│     승인된 오퍼만 받아요          │ ← text-display-md
│                                 │
│  검증된 로컬 브랜드의 오퍼만      │ ← text-base
│   받을 수 있어요. 안전하게        │   text-secondary
│      시작해보세요!               │
│                                 │
│                                 │
│        ○ ● ○                    │
│                                 │
│     [다음]                       │
│                                 │
└─────────────────────────────────┘
```

### Screen 3: Easy Start

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│        [일러스트레이션]           │
│     소셜 로그인 아이콘들          │
│                                 │
│                                 │
│    3초만에 시작하기              │ ← text-display-md
│                                 │
│  소셜 계정으로 간편하게 시작해요  │ ← text-base
│    별도 가입 절차 없이            │   text-secondary
│     바로 시작할 수 있어요         │
│                                 │
│                                 │
│        ○ ○ ●                    │
│                                 │
│     [시작하기]                   │ ← Primary button
│                                 │
└─────────────────────────────────┘
```

### Specs

```css
/* Container */
padding: 20px;
padding-top: max(20px, env(safe-area-inset-top));
padding-bottom: max(20px, env(safe-area-inset-bottom));

/* Illustration */
width: 280px;
height: 280px;
margin: 0 auto 32px;

/* Headline */
font-size: 28px;
line-height: 36px;
font-weight: 600;
text-align: center;
color: var(--jjik-text-primary);
margin-bottom: 16px;

/* Description */
font-size: 15px;
line-height: 22px;
text-align: center;
color: var(--jjik-text-secondary);
max-width: 300px;
margin: 0 auto;

/* Pagination Dots */
display: flex;
gap: 8px;
justify-content: center;
margin: 32px 0;

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--jjik-border);
  transition: all 200ms;
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: var(--jjik-primary);
}

/* Button */
width: 100%;
height: 56px;
background: var(--jjik-primary);
color: white;
font-size: 17px;
font-weight: 600;
border-radius: 12px;
box-shadow: 0 4px 16px rgba(255, 107, 53, 0.3);
```

### Swipe Gesture

```javascript
// React Native Gesture Handler 또는 Framer Motion
const onSwipeLeft = () => nextScreen();
const onSwipeRight = () => prevScreen();

// Threshold: 50px
```

---

## 3️⃣ **Login Screen**

```
┌─────────────────────────────────┐
│                                 │ ← Safe Area Top
│                                 │
│                                 │
│          [찍먹 로고]             │ ← 80x80px
│                                 │
│    로컬 체험으로 수익 만들기      │ ← text-lg, text-secondary
│                                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🎵  TikTok으로 계속하기  │   │ ← height: 56px
│  └─────────────────────────┘   │   border-radius: 12px
│                                 │   gap: 16px between buttons
│  ┌─────────────────────────┐   │
│  │  ▶️  YouTube로 계속하기   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  👤  게스트로 둘러보기    │   │ ← Ghost button
│  └─────────────────────────┘   │   (border only)
│                                 │
│                                 │
│                                 │
│    가입하면 이용약관 및 개인정보   │ ← text-xs (12px)
│      처리방침에 동의하게 됩니다    │   text-tertiary
│                                 │   text-center
└─────────────────────────────────┘
```

### Button Specs

```css
/* TikTok Button */
.btn-tiktok {
  width: 100%;
  height: 56px;
  background: #000000;
  color: white;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 200ms;
}

.btn-tiktok:active {
  transform: scale(0.98);
}

.btn-tiktok .icon {
  width: 24px;
  height: 24px;
}

/* YouTube Button */
.btn-youtube {
  background: #FF0000;
  /* 나머지 동일 */
}

/* Guest Button */
.btn-guest {
  background: transparent;
  border: 1px solid var(--jjik-border);
  color: var(--jjik-text-secondary);
}

.btn-guest:hover {
  border-color: var(--jjik-primary);
  color: var(--jjik-text-primary);
}
```

### Loading State (OAuth 진행 중)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│        [Spinner]                │ ← 40x40px
│                                 │   color: var(--jjik-primary)
│   TikTok에 연결하는 중...        │ ← text-base
│                                 │   text-secondary
│                                 │
│  잠시만 기다려주세요              │ ← text-sm
│                                 │   text-tertiary
│                                 │
└─────────────────────────────────┘
```

---

## 4️⃣ **Profile Creation Flow** (4 Steps)

### Step 1: Welcome + Basic Info (OAuth Success)

```
┌─────────────────────────────────┐
│  [←]          1/4               │ ← Header: text-sm, text-tertiary
│                                 │
│  ┌─────────┐                    │
│  │         │  환영해요!          │ ← Avatar: 80x80px
│  │  [IMG]  │  @username_123     │   Auto-filled from OAuth
│  └─────────┘                    │   text-h2, font-semibold
│                                 │
│  기본 정보를 확인해주세요          │ ← text-base, text-secondary
│                                 │
│  ┌─────────────────────────┐   │
│  │ 이름                      │   │ ← Label: text-sm, text-secondary
│  │ [김찍먹                 ] │   │   Input: height 48px
│  └─────────────────────────┘   │   Pre-filled from OAuth
│                                 │
│  ┌─────────────────────────┐   │
│  │ 전화번호 (선택)            │   │
│  │ [010-1234-5678        ] │   │ ← Optional
│  └─────────────────────────┘   │   placeholder: "정산 알림용"
│                                 │
│  ┌─────────────────────────┐   │
│  │ 이메일 (선택)             │   │
│  │ [email@example.com    ] │   │
│  └─────────────────────────┘   │
│                                 │
│                                 │
│     [다음]                      │ ← Primary button, bottom fixed
│                                 │
└─────────────────────────────────┘
```

### Step 2: SNS Accounts + Stats

```
┌─────────────────────────────────┐
│  [←]          2/4               │
│                                 │
│  SNS 계정 정보                   │ ← text-h1 (24px)
│  정확한 정보를 입력해주세요        │ ← text-sm, text-secondary
│                                 │
│  ─── Instagram ───              │ ← Section divider
│                                 │
│  ┌─────────────────────────┐   │
│  │ 계정 이름                  │   │
│  │ [@your_insta_id       ] │   │ ← Placeholder: "@username"
│  └─────────────────────────┘   │
│                                 │
│  ┌──────────┐  ┌──────────┐   │
│  │ 팔로워 수  │  │ 평균 조회수 │   │ ← Two columns
│  │ [12,500]  │  │ [2,300]   │   │   Width: 50% each, gap: 12px
│  └──────────┘  └──────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  📸 스크린샷 업로드        │   │ ← Upload button
│  │  Insights 화면을 캡처해주세요│   │   height: 80px
│  └─────────────────────────┘   │   dashed border
│                                 │
│  ─── TikTok ───                │
│                                 │
│  ✅ 연결됨 (@tiktok_id)        │ ← Already connected from OAuth
│  👥 8.5k followers             │   Auto-filled
│                                 │
│  ─── YouTube ───               │
│                                 │
│  [ ] YouTube 계정 추가           │ ← Optional checkbox
│                                 │
│                                 │
│     [다음]                      │
│                                 │
└─────────────────────────────────┘
```

### Upload Screenshot Flow

```
┌─────────────────────────────────┐
│  [←]  Instagram Insights       │
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │                         │   │
│  │    [업로드된 이미지]      │   │ ← Full width preview
│  │                         │   │   aspect-ratio: 9/16
│  │                         │   │   max-height: 400px
│  └─────────────────────────┘   │
│                                 │
│  🤖 AI가 자동으로 숫자를 읽고 있어요│ ← Loading state
│                                 │
│  ┌─────────────────────────┐   │
│  │ 감지된 팔로워 수:          │   │ ← After OCR
│  │ 12,543                   │   │   text-lg, font-medium
│  │                         │   │
│  │ 평균 조회수:              │   │
│  │ 2,315                    │   │
│  └─────────────────────────┘   │
│                                 │
│  숫자가 정확하지 않나요?          │ ← text-sm, text-secondary
│  [직접 수정하기]                 │ ← Link button
│                                 │
│     [확인]                      │
│                                 │
└─────────────────────────────────┘
```

### Step 3: Categories + Location

```
┌─────────────────────────────────┐
│  [←]          3/4               │
│                                 │
│  관심 카테고리                    │ ← text-h1
│  어떤 분야의 오퍼를 받고 싶나요?   │ ← text-sm, text-secondary
│                                 │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │☕카페│ │🍰디저트│ │🍜맛집 │   │ ← Grid: 3 columns
│  └────┘ └────┘ └────┘          │   height: 60px
│  ┌────┐ ┌────┐ ┌────┐          │   gap: 12px
│  │💄뷰티│ │👗패션│ │🏋️피트니스│  │   Multiple select
│  └────┘ └────┘ └────┘          │   Selected: primary color
│  ┌────┐ ┌────┐ ┌────┐          │   border + background
│  │🏠인테리어│ │📱테크│ │🎨아트│  │
│  └────┘ └────┘ └────┘          │
│  ┌────┐                         │
│  │✨라이프스타일│                 │
│  └────┘                         │
│                                 │
│  ───────────────────────────    │
│                                 │
│  활동 지역                       │ ← text-h2
│  주로 어디에서 활동하시나요?       │ ← text-sm
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔍 지역 검색              │   │ ← Search input
│  │ [성수동                 ] │   │   Autocomplete
│  └─────────────────────────┘   │
│                                 │
│  선택된 지역:                    │ ← Selected tags
│  [성수동 ×] [홍대 ×]            │   Dismissible
│                                 │
│                                 │
│     [다음]                      │
│                                 │
└─────────────────────────────────┘
```

### Category Chip (Selected State)

```css
.category-chip {
  height: 60px;
  padding: 0 16px;
  border-radius: 12px;
  border: 2px solid var(--jjik-border);
  background: var(--jjik-bg-secondary);
  font-size: 15px;
  font-weight: 500;
  transition: all 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.category-chip:active {
  transform: scale(0.95);
}

.category-chip.selected {
  border-color: var(--jjik-primary);
  background: rgba(255, 107, 53, 0.1);
  color: var(--jjik-primary);
}

.category-chip .emoji {
  font-size: 24px;
  line-height: 1;
}

.category-chip .label {
  font-size: 13px;
  line-height: 1;
}
```

### Step 4: Portfolio

```
┌─────────────────────────────────┐
│  [←]          4/4               │
│                                 │
│  포트폴리오                      │ ← text-h1
│  최근 작업물을 보여주세요 (선택)   │ ← text-sm, text-secondary
│                                 │
│  Instagram, TikTok, YouTube 게시물│
│  링크를 3-5개 추가해주세요         │ ← text-sm
│                                 │
│  ┌─────────────────────────┐   │
│  │ 게시물 URL               │   │
│  │ [https://instagram.com/p/│   │ ← Input with paste button
│  │  [📋]                    │   │   Icon: 24x24
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [https://tiktok.com/@   ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [                       ] │   │
│  └─────────────────────────┘   │
│                                 │
│  [+ URL 추가]                   │ ← Ghost button, text-sm
│                                 │
│  ───────────────────────────    │
│                                 │
│  🤖 AI가 콘텐츠 스타일을 분석 중...│ ← After adding URLs
│                                 │   Loading state
│  ✅ 분석 완료!                   │   → Success state
│                                 │
│  당신의 스타일:                   │ ← AI result
│  [감성적] [따뜻한 톤] [미니멀]    │   Badges: auto-generated
│                                 │
│                                 │
│     [프로필 완성]                 │ ← Primary button
│                                 │
└─────────────────────────────────┘
```

### AI Analysis Result (After Profile Complete)

```
┌─────────────────────────────────┐
│                                 │
│        ✨                       │ ← Success icon
│                                 │   60x60px, animated
│  프로필이 완성되었어요!            │ ← text-display-md
│                                 │   font-semibold
│                                 │
│  ┌─────────────────────────┐   │
│  │  @your_username         │   │ ← Summary card
│  │  12.5k followers        │   │   background: elevated
│  │                         │   │
│  │  📍 성수동, 홍대          │   │
│  │  ☕ 카페  🍰 디저트       │   │
│  │                         │   │
│  │  스타일: 감성적, 따뜻한 톤  │   │
│  └─────────────────────────┘   │
│                                 │
│  승인까지 보통 24시간 소요돼요     │ ← text-sm, text-secondary
│  승인되면 알림으로 알려드릴게요!   │
│                                 │
│                                 │
│     [홈으로 가기]                │ ← Primary button
│                                 │
└─────────────────────────────────┘
```

---

## 5️⃣ **Main App - Tab Navigation**

### Bottom Tab Bar

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│        [Content Area]           │
│                                 │
│                                 │
├─────────────────────────────────┤ ← Border top
│                                 │   1px, var(--jjik-border)
│  [체험]  [촬영]  [수익]  [MY]   │ ← Tabs
│   📦     📹     💰     👤       │   height: 64px
│                                 │   + safe-area-inset-bottom
└─────────────────────────────────┘
```

### Tab Specs

```css
.tab-bar {
  display: flex;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--jjik-bg-secondary);
  border-top: 1px solid var(--jjik-border);
  backdrop-filter: blur(20px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--jjik-text-tertiary);
  transition: color 200ms;
}

.tab-item.active {
  color: var(--jjik-primary);
}

.tab-icon {
  font-size: 24px;
  line-height: 1;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

/* Badge (notification) */
.tab-badge {
  position: absolute;
  top: 8px;
  right: calc(50% - 16px);
  width: 18px;
  height: 18px;
  background: var(--jjik-danger);
  color: white;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 6️⃣ **Tab 1: 체험 (Offers)**

### Header

```
┌─────────────────────────────────┐
│  [=]  체험         [🔍] [🔔3]   │ ← height: 56px
│                                 │   [=] Menu burger
│                                 │   [🔍] Search
│                                 │   [🔔] Notifications (badge)
├─────────────────────────────────┤
│                                 │
```

### Pending Approval State (First time)

```
│                                 │
│        ⏳                       │ ← Icon: 64x64px
│                                 │
│  프로필 승인 대기 중이에요         │ ← text-h2
│                                 │   font-semibold
│  보통 24시간 이내에 검토가 완료돼요 │ ← text-base
│                                 │   text-secondary
│                                 │
│  ┌─────────────────────────┐   │
│  │ 승인 진행 상황:            │   │ ← Info card
│  │                         │   │   background: elevated
│  │ ✅ 기본 정보 확인됨       │   │
│  │ ✅ SNS 계정 검증 완료     │   │
│  │ ⏳ 최종 승인 대기 중      │   │
│  └─────────────────────────┘   │
│                                 │
│   알림 설정을 켜두면 승인 즉시    │ ← text-sm
│      알려드려요!                 │   text-tertiary
│                                 │
│     [알림 켜기]                 │ ← Ghost button
│                                 │
```

### Approved - Empty State

```
│                                 │
│        📦                       │ ← Icon: 64x64px
│                                 │
│  아직 받은 오퍼가 없어요          │ ← text-h2
│                                 │
│  곧 사장님들이 오퍼를 보내드릴 거예요│ ← text-base
│  조금만 기다려주세요!             │   text-secondary
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💡 Tip                   │   │ ← Tip card
│  │ 프로필을 더 자세히 작성하면  │   │
│  │ 더 빨리 오퍼를 받을 수 있어요│   │
│  │                         │   │
│  │ [프로필 보완하기 →]       │   │
│  └─────────────────────────┘   │
│                                 │
```

### Offer List (Active State)

```
│  ┌─ 새 오퍼 ──────────────┐    │ ← Section header
│  │                         │   │   text-sm, text-secondary
│  │  ┌─────────────────────┐│  │
│  │  │ [사진] 성수동 OO카페  ││  │ ← Offer card
│  │  │ 📍 850m · 15분 전    ││  │   height: auto
│  │  │                     ││  │   padding: 16px
│  │  │ ☕ 시그니처 커피+디저트││  │   border-radius: 16px
│  │  │ 💰 무료 체험 + 3만원  ││  │
│  │  │                     ││  │
│  │  │ 📹 15초 릴스 1개      ││  │
│  │  │ ⏰ 2주 내 방문       ││  │
│  │  │                     ││  │
│  │  │ [수락] [거절] [보류] ││  │ ← Action buttons
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                │
│  ┌─ 진행 중 ──────────────┐   │
│  │  ┌─────────────────────┐│  │
│  │  │ [사진] 홍대 XX레스토랑││  │
│  │  │ 💚 수락됨 · 3일 전    ││  │ ← Status badge
│  │  │                     ││  │
│  │  │ 방문 예약: 12월 25일  ││  │
│  │  │ D-3                 ││  │ ← Countdown
│  │  │                     ││  │
│  │  │ [상세보기 →]         ││  │
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                │
│  ┌─ 완료 ─────────────────┐   │
│  │  ┌─────────────────────┐│  │
│  │  │ [사진] 강남 YY카페    ││  │
│  │  │ ✅ 완료 · 1주 전      ││  │
│  │  │                     ││  │
│  │  │ 💰 30,000원 정산 완료 ││  │
│  │  │ ⭐ 4.9 (사장님 평가)  ││  │
│  │  │                     ││  │
│  │  │ [리뷰 보기]          ││  │
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                │
└─────────────────────────────────┘
```

### Offer Card Detail Specs

```css
.offer-card {
  background: var(--jjik-bg-elevated);
  border: 1px solid var(--jjik-border);
  border-radius: 16px;
  padding: 16px;
  transition: all 200ms;
  margin-bottom: 12px;
}

.offer-card:active {
  transform: scale(0.98);
}

.offer-card.new {
  border-color: var(--jjik-primary);
  box-shadow: 0 0 0 1px rgba(255, 107, 53, 0.2);
}

/* Header */
.offer-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.offer-image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
}

.offer-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--jjik-text-primary);
  line-height: 24px;
}

.offer-meta {
  font-size: 13px;
  color: var(--jjik-text-tertiary);
  line-height: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Content */
.offer-reward {
  font-size: 16px;
  font-weight: 600;
  color: var(--jjik-accent);
  margin: 8px 0;
}

.offer-requirements {
  font-size: 14px;
  color: var(--jjik-text-secondary);
  line-height: 20px;
  margin: 4px 0;
}

/* Actions */
.offer-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-accept {
  flex: 1;
  height: 40px;
  background: var(--jjik-primary);
  color: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
}

.btn-decline {
  width: 80px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--jjik-border);
  color: var(--jjik-text-secondary);
  border-radius: 10px;
  font-size: 15px;
}

.btn-hold {
  width: 80px;
  height: 40px;
  background: transparent;
  border: 1px solid var(--jjik-border);
  color: var(--jjik-text-secondary);
  border-radius: 10px;
  font-size: 15px;
}
```

---

## 7️⃣ **Offer Detail Page** (오퍼 상세)

### Layout

```
┌─────────────────────────────────┐
│  [←]                      [⋮]   │ ← Header: Back + Menu
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │ ← Hero image
│  │    [매장 사진]           │   │   height: 240px
│  │                         │   │   full width
│  └─────────────────────────┘   │
│                                 │
│  성수동 OO카페                   │ ← text-h1, font-bold
│  📍 성수동 · 850m               │ ← text-sm, text-secondary
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💰 리워드                │   │ ← Card section
│  │                         │   │
│  │ 무료 체험 + 30,000원      │   │ ← text-xl, font-bold
│  │                         │   │   color: accent
│  │ • 시그니처 커피 1잔       │   │ ← List items
│  │ • 디저트 1개             │   │   text-base
│  │ • 현금 리워드 30,000원    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📹 촬영 요구사항          │   │
│  │                         │   │
│  │ • 15초 Instagram 릴스    │   │
│  │ • 매장 인테리어 포함 필수  │   │
│  │ • 음식 클로즈업 3초 이상  │   │
│  │ • #성수카페 #OO카페 태그  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ⏰ 방문 기한             │   │
│  │                         │   │
│  │ 2025년 12월 31일까지     │   │
│  │ (오퍼 수락 후 14일 이내)  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📋 유의사항              │   │
│  │                         │   │
│  │ • 방문 전 사전 예약 필수  │   │
│  │ • 영업시간: 10:00-22:00  │   │
│  │ • 주차 불가 (대중교통 이용)│  │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏪 매장 정보             │   │
│  │                         │   │
│  │ [사진] [사진] [사진]     │   │ ← Photo grid
│  │                         │   │
│  │ 주소: 서울시 성수동 123-45│   │
│  │ 전화: 02-1234-5678       │   │
│  │                         │   │
│  │ [지도 보기] [전화하기]    │   │ ← Action buttons
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💬 사장님 메시지          │   │
│  │                         │   │
│  │ "따뜻하고 감성적인 분위기로│   │ ← Quoted text
│  │  촬영해주시면 감사하겠습니다"│  │   italic
│  └─────────────────────────┘   │
│                                 │
│        [수락하기]                │ ← Fixed bottom button
│   [거절]    [1일 보류]          │   Primary + Ghost
│                                 │
└─────────────────────────────────┘
```

### Accept Confirmation Modal

```
┌─────────────────────────────────┐
│                                 │ ← Backdrop: rgba(0,0,0,0.6)
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │ ← Modal
│  │  오퍼를 수락하시겠어요?    │   │   border-radius: 20px
│  │                         │   │   padding: 24px
│  │  수락하면 14일 이내에      │   │
│  │  방문 및 촬영을 완료해야   │   │
│  │  합니다.                 │   │
│  │                         │   │
│  │  ┌───────────────────┐  │   │
│  │  │ ✓ 촬영 가능 확인    │  │   │ ← Checklist
│  │  │ ✓ 일정 확인        │  │   │
│  │  │ ✓ 요구사항 숙지    │  │   │
│  │  └───────────────────┘  │   │
│  │                         │   │
│  │  [취소]     [수락]      │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Accepted - Next Steps

```
┌─────────────────────────────────┐
│  [←]  성수동 OO카페             │
│                                 │
│        ✅                       │ ← Success icon
│                                 │
│  오퍼를 수락했어요!               │ ← text-h1
│                                 │
│  ┌─────────────────────────┐   │
│  │ 다음 단계                 │   │
│  │                         │   │
│  │ 1️⃣ 방문 예약하기         │   │
│  │    [사장님에게 연락하기]   │   │
│  │                         │   │
│  │ 2️⃣ 방문 및 체험          │   │
│  │    D-13 (12월 25일까지)  │   │
│  │                         │   │
│  │ 3️⃣ 촬영 및 업로드        │   │
│  │    [촬영 가이드 보기]     │   │
│  │                         │   │
│  │ 4️⃣ 검증 및 정산          │   │
│  │    보통 1-2일 소요        │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Tip: 방문 전 사장님께       │
│  미리 연락하면 더 좋아요!         │
│                                 │
│     [확인]                      │
│                                 │
└─────────────────────────────────┘
```

---

## 8️⃣ **Tab 2: 촬영 (Shot Coach)**

### Main Screen

```
┌─────────────────────────────────┐
│  촬영                     [?]   │ ← Header + Help
│                                 │
│  ┌─ 진행 중인 미션 ────────┐   │
│  │                         │   │
│  │  ┌─────────────────────┐│  │
│  │  │ [사진] 성수동 OO카페  ││  │
│  │  │                     ││  │
│  │  │ 방문 예약: 12월 25일  ││  │
│  │  │ D-3                 ││  │
│  │  │                     ││  │
│  │  │ 📹 15초 릴스 1개      ││  │
│  │  │ 진행률: 0%           ││  │
│  │  │                     ││  │
│  │  │ [촬영 시작하기]       ││  │ ← Primary button
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 촬영 가이드 ──────────┐   │
│  │                         │   │
│  │  📝 촬영 전 체크리스트    │   │
│  │  ┌─────────────────┐   │   │
│  │  │ □ 매장 분위기 파악 │   │   │ ← Checkbox list
│  │  │ □ 조명 확인       │   │   │
│  │  │ □ 음악/배경음 확인 │   │   │
│  │  └─────────────────┘   │   │
│  │                         │   │
│  │  💡 촬영 팁              │   │
│  │  • 자연광 활용하기        │   │
│  │  • 안정적인 그립          │   │
│  │  • 천천히 부드럽게        │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 참고 영상 ────────────┐   │
│  │                         │   │
│  │  [썸네일] [썸네일] [썸네일]│  │ ← Horizontal scroll
│  │  좋은 예시  피해야 할 예시 │  │
│  └─────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Shot Coach - Recording Screen

```
┌─────────────────────────────────┐
│  [×]                    00:15   │ ← Exit + Timer
│                                 │   Full screen camera
│                                 │
│                                 │
│         [카메라 뷰]              │ ← Native camera
│                                 │   9:16 aspect
│                                 │
│                                 │
│  ┌─────────────────────────┐   │ ← Real-time guide overlay
│  │ 💡 음식에 더 가까이!      │   │   Semi-transparent
│  └─────────────────────────┘   │   Auto-dismiss: 2s
│                                 │
│                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐   │ ← Shot checklist
│  │ ✓ 인테│  │  음식 │  │  전경│   │   Progress indicators
│  │ 리어 │  │  UP  │  │     │   │
│  └─────┘  └─────┘  └─────┘   │
│                                 │
│   [🔄]    [⚪]    [🔦]         │ ← Controls
│  플립     녹화    플래시          │   Bottom bar
│                                 │
└─────────────────────────────────┘
```

### Real-time Coaching Prompts

```css
/* Coaching Overlay */
.coach-prompt {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 20px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  animation: fade-in-out 2s ease-in-out;
  pointer-events: none;
}

@keyframes fade-in-out {
  0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  20% { opacity: 1; transform: translateX(-50%) translateY(0); }
  80% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
}

/* Progress Ring */
.progress-ring {
  width: 80px;
  height: 80px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.progress-ring circle {
  stroke: var(--jjik-primary);
  stroke-width: 4;
  fill: transparent;
  stroke-dasharray: 251.2; /* 2πr where r=40 */
  stroke-dashoffset: 251.2;
  animation: progress 15s linear;
}

@keyframes progress {
  to { stroke-dashoffset: 0; }
}
```

### Recording Prompts (Sequence)

```typescript
// Coaching prompts during 15s recording
const coachingSequence = [
  { time: 0, message: "녹화 시작! 매장 전경부터" },
  { time: 3, message: "좋아요! 이제 음식에 집중" },
  { time: 6, message: "천천히 클로즈업" },
  { time: 9, message: "음식 디테일을 보여주세요" },
  { time: 12, message: "마지막! 전체 분위기" },
  { time: 15, message: "완벽해요! 🎉" }
];
```

### Post-Recording - Review

```
┌─────────────────────────────────┐
│  [←]  촬영 결과                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │ ← Video preview
│  │    [촬영한 영상]         │   │   9:16 aspect
│  │                         │   │   Controls: play/pause
│  │        [▶]              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ AI 분석 결과 ──────────┐   │
│  │                         │   │
│  │ ✅ 매장 인테리어 포함됨    │   │ ← AI validation
│  │ ✅ 음식 클로즈업 3초 확인  │   │
│  │ ✅ 적절한 길이 (15초)     │   │
│  │ ⚠️  조명이 약간 어둡습니다 │   │
│  │                         │   │
│  │ 전체 점수: 85/100        │   │
│  └─────────────────────────┘  │
│                                 │
│  💡 더 나은 촬영을 위한 팁:     │
│  • 자연광 시간대에 다시 촬영    │
│  • 음식에 2초 더 집중          │
│                                 │
│  [다시 촬영]  [이대로 업로드]   │
│                                 │
└─────────────────────────────────┘
```

### Upload Flow

```
┌─────────────────────────────────┐
│  영상 업로드                     │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 1️⃣ Instagram에 업로드    │   │
│  │                         │   │
│  │ [Instagram 앱 열기]      │   │ ← Deep link
│  │                         │   │
│  │ 💡 필수 해시태그:         │   │
│  │ #성수카페 #OO카페        │   │
│  │ [해시태그 복사]          │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 2️⃣ 업로드 완료 후 링크 제출│  │
│  │                         │   │
│  │ 게시물 URL               │   │
│  │ [https://instagram.com/│   │
│  │   [📋붙여넣기]          │   │
│  │                         │   │
│  │ 또는 스크린샷 업로드       │   │
│  │ [📸 스크린샷 선택]       │   │
│  └─────────────────────────┘   │
│                                 │
│     [제출하기]                  │ ← Primary button
│                                 │
└─────────────────────────────────┘
```

### Verification in Progress

```
┌─────────────────────────────────┐
│  검증 중                         │
│                                 │
│        🔍                       │ ← Icon: 64x64, animated
│                                 │
│  업로드한 영상을 검증하고 있어요   │ ← text-h2
│                                 │
│  ┌─────────────────────────┐   │
│  │ 검증 항목:               │   │
│  │                         │   │
│  │ ✅ 게시물 확인됨         │   │ ← Progress list
│  │ ✅ 해시태그 확인         │   │
│  │ ⏳ 조회수 집계 중        │   │
│  │ ⏳ 최종 승인 대기        │   │
│  └─────────────────────────┘   │
│                                 │
│  보통 1-2시간 이내에 완료돼요     │ ← text-sm, text-secondary
│  완료되면 알림으로 알려드릴게요!   │
│                                 │
└─────────────────────────────────┘
```

### Approved - Mission Complete

```
┌─────────────────────────────────┐
│                                 │
│        🎉                       │ ← Success animation
│                                 │
│  미션 완료!                      │ ← text-display-md
│                                 │
│  ┌─────────────────────────┐   │
│  │ 성수동 OO카페            │   │
│  │                         │   │
│  │ ✅ 촬영 및 업로드 완료    │   │
│  │ 💰 30,000원 정산 예정    │   │
│  │                         │   │
│  │ 예상 정산일: 12월 26일    │   │
│  │ (T+1)                   │   │
│  └─────────────────────────┘   │
│                                 │
│  ⭐ 사장님 평가를 받았어요!      │
│                                 │
│  ┌─────────────────────────┐   │
│  │ "영상이 정말 감성적이에요! │   │
│  │  다음에 또 연락드릴게요"   │   │
│  │                         │   │
│  │ ⭐⭐⭐⭐⭐ 5.0          │   │
│  └─────────────────────────┘   │
│                                 │
│  🎁 첫 미션 완료 보너스          │
│  +5,000원 추가 지급!            │
│                                 │
│     [확인]                      │
│                                 │
└─────────────────────────────────┘
```

---

## 9️⃣ **Tab 3: 수익 (Earnings)**

### Main Screen

```
┌─────────────────────────────────┐
│  수익                     [📊]  │ ← Header + Stats
│                                 │
│  ┌─────────────────────────┐   │
│  │  이번 달 수익             │   │ ← Summary card
│  │                         │   │   Gradient background
│  │  ₩ 245,000              │   │   text-display-lg
│  │                         │   │   font-bold
│  │  전월 대비 +35% 📈       │   │   text-sm, success
│  └─────────────────────────┘   │
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐   │ ← Stats grid
│  │ 완료  │ │ 평균  │ │ 총   │   │   3 columns
│  │ 8건   │ │₩30k  │ │ 12건 │   │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  ┌─ 정산 예정 ─────────────┐   │
│  │                         │   │
│  │  ┌─────────────────────┐│  │
│  │  │ 성수동 OO카페        ││  │
│  │  │ 💰 30,000원         ││  │
│  │  │ 📅 12월 26일 정산 예정││  │
│  │  │ (내일)              ││  │
│  │  └─────────────────────┘│  │
│  │                         │   │
│  │  ┌─────────────────────┐│  │
│  │  │ 홍대 XX레스토랑       ││  │
│  │  │ 💰 50,000원         ││  │
│  │  │ 📅 12월 28일 정산 예정││  │
│  │  │ (D+3)              ││  │
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 정산 완료 ─────────────┐   │
│  │  [최근 30일] [전체보기]  │   │ ← Filter tabs
│  │                         │   │
│  │  12월 20일               │   │ ← Date divider
│  │  ┌─────────────────────┐│  │
│  │  │ 강남 YY카페          ││  │
│  │  │ + ₩35,000           ││  │ ← Success color
│  │  │ T+1 정산            ││  │
│  │  └─────────────────────┘│  │
│  │                         │   │
│  │  12월 18일               │   │
│  │  ┌─────────────────────┐│  │
│  │  │ 성수 ZZ베이커리       ││  │
│  │  │ + ₩40,000           ││  │
│  │  │ T+0 정산 (+800원)    ││  │ ← T+0 indicator
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Stats Detail Page (클릭 시)

```
┌─────────────────────────────────┐
│  [←]  수익 상세                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │  [차트 영역]             │   │ ← Line chart
│  │                         │   │   Last 6 months
│  │   📈 수익 추이           │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 월별 통계 ─────────────┐   │
│  │                         │   │
│  │  12월 2025              │   │
│  │  ₩ 245,000              │   │
│  │  완료: 8건               │   │
│  │  평균: ₩30,625          │   │
│  │                         │   │
│  │  11월 2025              │   │
│  │  ₩ 180,000              │   │
│  │  완료: 6건               │   │
│  │  평균: ₩30,000          │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 카테고리별 수익 ────────┐   │
│  │                         │   │
│  │  ☕ 카페      ₩120,000  │   │ ← Progress bar
│  │  [████████░░] 49%       │   │
│  │                         │   │
│  │  🍜 맛집      ₩80,000   │   │
│  │  [█████░░░░░] 33%       │   │
│  │                         │   │
│  │  💄 뷰티      ₩45,000   │   │
│  │  [███░░░░░░░] 18%       │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 시간대별 효율 ──────────┐   │
│  │                         │   │
│  │  가장 수익이 높은 시간:    │   │
│  │  주말 오후 2-5시          │   │
│  │                         │   │
│  │  완료율이 높은 요일:       │   │
│  │  토요일 (100%)           │   │
│  └─────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Payment Detail (개별 정산 상세)

```
┌─────────────────────────────────┐
│  [←]  정산 상세                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 성수동 OO카페            │   │
│  │                         │   │
│  │ [매장 사진]              │   │
│  └─────────────────────────┘   │
│                                 │
│  정산 금액                       │ ← text-sm, text-secondary
│  ₩ 30,000                       │ ← text-display-lg, bold
│                                 │
│  ┌─────────────────────────┐   │
│  │ 내역                     │   │
│  │                         │   │
│  │ 체험 리워드   ₩30,000    │   │
│  │ T+1 수수료    -₩0        │   │
│  │ ───────────────────────  │   │
│  │ 합계         ₩30,000    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 미션 정보                 │   │
│  │                         │   │
│  │ 수락일: 2025-12-15       │   │
│  │ 방문일: 2025-12-20       │   │
│  │ 완료일: 2025-12-20       │   │
│  │ 정산일: 2025-12-21       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 영상 성과                 │   │
│  │                         │   │
│  │ 👁️  조회수: 2,543       │   │
│  │ ❤️  좋아요: 156          │   │
│  │ 💬 댓글: 23             │   │
│  │                         │   │
│  │ [게시물 보기]            │   │
│  └─────────────────────────┘   │
│                                 │
│  [영수증 다운로드]               │ ← Ghost button
│                                 │
└─────────────────────────────────┘
```

### Withdrawal (출금 신청)

```
┌─────────────────────────────────┐
│  [←]  출금 신청                 │
│                                 │
│  출금 가능 금액                  │
│  ₩ 245,000                      │ ← text-display-md
│                                 │
│  ┌─────────────────────────┐   │
│  │ 출금 계좌                 │   │
│  │                         │   │
│  │ 은행: 국민은행           │   │
│  │ 계좌번호: 123-45-678901  │   │
│  │ 예금주: 김찍먹           │   │
│  │                         │   │
│  │ [계좌 변경]              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 출금 금액                 │   │
│  │                         │   │
│  │ ₩ [245,000            ] │   │ ← Input
│  │                         │   │
│  │ [전액 출금]              │   │ ← Quick action
│  └─────────────────────────┘   │
│                                 │
│  💡 출금 안내                    │
│  • 최소 출금액: 10,000원        │
│  • 출금 수수료: 무료             │
│  • 처리 시간: 영업일 기준 1-2일  │
│                                 │
│     [출금 신청]                 │ ← Primary button
│                                 │
└─────────────────────────────────┘
```

---

## 🔟 **Tab 4: MY (Profile)**

### Main Screen

```
┌─────────────────────────────────┐
│  MY                       [⚙️]  │ ← Header + Settings
│                                 │
│  ┌─────────┐                    │
│  │         │  @username         │ ← Avatar: 100x100px
│  │  [IMG]  │  김찍먹             │   text-h1, font-bold
│  └─────────┘  12.5k followers   │   text-sm, text-secondary
│                                 │
│  ┌────────┐ ┌────────┐         │ ← Quick actions
│  │ 프로필  │ │  뱃지   │         │   2 columns
│  │  편집  │ │ 🏆 3개 │         │   height: 60px
│  └────────┘ └────────┘         │
│                                 │
│  ┌─ 활동 통계 ─────────────┐   │
│  │                         │   │
│  │  ┌──────┐ ┌──────┐     │   │
│  │  │ 완료  │ │ 완료율│     │   │
│  │  │ 12건  │ │ 94%  │     │   │
│  │  └──────┘ └──────┘     │   │
│  │                         │   │
│  │  ┌──────┐ ┌──────┐     │   │
│  │  │ 평점  │ │ 응답률│     │   │
│  │  │ 4.9⭐ │ │ 89%  │     │   │
│  │  └──────┘ └──────┘     │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 내 정보 ───────────────┐   │
│  │                         │   │
│  │  활동 지역               │   │
│  │  [성수동 ×] [홍대 ×]    │   │
│  │                         │   │
│  │  관심 카테고리            │   │
│  │  [카페] [디저트] [맛집]  │   │
│  │                         │   │
│  │  스타일                  │   │
│  │  [감성적] [따뜻한 톤]    │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 계정 ──────────────────┐  │
│  │  연결된 SNS              │   │
│  │  ✅ TikTok @user        │   │
│  │  ✅ Instagram @user     │   │
│  │  ➕ YouTube 연결하기     │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 메뉴 ──────────────────┐  │
│  │  공지사항          [>]   │   │
│  │  이용가이드        [>]   │   │
│  │  문의하기          [>]   │   │
│  │  설정             [>]   │   │
│  └─────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Profile Edit

```
┌─────────────────────────────────┐
│  [←]  프로필 편집         [저장] │
│                                 │
│        ┌─────────┐              │
│        │         │              │ ← Avatar edit
│        │  [IMG]  │              │   Tap to change
│        └─────────┘              │
│       [사진 변경]                │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 이름                     │   │
│  │ [김찍먹                 ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 소개                     │   │
│  │ [따뜻한 감성의 영상을    ] │   │ ← Textarea
│  │ [만드는 크리에이터       ] │   │   max: 150자
│  │                          │   │
│  └─────────────────────────┘   │
│  150자 중 32자 사용              │
│                                 │
│  관심 카테고리                   │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │☕카페│ │🍰디저트│ │🍜맛집 │   │ ← Same as Step 3
│  └────┘ └────┘ └────┘          │
│  (선택됨)                       │
│                                 │
│  활동 지역                       │
│  [성수동 ×] [홍대 ×]            │
│  [+ 지역 추가]                  │
│                                 │
│  SNS 계정                       │
│  ┌─────────────────────────┐   │
│  │ Instagram                │   │
│  │ @your_insta             │   │
│  │ 12.5k followers         │   │
│  │ [업데이트]               │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ TikTok                   │   │
│  │ @your_tiktok            │   │
│  │ 8.5k followers          │   │
│  │ [업데이트]               │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Settings

```
┌─────────────────────────────────┐
│  [←]  설정                      │
│                                 │
│  ┌─ 알림 ──────────────────┐   │
│  │                         │   │
│  │  새 오퍼 알림      [●]   │   │ ← Toggle switches
│  │  미션 리마인더    [●]   │   │   Active: primary
│  │  정산 완료 알림    [●]   │   │   Inactive: gray
│  │  마케팅 알림      [○]   │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 계정 ──────────────────┐   │
│  │                         │   │
│  │  전화번호 변경     [>]   │   │
│  │  이메일 변경      [>]   │   │
│  │  비밀번호 변경    [>]   │   │
│  │  계정 연동 관리   [>]   │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 정산 ──────────────────┐   │
│  │                         │   │
│  │  출금 계좌 관리    [>]   │   │
│  │  정산 내역       [>]   │   │
│  │  세금 정보       [>]   │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 앱 설정 ────────────────┐  │
│  │                         │   │
│  │  언어 설정       한국어  │   │
│  │  화면 모드       다크 모드│   │
│  │  캐시 삭제       [>]   │   │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 기타 ───────────────────┐  │
│  │                         │   │
│  │  이용약관        [>]   │   │
│  │  개인정보처리방침  [>]   │   │
│  │  오픈소스 라이선스 [>]   │   │
│  │  버전 정보       1.0.0  │   │
│  └─────────────────────────┘  │
│                                 │
│  [로그아웃]                     │ ← Danger button
│  [회원 탈퇴]                     │   text-danger
│                                 │
└─────────────────────────────────┘
```

---

# 🏪 **Merchant App UX Flow**

---

## 1️⃣1️⃣ **Merchant App - Splash Screen**

### Layout (375x812 기준)

```
┌─────────────────────────────────┐
│                                 │ ← Safe Area Top
│                                 │
│          [찍먹 로고]             │ ← 중앙 배치
│                                 │   100x100px
│                                 │   Same as Creator App
│                                 │
│      로컬 인플루언서 마케팅       │ ← Subtitle (다름)
│                                 │   text-lg, text-secondary
│                                 │
│                                 │
│       ────────────────          │ ← Loading indicator
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Specs

동일한 스플래시 디자인이지만, 서브타이틀만 변경:
- Creator: "로컬 체험으로 수익 만들기"
- Merchant: "로컬 인플루언서 마케팅"

---

## 1️⃣2️⃣ **Merchant Onboarding** (3 Screens)

### Screen 1: Value Proposition

```
┌─────────────────────────────────┐
│  [Skip]                         │
│                                 │
│                                 │
│        [일러스트레이션]           │ ← 280x280px
│      상점 + 인플루언서            │   Lottie 애니메이션
│                                 │
│                                 │
│  주변 인플루언서와 바로 연결      │ ← text-display-md
│                                 │   font-semibold
│  위치 기반으로 우리 매장 근처의    │ ← text-base
│  크리에이터를 찾아 오퍼를 보내세요 │   text-secondary
│                                 │
│                                 │
│        ● ○ ○                    │
│                                 │
│     [다음]                       │
│                                 │
└─────────────────────────────────┘
```

### Screen 2: Trust & Safety

```
┌─────────────────────────────────┐
│  [Skip]                         │
│                                 │
│        [일러스트레이션]           │
│       검증 뱃지 + 체크마크         │
│                                 │
│                                 │
│     검증된 크리에이터만           │ ← text-display-md
│                                 │
│  모든 크리에이터는 SNS 계정 검증과 │ ← text-base
│  이전 작업물 심사를 거쳐          │   text-secondary
│  승인되었습니다                  │
│                                 │
│                                 │
│        ○ ● ○                    │
│                                 │
│     [다음]                       │
│                                 │
└─────────────────────────────────┘
```

### Screen 3: ROI Focused

```
┌─────────────────────────────────┐
│                                 │
│        [일러스트레이션]           │
│      그래프 + 돈 아이콘           │
│                                 │
│                                 │
│    명확한 성과, 투명한 정산       │ ← text-display-md
│                                 │
│  조회수, 좋아요, 댓글까지          │ ← text-base
│  모든 성과를 실시간으로 확인하고   │   text-secondary
│  성공한 만큼만 지불하세요         │
│                                 │
│                                 │
│        ○ ○ ●                    │
│                                 │
│     [시작하기]                   │
│                                 │
└─────────────────────────────────┘
```

---

## 1️⃣3️⃣ **Merchant Login & Verification**

### Login Screen

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│          [찍먹 로고]             │ ← 80x80px
│                                 │
│    로컬 인플루언서 마케팅         │ ← text-lg
│                                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 이메일 또는 전화번호       │   │
│  │ [email@example.com    ] │   │ ← Input: height 56px
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 비밀번호                  │   │
│  │ [••••••••             ] │   │
│  └─────────────────────────┘   │
│                                 │
│     [로그인]                     │ ← Primary button
│                                 │
│                                 │
│  [비밀번호 찾기]  |  [회원가입]  │ ← Links
│                                 │
│  ─────── 또는 ───────           │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🍎  Apple로 계속하기     │   │ ← Social login
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🅖  Google로 계속하기    │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Business Verification Flow (회원가입)

#### Step 1: Basic Info

```
┌─────────────────────────────────┐
│  [←]          사업자 정보  1/3   │
│                                 │
│  매장 기본 정보를 입력해주세요     │ ← text-h1
│                                 │
│  ┌─────────────────────────┐   │
│  │ 매장 이름                 │   │
│  │ [성수동 OO카페          ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 사업자 등록번호            │   │
│  │ [123-45-67890         ] │   │ ← Format: xxx-xx-xxxxx
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 대표자명                  │   │
│  │ [홍길동                 ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 전화번호                  │   │
│  │ [02-1234-5678         ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 이메일                    │   │
│  │ [business@example.com ] │   │
│  └─────────────────────────┘   │
│                                 │
│     [다음]                      │
│                                 │
└─────────────────────────────────┘
```

#### Step 2: Location

```
┌─────────────────────────────────┐
│  [←]          위치 정보    2/3   │
│                                 │
│  매장 위치를 등록해주세요          │ ← text-h1
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │                         │   │
│  │      [지도 영역]         │   │ ← Mapbox GL
│  │                         │   │   height: 300px
│  │        📍 현재 위치       │   │
│  │                         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 주소                      │   │
│  │ 서울시 성수동 123-45      │   │ ← Auto-filled from map
│  │ [상세주소              ] │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 정확한 위치는 크리에이터 검색에 │
│  중요합니다!                     │ ← text-sm, info
│                                 │
│     [다음]                      │
│                                 │
└─────────────────────────────────┘
```

#### Step 3: Category & Photos

```
┌─────────────────────────────────┐
│  [←]        매장 정보      3/3   │
│                                 │
│  카테고리                        │ ← text-h2
│                                 │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │☕카페│ │🍰디저트│ │🍜맛집 │   │ ← Same as Creator
│  └────┘ └────┘ └────┘          │   Single select
│  (선택됨)                       │
│                                 │
│  매장 사진 (최대 5장)            │ ← text-h2
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ [+]  │ │[사진1]│ │[사진2]│   │ ← Upload grid
│  └──────┘ └──────┘ └──────┘   │   120x120px each
│                                 │
│  매장 소개                       │ ← text-h2
│  ┌─────────────────────────┐   │
│  │ 따뜻한 분위기의 로컬 카페  │   │ ← Textarea
│  │                         │   │   max: 200자
│  │                         │   │
│  └─────────────────────────┘   │
│  200자 중 28자 사용              │
│                                 │
│  운영 시간                       │
│  ┌─────────┐  ┌─────────┐     │
│  │ 10:00   │ ~ │ 22:00   │     │ ← Time pickers
│  └─────────┘  └─────────┘     │
│                                 │
│     [가입 완료]                  │
│                                 │
└─────────────────────────────────┘
```

#### Verification Pending

```
┌─────────────────────────────────┐
│                                 │
│        ⏳                       │ ← Icon: 64x64px
│                                 │
│  사업자 검증 중이에요             │ ← text-h1
│                                 │
│  보통 1-2 영업일 내에             │ ← text-base
│  검토가 완료됩니다                │   text-secondary
│                                 │
│  ┌─────────────────────────┐   │
│  │ 검증 항목:               │   │
│  │                         │   │
│  │ ✅ 사업자 등록번호 확인됨  │   │
│  │ ⏳ 사업장 실사 진행 중    │   │
│  │ ⏳ 최종 승인 대기        │   │
│  └─────────────────────────┘   │
│                                 │
│  승인되면 이메일로 알려드릴게요!   │
│                                 │
│     [확인]                      │
│                                 │
└─────────────────────────────────┘
```

---

## 1️⃣4️⃣ **Merchant Main App - Tab Navigation**

### Bottom Tab Bar

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│        [Content Area]           │
│                                 │
│                                 │
├─────────────────────────────────┤
│                                 │
│  [검색]  [오퍼]  [분석]  [MY]   │ ← Tabs
│   🔍     ✉️     📊     🏢       │   height: 64px
│                                 │
└─────────────────────────────────┘
```

---

## 1️⃣5️⃣ **Tab 1: 검색 (Creator Discovery) - 핵심 차별화**

### Main Search Screen (Map View)

```
┌─────────────────────────────────┐
│  [=]  크리에이터 검색    [🔔]   │ ← Header: height 56px
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔍 [위치, 카테고리 검색 ] │   │ ← Search bar
│  └─────────────────────────┘   │   height: 48px
│                                 │
│ ┌──────────────────────────┐   │
│ │                          │   │
│ │                          │   │
│ │       [Mapbox 지도]       │   │ ← Full screen map
│ │                          │   │   Interactive
│ │      📍 📍 📍 📍         │   │   Creator markers
│ │   📍      📍     📍      │   │
│ │      📍      📍          │   │
│ │  📍            📍        │   │
│ │                          │   │
│ │   [내 위치로 이동]  [필터]│   │ ← Floating buttons
│ └──────────────────────────┘   │
│                                 │
│ ┌─ 근처 크리에이터 ────────┐   │ ← Bottom sheet
│ │  [드래그 핸들]            │   │   Swipeable up/down
│ │                          │   │
│ │  성수동 기준 15명 찾음     │   │
│ │                          │   │
│ │  ┌──────────────────────┐│  │
│ │  │ [👤] @username       ││  │ ← Creator card
│ │  │ 12.5k · ☕카페       ││  │   Horizontal scroll
│ │  │ 850m · 성수동        ││  │
│ │  └──────────────────────┘│  │
│ │  [→ 더보기]              │   │
│ └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Map Specs

```javascript
// Mapbox GL JS Configuration
const mapConfig = {
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [userLng, userLat], // 사용자 위치
  zoom: 14,
  pitch: 45, // 3D 각도
  bearing: 0
};

// Creator Marker
const creatorMarker = {
  width: 40,
  height: 40,
  backgroundColor: '#FF6B35',
  border: '3px solid white',
  borderRadius: '50%',
  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
  cursor: 'pointer'
};

// Cluster Marker (여러 크리에이터)
const clusterMarker = {
  backgroundColor: 'rgba(255, 107, 53, 0.8)',
  color: 'white',
  fontWeight: 700,
  fontSize: 16,
  borderRadius: '50%'
};

// Search Radius Circle
const searchRadius = {
  type: 'circle',
  paint: {
    'circle-radius': 2000, // 2km
    'circle-color': 'rgba(78, 205, 196, 0.15)',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#4ECDC4'
  }
};
```

### Filter Panel (Slide-in from right)

```
┌─────────────────────────────────┐
│  [×]  필터                      │ ← Header
│                                 │
│  ┌─ 위치 ───────────────────┐  │
│  │                          │  │
│  │ 검색 반경                 │  │
│  │ ●─────────────○         │  │ ← Slider
│  │ 1km            5km       │  │   Range: 0.5km - 10km
│  └──────────────────────────┘  │
│                                 │
│  ┌─ 카테고리 ───────────────┐  │
│  │                          │  │
│  │ [☕] 카페                 │  │ ← Checkbox list
│  │ [🍰] 디저트               │  │   Multiple select
│  │ [🍜] 맛집                 │  │
│  │ [💄] 뷰티                 │  │
│  │ [👗] 패션                 │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌─ 팔로워 수 ──────────────┐  │
│  │                          │  │
│  │ [ ] 나노 (1k-10k)        │  │
│  │ [ ] 마이크로 (10k-50k)   │  │
│  │ [ ] 미드 (50k-100k)      │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌─ 예산 범위 ──────────────┐  │
│  │                          │  │
│  │ 최소: ₩20,000            │  │
│  │ ●─────────────○         │  │
│  │ 최대: ₩100,000           │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌─ 정렬 ───────────────────┐  │
│  │ ⚪ 거리순 (가까운 순)      │  │ ← Radio buttons
│  │ ⚪ 팔로워순 (많은 순)      │  │
│  │ ⚪ 평점순 (높은 순)        │  │
│  │ ⚪ 완료율순               │  │
│  └──────────────────────────┘  │
│                                 │
│  [초기화]      [15명 보기]      │ ← Actions
│                                 │
└─────────────────────────────────┘
```

### Creator List View (Alternative to Map)

```
┌─────────────────────────────────┐
│  [🗺️ 지도] [📋 리스트]         │ ← Toggle view
│                                 │
│  15명의 크리에이터               │ ← Count
│  [최신순 ▼]                     │ ← Sort dropdown
│                                 │
│  ┌─────────────────────────┐   │
│  │ ┌─────┐  @username      │   │ ← Creator card
│  │ │     │  12.5k 팔로워    │   │   height: 120px
│  │ │ IMG │                 │   │
│  │ │     │  ☕카페 🍰디저트  │   │
│  │ └─────┘  📍 850m·성수동  │   │
│  │                         │   │
│  │  ⭐ 4.9 | 완료율 94%     │   │
│  │                         │   │
│  │  [프로필 보기] [오퍼 보내기]│  │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ┌─────┐  @creator2      │   │
│  │ │     │  8.5k 팔로워     │   │
│  │ │ IMG │                 │   │
│  │ │     │  🍜맛집 💄뷰티   │   │
│  │ └─────┘  📍 1.2km·홍대   │   │
│  │                         │   │
│  │  ⭐ 4.8 | 완료율 89%     │   │
│  │                         │   │
│  │  [프로필 보기] [오퍼 보내기]│  │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## 1️⃣6️⃣ **Creator Profile Detail** (From Search)

### Profile Header

```
┌─────────────────────────────────┐
│  [←]                      [⋮]   │ ← Back + Menu
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │ ← Cover image
│  │    [배경 이미지]         │   │   height: 200px
│  │                         │   │   Gradient overlay
│  │                         │   │
│  │   ┌─────────┐           │   │ ← Avatar
│  │   │         │           │   │   120x120px
│  │   │  [IMG]  │           │   │   Bottom aligned
│  │   └─────────┘           │   │
│  └─────────────────────────┘   │
│                                 │
│  @username                      │ ← text-h1, font-bold
│  김찍먹                          │ ← Real name
│  12.5k 팔로워                   │ ← text-sm, text-secondary
│                                 │
│  📍 성수동, 홍대 · 850m         │ ← Location + distance
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ ⭐4.9 │ │완료12│ │응답89%│   │ ← Stats
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│     [오퍼 보내기]                │ ← Primary CTA
│                                 │   Fixed bottom
└─────────────────────────────────┘
```

### Profile Content (Scrollable)

```
│  ┌─ 소개 ──────────────────┐   │
│  │                         │   │
│  │ 따뜻하고 감성적인 영상을   │   │
│  │ 만드는 크리에이터입니다    │   │
│  │                         │   │
│  │ 전문 분야: 카페, 디저트    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 카테고리 ──────────────┐   │
│  │ [☕카페] [🍰디저트]       │   │ ← Badges
│  │ [🍜맛집]                 │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 스타일 태그 ────────────┐  │
│  │ #감성적 #따뜻한톤         │   │
│  │ #미니멀 #자연스러운       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ SNS 계정 ──────────────┐  │
│  │                         │   │
│  │ 📱 TikTok    8.5k       │   │
│  │ 📷 Instagram 12.5k      │   │
│  │ ▶️  YouTube   3.2k      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 포트폴리오 ─────────────┐  │
│  │                         │   │
│  │ [썸네일] [썸네일] [썸네일]│  │ ← Video thumbnails
│  │                         │   │   Horizontal scroll
│  │ [더보기 →]              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 리뷰 (8) ───────────────┐  │
│  │                         │   │
│  │ ⭐⭐⭐⭐⭐ 5.0          │   │
│  │ "영상이 정말 감성적이에요!" │  │
│  │ - 성수 XX카페 · 2주 전   │   │
│  │                         │   │
│  │ ⭐⭐⭐⭐⭐ 5.0          │   │
│  │ "촬영 퀄리티가 좋습니다"   │   │
│  │ - 홍대 YY레스토랑 · 1달 전│  │
│  │                         │   │
│  │ [모든 리뷰 보기 →]       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 활동 통계 ──────────────┐  │
│  │                         │   │
│  │ 총 완료: 12건            │   │
│  │ 완료율: 94%             │   │
│  │ 평균 조회수: 2.3k        │   │
│  │ 평균 좋아요: 156         │   │
│  │ 응답 시간: 평균 2시간     │   │
│  └─────────────────────────┘   │
│                                 │
│     [오퍼 보내기]                │ ← Fixed bottom
│                                 │
└─────────────────────────────────┘
```

---

## 1️⃣7️⃣ **Send Offer Flow** (Multi-Step)

### Step 1: Offer Type

```
┌─────────────────────────────────┐
│  [←]  오퍼 보내기          1/4   │
│                                 │
│  오퍼 유형을 선택하세요           │ ← text-h1
│                                 │
│  ┌─────────────────────────┐   │
│  │  🎁 무료 체험 + 리워드    │   │ ← Option card
│  │                         │   │   height: 120px
│  │  크리에이터에게 무료 체험과│  │   Active: primary border
│  │  현금 리워드를 제공합니다  │   │
│  │                         │   │
│  │  가장 인기있는 옵션 ✨    │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  💰 리워드만             │   │
│  │                         │   │
│  │  체험 없이 순수 현금      │   │
│  │  리워드만 지급합니다      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  🎫 제품 제공            │   │
│  │                         │   │
│  │  제품/서비스만 무료로     │   │
│  │  제공합니다 (리워드 없음) │   │
│  └─────────────────────────┘   │
│                                 │
│     [다음]                      │
│                                 │
└─────────────────────────────────┘
```

### Step 2: Offer Details

```
┌─────────────────────────────────┐
│  [←]  오퍼 상세              2/4│
│                                 │
│  제공할 체험을 입력하세요          │ ← text-h1
│                                 │
│  ┌─────────────────────────┐   │
│  │ 체험 내용                 │   │
│  │ [시그니처 커피 1잔 + 디저트│  │ ← Input
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 예상 가치                 │   │
│  │ ₩ [25,000             ] │   │ ← Number input
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 리워드 금액 (추가)        │   │
│  │ ₩ [30,000             ] │   │
│  └─────────────────────────┘   │
│                                 │
│  총 제공 가치: ₩55,000          │ ← Calculated
│                                 │
│  ┌─────────────────────────┐   │
│  │ 촬영 요구사항             │   │
│  │                         │   │
│  │ [✓] Instagram 릴스       │   │ ← Checkboxes
│  │ [✓] 15초 영상            │   │
│  │ [ ] TikTok 추가 (+₩10k) │   │
│  │ [ ] YouTube Shorts      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 특별 요청사항 (선택)       │   │
│  │ [매장 인테리어 포함 필수  │   │ ← Textarea
│  │  음식 클로즈업 3초 이상   │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│     [다음]                      │
│                                 │
└─────────────────────────────────┘
```

### Step 3: Schedule & Timeline

```
┌─────────────────────────────────┐
│  [←]  일정 설정              3/4│
│                                 │
│  방문 기한                       │ ← text-h2
│                                 │
│  ┌─────────────────────────┐   │
│  │ 오퍼 수락 후              │   │
│  │                         │   │
│  │  [  14  ] 일 이내 방문   │   │ ← Number input
│  │                         │   │   Default: 14
│  └─────────────────────────┘   │
│                                 │
│  예상 종료일: 2026-01-09        │ ← Calculated
│                                 │
│  ┌─────────────────────────┐   │
│  │ 선호 방문 시간 (선택)     │   │
│  │                         │   │
│  │ [ ] 평일 오전 (10-12)    │   │ ← Checkboxes
│  │ [✓] 평일 오후 (14-17)    │   │
│  │ [✓] 주말 전일            │   │
│  └─────────────────────────┘   │
│                                 │
│  추가 안내사항                   │ ← text-h2
│                                 │
│  ┌─────────────────────────┐   │
│  │ [방문 전 예약 필수        │   │ ← Textarea
│  │  주차 불가 (대중교통 이용)│   │
│  │  영업시간: 10:00-22:00   │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  정산 옵션                       │
│  ⚪ T+1 (검증 후 익일 정산)      │ ← Radio
│  ⚪ T+0 (당일 정산, +800원)     │
│                                 │
│     [다음]                      │
│                                 │
└─────────────────────────────────┘
```

### Step 4: Review & Send

```
┌─────────────────────────────────┐
│  [←]  최종 확인              4/4│
│                                 │
│  오퍼 요약                       │ ← text-h1
│                                 │
│  ┌─────────────────────────┐   │
│  │ 받는 사람                 │   │
│  │ @username (12.5k)       │   │
│  │ 📍 성수동                │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💰 제공 내용             │   │
│  │                         │   │
│  │ • 시그니처 커피 + 디저트  │   │
│  │   (₩25,000 상당)        │   │
│  │ • 현금 리워드 ₩30,000    │   │
│  │                         │   │
│  │ 총 가치: ₩55,000        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📹 요구사항              │   │
│  │                         │   │
│  │ • Instagram 릴스 1개     │   │
│  │ • 15초 영상              │   │
│  │ • 매장 인테리어 포함 필수 │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ⏰ 일정                  │   │
│  │ 14일 이내 방문           │   │
│  │ 선호 시간: 평일 오후, 주말│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💵 예상 비용 계산        │   │
│  │                         │   │
│  │ 체험 비용      ₩25,000   │   │
│  │ 리워드         ₩30,000   │   │
│  │ 플랫폼 수수료   ₩12,650   │   │ ← 23% (리워드 기준)
│  │ ───────────────────────  │   │
│  │ 총 비용       ₩67,650   │   │ ← Bold
│  └─────────────────────────┘   │
│                                 │
│  [ ] 이용약관에 동의합니다       │ ← Checkbox required
│                                 │
│     [오퍼 보내기]                │ ← Primary CTA
│                                 │
└─────────────────────────────────┘
```

### Offer Sent Confirmation

```
┌─────────────────────────────────┐
│                                 │
│        ✉️                       │ ← Icon: 64x64px
│                                 │   Animated
│  오퍼를 보냈어요!                 │ ← text-display-md
│                                 │
│  @username에게 오퍼가 전달되었습니다│ ← text-base
│  보통 24시간 이내에 응답해요       │   text-secondary
│                                 │
│  ┌─────────────────────────┐   │
│  │ 다음 단계                 │   │
│  │                         │   │
│  │ 1️⃣ 크리에이터 검토 (24h) │   │
│  │ 2️⃣ 수락 시 방문 예약     │   │
│  │ 3️⃣ 촬영 및 업로드        │   │
│  │ 4️⃣ 검증 및 정산          │   │
│  └─────────────────────────┘   │
│                                 │
│  알림을 켜두면 응답 즉시          │
│  알려드려요!                     │
│                                 │
│  [알림 켜기]    [오퍼 관리로]    │
│                                 │
└─────────────────────────────────┘
```

---

## 1️⃣8️⃣ **Tab 2: 오퍼 (Offer Management)**

### Main Screen

```
┌─────────────────────────────────┐
│  오퍼 관리              [+ 새로 만들기]│ ← Header + CTA
│                                 │
│  ┌─ 진행 중 (3) ────────────┐  │
│  │                         │   │
│  │  ┌─────────────────────┐│  │
│  │  │ @username           ││  │ ← Offer card
│  │  │ 12.5k · 성수동      ││  │   Compact view
│  │  │                     ││  │
│  │  │ 💰 ₩30,000         ││  │
│  │  │ 📹 Instagram 릴스   ││  │
│  │  │                     ││  │
│  │  │ 상태: 수락됨 · 3일 전││  │
│  │  │ 📅 방문 예정: 12/28 ││  │
│  │  │                     ││  │
│  │  │ [상세보기]          ││  │
│  │  └─────────────────────┘│  │
│  │                         │   │
│  │  ┌─────────────────────┐│  │
│  │  │ @creator2           ││  │
│  │  │ 8.5k · 홍대         ││  │
│  │  │                     ││  │
│  │  │ 💰 ₩50,000         ││  │
│  │  │ 📹 릴스 + TikTok    ││  │
│  │  │                     ││  │
│  │  │ 상태: 촬영 완료      ││  │
│  │  │ 🔍 검증 중...       ││  │
│  │  │                     ││  │
│  │  │ [결과 확인]         ││  │
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 대기 중 (2) ────────────┐  │
│  │                         │   │
│  │  ┌─────────────────────┐│  │
│  │  │ @creator3           ││  │
│  │  │ 15k · 강남          ││  │
│  │  │                     ││  │
│  │  │ 💰 ₩40,000         ││  │
│  │  │ 📹 YouTube Shorts   ││  │
│  │  │                     ││  │
│  │  │ 상태: 검토 중 · 12시간│  │
│  │  │ ⏰ 아직 응답 없음    ││  │
│  │  │                     ││  │
│  │  │ [취소하기]          ││  │
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                 │
│  ┌─ 완료 (12) ──────────────┐  │
│  │  [최근 30일] [전체보기]  │   │
│  │                         │   │
│  │  12월 20일               │   │
│  │  ┌─────────────────────┐│  │
│  │  │ @username           ││  │
│  │  │ ✅ 완료 · 정산 완료  ││  │
│  │  │                     ││  │
│  │  │ 📊 조회수: 2.5k     ││  │
│  │  │ ❤️  좋아요: 156      ││  │
│  │  │ ⭐ 평가: 5.0        ││  │
│  │  │                     ││  │
│  │  │ [결과 보기]         ││  │
│  │  └─────────────────────┘│  │
│  └─────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Offer Detail Page (In Progress)

```
┌─────────────────────────────────┐
│  [←]  오퍼 상세           [⋮]   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ┌───────┐               │   │
│  │ │       │  @username    │   │ ← Creator info
│  │ │  IMG  │  12.5k 팔로워  │   │
│  │ └───────┘  ☕카페        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 진행 상황 ──────────────┐  │
│  │                         │   │
│  │ ✅ 오퍼 수락 (12/15)     │   │ ← Timeline
│  │ ✅ 방문 예약 완료 (12/18)│   │
│  │ 🟡 방문 예정 (12/28)     │   │ ← Current step
│  │ ⚪ 촬영 및 업로드        │   │
│  │ ⚪ 검증                 │   │
│  │ ⚪ 정산                 │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 제공 내역 ──────────────┐  │
│  │                         │   │
│  │ • 시그니처 커피 + 디저트  │   │
│  │   (₩25,000)            │   │
│  │ • 현금 리워드 ₩30,000    │   │
│  │                         │   │
│  │ 총 제공: ₩55,000        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 요구사항 ───────────────┐  │
│  │                         │   │
│  │ ✅ Instagram 릴스 1개    │   │
│  │ ✅ 15초 영상             │   │
│  │ ⏳ 매장 인테리어 포함     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 방문 정보 ──────────────┐  │
│  │                         │   │
│  │ 예약일: 2025-12-28      │   │
│  │ 시간: 오후 3:00         │   │
│  │ 특별 요청: 창가 자리     │   │
│  │                         │   │
│  │ [크리에이터에게 메시지]   │   │
│  └─────────────────────────┘   │
│                                 │
│  [오퍼 취소하기]                 │ ← Danger action
│                                 │
└─────────────────────────────────┘
```

### Offer Detail - After Completion

```
┌─────────────────────────────────┐
│  [←]  오퍼 결과                 │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ┌───────┐               │   │
│  │ │       │  @username    │   │
│  │ │  IMG  │  12.5k 팔로워  │   │
│  │ └───────┘  ⭐ 5.0       │   │
│  └─────────────────────────┘   │
│                                 │
│  ✅ 미션 완료!                   │ ← Success badge
│  정산 완료 · 2025-12-21         │
│                                 │
│  ┌─ 게시물 성과 ────────────┐  │
│  │                         │   │
│  │ [비디오 썸네일]          │   │ ← Video preview
│  │                         │   │   Playable
│  │ 📱 Instagram            │   │
│  │ 게시일: 12/20           │   │
│  │                         │   │
│  │ 👁️  조회수: 2,543       │   │ ← Metrics
│  │ ❤️  좋아요: 156          │   │
│  │ 💬 댓글: 23             │   │
│  │ 🔗 공유: 12             │   │
│  │                         │   │
│  │ 참여율: 6.8% (평균 대비 +2.3%)│
│  │                         │   │
│  │ [게시물 보기]            │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 비용 내역 ──────────────┐  │
│  │                         │   │
│  │ 체험 비용      ₩25,000   │   │
│  │ 리워드         ₩30,000   │   │
│  │ 플랫폼 수수료   ₩12,650   │   │
│  │ ───────────────────────  │   │
│  │ 총 지출       ₩67,650   │   │
│  │                         │   │
│  │ T+1 정산 완료            │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 크리에이터 평가 ─────────┐  │
│  │                         │   │
│  │ 이 크리에이터와 작업은      │   │
│  │ 어떠셨나요?              │   │
│  │                         │   │
│  │ ⭐⭐⭐⭐⭐             │   │ ← Star rating
│  │                         │   │
│  │ [영상 퀄리티가 좋았어요   │   │ ← Textarea
│  │  다음에 또 연락하고 싶습니다]│  │
│  │                         │   │
│  │ [평가 제출]              │   │
│  └─────────────────────────┘   │
│                                 │
│  [영수증 다운로드]               │
│  [다시 오퍼 보내기]              │
│                                 │
└─────────────────────────────────┘
```

---

## 1️⃣9️⃣ **Tab 3: 분석 (Analytics)**

### Dashboard Main

```
┌─────────────────────────────────┐
│  캠페인 분석              [📊]   │ ← Header
│                                 │
│  ┌─────────────────────────┐   │
│  │  이번 달 성과             │   │ ← Summary card
│  │                         │   │   Gradient bg
│  │  총 조회수               │   │
│  │  45.2k                  │   │ ← text-display-lg
│  │                         │   │
│  │  전월 대비 +28% 📈       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │ 총지출 │ │ 캠페인│ │ 평균  │   │ ← Stats grid
│  │₩245k │ │  8개 │ │₩30k  │   │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  ┌─ 성과 추이 (최근 6개월) ──┐  │
│  │                         │   │
│  │  [라인 차트]             │   │ ← Line chart
│  │                         │   │   조회수 + 참여율
│  │   /\    /\              │   │
│  │  /  \  /  \  /\         │   │
│  │ /    \/    \/  \        │   │
│  │                         │   │
│  │ 7월 8월 9월 10월 11월 12월│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 카테고리별 ROI ──────────┐  │
│  │                         │   │
│  │ ☕ 카페                  │   │
│  │ 지출: ₩120k → 조회: 25k  │   │
│  │ ROI: 208% ▲             │   │ ← Success color
│  │ [████████░░] 높음       │   │
│  │                         │   │
│  │ 🍜 맛집                  │   │
│  │ 지출: ₩80k → 조회: 15k   │   │
│  │ ROI: 187% ▲             │   │
│  │ [███████░░░] 높음       │   │
│  │                         │   │
│  │ 💄 뷰티                  │   │
│  │ 지출: ₩45k → 조회: 5.2k  │   │
│  │ ROI: 115% ▲             │   │
│  │ [████░░░░░░] 보통       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 인기 크리에이터 ─────────┐  │
│  │                         │   │
│  │ 1. @username            │   │
│  │    평균 조회: 2.8k       │   │
│  │    완료: 3회             │   │
│  │                         │   │
│  │ 2. @creator2            │   │
│  │    평균 조회: 2.1k       │   │
│  │    완료: 2회             │   │
│  │                         │   │
│  │ [전체 순위 보기]         │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Campaign Detail Analytics

```
┌─────────────────────────────────┐
│  [←]  캠페인 상세 분석           │
│                                 │
│  기간: 2025년 12월              │
│  총 8개 캠페인                   │
│                                 │
│  ┌─ 주요 지표 ──────────────┐  │
│  │                         │   │
│  │ 총 조회수    45,234      │   │
│  │ 총 좋아요    2,156       │   │
│  │ 총 댓글      342         │   │
│  │ 총 공유      127         │   │
│  │                         │   │
│  │ 평균 참여율  6.2%        │   │
│  │ (업계 평균: 4.8%)        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 시간대별 조회 패턴 ───────┐  │
│  │                         │   │
│  │  [막대 그래프]           │   │
│  │  █                      │   │
│  │  █  █                   │   │
│  │  █  █     █  █          │   │
│  │  █  █  █  █  █  █       │   │
│  │                         │   │
│  │ 10 12 14 16 18 20 22시  │   │
│  │                         │   │
│  │ 피크 시간: 오후 6-8시     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 인구통계 ───────────────┐  │
│  │                         │   │
│  │ 연령대:                  │   │
│  │ 18-24세  ████░ 42%      │   │
│  │ 25-34세  ██████ 38%     │   │
│  │ 35-44세  ██░ 15%        │   │
│  │ 45+세    ░ 5%           │   │
│  │                         │   │
│  │ 성별: 여성 68% | 남성 32% │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 지역별 반응 ─────────────┐  │
│  │                         │   │
│  │ 1. 강남구    12.5k (28%) │   │
│  │ 2. 성동구    8.2k (18%)  │   │
│  │ 3. 마포구    6.1k (14%)  │   │
│  │ 4. 용산구    4.8k (11%)  │   │
│  │ 5. 기타      13.6k (29%) │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 비용 효율성 ─────────────┐  │
│  │                         │   │
│  │ 조회당 비용 (CPV)        │   │
│  │ ₩5.4                    │   │
│  │ (업계 평균: ₩8.2)        │   │
│  │                         │   │
│  │ 참여당 비용 (CPE)        │   │
│  │ ₩87                     │   │
│  │                         │   │
│  │ 💡 평균 대비 34% 절감    │   │
│  └─────────────────────────┘   │
│                                 │
│  [리포트 다운로드 (PDF)]         │
│  [데이터 내보내기 (CSV)]         │
│                                 │
└─────────────────────────────────┘
```

### Comparison View

```
┌─────────────────────────────────┐
│  [←]  크리에이터 비교            │
│                                 │
│  선택한 크리에이터 (2)           │
│                                 │
│  ┌─────────────┬─────────────┐ │
│  │ @username   │ @creator2   │ │
│  ├─────────────┼─────────────┤ │
│  │ 팔로워       │             │ │
│  │ 12.5k       │ 8.5k        │ │
│  ├─────────────┼─────────────┤ │
│  │ 평균 조회수   │             │ │
│  │ 2.8k        │ 2.1k        │ │
│  ├─────────────┼─────────────┤ │
│  │ 참여율       │             │ │
│  │ 6.8%        │ 5.4%        │ │
│  ├─────────────┼─────────────┤ │
│  │ 완료한 미션   │             │ │
│  │ 3회         │ 2회         │ │
│  ├─────────────┼─────────────┤ │
│  │ 평점         │             │ │
│  │ ⭐ 5.0      │ ⭐ 4.8      │ │
│  ├─────────────┼─────────────┤ │
│  │ 평균 비용     │             │ │
│  │ ₩67k        │ ₩54k        │ │
│  ├─────────────┼─────────────┤ │
│  │ ROI         │             │ │
│  │ 208%        │ 187%        │ │
│  └─────────────┴─────────────┘ │
│                                 │
│  ┌─ 추천 ──────────────────┐  │
│  │                         │   │
│  │ @username이 더 높은      │   │
│  │ 참여율과 ROI를 보여줍니다 │   │
│  │                         │   │
│  │ 하지만 @creator2가       │   │
│  │ 비용 효율적입니다         │   │
│  └─────────────────────────┘   │
│                                 │
│  [다른 크리에이터 추가]          │
│                                 │
└─────────────────────────────────┘
```

---

## 2️⃣0️⃣ **Tab 4: MY (Business Profile)**

### Main Screen

```
┌─────────────────────────────────┐
│  MY                       [⚙️]  │
│                                 │
│  ┌─────────┐                    │
│  │         │  성수동 OO카페      │ ← Business logo
│  │  [IMG]  │  ☕ 카페           │   120x120px
│  └─────────┘  📍 성수동         │
│                                 │
│  ┌────────┐ ┌────────┐         │
│  │ 프로필  │ │  통계   │         │ ← Quick actions
│  │  편집  │ │ 📊 보기 │         │
│  └────────┘ └────────┘         │
│                                 │
│  ┌─ 활동 통계 ─────────────┐   │
│  │                         │   │
│  │  ┌──────┐ ┌──────┐     │   │
│  │  │ 총오퍼 │ │ 완료  │     │   │
│  │  │ 24건  │ │ 18건 │     │   │
│  │  └──────┘ └──────┘     │   │
│  │                         │   │
│  │  ┌──────┐ ┌──────┐     │   │
│  │  │ 총지출 │ │ 평균  │     │   │
│  │  │₩680k │ │₩38k  │     │   │
│  │  └──────┘ └──────┘     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 비즈니스 정보 ──────────┐   │
│  │                         │   │
│  │  사업자 등록번호          │   │
│  │  123-45-67890           │   │
│  │                         │   │
│  │  대표자                  │   │
│  │  홍길동                  │   │
│  │                         │   │
│  │  전화번호                │   │
│  │  02-1234-5678           │   │
│  │                         │   │
│  │  주소                    │   │
│  │  서울시 성수동 123-45    │   │
│  │                         │   │
│  │  [정보 수정]             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 정산 ──────────────────┐   │
│  │  정산 계좌              │   │
│  │  국민은행 ***-****-****  │   │
│  │                         │   │
│  │  다음 정산 예정          │   │
│  │  ₩125,000 (12/31)      │   │
│  │                         │   │
│  │  [정산 관리]             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 메뉴 ──────────────────┐   │
│  │  공지사항          [>]   │   │
│  │  이용가이드        [>]   │   │
│  │  문의하기          [>]   │   │
│  │  설정             [>]   │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Business Profile Edit

```
┌─────────────────────────────────┐
│  [←]  비즈니스 프로필 편집  [저장]│
│                                 │
│        ┌─────────┐              │
│        │         │              │
│        │  [IMG]  │              │ ← Logo upload
│        └─────────┘              │
│       [로고 변경]                │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 매장 이름                 │   │
│  │ [성수동 OO카페          ] │   │
│  └─────────────────────────┘   │
│                                 │
│  카테고리                        │
│  ┌────┐ ┌────┐ ┌────┐          │
│  │☕카페│ │🍰디저트│ │🍜맛집 │   │
│  └────┘ └────┘ └────┘          │
│  (선택됨)                       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 매장 소개                 │   │
│  │ [따뜻한 분위기의 로컬 카페│   │ ← Textarea
│  │  수제 디저트와 시그니처   │   │   max: 200자
│  │  커피를 제공합니다        │   │
│  │                         │   │
│  └─────────────────────────┘   │
│  200자 중 58자 사용              │
│                                 │
│  매장 사진 (최대 5장)            │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │[사진1]│ │[사진2]│ │[사진3]│   │
│  └──────┘ └──────┘ └──────┘   │
│  ┌──────┐ ┌──────┐            │
│  │ [+]  │ │ [+]  │            │
│  └──────┘ └──────┘            │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 주소                      │   │
│  │ 서울시 성수동 123-45      │   │
│  │ [지도에서 위치 수정]      │   │
│  └─────────────────────────┘   │
│                                 │
│  운영 시간                       │
│  ┌─────────┐  ┌─────────┐     │
│  │ 10:00   │ ~ │ 22:00   │     │
│  └─────────┘  └─────────┘     │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 전화번호                  │   │
│  │ [02-1234-5678         ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 웹사이트 (선택)           │   │
│  │ [https://example.com  ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Instagram (선택)          │   │
│  │ [@cafe_seongsu        ] │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Settings (Merchant)

```
┌─────────────────────────────────┐
│  [←]  설정                      │
│                                 │
│  ┌─ 알림 ──────────────────┐   │
│  │                         │   │
│  │  새 응답 알림      [●]   │   │
│  │  미션 진행 알림    [●]   │   │
│  │  성과 리포트      [●]   │   │
│  │  마케팅 알림      [○]   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 계정 ──────────────────┐   │
│  │                         │   │
│  │  비밀번호 변경     [>]   │   │
│  │  이메일 변경      [>]   │   │
│  │  전화번호 변경    [>]   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 결제 & 정산 ────────────┐  │
│  │                         │   │
│  │  정산 계좌 관리    [>]   │   │
│  │  결제 수단 관리   [>]   │   │
│  │  정산 내역       [>]   │   │
│  │  세금 정보       [>]   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 비즈니스 ───────────────┐  │
│  │                         │   │
│  │  사업자 정보 수정  [>]   │   │
│  │  매장 정보 수정   [>]   │   │
│  │  운영 시간 변경   [>]   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 앱 설정 ────────────────┐  │
│  │                         │   │
│  │  언어 설정       한국어  │   │
│  │  화면 모드       다크 모드│   │
│  │  캐시 삭제       [>]   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─ 기타 ───────────────────┐  │
│  │                         │   │
│  │  이용약관        [>]   │   │
│  │  개인정보처리방침  [>]   │   │
│  │  사업자 약관      [>]   │   │
│  │  버전 정보       1.0.0  │   │
│  └─────────────────────────┘   │
│                                 │
│  [로그아웃]                     │
│  [계정 삭제]                     │
│                                 │
└─────────────────────────────────┘
```

---

## 2️⃣1️⃣ **Shared Screens** (Both Apps)

### Notification Center

```
┌─────────────────────────────────┐
│  [←]  알림                 [⚙️] │
│                                 │
│  오늘                            │ ← Date divider
│  ┌─────────────────────────┐   │
│  │ 🎉 새 오퍼가 도착했어요!  │   │ ← Notification card
│  │                         │   │   Unread: bold
│  │ @merchant님이 오퍼를     │   │
│  │ 보냈습니다               │   │
│  │                         │   │
│  │ 2시간 전                 │   │ ← Timestamp
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ✅ 미션이 승인되었어요    │   │
│  │                         │   │
│  │ 성수동 OO카페 미션이     │   │
│  │ 승인되었습니다           │   │
│  │                         │   │
│  │ 5시간 전                 │   │
│  └─────────────────────────┘   │
│                                 │
│  어제                            │
│  ┌─────────────────────────┐   │
│  │ 💰 정산이 완료되었어요    │   │
│  │                         │   │
│  │ ₩30,000이 입금되었습니다 │   │
│  │                         │   │
│  │ 1일 전                   │   │
│  └─────────────────────────┘   │
│                                 │
│  이번 주                         │
│  ┌─────────────────────────┐   │
│  │ 📊 주간 리포트           │   │
│  │                         │   │
│  │ 이번 주 수익: ₩85,000    │   │
│  │ 완료한 미션: 3건          │   │
│  │                         │   │
│  │ 3일 전                   │   │
│  └─────────────────────────┘   │
│                                 │
│  [모두 읽음으로 표시]            │
│                                 │
└─────────────────────────────────┘
```

### Chat / Messaging

```
┌─────────────────────────────────┐
│  [←]  @username           [⋮]   │ ← Header
│                                 │
│  ┌─ 2025년 12월 25일 ────┐     │ ← Date divider
│  │                         │   │
│  │  ┌─────────────────┐   │   │
│  │  │ 안녕하세요!       │   │   │ ← Received message
│  │  │ 방문 예약하고     │   │   │   Left aligned
│  │  │ 싶습니다          │   │   │   Gray bubble
│  │  └─────────────────┘   │   │
│  │  오전 10:23             │   │
│  │                         │   │
│  │       ┌─────────────────┐  │
│  │       │ 네! 언제 편하세요?│  │ ← Sent message
│  │       └─────────────────┘  │   Right aligned
│  │                  오전 10:25 │   Primary color
│  │                         │   │
│  │  ┌─────────────────┐   │   │
│  │  │ 28일 오후 3시는   │   │   │
│  │  │ 어떠신가요?       │   │   │
│  │  └─────────────────┘   │   │
│  │  오전 10:26             │   │
│  │                         │   │
│  │       ┌─────────────────┐  │
│  │       │ 좋습니다! 예약    │  │
│  │       │ 완료했어요        │  │
│  │       └─────────────────┘  │
│  │                  오전 10:28 │
│  └─────────────────────────┘  │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [메시지 입력...]        📎│  │ ← Input
│  │                          │  │   height: 48px
│  └─────────────────────────┘   │   + attachment
│                                 │
└─────────────────────────────────┘
```

### Search / Filter Global

```
┌─────────────────────────────────┐
│  [←]  검색                      │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔍 [검색어 입력...     ] │   │ ← Search input
│  └─────────────────────────┘   │   Auto-complete
│                                 │
│  최근 검색                       │ ← Section
│  • 성수동 카페                   │ ← Recent items
│  • 홍대 맛집                     │   Tappable
│  • 강남 뷰티                     │
│                                 │
│  인기 검색어                     │
│  [카페] [디저트] [맛집]          │ ← Tags
│  [뷰티] [패션]                  │
│                                 │
│  추천                            │
│  ┌─────────────────────────┐   │
│  │ @username               │   │
│  │ 12.5k · ☕카페          │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## 2️⃣2️⃣ **Loading States & Skeletons**

### Skeleton Screen (Loading)

```
┌─────────────────────────────────┐
│  [=]  검색            [🔍] [🔔] │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ░░░░░░░░░░░░░░░░░░░░░   │   │ ← Shimmer effect
│  │ ░░░░░░░░                │   │   Animated gradient
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ░░░░ ░░░░░░░░░░░        │   │
│  │ ░░░░ ░░░░░░             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ░░░░ ░░░░░░░░░░░        │   │
│  │ ░░░░ ░░░░░░             │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### Empty State (No Data)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│        📭                       │ ← Empty icon
│                                 │   64x64px
│  아직 데이터가 없어요             │ ← text-h2
│                                 │
│  첫 번째 액션을 시작해보세요!     │ ← text-base
│                                 │   text-secondary
│                                 │
│     [시작하기]                   │ ← CTA
│                                 │
│                                 │
└─────────────────────────────────┘
```

### Error State

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│        ⚠️                       │ ← Error icon
│                                 │
│  문제가 발생했어요                │ ← text-h2
│                                 │
│  잠시 후 다시 시도해주세요         │ ← text-base
│                                 │
│  오류 코드: 500                  │ ← text-xs
│                                 │   text-tertiary
│     [다시 시도]                  │ ← CTA
│                                 │
│                                 │
└─────────────────────────────────┘
```

---

## 2️⃣3️⃣ **Interaction Patterns**

### Pull to Refresh

```css
.pull-to-refresh {
  display: flex;
  justify-content: center;
  padding: 16px;
  color: var(--jjik-text-tertiary);
}

.pull-icon {
  width: 24px;
  height: 24px;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Swipe Actions

```
┌─────────────────────────────────┐
│  ← Swipe                        │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [카드 내용]              │   │ ← Swipeable card
│  └─────────────────────────┘   │
│                                 │
│  Swipe left:  [🗑️ 삭제]        │
│  Swipe right: [✅ 완료]         │
│                                 │
└─────────────────────────────────┘
```

### Toast Notifications

```css
.toast {
  position: fixed;
  bottom: calc(64px + env(safe-area-inset-bottom) + 16px);
  left: 20px;
  right: 20px;
  background: var(--jjik-bg-elevated);
  border: 1px solid var(--jjik-border);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow-lg);
  animation: slide-up 0.3s ease-out;
  z-index: var(--z-toast);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.toast-success {
  border-left: 4px solid var(--jjik-success);
}

.toast-error {
  border-left: 4px solid var(--jjik-danger);
}

.toast-info {
  border-left: 4px solid var(--jjik-info);
}
```

---

## 2️⃣4️⃣ **Responsive Design Notes**

### Tablet (768px+)

```css
@media (min-width: 768px) {
  /* Two-column layout */
  .main-content {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 24px;
  }
  
  /* Side navigation instead of bottom tabs */
  .tab-bar {
    display: none;
  }
  
  .sidebar {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 320px;
    background: var(--jjik-bg-secondary);
    border-right: 1px solid var(--jjik-border);
  }
}
```

### Desktop (1024px+)

```css
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Three-column layout for analytics */
  .analytics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  /* Modal dialogs instead of full-screen */
  .modal {
    max-width: 600px;
    margin: 40px auto;
    border-radius: 20px;
  }
}
```

---

**🎉 UX/UI 설계 완료!**

**Total Screens Designed:**
- **Creator App**: 30+ screens
- **Merchant App**: 25+ screens
- **Shared**: 10+ screens
- **Total**: **65+ 상세 화면**

**Next Steps:**
1. Component library 구현
2. Interactive prototype (Framer/Figma)
3. Development handoff documentation

---

**Last Updated**: 2025-10-16  
**Version**: 1.0.0  
**Designer**: Claude (JJIKMEOK 전용 최적화)  
**Status**: ✅ Complete
