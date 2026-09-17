# AI Development Guide

**Required starting point for every AI-assisted change in BorrowedTime.**

Before editing code, an agent must read this document and the standards it
links to. When a task changes a clock, also read
[`CLOCK_STANDARDS.md`](./CLOCK_STANDARDS.md). When a task changes assets,
fonts, loading, or bundle behavior, also read
[`PERFORMANCE.md`](./PERFORMANCE.md).

This guide describes the repository's preferred patterns. Existing legacy
clocks may not follow every rule; do not rewrite unrelated clocks while
working on a focused task.

## 1. Required Agent Workflow

1. Read this guide.
2. Identify the target clock or shared module before editing.
3. Read the target `Clock.tsx`, `Clock.module.css`, and any helper it uses.
4. Search for an existing project pattern before introducing a new one.
5. Make the smallest complete change that preserves the visual behavior.
6. Keep assets local and register every asset used by a clock in `assets`.
7. Run the narrowest relevant check, then run `npm run build`.
8. For clock changes, run the clock verifier for the target date when practical:
   `node scripts/verify-all-clocks.js --path YY-MM-DD`.
9. Report changed files, checks run, and any remaining failures.

Do not silently replace a broken asset, swallow an import error, or claim a
check passed when it was not run.

## 2. Project Layout

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

Use the `@/` alias for source imports. Keep a clock's implementation and
styles in its date directory unless a utility is genuinely shared.

### Asset locations

Use the existing asset directories:

```text
src/assets/images/
src/assets/fonts/
src/assets/icons/
```

Keep a new asset near the other assets for its year/month or project category.
Do not rename or move existing assets to make a task easier.

## 3. Importing Images

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

Prefer CSS `background-image` for decorative art and `<img>` for meaningful
content. Meaningful images need useful `alt` text; decorative images use
`alt=""` or are backgrounds.

### Responsive images

For an image that is content rather than a background, use `srcSet` and
`sizes` when multiple local resolutions exist:

```tsx
<img
  src={image}
  srcSet={`${smallImage} 640w, ${largeImage} 1280w`}
  sizes="100vw"
  alt="..."
  loading="lazy"
/>
```

Do not use `loading="lazy"` for the primary above-the-fold image if it delays
the clock's first paint.

### Image rules

- Prefer WebP or AVIF; use PNG for transparency and SVG for simple scalable
  artwork.
- Keep each image under 200 KB when possible.
- Do not embed base64 data or fetch images from remote providers.
- Do not add an asset to `assets` if it is never rendered.
- Avoid `object-fit: cover` when cropping would remove important artwork;
  choose `contain` or an explicit aspect-ratio treatment instead.

## 4. Importing Video and Other Media

Import local video the same way as an image:

```tsx
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-10/background.webm';
```

Register it in `assets` even though the page loader avoids preloading large
video files:

```tsx
export const assets = [backgroundVideo, overlayImage];
```

Use a background video with the required playback attributes:

```tsx
<video
  className={styles.backgroundVideo}
  autoPlay
  loop
  muted
  playsInline
  preload="none"
  aria-hidden="true"
>
  <source src={backgroundVideo} type="video/webm" />
</video>
```

Use `poster` when the first frame matters:

```tsx
<video
  poster={posterImage}
  autoPlay
  loop
  muted
  playsInline
  preload="none"
>
  <source src={video} type="video/mp4" />
</video>
```

Video rules:

- Prefer WebM, with MP4 when browser compatibility requires it.
- Keep each video under 2 MB.
- `autoPlay` requires `muted` and `playsInline`.
- Use `preload="none"` for decorative or below-the-fold video.
- Do not use video when a static image communicates the same design.
- Provide a poster or a visually acceptable fallback when a blank frame would
  be harmful.

Audio must be user-initiated unless the product requirement explicitly says
otherwise. Do not add autoplay audio to a clock.

## 5. Importing and Using Fonts

Import a local font file and register it:

```tsx
import clockFont from '@/assets/fonts/26fonts/26-09-16-display.woff2';

export const assets = [clockFont];
```

For a clock-specific font, define the face in the clock's CSS module:

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

When the URL must be resolved by Vite, import it in `Clock.tsx` and pass it
through a CSS custom property:

```tsx
import clockFont from '@/assets/fonts/26fonts/26-09-16-display.woff2';

<main className={styles.container} style={{ '--clock-font': `url(${clockFont})` }}>
  <span className={styles.digits}>12:34:56</span>
</main>
```

