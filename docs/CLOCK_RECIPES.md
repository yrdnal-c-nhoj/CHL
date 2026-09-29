# Clock Recipes

Code patterns for building current clocks (September 2026 onward).

**These recipes illustrate rules; they do not own them.** Requirements live in `docs/CLOCKS.md`; size, format, and count budgets live in `docs/PERFORMANCE.md`. If a recipe conflicts with either, that document wins — fix the recipe.

For a new clock, start with `npm run new-clock YY-MM-DD "Title" tag1 tag2`, which scaffolds from `src/templates/BaseClock.tsx`. The recipes below are for the parts the scaffold does not cover.

Examples were verified against the repository on **2026-09-29**. Prefer the `grep` commands in `AGENTS.md` over trusting a dated example.

## Contents

1. [Minimal clock](#minimal-clock)
2. [Images](#images)
3. [Video](#video)
4. [Fonts](#fonts)
5. [Tiling and layered backgrounds](#tiling-and-layered-backgrounds)
6. [Verified examples](#verified-examples)

---

## Minimal clock

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

A clock with no local assets may omit the `assets` export. Any clock that imports an image, font, or video must export it (see below).

For continuous hand or needle motion, use `useSmoothClock` instead:

```tsx
import { useSmoothClock } from '@/utils/hooks';

const time = useSmoothClock(50);
const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
```

`SRTime` takes a single `time: Date` prop and renders a visually hidden `<time dateTime=...>`.

---

## Images

Import at the top of `Clock.tsx` and register in `assets`:

```tsx
import backgroundImage from '@/assets/images/26_images/26-09/26-09-16/background.webp';

export const assets = [backgroundImage];
```

Use the imported URL in JSX or in a CSS variable:

```tsx
<img className={styles.logo} src={logoImage} alt="BorrowedTime logo" />
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

Guidance:

- Decorative art: CSS `background-image`. Meaningful content: `<img>` with useful `alt` text. Decorative `<img>` uses `alt=""`.
- Do not register an asset that is never rendered.
- Use `contain` or an explicit aspect ratio when `cover` would crop important artwork.
- Do not lazy-load the primary above-the-fold image if it delays first paint.
- Format and size limits: `docs/PERFORMANCE.md`.

Responsive content images, when several local resolutions exist:

```tsx
<img
  src={image}
  srcSet={`${smallImage} 640w, ${largeImage} 1280w`}
  sizes="100vw"
  alt="..."
  loading="lazy"
/>
```

Preloading several images before showing the clock: see `26-09-05` (`preloadImages` helper).

---

## Video

Import and register like an image:

```tsx
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-10/background.webm';

export const assets = [backgroundVideo];
```

Default pattern (used by most current video clocks; see `26-09-20`): a plain `<video>` with a direct `src`.

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

Add `poster={posterImage}` when a blank first frame would look wrong.

Use a `<source type="...">` child only when serving more than one format as a fallback chain (see `26-09-19`, `26-09-21`, `26-09-29`).

Rules:

- `autoPlay` requires `muted` and `playsInline`.
- Do not use video where a still image communicates the same design.
- Audio must be user-initiated; never autoplay audio.
- Format and size limits: `docs/PERFORMANCE.md`.

> **Open decision (delete when resolved):** `docs/PERFORMANCE.md` asks for `preload="none"` on background video, but most current clocks omit it and this recipe follows them. Either add it to the recipe and the clocks, or remove it from `PERFORMANCE.md`. Check that autoplay still starts before choosing.

---

## Fonts

### Default: local font through the shared hook

Append `?url` so Vite resolves a URL string, register it in `assets`, and load it with `useSuspenseFontLoader`. Do not hand-roll a competing loader.

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

What the hook does: suspends the component until the font is ready (no flash of unstyled text), caches by `fontFamily` + `fontUrl`, and reference-counts so `document.fonts` is cleaned up when the clock unmounts.

Give each clock a unique `fontFamily` that includes its own date. The `document.fonts` registry is shared across clocks.

Font count, format, size, and `font-display` policy: `docs/PERFORMANCE.md`.

### Exception: manual `@font-face`

Use only where Suspense-based loading is inappropriate (for example a font that must exist at first paint with no fallback period). See the CSS in `26-09-23`:

```css
@font-face {
  font-family: 'ClockDisplay_26_09_23';
  src: url('../../../../assets/fonts/26fonts/26-09-23.ttf') format('truetype');
  font-display: swap;
  font-style: normal;
}
```

Still register the file in `assets`. Do not combine this with `useSuspenseFontLoader` for the same font; `26-09-27` does both and is not a model to copy.

### Google Fonts instead of a local file

Load with a `<link>` (not an `@import` inside inline `<style>`) and add a `preconnect`:

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

A Google Font counts toward the family limit in `docs/PERFORMANCE.md`. It does **not** go in `assets`, which is only for locally bundled files.

---

## Tiling and layered backgrounds

Tile with CSS `background-repeat`, not many `<img>` elements:

```tsx
import tileImage from '@/assets/images/26_images/26-09/26-09-16/tile.webp';

export const assets = [tileImage];
```

```tsx
<main
  className={styles.container}
  style={{ '--tile-image': `url(${tileImage})` }}
>
```

```css
.container {
  background-image: var(--tile-image);
  background-repeat: repeat;      /* or repeat-x, repeat-y, no-repeat */
  background-size: 8rem 8rem;
  background-position: center;
}
```

For layers, list the foreground first and keep the repeat, size, and position lists in the same order:

```css
.container {
  background-image: var(--overlay), var(--tile);
  background-repeat: no-repeat, repeat;
  background-size: cover, 6rem 6rem;
  background-position: center, top left;
}
```

Size guidance: `cover` for a full-bleed image that may crop; `contain` when the whole artwork must stay visible; explicit dimensions when a tile's scale is part of the design. Do not use `cover` on a texture that must keep its natural tile size.

---

## Verified examples

Checked 2026-09-29. If one no longer matches, use the `grep` commands in `AGENTS.md` and update this table.

| Need | Example | Note |
|---|---|---|
| Font via shared hook | `26-09-20` | `?url` import, `useSuspenseFontLoader`, font in `assets` |
| Manual `@font-face` | `26-09-23` | CSS-declared font; also loads Google Fonts |
| Plain background video | `26-09-20` | Direct `src`, no `<source>` |
| Video with `<source>` | `26-09-19`, `26-09-21`, `26-09-29` | Only when a fallback chain is needed |
| Preload several images before showing | `26-09-05` | Local `preloadImages` helper |
| Many images | `26-09-18` | 10 image imports, the highest currently |
| Three.js render loop | `26-09-01` | Only current clock with a `renderer.render()` loop; time from `useClock` |
| Smooth motion | `26-09-13`, `26-09-20` | `useSmoothClock` |

When you introduce a pattern worth reusing, add a row here.
