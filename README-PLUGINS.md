# 🛠️ Claude Code Plugin System

**ZZMUK (찍먹)** 프로젝트의 Claude Code 플러그인 마켓플레이스 문서입니다.

---

## 📦 설치된 플러그인

### 1. 🛡️ Tailwind Guard
**목적**: 커스텀 CSS 차단 및 Tailwind Plus 전용 사용 강제

**기능**:
- ✅ `.css`, `.scss`, `.sass` 파일 생성 차단 (globals.css, tokens.css 제외)
- ✅ `<style>` 태그 사용 차단
- ⚠️ `@apply` 지시자 경고 (향후 제거 권장)

**자동 실행**:
- Pre-commit hook (커밋 전 자동 검사)
- Pull Request 생성 시

**수동 실행**:
```bash
# 전체 스캔
/run tailwind-guard lint-check

# 또는 별칭 사용
/lint-css
```

**설정 파일**:
- `.claude-plugin/plugins/tailwind-guard/plugin.json`
- `.claude-plugin/plugins/tailwind-guard/hooks/beforeCommit.json`

---

### 2. 🎨 Design QA
**목적**: 디자인 품질 및 접근성 자동 검사

**기능**:
- 📊 Lighthouse 감사 (성능, 접근성, 모범 사례, SEO)
- ♿ Axe 접근성 스캔 (WCAG 2.1 AA)
- 🎭 Apple Liquid Glass 디자인 준수 확인
  - `backdrop-blur-xl` / `saturate-150` 사용 확인
  - 유리 효과: `bg-white/[0.05]` + `border-white/10`
  - 멀티 레이어 섀도우 확인
  - 호버 효과 검증
- 🏷️ 메타 태그 검증 (title, description, OpenGraph, Twitter Card)

**자동 실행**:
- Pull Request 생성 시

**수동 실행**:
```bash
# 특정 페이지 검사
/agent design-check --pages /splash,/onboarding

# 전체 리포트 생성
/agent design-check --pages /splash --report --screenshots

# 별칭 사용
/check-design
```

**설정 파일**:
- `.claude-plugin/plugins/design-qa/plugin.json`
- `.claude-plugin/plugins/design-qa/agents/design-check.md`
- `scripts/design-qa.js`

---

### 3. 🎯 Token Drift
**목적**: Figma 토큰과 Tailwind 설정 동기화 확인

**기능**:
- 🎨 색상 토큰 불일치 감지
- 📏 간격(spacing) 토큰 검증
- 🔤 타이포그래피 토큰 확인
- 🌑 섀도우 토큰 비교
- 🔲 Border radius 토큰 검증
- 📱 브레이크포인트 확인

**자동 실행**:
- Post-push hook (푸시 후 자동 검사)
- Pull Request 생성 시

**수동 실행**:
```bash
# 토큰 드리프트 검사
/run check-token-drift

# 별칭 사용
/check-tokens
```

**리포트 출력**:
- `.token-drift-report.json` (JSON 형식 상세 리포트)

**설정 파일**:
- `.claude-plugin/plugins/token-drift/plugin.json`
- `.claude-plugin/plugins/token-drift/hooks/postPush.json`
- `scripts/check-token-drift.js`

---

## 🚀 빠른 시작

### 1. 마켓플레이스 추가
```bash
# Claude Code에서 프로젝트 디렉터리 열기
cd /home/user/webapp
claude

# 로컬 마켓플레이스 추가
/plugin marketplace add ./.claude-plugin
```

### 2. 플러그인 설치
```bash
# 개별 설치
/plugin install tailwind-guard@zzmuk
/plugin install design-qa@zzmuk
/plugin install token-drift@zzmuk

# 또는 자동 활성화 (이미 .claude/settings.json에 설정됨)
```

### 3. 플러그인 상태 확인
```bash
# 설치된 플러그인 목록
/plugin list

# 특정 플러그인 정보
/plugin info tailwind-guard
```

---

## 📋 커맨드 별칭

빠른 실행을 위해 다음 별칭을 사용할 수 있습니다:

