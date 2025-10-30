# 🎨 JJIKMEOK Logo - HTML Meta Tags

## 📱 PWA & Icon Meta Tags

Add these meta tags to your `<head>` section (e.g., in `src/app/layout.tsx` for Next.js):

```html
<!-- Primary Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="description" content="로컬 상점 미션을 오늘 찍고, 오늘 받는다. 나노 크리에이터를 위한 로컬 숏폼 플랫폼." />
<meta name="keywords" content="찍먹, JJIKMEOK, 로컬크리에이터, 나노크리에이터, 미션, 숏폼, 로컬비즈니스" />
<meta name="author" content="JJIKMEOK" />
<meta name="theme-color" content="#0A0E1A" media="(prefers-color-scheme: dark)" />
<meta name="theme-color" content="#FBFBFD" media="(prefers-color-scheme: light)" />

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json" />

<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/logos/variant4-stacked/logo-stacked-32.png" />
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="찍먹" />

<!-- iOS Splash Screens (optional, generate later) -->
<!-- <link rel="apple-touch-startup-image" href="/splash/iphone-x.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" /> -->

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://jjikmeok.com/" />
<meta property="og:title" content="JJIKMEOK - 찍먹" />
<meta property="og:description" content="로컬 상점 미션을 오늘 찍고, 오늘 받는다." />
<meta property="og:image" content="https://jjikmeok.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:site_name" content="JJIKMEOK" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://jjikmeok.com/" />
<meta name="twitter:title" content="JJIKMEOK - 찍먹" />
<meta name="twitter:description" content="로컬 상점 미션을 오늘 찍고, 오늘 받는다." />
<meta name="twitter:image" content="https://jjikmeok.com/og-image.png" />
<meta name="twitter:creator" content="@jjikmeok" />

<!-- Microsoft Tiles (Windows) -->
<meta name="msapplication-TileColor" content="#FF6B35" />
<meta name="msapplication-TileImage" content="/icon-512.png" />
<meta name="msapplication-config" content="/browserconfig.xml" />

<!-- Safe Area (iOS Notch) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

---

## 🎨 Next.js Implementation (App Router)

For Next.js 14+ with App Router, update `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'JJIKMEOK - 찍먹',
    template: '%s | JJIKMEOK'
  },
  description: '로컬 상점 미션을 오늘 찍고, 오늘 받는다. 나노 크리에이터를 위한 로컬 숏폼 플랫폼.',
  keywords: ['찍먹', 'JJIKMEOK', '로컬크리에이터', '나노크리에이터', '미션', '숏폼'],
  authors: [{ name: 'JJIKMEOK' }],
  creator: 'JJIKMEOK',
  publisher: 'JJIKMEOK',
  
  // Manifest
  manifest: '/manifest.json',
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logos/variant4-stacked/logo-stacked-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  
  // Theme Color
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0E1A' },
    { media: '(prefers-color-scheme: light)', color: '#FBFBFD' }
  ],
  
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover'
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://jjikmeok.com/',
    title: 'JJIKMEOK - 찍먹',
    description: '로컬 상점 미션을 오늘 찍고, 오늘 받는다.',
    siteName: 'JJIKMEOK',
    images: [
      {
        url: 'https://jjikmeok.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JJIKMEOK Logo'
      }
    ]
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'JJIKMEOK - 찍먹',
    description: '로컬 상점 미션을 오늘 찍고, 오늘 받는다.',
    images: ['https://jjikmeok.com/og-image.png'],
    creator: '@jjikmeok'
  },
  
  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '찍먹'
  },
  
  // Other
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}
```

---

## 📊 OG Image Generation (TODO)

Create Open Graph image (1200×630px) with this composition:

```
┌─────────────────────────────────────┐
│                                     │
│   [Logo 70%]    JJIKMEOK            │
│   (Centered)    찍먹                │
│                 로컬 미션 플랫폼     │
│                                     │
└─────────────────────────────────────┘
```

### Recommended Layout:
- **Background**: Gradient `#0A0E1A` → `#131825`
- **Logo**: Variant 4 (Stacked GG), 400px width, centered-left
- **Wordmark**: Pretendard Bold 72px, gradient text
- **Tagline**: 로컬 상점 미션을 오늘 찍고, 오늘 받는다 (32px)

---

## 🔍 Validation Checklist

### PWA Manifest
- [x] manifest.json created in `/public/`
- [x] Icons 192px and 512px available
- [x] Maskable icons 384px and 512px available
- [x] theme_color and background_color set
- [ ] Lighthouse PWA score ≥90

### Favicons
- [x] favicon.ico (32×32, 16×16 multi-size)
- [x] icon-192.png (PWA standard)
- [x] icon-512.png (PWA high-res)
- [x] apple-touch-icon.png (180×180)

### Meta Tags
- [ ] Update `src/app/layout.tsx` with metadata
- [ ] Test Open Graph preview (Facebook Debugger)
- [ ] Test Twitter Card preview (Twitter Card Validator)
- [ ] Verify theme-color in Chrome DevTools

### Testing Tools
- [ ] [Lighthouse CI](https://web.dev/measure/)
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [Maskable.app](https://maskable.app/) - Test maskable icons
- [ ] [Favicon Checker](https://realfavicongenerator.net/favicon_checker)

---

## 📱 iOS/Android Testing

### iOS Safari
1. Open site in Safari
2. Tap "Share" → "Add to Home Screen"
3. Verify icon appears correctly
4. Verify app name "찍먹" displays
5. Launch from home screen, check splash screen

### Android Chrome
1. Open site in Chrome
2. Tap "Add to Home screen" banner
3. Verify icon and name
4. Launch from home screen
5. Check standalone mode

---

## 🎯 Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| **PWA Score** | ≥90 | Lighthouse |
| **Icon Load** | <100ms | Network Tab |
| **Maskable Valid** | ✅ Pass | Maskable.app |
| **Contrast Ratio** | ≥3:1 | WebAIM |
| **File Sizes** | <100KB | DevTools |

---

## 📚 Additional Resources

- [PWA Manifest Generator](https://www.simicart.com/manifest-generator.html/)
- [Favicon Generator](https://realfavicongenerator.net/)
- [Maskable Icon Editor](https://maskable.app/editor)
- [iOS Splash Screen Generator](https://progressier.com/pwa-splash-screen-generator)

---

**Next Steps:**
1. Update `src/app/layout.tsx` with metadata
2. Generate OG image (1200×630)
3. Run Lighthouse audit
4. Test on iOS/Android devices
5. Validate Open Graph previews

---

**Last Updated**: 2025-10-17  
**Status**: Ready for Implementation
