---
description: "Check for disallowed CSS files or style tags in the codebase"
usage: "/run tailwind-guard lint-check"
---

# Tailwind Guard - Lint Check

Scans the entire codebase for violations of the "NO Custom CSS" rule.

## What it checks:

1. **Custom CSS files** (除外: `globals.css`, `tokens.css`)
   - `.css` files in `src/` directory
   - `.scss` / `.sass` files
   
2. **Inline style tags**
   - `<style>` tags in TSX/JSX files
   - `<style jsx>` or `<style scoped>`

3. **@apply directives** (Warning only)
   - `@apply` usage in CSS files
   - Recommends converting to inline utilities

## Commands:

### Full Scan
```bash
cd /home/user/webapp && \
echo "🔍 Scanning for custom CSS violations..." && \
echo "" && \
echo "📁 Custom CSS files:" && \
find src/ -type f \( -name "*.css" -o -name "*.scss" -o -name "*.sass" \) ! -name "globals.css" ! -name "tokens.css" 2>/dev/null || echo "  ✅ None found" && \
echo "" && \
echo "🏷️ Inline <style> tags:" && \
grep -rn "<style" src/ --include="*.tsx" --include="*.jsx" 2>/dev/null || echo "  ✅ None found" && \
echo "" && \
echo "⚠️ @apply directives:" && \
grep -rn "@apply" src/ --include="*.css" 2>/dev/null || echo "  ✅ None found"
```

### Quick Check (Git staged only)
```bash
cd /home/user/webapp && \
git diff --cached --name-only --diff-filter=ACM | \
grep -E '\.(css|scss|sass)$' | \
grep -v 'globals.css\|tokens.css' && \
echo "❌ Custom CSS files detected in staged changes" || \
echo "✅ No custom CSS in staged changes"
```

## Expected Output:

```
✅ Tailwind Guard Scan Complete

📊 Results:
- Custom CSS files: 0
- Inline <style> tags: 0  
- @apply directives: 0 (warnings)

✅ All checks passed - 100% Tailwind Plus compliant
```

## Enforcement Level:

- **BLOCK** (exit 1): Custom CSS files, inline <style> tags
- **WARN** (exit 0): @apply directives (deprecated pattern)
- **PASS** (exit 0): No violations

## Related:

- Pre-commit hook: `.claude-plugin/plugins/tailwind-guard/hooks/beforeCommit.json`
- Configuration: `.claude-plugin/plugins/tailwind-guard/plugin.json`
- Documentation: `README-PLUGINS.md`
