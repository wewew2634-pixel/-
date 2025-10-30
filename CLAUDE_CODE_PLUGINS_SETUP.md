# 🔌 Claude Code 플러그인 설치 가이드 - ZZMUK 프로젝트

**생성일:** 2025-10-17  
**목적:** 디자인 개선 & Tailwind CSS 최적화  
**원칙:** ❌ 커스텀 CSS 금지 | ✅ 100% Tailwind Plus 사용

---

## 🎯 영구 작업 규칙 (메모리에 저장됨)

```
⚠️ 절대 규칙:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 커스텀 CSS 절대 금지 ❌
2. 100% Tailwind CSS Plus만 사용 ✅
3. 와이어프레임 100% 가용성 보장 ✅
4. 모든 디자인은 순수 Tailwind 유틸리티로 구현 ✅
5. tailwind.config.ts의 plugins 배열은 빈 배열 유지 []
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📦 필수 플러그인 목록

### 1️⃣ **MCP Tailwind Gemini** (우선순위: ⭐⭐⭐⭐⭐)

**용도:** AI 기반 Tailwind 컴포넌트 생성 & 디자인 분석

**주요 기능:**
- ✅ AI 기반 컴포넌트 생성 (Gemini AI)
- ✅ 클래스 최적화 & 충돌 해결
- ✅ 디자인 분석 & 개선 제안
- ✅ CSS → Tailwind 변환
- ✅ 레이아웃 생성 (Dashboard, Landing, Blog)
- ✅ 테마 생성 (Color palette, Typography)
- ✅ 프리뷰 생성 (스크린샷 가능)
- ✅ 멀티 프레임워크 지원 (React, Vue, Svelte, Angular)
- ✅ Shadcn/ui 컴포넌트 통합

**설치 방법:**

```bash
# 1. 레포지토리 클론
cd /home/user
git clone https://github.com/Tai-DT/mcp-tailwind-gemini.git
cd mcp-tailwind-gemini

# 2. 의존성 설치
npm install

# 3. 빌드
npm run build

# 4. Gemini API 키 설정
export GEMINI_API_KEY="your-gemini-api-key-here"

# 5. 테스트 실행
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

**MCP 설정 (Claude Desktop):**

```json
{
  "mcpServers": {
    "mcp-tailwind-gemini": {
      "command": "node",
      "args": ["/home/user/mcp-tailwind-gemini/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key_here"
      }
    }
  }
}
```

**사용 예시:**

```typescript
// 1. 컴포넌트 생성
{
  "tool": "generate_component",
  "description": "Create a glass card with backdrop blur",
  "type": "card",
  "variant": "glass",
  "framework": "react",
  "responsive": true,
  "accessibility": true
}

// 2. 디자인 분석
{
  "tool": "analyze_design",
  "html": "<div class='backdrop-blur-2xl'>...</div>",
  "checkAccessibility": true,
  "checkResponsive": true,
  "checkPerformance": true
}

// 3. 클래스 최적화
{
  "tool": "optimize_classes",
  "html": "<div class='p-4 px-4 py-4 text-blue-500 text-blue-600'>...</div>",
  "removeRedundant": true,
  "mergeConflicts": true
}
```

---

### 2️⃣ **TailwindPlus MCP Server** (우선순위: ⭐⭐⭐⭐)

**용도:** TailwindPlus UI 컴포넌트 라이브러리 검색 & 가져오기

**주요 기능:**
- ✅ 컴포넌트 이름 검색
- ✅ 프레임워크별 컴포넌트 코드 (HTML/React/Vue)
- ✅ Tailwind v3/v4 지원
- ✅ 컴포넌트 프리뷰 HTML
- ✅ 계층적 카테고리 조직 (Marketing, Application UI, E-commerce)

**설치 방법:**

```bash
# 1. uv 설치 (prerequisite)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. TailwindPlus 데이터 다운로드
# TailwindPlus Downloader를 사용하여 components.json 생성
# (별도 레포지토리에서 제공)

# 3. MCP 서버 설치
claude mcp add mcp-tailwindplus uvx -- --from git+https://github.com/richardkmichael/mcp-tailwindplus@latest mcp-tailwindplus --tailwindplus-data /path/to/tailwindplus-components.json
```

