#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 LOGO IMAGE OPTIMIZATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check actual logo file sizes
echo "📦 File Sizes:"
ls -lh public/logos/variant4-stacked/ | grep -E "\.png$" | awk '{printf "  %-30s %10s\n", $9, $5}'

echo ""
echo "📊 Size Comparison:"
size_64=$(stat -f%z public/logos/variant4-stacked/logo-stacked-64.png 2>/dev/null || stat -c%s public/logos/variant4-stacked/logo-stacked-64.png)
size_96=$(stat -f%z public/logos/variant4-stacked/logo-stacked-96.png 2>/dev/null || stat -c%s public/logos/variant4-stacked/logo-stacked-96.png)
size_128=$(stat -f%z public/logos/variant4-stacked/logo-stacked-128.png 2>/dev/null || stat -c%s public/logos/variant4-stacked/logo-stacked-128.png)
size_192=$(stat -f%z public/logos/variant4-stacked/logo-stacked-192.png 2>/dev/null || stat -c%s public/logos/variant4-stacked/logo-stacked-192.png)

echo "  64px:  ${size_64} bytes ($(echo "scale=1; $size_64/1024" | bc)KB) - sm/md sizes"
echo "  96px:  ${size_96} bytes ($(echo "scale=1; $size_96/1024" | bc)KB) - lg size"
echo "  128px: ${size_128} bytes ($(echo "scale=1; $size_128/1024" | bc)KB) - xl size"
echo "  192px: ${size_192} bytes ($(echo "scale=1; $size_192/1024" | bc)KB) - previous version"

reduction=$(echo "scale=1; 100 - ($size_128 * 100 / $size_192)" | bc)
echo ""
echo "💡 Optimization: Using 128px instead of 192px = ${reduction}% smaller"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ PERFORMANCE METRICS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Current implementation (Logo2025.tsx):"
cat components/Logo2025.tsx | grep -A 2 "const sizeMap"