| 별칭 | 실제 명령 | 설명 |
|------|-----------|------|
| `/lint-css` | `/run tailwind-guard lint-check` | CSS 규칙 검사 |
| `/check-design` | `/agent design-check` | 디자인 QA 실행 |
| `/check-tokens` | `/run check-token-drift` | 토큰 드리프트 검사 |

---

## 🔄 워크플로우 통합

### Git 커밋 전
```bash
# 1. 코드 수정
# 2. git add .
# 3. git commit -m "..." 
#    → tailwind-guard가 자동 실행됨
#    → 커스텀 CSS 발견 시 커밋 차단
```

### Git 푸시 후
```bash
# 1. git push origin genspark_ai_developer
#    → token-drift가 자동 실행됨
#    → 토큰 불일치 발견 시 경고
```

### Pull Request 생성 시
```bash
# PR 생성 시 자동 실행:
# 1. tailwind-guard: CSS 규칙 검사
# 2. design-qa: 디자인 품질 검사
# 3. token-drift: 토큰 동기화 검사
# → 결과가 PR 코멘트로 자동 추가됨
```

---

## ⚠️ 절대 규칙 (Absolute Rules)

### 🚫 커스텀 CSS 절대 금지
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ABSOLUTE RULE: 커스텀 CSS 절대 금지
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 허용: Tailwind Plus 유틸리티 클래스만
❌ 금지: .css, .scss, .sass 파일 (globals.css, tokens.css 제외)
❌ 금지: <style> 태그
⚠️ 경고: @apply 지시자 (향후 제거 권장)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**예시**:
```tsx
// ✅ 올바른 방법 (Pure Tailwind)
<button className="inline-flex items-center justify-center gap-2 h-14 px-4 rounded-2xl font-semibold text-[15px] transition-all duration-200 ease-out bg-primary text-primary-foreground shadow-lg hover:brightness-105">
  Click me
</button>

// ❌ 잘못된 방법 (Custom CSS)
<style>
  .custom-button {
    display: inline-flex;
    align-items: center;
    /* ... */
  }
</style>
<button className="custom-button">Click me</button>

// ❌ 잘못된 방법 (@apply)
// styles.css
.custom-button {
  @apply inline-flex items-center justify-center;
}
```

---

## 🎯 Design QA 체크리스트

### Lighthouse 최소 기준
- **Performance**: 90/100
- **Accessibility**: 95/100
- **Best Practices**: 90/100
- **SEO**: 90/100

### Liquid Glass Design 필수 요소
- ✅ `backdrop-blur-xl` 또는 `backdrop-blur-2xl`
- ✅ `saturate-150` (색상 채도)
- ✅ `bg-white/[0.05]` + `border-white/10` (유리 효과)
- ✅ 멀티 레이어 섀도우: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_10px_30px_rgba(0,0,0,0.3)]`
- ✅ 호버 효과: `hover:brightness-105 hover:shadow-xl hover:-translate-y-0.5`

### 접근성 (WCAG 2.1 AA)
- ✅ 색상 대비 4.5:1 이상
- ✅ ARIA 속성 적절히 사용
- ✅ Semantic HTML 사용
- ✅ 키보드 네비게이션 지원
- ✅ `focus-visible:ring-2` 포커스 표시

---

## 🔧 문제 해결

### "Custom CSS detected" 오류
**원인**: 커밋에 `.css`, `.scss`, `.sass` 파일이 포함됨

**해결**:
1. 커스텀 CSS 파일 제거
2. 스타일을 Tailwind 유틸리티 클래스로 변환
3. 변경사항 재커밋

### "Token drift detected" 경고
**원인**: Figma 토큰과 Tailwind 설정 불일치

**해결**:
1. `.token-drift-report.json` 리포트 확인
2. 불일치 항목 확인
3. `tailwind.config.ts` 또는 Figma 토큰 업데이트
4. 동기화 후 재푸시

### "Design QA failed" 경고
**원인**: Lighthouse 점수 또는 Liquid Glass 준수 미달

**해결**:
1. Design QA 리포트 확인
2. 실패한 항목 개선
3. 재검사: `/check-design`

---

## 📂 디렉터리 구조

```
.
├── .claude/
│   └── settings.json                    # Claude 설정 (플러그인 활성화)
├── .claude-plugin/
│   ├── marketplace.json                 # 마켓플레이스 정의
│   └── plugins/
│       ├── tailwind-guard/              # Tailwind 가드 플러그인
│       │   ├── plugin.json
│       │   ├── hooks/
│       │   │   └── beforeCommit.json
│       │   └── commands/
│       │       └── lint-check.md
│       ├── design-qa/                   # Design QA 플러그인
│       │   ├── plugin.json
│       │   ├── agents/
│       │   │   └── design-check.md
│       │   └── commands/
│       └── token-drift/                 # Token Drift 플러그인
│           ├── plugin.json
│           ├── hooks/
│           │   └── postPush.json
│           └── commands/
│               └── check-token-drift.md
├── scripts/
│   ├── check-token-drift.js            # Token drift 검사 스크립트
│   └── design-qa.js                    # Design QA 스크립트
└── README-PLUGINS.md                    # 이 문서
```

---

## 📊 리포트 출력

### Token Drift Report
**위치**: `./.token-drift-report.json`

**형식**: JSON
```json
{
  "timestamp": "2024-10-17T10:30:00Z",
  "status": "drift_detected",
  "driftCount": 3,
  "categories": {
    "colors": { "checked": 24, "drifted": 2, "issues": [...] },
    "spacing": { "checked": 12, "drifted": 0, "issues": [] }
  }
}
```

### Design QA Report
**위치**: `./design-qa-reports/` (선택적)

**형식**: HTML + 콘솔 출력

---

## 🚀 고급 사용법

### 플러그인 우선순위
플러그인은 다음 우선순위로 실행됩니다:
1. **tailwind-guard** (priority: 100) - 가장 먼저 실행
2. **design-qa** (priority: 80)
3. **token-drift** (priority: 70)

### 플러그인 비활성화
```bash
# 특정 플러그인 비활성화
/plugin disable token-drift

