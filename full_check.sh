#!/bin/bash
BASE=https://3001-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 SECURITY HEADERS (/splash)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -I "${BASE}/splash" | grep -Ei "content-security-policy|permissions-policy|x-frame-options|x-content-type-options|referrer-policy|x-xss-protection|strict-transport-security"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 META TAGS COUNT (/splash)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE}/splash" > /tmp/splash.html
echo "Total meta tags: $(grep -oE '<meta[^>]*>' /tmp/splash.html | wc -l)"
echo "- Description: $(grep -c 'name="description"' /tmp/splash.html)"
echo "- Keywords: $(grep -c 'name="keywords"' /tmp/splash.html)"
echo "- OG tags: $(grep -c 'property="og:' /tmp/splash.html)"
echo "- Twitter tags: $(grep -c 'name="twitter:' /tmp/splash.html)"
echo "- Canonical: $(grep -c 'rel="canonical"' /tmp/splash.html)"
echo "- Manifest: $(grep -c 'rel="manifest"' /tmp/splash.html)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️ OG IMAGE API (/api/og)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -I "${BASE}/api/og?title=JJIKMEOK&subtitle=Test" | head -n 12

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CANONICAL URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE}/splash" | grep -oE '<link[^>]*rel="canonical"[^>]*>'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 PWA MANIFEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "${BASE}/manifest.json" | jq -r '.start_url, .name, .short_name'
