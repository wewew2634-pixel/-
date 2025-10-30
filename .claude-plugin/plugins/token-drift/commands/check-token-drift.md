---
description: "Check for design token drift between Figma and Tailwind config"
usage: "/run check-token-drift"
---

# Token Drift Checker

Detects mismatches between Figma Tokens JSON and Tailwind configuration.

## What it checks:

### 1. Color Tokens
- Figma color definitions → Tailwind theme colors
- Primary, secondary, accent, surface colors
- Opacity variants (e.g., `primary/50`, `primary/10`)

### 2. Spacing Tokens
- Figma spacing scale → Tailwind spacing config
- Padding, margin, gap values
- Custom spacing tokens

### 3. Typography Tokens
- Font families → Tailwind fontFamily
- Font sizes → Tailwind fontSize
- Font weights → Tailwind fontWeight
- Line heights, letter spacing

### 4. Shadow Tokens
- Box shadows → Tailwind boxShadow
- Drop shadows, inner shadows
- Multi-layer shadow definitions

### 5. Border Radius Tokens
- Radius values → Tailwind borderRadius
- Component-specific radius (button, card, input)

### 6. Breakpoints
- Responsive breakpoints → Tailwind screens
- Mobile, tablet, desktop definitions

## Implementation:

```bash
node /home/user/webapp/scripts/check-token-drift.js
```

The script:
1. Loads `design-tokens/figma-tokens.json`
2. Parses `tailwind.config.ts` theme configuration
3. Compares token values across all categories
4. Generates drift report with mismatches
5. Exits with code 1 if drift detected, 0 if synchronized

## Output Format:

### Console Output
```
🎨 Design Token Drift Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Sources:
  - Figma: design-tokens/figma-tokens.json
  - Tailwind: tailwind.config.ts
  - CSS: src/styles/tokens.css

🔍 Checking tokens...

❌ DRIFT DETECTED:

Colors:
  ⚠️ primary: Figma=#FF6B35 ≠ Tailwind=#FF5722
  ⚠️ surface-hover: Missing in Tailwind config

Spacing:
  ✅ All spacing tokens synchronized

Typography:
  ⚠️ heading-1: Figma=48px/1.2 ≠ Tailwind=40px/1.25

Shadows:
  ✅ All shadow tokens synchronized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 3 drift issues found - Review required
```

### JSON Report (`.token-drift-report.json`)
```json
{
  "timestamp": "2024-10-17T10:30:00Z",
  "status": "drift_detected",
  "driftCount": 3,
  "categories": {
    "colors": {
      "checked": 24,
      "drifted": 2,
      "issues": [
        {
          "token": "primary",
          "figmaValue": "#FF6B35",
          "tailwindValue": "#FF5722",
          "severity": "high"
        },
        {
          "token": "surface-hover",
          "figmaValue": "rgba(255,255,255,0.1)",
          "tailwindValue": null,
          "severity": "medium",
          "note": "Missing in Tailwind config"
        }
      ]
    },
    "spacing": {
      "checked": 12,
      "drifted": 0,
      "issues": []
    },
    "typography": {
      "checked": 8,
      "drifted": 1,
      "issues": [
        {
          "token": "heading-1",
          "figmaValue": "48px/1.2",
          "tailwindValue": "40px/1.25",
          "severity": "low"
        }
      ]
    }
  },
  "recommendations": [
    "Update tailwind.config.ts theme.colors.primary to #FF6B35",
    "Add surface-hover token to Tailwind config",
    "Synchronize heading-1 font size and line-height"
  ]
}
```

## Usage in Claude Code:

```bash
# Manual check
/run check-token-drift

# Auto-run after push (configured in hooks)
git push origin genspark_ai_developer
# → Hook automatically runs token drift check
```

## Related:

- Plugin config: `.claude-plugin/plugins/token-drift/plugin.json`
- Post-push hook: `.claude-plugin/plugins/token-drift/hooks/postPush.json`
- Implementation: `scripts/check-token-drift.js`
