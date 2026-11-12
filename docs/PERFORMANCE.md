# Performance Delivery Rules

Last reviewed: 2026-11-12

For project-level standards, roadmap, and enforcement plan, see
[`docs/ROADMAP.md`](./ROADMAP.md).

## Image & Video Budgets

| Asset type        | Budget             | Notes                                                       |
| ----------------- | ------------------ | ----------------------------------------------------------- |
| Images            | `< 200KB` per file | Prefer WebP/AVIF. Use `loading="lazy"` below the fold.      |
| Video backgrounds | `< 2MB` per file   | WebM/MP4, `muted`, `loop`, `playsInline`, `preload="none"`. |
| Sprites / icons   | Inline if `< 4KB`  | Vite `assetsInlineLimit` handles this automatically.        |
| Thumbnails        | `< 50KB`           | Generated at build time, served via CDN.                    |

## Video Encoding Best Practices

**Target format: WebM (VP9) or AV1** — 30–50% smaller than H.264 MP4 at equivalent visual quality. Provide MP4 as fallback only when WebM is unsupported.

**Encoding guidelines:**

- **Resolution:** 720p max (`-vf scale=-2:720`) — 1080p+ wastes bandwidth on background video.
- **Bitrate/Quality:** CRF 30–35 for VP9 (`-crf 32 -b:v 0`), CRF 26–30 for H.264 (`-crf 28 -preset slow`).
- **Audio:** Strip entirely (`-an`) — background video must be `muted`.
- **Loop length:** 10–30 seconds — shorter loops = smaller files, seamless repetition.
- **Fast start:** `-movflags +faststart` (MP4) so metadata is at file start.
- **Poster frame:** Extract first frame as WebP (`ffmpeg -i input.mp4 -vframes 1 -vf scale=-2:720 poster.webp`) and add `poster="..."` to `<video>` for instant visual before playback.

**Component requirements (enforced by conformance):**

- `<video preload="none" ...>` — prevents eager download on page load.
- `@media (prefers-reduced-motion: reduce) { video { display: none; } }` — respects user motion preferences.
- `autoPlay loop muted playsInline` — required for auto-play policy compliance.
- Register every video in the clock's `export const assets = [...]` array.

**FFmpeg reference commands:**

```bash
# WebM (primary, best compression)
ffmpeg -i input.mp4 \
  -an -vf scale=-2:720 \
  -c:v libvpx-vp9 -crf 32 -b:v 0 \
  output.webm

# MP4 fallback (H.264)
ffmpeg -i input.mp4 \
  -an -vf scale=-2:720 \
  -c:v libx264 -crf 28 -preset slow \
  -movflags +faststart output.mp4

# Poster frame
ffmpeg -i input.mp4 -vframes 1 -vf scale=-2:720 poster.webp
```

**JSX pattern (established Sept 2026):**

```tsx
<video
  src={videoWebM}
  poster={posterImage}
  preload="none"
  autoPlay
  loop
  muted
  playsInline
  aria-hidden="true"
  className={styles.backgroundVideo}
/>
```

## Font Rules

- **Count:** Max 2 custom font families per page. Fewer is better.
- **Format:** WOFF2/TTF/OTF. All formats allowed; WOFF2 preferred for production.
- **Location:** Local files are preferred for reliability and to avoid a cross-origin request blocking first paint. Google Fonts (or another reputable remote provider) is allowed when local self-hosting isn't practical — use a `<link rel="preconnect">` to the font host and keep the `@font-face`/`<link>` load out of a blocking synchronous inline `<style>` tag.
- **Subsetting:** Subset to required Unicode ranges. Remove unused glyphs.
- **Size:** `< 100KB` per font file. Split weights/styles into separate files.

### font-display Policy

Choose intentionally based on font role:

| Value      | Use case                                   | Trade-off                                               |
| ---------- | ------------------------------------------ | ------------------------------------------------------- |
| `block`    | Art-directed, brand-critical display fonts | Hides text until font loads; protects design            |
| `swap`     | UI fonts, fallback-safe text               | Shows text immediately with fallback, then swaps        |
| `fallback` | Non-critical text, captions                | Short block period, then fallback for the page lifetime |
| `optional` | Decorative fonts, experimental             | May never load; fastest perceived performance           |

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

| Path                    | Policy                                                                            | Rationale                                 |
| ----------------------- | --------------------------------------------------------------------------------- | ----------------------------------------- |
| `/assets/*`             | `public, max-age=31536000, immutable`                                             | Hashed filenames are content-addressable. |
| `/assets/images/*.mp4`  | `Cache-Control: public, max-age=31536000, immutable` + `Content-Type: video/mp4`  | Media files.                              |
| `/assets/images/*.webm` | `Cache-Control: public, max-age=31536000, immutable` + `Content-Type: video/webm` | Media files.                              |

### HTML / shell

| Path          | Policy     | Rationale                       |
| ------------- | ---------- | ------------------------------- |
| `/`           | `no-cache` | Must revalidate on every visit. |
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

| Chunk                         | Limit             | Current (2026-09-27, brotli)                                                 | Status                                                                             |
| ----------------------------- | ----------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Framework (React/DOM)         | `< 100KB` gzipped | `framework-[hash].js` ≈ 58.71KB br                                           | ✅                                                                                 |
| Three.js                      | `< 150KB` gzipped | `three-[hash].js` ≈ 194.07KB br (872.83KB raw)                               | ⚠️ Over budget, but loaded only by the 10 clocks that use 3D (no longer site-wide) |
| Animation (GSAP/Framer)       | `< 80KB` gzipped  | (none observed in last build)                                                | —                                                                                  |
| Vendor                        | `< 120KB` gzipped | `vendor-[hash].js` ≈ 30.93KB br                                              | ✅                                                                                 |
| Individual clock page         | `< 50KB` gzipped  | Dynamic import chunk; biggest observed `useClockPage-[hash].js` ≈ 15.99KB br | ✅                                                                                 |
| Thumbnails (`Thumbnail-*.js`) | `< 50KB` gzipped  | ≈ 58.96KB br (measured 2026-09-20)                                           | ❌ Over budget; split or lazy-load still open (ROADMAP 4.7)                        |
| Total initial JS              | `< 150KB` gzipped | framework + vendor + entry ≈ ~95KB br                                        | ✅                                                                                 |

**Enforcement:**

- `chunkSizeWarningLimit: 1000` in `vite.config.ts` warns during build.
- Fail CI if any single chunk exceeds its limit.

**Three.js loading (fixed 2026-09-27):** previously `three.js` shared a chunk with
general vendor code and Vite's `__vitePreload` helper, so `index.html` preloaded it
and every page (home, tags, contact, any clock) downloaded it. `vite.config.ts`
now puts `three` plus every package that depends on it (`@react-three/*`,
`three-stdlib`, `troika-*`, `maath`, `camera-controls`, `meshline`,
`three-mesh-bvh`, `stats-gl`, `@monogrid/gainmap-js`) in one `three` chunk, and
pins Vite's runtime helpers to `framework`. If a new dependency of `three` is
added, add it to that list or `vendor` will start importing `three` again.
Check with: `index.html` must not modulepreload `three-*.js`, and only `Clock-*.js`
chunks should import it.

**Remaining action item:** the `three` chunk itself is still over its 150KB
budget (194KB br). Converting `import * as THREE` to named imports was tested and
saved nothing. Options: (a) raise the budget for this chunk and document why,
(b) reduce which `@react-three/drei` helpers are used.

## Other Rules

- **Source maps:** disabled in production (`sourcemap: false`).
- **Console stripping:** `console.log`/`info`/`debug` removed by esbuild `pure` in production.
- **Images:** use `srcset` + `sizes` for responsive images. No raster images above 2x viewport width.
- **Lazy loading:** all non-critical images and videos use `loading="lazy"` or `preload="none"`.
