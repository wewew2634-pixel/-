#!/bin/bash
BASE=https://3001-i0a44wg364p45iruk1vlb-b237eb32.sandbox.novita.ai
PAGES=( "/" "/splash" "/onboarding" "/auth/login" )

for p in "${PAGES[@]}"; do
  echo "=== 페이지: ${BASE}${p} ==="
  echo "-- 응답 헤더 --"
  curl -s -D - "${BASE}${p}" -o /tmp/page.html 2>&1 | head -n 20 | grep -Ei "HTTP|content-security-policy|x-content-type-options|permissions-policy|referrer-policy|strict-transport-security|x-frame-options"
  echo "-- meta & og tags (head) --"
  sed -n '1,200p' /tmp/page.html | grep -Ei "<meta|og:|twitter:|rel=\"manifest\"|link" | head -n 30
  echo ""
done

# OG API 점검
echo "=== OG API 응답 ==="
curl -s -D - "${BASE}/api/og?title=JJIKMEOK&subtitle=Test" -o /dev/null 2>&1 | head -n 20
