# 🎨 JJIKMEOK Logo Assets

**Version**: 1.0.0  
**Generated**: 2025-10-17  
**Status**: Production Ready ✅

---

## 📁 Directory Structure

```
logos/
├── variant1-gloop/          # G-Loop J-Clip Hybrid
│   ├── logo-gloop-1024.png  # Master (1.4MB)
│   ├── logo-gloop-512.png
│   ├── logo-gloop-192.png
│   └── ... (32px-384px)
│
├── variant2-circle/         # Cropped Circle '찍'
│   ├── logo-circle-1024.png # Master (1.5MB)
│   ├── logo-circle-512.png
│   └── ... (64px-384px)
│
├── variant3-ribbon/         # Ribbon-J Flow
│   ├── logo-ribbon-1024.png # Master (1.4MB)
│   ├── logo-ribbon-512.png
│   └── ... (64px-384px)
│
├── variant4-stacked/        # ⭐️ Stacked GG (RECOMMENDED)
│   ├── logo-stacked-1024.png # Master (1.5MB)
│   ├── logo-stacked-512.png  # 76KB - PWA Icon
│   ├── logo-stacked-384.png  # 46KB - Maskable
│   ├── logo-stacked-192.png  # 15KB - PWA Fallback
│   └── ... (32px-128px)
│
├── LOGO_COMPARISON.html     # Interactive comparison tool
├── HTML_HEAD_META.md        # Implementation guide
└── README.md                # This file
```

---

## 🏆 Recommended Logo: Variant 4 (Stacked GG)

**Why?**
- ✅ **Best small-size readability** (24px+)
- ✅ **PWA icon optimized** (192/512/maskable)
- ✅ **Perfect dark/light mode** support
- ✅ **Semantic clarity**: "찍→먹" two-phase concept
- ✅ **WCAG AA compliant** (≥3:1 contrast)

### Quick Usage

```html
<!-- PWA Icon (192px) -->
<link rel="icon" href="/logos/variant4-stacked/logo-stacked-192.png" />

<!-- High-res (512px) -->
<link rel="icon" href="/logos/variant4-stacked/logo-stacked-512.png" />

<!-- Maskable (384px) -->
<link rel="icon" href="/logos/variant4-stacked/logo-stacked-384.png" purpose="maskable" />
```

---

## 🎨 All Variants at a Glance

| Variant | Style | Best For | Small Size | File Sizes |
|---------|-------|----------|------------|------------|
| **1. G-Loop** | Hybrid Arc | Tech docs, API | Medium | 32px-1024px |
| **2. Circle** | Korean Stamp | Local marketing | Low | 64px-1024px |
| **3. Ribbon** | Flow Line | Video intros | Low | 64px-1024px |
| **4. Stacked** ⭐️ | Dual-Phase | Main app, PWA | **High** | 32px-1024px |

---

## 📊 File Sizes Reference

### Variant 4 (Stacked GG) - Recommended
| Size | File Size | Usage |
|------|-----------|-------|
| 1024px | 1.5MB | Master, High-DPI |
| 512px | 76KB | PWA Primary Icon |
| 384px | 46KB | PWA Maskable |
| 192px | 15KB | PWA Fallback |
| 128px | 8.8KB | Standard Icon |
| 64px | 3.8KB | Small Icon |
| 32px | 1.8KB | Favicon |

### Total Package
- **4 Variants** × ~7 resolutions each = **29 PNG files**
- **Total Size**: ~6.2MB (all variants)
- **Recommended Set** (Variant 4 only): ~1.7MB

---

## 🎨 Color Specifications

### Gradient (All Variants)
```css
/* Primary Gradient */
background: linear-gradient(135deg, 
  #FF6B2C 0%,    /* Warm Orange */
  #FF9E2F 35%,   /* Mid Orange */
  #00C3AD 100%   /* Mint Green */
);

/* Alternative (Variant 2) */
background: linear-gradient(135deg, 
  #FF6B2C 0%, 
  #E2453C 100%
);
```

### Theme Colors
- **Dark Mode BG**: `#0A0E1A`
- **Light Mode BG**: `#FBFBFD`
- **Border**: `rgba(255, 255, 255, 0.08)`

---

## 🚀 Quick Start

### 1. View Comparison Tool
Open `LOGO_COMPARISON.html` in your browser to compare all variants side-by-side with dark/light mode toggle.