```css
@font-face {
  font-family: 'ClockDisplay_26_09_16';
  src: var(--clock-font) format('woff2');
  font-display: swap;
}
```

If a shared font-loading utility is needed, use
[`src/utils/fontLoader.tsx`](../src/utils/fontLoader.tsx) rather than creating
another global loader. Avoid injecting `<style>` tags or mutating global
styles from a clock.

Font rules:

- Use local files only; do not add Google Fonts or another remote provider.
- Prefer WOFF2; TTF/OTF are accepted when that is the supplied source.
- Use no more than two custom families per clock.
- Keep each font file under 100 KB when possible.
- Use `swap` or `fallback` by default; use `block` only for intentionally
  art-directed display text.
- Use a unique family name per clock to prevent cross-clock collisions.

## 6. Building a Clock

Start from the smallest compliant structure:

```tsx
import { useClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets: string[] = [];

const Clock = () => {
  const time = useClock();

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div aria-hidden="true">{time.toLocaleTimeString()}</div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_YY_MM_DD';
```

Use `useClock()` for once-per-second displays and `useSmoothClock()` only when
sub-second movement is visibly required:

```tsx
import { useSmoothClock } from '@/utils/hooks';

const time = useSmoothClock(50);
const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
```

Never create a `setInterval`, `setTimeout` animation loop, or manual
`requestAnimationFrame` loop inside a clock. Never use deprecated clock hooks
in new code.

Every clock must:

- export a default component;
- set `Clock.displayName` to its folder date;
- export an `assets` array, including fonts, images, and media;
- render a semantic `<time dateTime="...">` or the shared `SRTime`;
- use `Clock.module.css` for static styles;
- use `100dvh` for a full-height root layout;
- guard array and object index access under strict TypeScript;
- avoid `any`, inline `<style>`, and global `document.body` mutations.

## 7. Tiling Images and Layering Backgrounds

For a repeating texture or tile, use CSS `background-repeat` rather than
rendering dozens of `<img>` elements:

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

For multiple layers, list the most foreground layer first and keep the
repeat/size/position lists in the same order:

```css
.container {
  background-image: var(--overlay), var(--tile);
  background-repeat: no-repeat, repeat;
  background-size: cover, 6rem 6rem;
  background-position: center, top left;
}
```

Use `background-size: cover` for a full-bleed image that may crop, `contain`
when the entire artwork must remain visible, and explicit dimensions when a
tile's scale is part of the design. Do not use `background-size: cover` for a
texture that must retain its natural tile scale.

## 8. Styling and Layout Rules

- Use CSS Modules for static styles.
- Use inline styles only for genuinely dynamic values such as a computed angle
  or an imported asset URL passed through a CSS variable.
- Do not add Tailwind to a clock or migrate existing CSS to Tailwind.
- Prefer `dvh`, `vw`, `vmin`, `rem`, `%`, and `fr` for responsive layout.
- Avoid fixed pixel layout dimensions; pixel values are acceptable for a
  deliberately sized visual detail or asset tile.
- Do not introduce page scrolling unless explicitly requested.
- Do not mutate global styles or unrelated clock components.

## 9. Validation Commands

Use the command that matches the change:

```bash
npm run build                         # required before completion
npm run build:with-types              # build plus TypeScript
npm run test:run                      # behavior or shared utility changes
npm run lint                          # lint-sensitive changes
node scripts/verify-all-clocks.js --path 26-09-16
npm run status                        # refresh docs/STATUS.md
```

The repository may contain pre-existing lint, type, or legacy clock failures.
Record them accurately instead of weakening rules or hiding output.

## 10. Source-of-Truth Documents

- [`CLOCK_STANDARDS.md`](./CLOCK_STANDARDS.md): clock contract and prohibited
  patterns.
- [`PERFORMANCE.md`](./PERFORMANCE.md): asset budgets, fonts, caching, and
  bundle limits.
- [`ROADMAP.md`](./ROADMAP.md): project priorities and known debt.
- [`src/utils/assetLoader.ts`](../src/utils/assetLoader.ts): shared asset
  loading interfaces and preload behavior.
- [`src/hooks/useClockPage.ts`](../src/hooks/useClockPage.ts): dynamic clock
  loading and asset registration behavior.
