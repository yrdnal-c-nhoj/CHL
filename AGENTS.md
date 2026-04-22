# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**BorrowedTime** by Cubist Heart Laboratories — a creative art project that publishes a new uniquely-designed clock every day. Each clock lives at the URL `/:YY-MM-DD`.

## Commands

```bash
npm run dev           # Start dev server at http://localhost:5173
npm run build         # Production build to dist/
npm run build:with-types  # TypeScript check + build
npm run preview       # Preview production build
npm run test          # Run tests in watch mode (Vitest)
npm run test:run      # Run tests once (CI-friendly)
npm run lint          # ESLint
npm run format        # Prettier
npm run type-check    # tsc --noEmit (no build output)
npm run clean         # rm -rf dist
```

Run a single test file:

```bash
npx vitest run src/path/to/file.test.ts
```

## Architecture

### Data Flow

The clock registry lives in `src/context/clockpages.json` — an ordered array of `{ path, date, title }` entries in `YY-MM-DD` format. `DataProvider` (`src/context/DataContext.jsx`) reads this JSON and exposes `{ items, loading, error }` via `DataContext` to the whole app. In development (`import.meta.env.DEV`), it loads from `src/context/testclock.json` instead.

### Routing

`App.tsx` defines routes. The wildcard route `/:date` maps to `ClockPage.tsx`, which looks up the date in `DataContext`, then dynamically imports the matching `Clock.tsx` via the `useClockPage` hook.

### Clock Loading Pipeline

`src/hooks/useClockPage.ts` is the core of the system:

1. Uses `import.meta.glob('../../pages/**/Clock.tsx')` to pre-register all clock modules at build time.
2. Constructs the module key as `pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`.
3. Dynamically imports the matching module and preloads any exported image/video assets before rendering.
4. Manages a black overlay that fades out once the clock and its assets are ready, preventing flash of unstyled content.

`ClockPage.tsx` wraps the loaded component in a `<Suspense>` boundary (using `ClockLoadingFallback` from `fontLoader.tsx`), fades the header out after 1.5s, and provides prev/next navigation via `ClockPageNav`.

### Font Loading

`src/utils/fontLoader.tsx` exports `useSuspenseFontLoader(fontConfigs: FontConfig[])`. It uses a Suspense-compatible resource cache (throws a Promise while pending) and reference-counting to add/remove `FontFace` objects from `document.fonts` on mount/unmount. This **must** be called inside a component wrapped in a `<Suspense>` boundary — `ClockPage.tsx` provides that boundary. Use `useFontLoader` (single font) or `useSuspenseFontLoader` (multiple fonts) in new clock components.

### Adding a New Clock

1. Create `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx` — the default export must be a React component.
2. Add an entry to `src/context/clockpages.json`: `{ "path": "YY-MM-DD", "date": "YY-MM-DD", "title": "Clock Title" }`.

That's all that's required. The glob-based dynamic import in `useClockPage.ts` automatically picks up any new `Clock.tsx` file matching the pattern.

### Shared Utilities

- `src/utils/clockUtils.ts` — `useClockTime()` (1s interval), `formatTime()`, `calculateAngles()`, `generateTickMarks()`.
- `src/utils/assetLoader.ts` — hooks for image/video/audio loading with caching and fallback support (`useImageLoader`, `useVideoLoader`, `useAudioLoader`, `useMultiAssetLoader`).
- `src/types/clock.ts` — shared TypeScript types (`FontConfig`, `ClockTime`, `ClockHand`, etc.).
- `src/templates/` — reusable clock templates (`ClockTemplate.jsx`, `DigitalClockTemplate.jsx`, `AnalogClockTemplate.jsx`, `WordClockTemplate.jsx`).

### Styling Conventions

- Clock components use **CSS Modules** (`.module.css`) for scoped styles to prevent leakage between clocks.
- Avoid injecting global `<style>` tags or keyframes directly into the DOM from clock components; use CSS Modules or scoped inline styles instead.
- TailwindCSS is available for shared UI components (nav, footer, etc.), not typically used inside individual clock pages.

### TypeScript Migration

The codebase is in active migration from JSX to TSX. Shared utilities and new files should use TypeScript. `strict` mode is enabled in `tsconfig.json`, with path aliases (`@/components/*`, `@/utils/*`, etc.) configured.

### Environment Variables

Defined in `.env` (copy from `.env.example`). All must be prefixed with `VITE_` to be accessible in the browser. Key variables:

- `VITE_GA_MEASUREMENT_ID` — Google Analytics 4 measurement ID
- `VITE_ENVIRONMENT` — `development` / `testing` / `production` (controls test vs. prod data)
- `VITE_PIXABAY_KEY`, `VITE_UNSPLASH_KEY`, `VITE_GOOGLE_API_KEY`, `VITE_NASA_API_KEY` — image API keys used by individual clocks

### Testing

Tests use **Vitest** + **@testing-library/react** with `jsdom`. Setup file at `src/test/setup.js` mocks `window.matchMedia`, `ResizeObserver`, the `FontFace` API, and `document.fonts`. Tests run with globals enabled (no import needed for `describe`, `it`, `expect`, `vi`).

### Deployment

Deployed to **Vercel**. Build command: `npm run build`, output: `dist/`. `vercel.json` and `.vercel/` contain project configuration. Node.js 24.x is required.