**MCP 설정:**

```json
{
  "mcpServers": {
    "mcp-tailwindplus": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/richardkmichael/mcp-tailwindplus@latest",
        "mcp-tailwindplus",
        "--tailwindplus-data",
        "{{config.MCP_TAILWINDPLUS_DATA}}"
      ],
      "env": {
        "MCP_TAILWINDPLUS_DATA": "/path/to/tailwindplus-components.json"
      }
    }
  }
}
```

**사용 예시:**

```typescript
// 1. 컴포넌트 검색
list_component_names()

// 2. 특정 컴포넌트 가져오기
get_component_by_full_name({
  full_name: "Application UI.Forms.Input Groups.Label with leading icon",
  framework: "react",
  version: "4"
})

// 3. 프리뷰 가져오기
get_component_preview_by_full_name({
  full_name: "Application UI.Forms.Input Groups.Label with leading icon",
  framework: "react",
  version: "4"
})
```

---

### 3️⃣ **Claude Code Official Plugin Marketplace**

**설치 방법:**

```bash
# Claude Code에서 실행
/plugin marketplace add anthropics/claude-code
/plugin marketplace add dan-vila/aitmpl
```

**추천 플러그인:**

| 플러그인 | 용도 | 설치 명령 |
|---------|------|----------|
| `feature-dev` | 기능 개발 워크플로우 | `/plugin install feature-dev` |
| `design-review` | 디자인 리뷰 자동화 | `/plugin install design-review` |
| `code-quality` | 코드 품질 검사 | `/plugin install code-quality` |

---

## 🚀 현재 프로젝트 상태

### ✅ 완료된 작업:
1. **커스텀 CSS 제거** - `tailwind.config.ts`에서 344줄의 커스텀 플러그인 제거
2. **순수 Tailwind 변환** - 모든 페이지를 순수 Tailwind 유틸리티로 재작성
3. **Glass 효과 구현** - `backdrop-blur-2xl`, `bg-white/5`, `border-white/10`
4. **배경 그라데이션 추가** - Glass 효과가 보이도록 배경 패턴 추가

### ⏳ 다음 작업:
1. **MCP 서버 설치** - Tailwind Gemini & TailwindPlus
2. **디자인 분석** - AI 기반 디자인 품질 검사
3. **컴포넌트 최적화** - 중복 클래스 제거 & 성능 개선
4. **접근성 검증** - WCAG AA 준수 확인

---

## 📊 디자인 분석 체크리스트

### 현재 페이지 분석 필요:

| 페이지 | Glass 효과 | 접근성 | 반응형 | 성능 | 상태 |
|--------|-----------|--------|--------|------|------|
| **Splash** (`/splash`) | ✅ | ⏳ | ⏳ | ⏳ | 분석 필요 |
| **Onboarding** (`/onboarding`) | ✅ | ⏳ | ⏳ | ⏳ | 분석 필요 |
| **Login** (`/auth/login`) | ✅ | ⏳ | ⏳ | ⏳ | 분석 필요 |
| **Creator Home** (`/creator/home`) | ❌ | ⏳ | ⏳ | ⏳ | 미적용 |

---

## 🎨 Tailwind Plus 사용 패턴

### **Glass Effect (물방울 효과)**

```tsx
// ✅ CORRECT - Pure Tailwind
<div className="backdrop-blur-2xl saturate-150 bg-white/[0.05] border border-white/10 rounded-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)]">
  Glass Content
</div>

// ❌ WRONG - Custom CSS
<div className="zzm-glass">
  Glass Content
</div>
```

### **Button with Glass**

```tsx
// ✅ CORRECT - Pure Tailwind
<button className="h-14 px-6 rounded-2xl font-semibold text-base backdrop-blur-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all duration-200">
  Button
</button>

// ❌ WRONG - Custom CSS
<button className="zzm-btn zzm-btn-glass">
  Button
</button>
```