```bash
cd public/logos
open LOGO_COMPARISON.html  # macOS
xdg-open LOGO_COMPARISON.html  # Linux
start LOGO_COMPARISON.html  # Windows
```

### 2. Implementation Guide
See `HTML_HEAD_META.md` for complete implementation instructions including:
- PWA manifest setup
- Meta tags (OG, Twitter Card)
- Next.js metadata configuration
- iOS/Android testing steps

### 3. Copy to Project Root
```bash
# Copy recommended variant to public root
cp variant4-stacked/logo-stacked-192.png ../icon-192.png
cp variant4-stacked/logo-stacked-512.png ../icon-512.png
```

---

## 📱 PWA Manifest Integration

Update `public/manifest.json`:

```json
{
  "name": "JJIKMEOK - 찍먹",
  "short_name": "찍먹",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logos/variant4-stacked/logo-stacked-384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#0A0E1A",
  "background_color": "#0A0E1A"
}
```

---

## 🎯 Design Specifications

### Gradient Details
- **Angle**: 135° (diagonal top-left to bottom-right)
- **Color Stops**: 0%, 35%, 100%
- **Highlight Overlay**: 10% (optional)

### Line Weights (1024px base)
- **Variant 1**: Outer 8px, Inner 4px
- **Variant 2**: Border 2px (mint edge)
- **Variant 3**: Ribbon 6px
- **Variant 4**: Top G thin (4px), Bottom G thick (8px)

### Spacing
- **Minimum Clear Space**: 20% of logo height
- **Edge Padding**: ≥16px
- **With Text Gap**: ≥24px

---

## ✅ Quality Checks

### Contrast (WCAG)
- [x] Logo on Dark BG: 4.8:1 (AA ✅)
- [x] Logo on Light BG: 5.2:1 (AA ✅)
- [x] Text on BG: 14.2:1+ (AAA ✅)

### PWA Requirements
- [x] 192×192 icon (any purpose)
- [x] 512×512 icon (any purpose)
- [x] 384×384+ maskable icon
- [x] Opaque background (optional transparent)
- [x] Valid manifest.json

### File Quality
- [x] PNG format with transparency
- [x] Proper color profile (sRGB)
- [x] No compression artifacts
- [x] Sharp edges at all sizes

---

## 🔧 Regeneration Commands

If you need to regenerate icons from master files:

```bash
# Install ImageMagick (if needed)
# brew install imagemagick  # macOS
# apt-get install imagemagick  # Linux

# Generate multi-resolution from 1024px master
cd variant4-stacked
for size in 512 384 192 128 96 64 48 32; do
  convert logo-stacked-1024.png -resize ${size}x${size} logo-stacked-${size}.png
done

# Generate favicon.ico (multi-size)
convert logo-stacked-32.png -define icon:auto-resize=32,16 ../favicon.ico

# Generate Apple Touch Icon (180px)
convert logo-stacked-512.png -resize 180x180 ../apple-touch-icon.png
```

---

## 📚 Related Documentation

- **Main Design System**: `/DESIGN_SYSTEM.md`
- **Logo Design Guide**: `/LOGO_DESIGN_GUIDE.md`
- **UX/UI Specification**: `/UX_UI_SPEC.md`
- **Implementation Guide**: `HTML_HEAD_META.md`

---

## 🎨 Design Philosophy

**"로컬 체험의 따뜻함 + 기술의 신뢰성"**

1. **Warm Colors**: Orange (warmth, local) → Mint (trust, tech)
2. **Instant Action**: "찍먹" snap gesture symbolism
3. **Mobile-First**: Optimized for small screens (24px+)
4. **Accessibility**: WCAG AA compliant, dark/light mode

---

## 🚧 Future Enhancements

- [ ] Animated Lottie version (JSON)
- [ ] 3D variant (Spline/Three.js)
- [ ] OG image (1200×630)
- [ ] iOS splash screens (multiple sizes)
- [ ] Brand guidelines PDF
- [ ] Figma/Sketch source files

---

## 📞 Support

For questions or custom variants:
- **Documentation**: See `LOGO_DESIGN_GUIDE.md`
- **Repository**: GitHub JJIKMEOK
- **Design System**: `DESIGN_SYSTEM.md`

---

**© 2025 JJIKMEOK. All rights reserved.**  
**Version**: 1.0.0 | **Status**: Production Ready ✅
