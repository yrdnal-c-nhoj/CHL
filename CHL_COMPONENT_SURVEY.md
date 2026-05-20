# CHL Component Survey (BorrowedTime)

## Scope
This document surveys the current “CHL component” system in the BorrowedTime repo: routing, registry-driven discovery, clock page rendering, asset preloading, and the submission automation pipeline. It also highlights where documentation matches (or diverges from) current implementation.

---

## 1. System Architecture at a Glance

### Registry-Discovery pattern
- Source of truth: `src/context/clockpages.json`
- Loader: `src/hooks/useClockPage.ts`
- Data hydration: `src/context/DataContext.tsx`

Flow:
1. `DataProvider` loads registry JSON (production uses `clockpages.json`, DEV uses `testclocks.json`).
2. `App.tsx` routes `/:date` to `ClockPage`.
3. `ClockPage` derives `currentItem` from the loaded registry.
4. `useClockPage(currentItem)` dynamically imports the correct `src/pages/**/Clock.tsx` module.
5. If the module exports `assets`, the hook preloads those assets before mounting the clock component.
6. `ClockPage` wraps the clock in `Suspense` for font loading.

---

## 2. Entry Points & Routing

### `src/App.tsx`
Responsibilities:
- React Router v6 route table:
  - `/` → `Home`
  - `/:date` → `ClockPage`
  - `/contact` → `Contact`
  - `/today` → `Today`
  - `/list` → `ClockList`
- SEO + analytics:
  - `AnalyticsAndSEO` uses `react-helmet-async`.
  - Uses `pageview` from `src/analytics.ts`.
- Error handling:
  - `ErrorBoundary` catches runtime errors and renders a fallback.

Documentation check:
- README mentions SEO + analytics and lazy-loading; `App.tsx` matches that intent.

---

## 3. Data Loading (Registry)

### `src/context/DataContext.tsx`
Responsibilities:
- Provides `DataContext` with:
  - `items`: registry of clock items
  - `loading`
  - `error`
- Loads JSON via dynamic import:
  - `clockpages.json` in prod
  - `testclocks.json` in dev

Implementation details:
- `ClockItem` includes `path`, `date`, `title`, plus index signature (`[key: string]: any`).

Doc gap (actionable):
- The repo docs emphasize strict typing and “no any” (BTS), but the current `ClockItem` interface explicitly includes an `[key: string]: any` index signature. This is not inherently wrong, but should be called out in BTS or replaced with a narrower type.

---

## 4. Clock Page Rendering

### `src/ClockPage.tsx`
Responsibilities:
- Reads `date` route param.
- Validates `date` format (via `DATE_REGEX` from `src/utils/dateUtils`).
- Uses `useAutoHeader` to fade the header in/out.
- Derives `prevItem` / `currentItem` / `nextItem` using registry `items`.
- Renders:
  - `Header`
  - the clock component (dynamic)
  - `ClockPageNav` once ready
  - a fading `LoadingOverlay`

Notable implementation details:
- `ClockComponent` is loaded through `useClockPage` and mounted only when `isReady` is true.
- The clock itself is wrapped in:
  - `<Suspense fallback={<ClockLoadingFallback />}>`
  - `<ClockComponent />`

Doc alignment:
- `src/templates/ARCHITECTURE.md` and README both describe font loading with Suspense; `ClockPage` is consistent with that.

---

## 5. Dynamic Clock Loading + Asset Preloading

### `src/hooks/useClockPage.ts`
Responsibilities:
- Dynamically imports the correct `Clock.tsx` under `src/pages/**/Clock.tsx` using `import.meta.glob`.
- Preloads module-provided `assets`:
  - The imported module may export `assets?: string[]`.
  - Each URL is preloaded using a plain `Image()` loader.
  - Failures resolve as `false` (warn + continue) rather than rejecting.
- Safety mechanisms:
  - `LOADING_TIMEOUT` (10s): if exceeded, overlay hides and the hook sets `error`.
  - `overlayVisible` and `isReady` govern UI transitions.

Important detail:
- Asset preloading currently assumes “image-like” URLs (`new Image()`), even though some clocks may export videos/audio/mp4 assets.

Doc gap (actionable):
- Template docs and scripts describe “export assets for preloading pipeline”. However, the current preloader implementation in `useClockPage.ts` uses `Image()` only. This means exported mp4/webm assets will not preload correctly.
- This should be reconciled either by:
  - updating `useClockPage.ts` to preload videos/audios too, or
  - tightening BTS/template guidance to only export images/gifs for `assets` in this pipeline.

---

## 6. Shared UI Components

### Header
- `src/components/Header.tsx` uses `Header.module.css`.
- Visibility is controlled via a `visible` prop.

### Navigation
- `src/components/TopNav.tsx` implements a hamburger menu with `NavLink`.
- `src/components/ClockPageNav.tsx` provides prev/next controls and auto-hides after inactivity.