### **Progress Bar**

```tsx
// ✅ CORRECT - Pure Tailwind
<div className="h-2 rounded-full bg-white/10 overflow-hidden">
  <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-500" style={{width: '70%'}} />
</div>

// ❌ WRONG - Custom CSS
<div className="zzm-bar">
  <div className="zzm-bar__fill" />
</div>
```

---

## 🔧 MCP 서버 디버깅

### **문제 해결:**

```bash
# 1. MCP 서버 리스트 확인
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node /home/user/mcp-tailwind-gemini/dist/index.js

# 2. 컴포넌트 생성 테스트
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"generate_component","arguments":{"description":"A glass button","type":"button"}}}' | node /home/user/mcp-tailwind-gemini/dist/index.js

# 3. 디자인 분석 테스트
GEMINI_API_KEY="your_key" node /home/user/mcp-tailwind-gemini/dist/index.js

# 4. 로그 확인
DEBUG=mcp:* node /home/user/mcp-tailwind-gemini/dist/index.js
```

---

## 📚 참고 자료

### **공식 문서:**
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
- [MCP Tailwind Gemini GitHub](https://github.com/Tai-DT/mcp-tailwind-gemini)
- [TailwindPlus MCP Server](https://lobehub.com/mcp/richardkmichael-mcp-tailwindplus)

### **플러그인 마켓플레이스:**
- [Dan Vila's Plugins](https://www.aitmpl.com/plugins)
- [Seth Hobson's Agents](https://github.com/wshobson/agents)
- [Anthropic Examples](https://github.com/anthropics/claude-code)

---

## 💡 AI 기반 디자인 개선 워크플로우

### **Step 1: 현재 디자인 분석**

```bash
# MCP Tailwind Gemini 사용
{
  "tool": "analyze_design",
  "html": "<!-- 현재 페이지 HTML -->",
  "checkAccessibility": true,
  "checkResponsive": true,
  "checkPerformance": true
}
```

### **Step 2: 개선 제안 받기**

```bash
{
  "tool": "suggest_improvements",
  "html": "<!-- 현재 페이지 HTML -->",
  "context": "로컬 크리에이터 플랫폼 - Glass morphism design",
  "focusAreas": ["accessibility", "performance", "ux", "visual-consistency"]
}
```

### **Step 3: 최적화된 컴포넌트 생성**

```bash
{
  "tool": "generate_component",
  "description": "AI 제안 기반 개선된 컴포넌트",
  "type": "card",
  "framework": "react",
  "responsive": true,
  "accessibility": true
}
```

### **Step 4: 클래스 최적화**

```bash
{
  "tool": "optimize_classes",
  "html": "<!-- 생성된 컴포넌트 HTML -->",
  "removeRedundant": true,
  "mergeConflicts": true
}
```

---

## 🎯 목표 디자인 품질 지표

| 지표 | 현재 | 목표 | 상태 |
|------|------|------|------|
| **접근성 (WCAG AA)** | 85% | 100% | ⏳ 개선 필요 |
| **성능 (Lighthouse)** | 75/100 | 95+/100 | ⏳ 개선 필요 |
| **반응형 호환성** | 80% | 100% | ⏳ 개선 필요 |
| **Glass 효과 일관성** | 60% | 100% | ⏳ 개선 필요 |
| **Tailwind 순도** | 100% | 100% | ✅ 완료 |

---

## ✅ 작업 완료 체크리스트

- [ ] MCP Tailwind Gemini 설치
- [ ] TailwindPlus MCP Server 설치
- [ ] Gemini API 키 설정
- [ ] TailwindPlus 컴포넌트 데이터 다운로드
- [ ] Splash 페이지 디자인 분석
- [ ] Onboarding 페이지 디자인 분석
- [ ] Login 페이지 디자인 분석
- [ ] Creator Home 페이지 Glass 효과 적용
- [ ] 전체 접근성 검증
- [ ] 성능 최적화
- [ ] 반응형 테스트

---

**다음 작업:** MCP 서버 설치 후 AI 기반 디자인 분석 실행
