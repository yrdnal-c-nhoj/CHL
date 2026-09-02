# Performance Delivery Rules

Last reviewed: 2026-09-02

## Image & Video Budgets

| Asset type | Budget | Notes |
|---|---|---|
| Images | `< 200KB` per file | Prefer WebP/AVIF. Use `loading="lazy"` below the fold. |
| Video backgrounds | `< 2MB` per file | WebM/MP4, `muted`, `loop`, `playsInline`, `preload="none"`. |
| Sprites / icons | Inline if `< 4KB` | Vite `assetsInlineLimit` handles this automatically. |
| Thumbnails | `< 50KB` | Generated at build time, served via CDN. |

## Font Rules

- **Count:** Max 2 custom font families per page. Fewer is better.
- **Format:** WOFF2 only. No TTF/WOFF in production.
- **Location:** Local files only. No remote font providers.
- **Subsetting:** Subset to required Unicode ranges. Remove unused glyphs.
- **Size:** `< 100KB` per font file. Split weights/styles into separate files.

### font-display Policy

Choose intentionally based on font role:

| Value | Use case | Trade-off |
|---|---|---|
| `block` | Art-directed, brand-critical display fonts | Hides text until font loads; protects design |
| `swap` | UI fonts, fallback-safe text | Shows text immediately with fallback, then swaps |
| `fallback` | Non-critical text, captions | Short block period, then fallback for the page lifetime |
| `optional` | Decorative fonts, experimental | May never load; fastest perceived performance |

**Rule:** Use `block` only when the art direction genuinely requires it and the font is small/subset. For most clocks, `swap` or `fallback` gives better perceived performance without compromising the experience.

## Cache Headers

### Immutable assets

All files under `/assets/` receive immutable caching because Vite hashes
filenames by content (`index-[hash].js`, `style-[hash].css`, etc.).

This single glob covers:
- JavaScript chunks (`/assets/*.js`)
- CSS bundles (`/assets/*.css`)
- Fonts (`/assets/fonts/*.woff2`)
- Images (`/assets/images/*.{webp,png,jpg}`)
- Media (`/assets/images/*.{mp4,webm}`)

| Path | Policy | Rationale |
|---|---|---|
| `/assets/*` | `public, max-age=31536000, immutable` | Hashed filenames are content-addressable. |
| `/assets/images/*.mp4` | `Cache-Control: public, max-age=31536000, immutable` + `Content-Type: video/mp4` | Media files. |
| `/assets/images/*.webm` | `Cache-Control: public, max-age=31536000, immutable` + `Content-Type: video/webm` | Media files. |

### HTML / shell

| Path | Policy | Rationale |
|---|---|---|
| `/` | `no-cache` | Must revalidate on every visit. |
| `/index.html` | `no-cache` | Must revalidate on every visit. |

**Current implementation:** `public/_headers` (Netlify). Vercel equivalent:
`vercel.json` routes with `headers` config.

## Preload Policy

- **Preload:** only above-the-fold fonts and critical CSS.
- **Prefetch:** use for next-likely route chunks (`<link rel="prefetch">` or Vite `_preload-prefetch`).
- **Do not preload:** off-screen images, videos, or non-critical fonts.
- **Delivery:** preload links injected by the preloading pipeline in `useClockPage`.

## Compression

- **Brotli:** enabled for `.js`, `.css`, `.html`, `.json`, `.svg`, `.woff2`.
- **Gzip:** fallback for browsers without Brotli.
- **Threshold:** compress files `> 1KB`.
- **Implementation:** `vite-plugin-compression` (already configured in `vite.config.ts`).

## Route-Level Bundle Limits

| Chunk | Limit | Current (2026-09-02, brotli) | Status |
|---|---|---|---|
| Framework (React/DOM) | `< 100KB` gzipped | `framework-[hash].js` ≈ 50.89KB br | ✅ |
| Three.js | `< 150KB` gzipped | `three-[hash].js` ≈ 190.66KB br (859.55KB raw) | ❌ Over budget |
| Animation (GSAP/Framer) | `< 80KB` gzipped | (none observed in last build) | — |
| Vendor | `< 120KB` gzipped | `vendor-[hash].js` ≈ 25.49KB br | ✅ |
| Individual clock page | `< 50KB` gzipped | Dynamic import chunk; biggest observed `useClockPage-[hash].js` ≈ 15.99KB br | ✅ |
| Total initial JS | `< 150KB` gzipped | framework + vendor + entry ≈ ~95KB br | ✅ |

**Enforcement:**
- `chunkSizeWarningLimit: 1000` in `vite.config.ts` warns during build.
- Fail CI if any single chunk exceeds its limit.

**Action item:** the Three.js chunk is now materially over budget
(190.66KB br vs 150KB target). Options: (a) defer Three.js to a dynamic
import that only loads on routes that use it, (b) split `@react-three/drei`
submodules, (c) raise the budget and document the rationale. Recommend (a) or
(b) before the next release.

## Other Rules

- **Source maps:** disabled in production (`sourcemap: false`).
- **Console stripping:** `console.log`/`info`/`debug` removed by esbuild `pure` in production.
- **Images:** use `srcset` + `sizes` for responsive images. No raster images above 2x viewport width.
- **Lazy loading:** all non-critical images and videos use `loading="lazy"` or `preload="none"`.