### Thumbnails
- `src/components/Thumbnail.tsx`:
  - maps `date → imageUrl` via `src/utils/thumbnailMap.ts`
  - enforces square aspect ratio using inline style `aspectRatio: '1 / 1'`
  - displays a “No Image” fallback when missing

Implementation details worth documenting:
- `Thumbnail` strips caller-provided `height`/`aspectRatio` so it always remains square.

---

## 7. Clock Template & Hook Contracts

### `src/templates/BaseClock.tsx`
Contract expectations:
- Exports:
  - `export const assets: string[] = []` (preloading pipeline)
- Uses:
  - `useClockTime()` by default
  - `useSuspenseFontLoader(fontConfigs)`
- Renders:
  - `<main>`
  - `<time dateTime={isoTime}>` with digits

### Font loading
- `src/utils/fontLoader.tsx` uses a Suspense resource-style loader with `FontFace`.
- It returns a resource `.read()` method which suspends while pending.

Doc check:
- `src/templates/ARCHITECTURE.md` states WOFF2-only font requirements and specific naming. The actual code supports `FontFace` with `fontUrl` and `FontFaceDescriptors`, and the file naming rules are documentation-level requirements.

Mismatch to check:
- `AGENTS.md` and README have slightly different font constraints (AGENTS mentions TTF/OTF/WOFF2 supported; templates emphasize WOFF2). This needs a single source of truth.

---

## 8. Time Hooks

### `src/utils/hooks/useClockTime.ts`
- Provides `useClockTime()` with `setInterval(1000)`.
- Also provides helper functions for formatting and analog calculations.

### `useSmoothClock.ts`
- Provides RAF-based smooth time via `requestAnimationFrame`.

Doc gap:
- `AGENTS.md` says “Logic Migration: Refactor remaining setInterval clocks to useClockTime()”. But `useClockTime()` itself is setInterval-based. That statement likely intended “refactor remaining legacy clocks to use these standardized hooks”, not remove setInterval entirely.

---

## 9. Automation Pipeline (Finalize / Captures)

### Scripts
- `npm run finalize` → `tsx scripts/UploadFinalize/finalize-component.ts`
- Thumbnail capture:
  - `npm run capture:thumbnails`
  - `npm run capture:daily-square` (daily thumb)
- Social capture:
  - `npm run capture:instagram/twitter/facebook`

### `scripts/UploadFinalize/README.md`
Docs describe:
- validation checks (TS compile, eslint, structure, standards)
- auto-fixes (formatting, asset organization, moving, relinking, orphan cleanup, font renaming)
- screenshot capture to `screen-caps/`

Consistency check needed:
- Validate that the finalize script’s actual checks match BTS/AGENTS/ARCHITECTURE docs (not fully verified in this survey pass).

---

## 10. Documentation Consistency Findings (Early)

1. **Preloading pipeline mismatch**
   - Docs say “export assets” for preloading.
   - `useClockPage.ts` currently preloads only with `new Image()`.
   - Action: document image-only vs broaden loader to support video/audio.

2. **Font constraints differ across docs**
   - Templates mention WOFF2-only.
   - AGENTS mentions broader support.
   - Action: define a canonical font policy.

3. **BTS says “no any” but types include `any`**
   - `ClockItem` has an index signature `[key: string]: any`.
   - Action: either tighten the type or explicitly carve out allowed extension fields.

4. **Two clock loader implementations exist in repo**
   - `src/hooks/useClockPage.ts` and `src/pages/.../useClockPage.ts` (older path) both exist.
   - Action: document which one is used in production route; avoid confusion for contributors.

---

## 11. Suggested Documentation Next Edits (High value)
- Add/adjust a “Clock Module Contract” section:
  - what a clock must export (`assets`, fontConfigs usage)
  - what asset types are supported by the preloader
- Add/adjust a “Font policy” section:
  - allowed formats, naming, hosting path
- Add/adjust a “Type policy” section:
  - where `any` is allowed (if anywhere)
- Add/adjust a “Loader architecture” diagram:
  - DataContext → ClockPage → useClockPage → Suspense fonts

---

## Appendix: Key Files
- Routing: `src/App.tsx`
- Registry: `src/context/DataContext.tsx`
- Clock page: `src/ClockPage.tsx`
- Dynamic loader: `src/hooks/useClockPage.ts`
- Template contract: `src/templates/BaseClock.tsx`, `src/templates/ARCHITECTURE.md`
- UI: `src/components/*`
- Thumbnail mapping: `src/utils/thumbnailMap.ts`
- Font loader: `src/utils/fontLoader.tsx`
- Hooks: `src/utils/hooks/*`
- Automation:
  - `scripts/UploadFinalize/*`
  - `scripts/SocialMediaCap/*`
  - `scripts/DailyThumb/*`

