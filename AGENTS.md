# Project AI Instructions

**Required starting point for every AI-assisted change in BorrowedTime.**

## Project Principle

BorrowedTime is both software and a historical digital-art archive. **September 2026 is the current architectural boundary.** New work follows the current architecture; historical clocks are not rewritten merely to make the archive uniform.

## Required Reading

Before editing, read this file and:
- `docs/ARCHITECTURE.md` — architecture and the historical/current boundary
- `docs/CLOCKS.md` — for clock work
- `docs/PERFORMANCE.md` — for assets, fonts, media, loading, or bundle work

Use `CONTRIBUTING.md` for the human contribution workflow.

This guide describes the repository's preferred patterns. Existing legacy clocks may not follow every rule; do not rewrite unrelated clocks while working on a focused task.

## Required Agent Workflow

1. Read this file and the standards it links to.
2. Identify the target clock or shared module before editing; determine whether it is historical or current.
3. Read the target `Clock.tsx`, `Clock.module.css`, and any helper it uses.
4. Search for an existing project pattern before introducing a new one.
5. Make the smallest complete change that preserves the visual behavior.
6. Keep assets local and register every asset used by a clock in `assets`.
7. Run the narrowest relevant check, then run `npm run build`.
8. For clock changes, run the clock verifier for the target date when practical:
   `node scripts/verify-all-clocks.js --path YY-MM-DD`.
9. Report changed files, checks run, and any remaining failures.

Do not silently replace a broken asset, swallow an import error, or claim a check passed when it was not run.

## Project Layout

### Clock files

Each daily clock lives in:

```text
src/pages/YYYY/YY-MM/YY-MM-DD/
  Clock.tsx
  Clock.module.css
  optional helper files
```

Examples:

- `src/pages/2026/26-09/26-09-16/Clock.tsx`
- `src/pages/2026/26-09/26-09-16/Clock.module.css`

Use the `@/` alias for source imports. Keep a clock's implementation and styles in its date directory unless a utility is genuinely shared.

### Asset locations

Use the existing asset directories:

```text
src/assets/images/
src/assets/fonts/
src/assets/icons/
```

Keep a new asset near the other assets for its year/month or project category. Do not rename or move existing assets to make a task easier.

## Importing Images

Import local images at the top of `Clock.tsx`:

```tsx
import backgroundImage from '@/assets/images/26_images/26-09/26-09-16/background.webp';
```

Register every imported image that the clock loads:

```tsx
export const assets = [backgroundImage];
```

Use an imported URL in JSX or CSS variables:

```tsx
<img
  className={styles.logo}
  src={logoImage}
  alt="BorrowedTime logo"
/>
```

```tsx
<main
  className={styles.container}
  style={{ '--background-image': `url(${backgroundImage})` }}
>
```

```css
.container {
  background-image: var(--background-image);
}
```

Prefer CSS `background-image` for decorative art and `<img>` for meaningful content. Meaningful images need useful `alt` text; decorative images use `alt=""` or are backgrounds.

### Responsive images

For an image that is content rather than a background, use `srcSet` and `sizes` when multiple local resolutions exist:

```tsx
<img
  src={image}
  srcSet={`${smallImage} 640w, ${largeImage} 1280w`}
  sizes="100vw"
  alt="..."
  loading="lazy"
/>
```

Do not use `loading="lazy"` for the primary above-the-fold image if it delays the clock's first paint.

### Image rules

- Prefer WebP or AVIF; use PNG for transparency and SVG for simple scalable artwork.
- Follow the size budget in [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md).
- Do not embed base64 data or fetch images from remote providers.
- Do not add an asset to `assets` if it is never rendered.
- Avoid `object-fit: cover` when cropping would remove important artwork; choose `contain` or an explicit aspect-ratio treatment instead.

## Importing Video and Other Media

Import local video the same way as an image:

```tsx
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-10/background.webm';
```

Register it in `assets`:

```tsx
export const assets = [backgroundVideo, overlayImage];
```

**Established pattern since September 2026** (used in 20 of the ~26 September clocks — see e.g. `src/pages/2026/26-09/26-09-20/Clock.tsx`): render it as a plain `<video>` with a direct `src`, not a `<source>` child or a CSS custom property:

```tsx
<video
  src={backgroundVideo}
  autoPlay
  loop
  muted
  playsInline
  aria-hidden="true"
  className={styles.backgroundVideo}
/>
```

Use `poster` when the first frame matters:

```tsx
<video
  src={video}
  poster={posterImage}
  autoPlay
  loop
  muted
  playsInline
/>
```

A `<source>` child with an explicit `type` is only needed when serving more than one video format as a fallback chain; most clocks ship a single WebM and don't need it.

Video rules:

- Prefer WebM, with MP4 when browser compatibility requires it.
- Follow the size budget in [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md).
- `autoPlay` requires `muted` and `playsInline`.
- Do not use video when a static image communicates the same design.
- Provide a poster or a visually acceptable fallback when a blank frame would be harmful.

Audio must be user-initiated unless the product requirement explicitly says otherwise. Do not add autoplay audio to a clock.

## Importing and Using Fonts

Import a local font file and register it. **Established pattern since September 2026** (used in 20 of the ~26 September clocks — see e.g. `src/pages/2026/26-09/26-09-20/Clock.tsx`): append `?url` so Vite resolves it to a URL string, and load it through the shared `useSuspenseFontLoader` hook rather than a manual `@font-face` block:

```tsx
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import font from '@/assets/fonts/26fonts/26-09-20.otf?url';

export const assets = [font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_20',
  fontUrl: font,
};

const Clock_26_09_20 = () => {
  useSuspenseFontLoader([fontConfig]);
  // ...
};
```

```css
.digits {
  font-family: 'ClockFont_26_09_20', monospace;
}
```

`useSuspenseFontLoader` (defined in [`src/utils/fontLoader.tsx`](./src/utils/fontLoader.tsx)) suspends the component until the font is ready — preventing FOUC without a manual `font-display` decision — caches by `fontFamily`+`fontUrl` so re-renders don't reload, and reference-counts so `document.fonts` is cleaned up correctly when a clock unmounts. Give each clock a unique `fontFamily` (matching its own date, as above) to avoid cross-clock collisions in the shared `document.fonts` registry. Use this hook for any clock loading a local font; don't hand-roll a competing loader.

**Manual `@font-face` remains valid** for the rare case where Suspense-based loading is inappropriate (e.g. a font that must be available before first paint with no fallback period):

```css
@font-face {
  font-family: 'ClockDisplay_26_09_16';
  src: url('../../../../assets/fonts/26fonts/26-09-16-display.woff2')
    format('woff2');
  font-display: swap;
  font-style: normal;
  font-weight: 400;
}

.digits {
  font-family: 'ClockDisplay_26_09_16', monospace;
}
```

Font rules:

- Format, count, size, and location budgets are defined once in [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md) — follow that, don't restate numbers here that could drift out of sync.
- Use a unique family name per clock (matching the clock's own date, as in the example above) to prevent cross-clock collisions in the shared `document.fonts` registry.

### Using a Google Font instead of a local file

Load it via a `<link>` (not a blocking `@import` inside inline `<style>`) and add a `preconnect` hint:

```tsx
useEffect(() => {
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = 'https://fonts.gstatic.com';
  preconnect.crossOrigin = 'anonymous';

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href =
    'https://fonts.googleapis.com/css2?family=Finger+Paint&display=swap';

  document.head.append(preconnect, stylesheet);
  return () => {
    preconnect.remove();
    stylesheet.remove();
  };
}, []);
```

```css
.digits {
  font-family: 'Finger Paint', cursive;
}
```

A Google Font counts toward the family-count limit in `docs/PERFORMANCE.md` and still needs a `font-display` value (Google's `&display=swap` query param covers this). It does not go in the clock's `assets` array — that array is for locally bundled files Vite resolves at build time.

## Concrete Precedent — Where to Look Instead of Guessing

Rather than scanning the whole fleet for how something has been done, check one of these known-good September 2026 examples first:

| Need | Look at | Why |
|---|---|---|
| Font loading (the default pattern) | `26-09-20` | `useSuspenseFontLoader` + `?url` import, as documented above |
| Manual `@font-face` (the exception) | `26-09-16` | The one clock still using a hand-written `@font-face` block |
| Single background video | `26-09-20`, `26-09-19`, `26-09-21` | Plain `<video src={...}>`, no `<source>` child |
| Multiple images with preload-before-show | `26-09-05` | Local `preloadImages` helper gates rendering until all images decode |
| Many images (10+) in one clock | `26-09-18` | Largest current image count; check its directory structure and loading strategy before adding a similarly image-heavy clock |
| Three.js / WebGL render loop | `26-09-01` | The only clock using a `requestAnimationFrame` render loop; see `docs/CLOCKS.md` for why the verifier permits this |
| Smooth (sub-second) motion | any clock using `useSmoothClock` (`26-09-13`, `26-09-20`, others) | Correct hook for continuous hand/needle motion instead of `useClock`'s once-per-second updates |

This table reflects the fleet as of 2026-09-28. If you add a clock that establishes a new pattern worth reusing, add a row here rather than leaving the next person (or agent) to rediscover it by reading every clock.

## Building a Clock

Start from the smallest compliant structure:

```tsx
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

const Clock = () => {
  const time = useClock();

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div aria-hidden="true">{time.toLocaleTimeString()}</div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_YY_MM_DD';
```

Use `useClock()` for once-per-second displays and `useSmoothClock()` only when sub-second movement is visibly required:

```tsx
import { useSmoothClock } from '@/utils/hooks';

const time = useSmoothClock(50);
const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
```

Never create a `setInterval`, `setTimeout`, or manual timing loop to maintain displayed clock time. A Three.js/WebGL `requestAnimationFrame` render loop is permitted when it is only rendering and the clock value comes from shared time infrastructure. Never use deprecated clock hooks in new code.

Every clock must:

- export a default component;
- set `Clock.displayName` to its folder date;
- if it imports any local asset (font, image, or media), export an `assets` array registering it — a clock with no local assets can omit this export;
- render a semantic `<time dateTime="...">` or the shared `SRTime`;
- use `Clock.module.css` for static styles;
- use `100dvh` for a full-height root layout;
- guard array and object index access under strict TypeScript;
- avoid `any`, inline `<style>`, and global `document.body` mutations.

## Tiling Images and Layering Backgrounds

For a repeating texture or tile, use CSS `background-repeat` rather than rendering dozens of `<img>` elements:

```tsx
import tileImage from '@/assets/images/26_images/26-09/26-09-16/tile.webp';

export const assets = [tileImage];
```

```tsx
<main
  className={styles.container}
  style={{ '--tile-image': `url(${tileImage})` }}
>
  ...
</main>
```

```css
.container {
  background-image: var(--tile-image);
  background-repeat: repeat;
  background-size: 8rem 8rem;
  background-position: center;
}
```

Choose the repeat mode deliberately:

```css
/* Tile in both directions. */
background-repeat: repeat;

/* A horizontal strip. */
background-repeat: repeat-x;

/* A vertical strip. */
background-repeat: repeat-y;

/* Do not tile; show one image. */
background-repeat: no-repeat;
```

For multiple layers, list the most foreground layer first and keep the repeat/size/position lists in the same order:

```css
.container {
  background-image: var(--overlay), var(--tile);
  background-repeat: no-repeat, repeat;
  background-size: cover, 6rem 6rem;
  background-position: center, top left;
}
```

Use `background-size: cover` for a full-bleed image that may crop, `contain` when the entire artwork must remain visible, and explicit dimensions when a tile's scale is part of the design. Do not use `background-size: cover` for a texture that must retain its natural tile scale.

## Current Clock Rules

- Use React + TypeScript + Vite patterns already established by the project.
- Keep artwork-specific implementation local to its date directory.
- Use shared time hooks and infrastructure.
- Export every imported image, font, and media asset through the clock's `assets` array.
- Use CSS Modules for static styles; inline styles only for genuinely dynamic values.
- Do not use Tailwind for new work.
- Avoid fixed-pixel layout dimensions; prefer `dvh`, `vw`, `vmin`, `rem`, `%`, and `fr`.
- Provide semantic time/accessibility output.
- Provide an appropriate `prefers-reduced-motion` treatment for animated clocks.
- Do not introduce scrolling unless the artwork requires it.
- Do not add dependencies when existing infrastructure is sufficient.
- Do not mutate global styles or unrelated clock components.

## Timekeeping

Use `useClock` or `useSmoothClock`.

Do not use `setInterval`, `setTimeout`, `Date.now()`, or a manual `requestAnimationFrame` loop as an independent source of displayed clock time.

A Three.js/WebGL render loop is allowed when it only renders frames and the displayed time comes from the shared clock infrastructure.

## Historical Code

Do not broad-refactor historical clocks. Modify them only for a concrete reason such as:
- production breakage;
- build/deployment failure;
- security;
- serious accessibility issues;
- shared-infrastructure incompatibility;
- material browser/performance failure.

## Assets

Keep assets in established directories. Do not rename historical assets or introduce unexplained root-level media. Check asset size and format against `docs/PERFORMANCE.md`.

## Conformance Check ("does this conform to our standards?")

When the owner asks whether code, a clock, or a change conforms to the technical standards (or asks any close variant: "check standards", "bring it up to standard", "does this meet our rules?"), do not answer from memory and do not just report. **Check, fix, re-check, report.** Work quickly and in this order:

1. **Run the checker.** `npm run conform -- --fix`
   - With no arguments it checks clocks with uncommitted changes (or the last commit if the tree is clean).
   - Use `--path YY-MM-DD` for a named clock, or `--all-current` for every clock from 26-09 onward.
   - Historical clocks (before September 2026) are skipped unless named with `--path`. Do not fix them to make the archive uniform.
2. **Read the result by level:**
   - `FIXED` - already corrected by `--fix`. Just report it.
   - `FAIL` - breaks the clock contract. Fix it by hand (smallest change), then re-run.
   - `REVIEW` - a budget or heuristic finding. Decide case by case (see below); do not silently ignore it.
3. **Fix every `FAIL` yourself.** Typical cases: `<img>` missing `alt`, a missing asset file, `document.body` mutation, Tailwind in a clock, anything reported by `[verifier]`.
4. **Handle `REVIEW` items:**
   - `prefers-reduced-motion` missing: add a `@media (prefers-reduced-motion: reduce)` block that pauses, slows, or simplifies non-essential motion while keeping the time readable.
   - Unused imported asset: remove the import and its `assets` entry.
   - Fixed `px` layout values: convert to `dvh`/`vw`/`vmin`/`rem`/`%`/`fr` when it does not change the artwork; otherwise leave and say why.
   - Asset over budget (image 200KB, video 2MB, font 100KB) or more than 2 fonts: **do not** delete, replace, or re-encode artwork on your own. Report the file, its size, and the budget, and ask.
   - String `className`, `document.head`, `Date.now()`, remote URL: confirm each is legitimate per this file, otherwise fix it.
5. **Re-run** `npm run conform -- --path <date>` until there are no `FAIL` lines.
6. **Run the gates:** `npm run type-check`, `npm run test:run` if shared code changed, and `npm run build`. Do a browser smoke check for clock changes when a browser is available.
7. **Report** in this shape: what was auto-fixed, what you fixed by hand, what remains under REVIEW (with file and size where relevant), and exactly which commands you ran. Never claim a check passed that you did not run.

Rules for this procedure:
- Fix only what the standards require. No unrelated refactors, no renaming or moving existing assets.
- `npm run conform` covers the mechanical standards. Anything it cannot see (visual result, layout on mobile portrait/landscape/tablet) still needs the smoke check or an explicit "not verified" in the report.
- If a standard in this file and the checker ever disagree, this file and `docs/CLOCKS.md` win; fix the checker.

## Validation Commands

Use the command that matches the change:

```bash
npm run build                         # required before completion
npm run build:with-types              # build plus TypeScript (full fleet)
npm run type-check                    # TypeScript check for in-scope code (tsconfig.ci.json)
npm run test:run                      # behavior or shared utility changes
npm run lint                          # lint-sensitive changes
npm run verify:clocks:changed         # verify only changed clock pages
npm run conform                       # full conformance check (add -- --fix to auto-fix)
npm run verify:clocks -- --path 26-09-16  # verify specific clock
# npm run status                      # reminder only; docs/STATUS.md is updated manually
```

Run a browser/visual smoke check for clock changes.

The repository may contain pre-existing lint, type, or legacy clock failures. Record them accurately instead of weakening rules or hiding output. Never claim a check passed unless it was actually run.

## Change Discipline

Prefer small, focused changes. Do not modify unrelated clock implementations. Shared infrastructure should remain compatible with the archive where reasonably possible.

## Source-of-Truth Documents

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): authoritative application architecture and historical/current boundary.
- [`docs/CLOCKS.md`](./docs/CLOCKS.md): current clock contract.
- [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md): asset budgets, fonts, caching, and bundle limits.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md): project priorities and technical debt.
- [`docs/STATUS.md`](./docs/STATUS.md): recorded health checks and fleet inventory.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md): human contribution workflow.
- [`src/utils/assetLoader.ts`](./src/utils/assetLoader.ts): shared asset loading interfaces.
- [`src/hooks/useClockPage.ts`](./src/hooks/useClockPage.ts): dynamic clock loading and asset registration.

This file is the single canonical entry point for AI-assisted changes; `docs/AI_DEVELOPMENT_GUIDE.md` is retained only as a compatibility pointer to this file.