# 재활성화
/plugin enable token-drift
```

### 플러그인 업데이트
```bash
# 특정 플러그인 업데이트
/plugin update tailwind-guard

# 모든 플러그인 업데이트
/plugin update --all
```

---

## 📚 관련 문서

- **Claude Code 공식 문서**: https://claude.ai/docs/plugins
- **Tailwind CSS 공식 문서**: https://tailwindcss.com/docs
- **WCAG 2.1 가이드라인**: https://www.w3.org/WAI/WCAG21/quickref/
- **Lighthouse 문서**: https://developers.google.com/web/tools/lighthouse
- **Axe Accessibility**: https://www.deque.com/axe/

---

## 💡 팁 & 모범 사례

### 1. 커밋 전 항상 검사
```bash
# 커밋 전 수동 검사
/lint-css
git add .
git commit -m "feat: Add new component"
```

### 2. PR 생성 전 로컬 테스트
```bash
# 로컬에서 모든 검사 실행
/lint-css
/check-design
/check-tokens

# 모든 검사 통과 후 PR 생성
git push origin genspark_ai_developer
# → GitHub에서 PR 생성
```

### 3. 디자인 변경 시 Liquid Glass 확인
```bash
# 디자인 변경 후 항상 검증
/check-design --pages /splash,/onboarding
```

### 4. Figma 토큰 업데이트 후 동기화 확인
```bash
# Figma 토큰 파일 업데이트 후
/check-tokens
# → 드리프트 발견 시 tailwind.config.ts 업데이트
```

---

## 🤝 기여 가이드

### 새 플러그인 추가
1. `.claude-plugin/plugins/` 에 새 디렉터리 생성
2. `plugin.json` 작성
3. `hooks/`, `commands/`, `agents/` 구현
4. `marketplace.json` 에 플러그인 등록
5. 테스트 및 문서화

### 기존 플러그인 개선
1. 플러그인 디렉터리에서 수정
2. 버전 업데이트 (`plugin.json`)
3. 테스트
4. 문서 업데이트 (이 파일)

---

## 📞 지원

문제가 발생하면:
1. 콘솔 출력 확인
2. 리포트 파일 확인 (`.token-drift-report.json` 등)
3. `.claude/settings.json` 설정 확인
4. 플러그인 재설치: `/plugin install [plugin-name]@zzmuk`

---

**ZZMUK Team** | 2024-10-17 | Version 1.0.0
