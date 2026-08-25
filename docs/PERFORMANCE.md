# Performance Delivery Rules

Last reviewed: 2026-08-25

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

| Path | Policy | Rationale |
|---|---|---|
| `/assets/*.js` | `public, max-age=31536000, immutable` | Hashed filenames. |
| `/assets/*.css` | `public, max-age=31536000, immutable` | Hashed filenames. |
| `/assets/images/*.{webp,png,jpg}` | `public, max-age=31536000, immutable` | Immutable assets. |
| `/assets/images/*.{mp4,webm}` | `public, max-age=31536000, immutable` | Immutable media. |
| `/index.html` | `no-cache` | Must revalidate on every visit. |

Current implementation: `public/_headers` (Netlify). Vercel equivalent: `vercel.json` routes.

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

| Chunk | Limit | Current split |
|---|---|---|
| Framework (React/DOM) | `< 100KB` gzipped | `framework-[hash].js` |
| Three.js | `< 150KB` gzipped | `three-[hash].js` |
| Animation (GSAP/Framer) | `< 80KB` gzipped | `animation-[hash].js` |
| Vendor | `< 120KB` gzipped | `vendor-[hash].js` |
| Individual clock page | `< 50KB` gzipped | Dynamic import chunk |
| Total initial JS | `< 150KB` gzipped | Sum of all sync chunks |

**Enforcement:**
- `chunkSizeWarningLimit: 1000` in `vite.config.ts` warns during build.
- Fail CI if any single chunk exceeds its limit.

## Other Rules

- **Source maps:** disabled in production (`sourcemap: false`).
- **Console stripping:** `console.log`/`info`/`debug` removed by esbuild `pure` in production.
- **Images:** use `srcset` + `sizes` for responsive images. No raster images above 2x viewport width.
- **Lazy loading:** all non-critical images and videos use `loading="lazy"` or `preload="none"`.
