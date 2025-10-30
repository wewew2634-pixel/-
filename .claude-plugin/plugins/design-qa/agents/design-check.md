---
description: "Run comprehensive design quality & accessibility audits"
usage: "/agent design-check --pages /splash,/onboarding --report"
---

# Design QA Agent - Comprehensive Audit

Automated design quality and accessibility audits for Apple Liquid Glass design compliance.

## Agent Capabilities:

### 1. Lighthouse Audit
- **Performance**: Load time, FCP, LCP, CLS
- **Accessibility**: ARIA, semantic HTML, color contrast
- **Best Practices**: HTTPS, console errors, image optimization
- **SEO**: Meta tags, OpenGraph, structured data

### 2. Axe Accessibility Scan
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader compatibility
- Focus management

### 3. Liquid Glass Design Compliance
- `backdrop-blur-xl` / `backdrop-blur-2xl` usage
- `saturate-150` color saturation
- `bg-white/[0.05]` + `border-white/10` glass effect
- Multi-layer shadows: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),...]`
- Hover interactions: `hover:brightness-105 hover:shadow-xl`

### 4. Meta Tags Validation
- `<title>` presence and length
- `<meta name="description">` (150-160 chars)
- OpenGraph tags (`og:title`, `og:description`, `og:image`)
- Twitter Card tags
- `manifest.json` link

## Parameters:

```json
{
  "pages": ["string"],          // Array of routes to check
  "threshold": {                // Minimum scores (0-100)
    "performance": 90,
    "accessibility": 95,
    "bestPractices": 90,
    "seo": 90
  },
  "report": true,               // Generate HTML report
  "screenshots": true,          // Capture screenshots
  "compareBaseline": false      // Compare with baseline snapshots
}
```

## Example Usage:

```bash
# Run design QA on all target pages
/agent design-check --pages /splash,/onboarding,/auth/login

# Run with custom thresholds
/agent design-check --pages /splash --threshold.accessibility=100

# Generate full report with screenshots
/agent design-check --pages /splash --report --screenshots

# Compare with baseline (visual regression)
/agent design-check --pages /splash --compareBaseline
```

## Output:

### Console Summary
```
🎨 Design QA Report - /splash
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Lighthouse Scores:
  ✅ Performance:      94/100 (threshold: 90)
  ✅ Accessibility:    98/100 (threshold: 95)
  ✅ Best Practices:   92/100 (threshold: 90)
  ✅ SEO:              95/100 (threshold: 90)

♿ Axe Accessibility:
  ✅ Critical issues:  0
  ✅ Serious issues:   0
  ⚠️  Moderate issues: 1
  💡 Minor issues:     2

🎭 Liquid Glass Compliance:
  ✅ backdrop-blur-xl: Found (3 components)
  ✅ saturate-150:     Found (2 components)
  ✅ Glass effect:     bg-white/[0.05] + border-white/10
  ✅ Shadow layers:    Inset + drop shadow detected
  ✅ Hover effects:    brightness-105, shadow-xl, -translate-y-0.5

🏷️ Meta Tags:
  ✅ Title:           "ZZMUK - 찍먹" (14 chars)
  ✅ Description:     Present (158 chars)
  ✅ OpenGraph:       5/5 tags present
  ✅ Twitter Card:    4/4 tags present
  ✅ Manifest:        Linked

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ALL CHECKS PASSED - Design QA approved
```

### HTML Report (optional)
Generates `/design-qa-reports/splash-2024-10-17.html` with:
- Interactive Lighthouse report
- Axe scan results with DOM highlights
- Screenshot comparisons (if baseline exists)
- Recommendations and action items

## Implementation Script:

See: `/home/user/webapp/scripts/design-qa.js`

## Integration:

- **Manual**: `/agent design-check --pages /splash`
- **PR Hook**: Runs automatically on Pull Request creation
- **CI/CD**: Integrates with GitHub Actions `.github/workflows/design-qa.yml`

## Related:

- Plugin config: `.claude-plugin/plugins/design-qa/plugin.json`
- Baseline snapshots: `/.design-qa/baselines/`
- Documentation: `README-PLUGINS.md`
