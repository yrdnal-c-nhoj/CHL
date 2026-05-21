# Clock Architecture

> Implementation patterns, hooks, and CSS conventions for clock components.
> Workflow and policy: [`DEVELOPMENT.md`](./DEVELOPMENT.md).

---

## Directory Structure

```
src/
├── pages/YYYY/YY-MM/YY-MM-DD/
│   ├── Clock.tsx              # Your clock component
│   └── Clock.module.css       # Styles
├── templates/
│   ├── BaseClock.tsx          # Starter template
│   └── BaseClock.module.css
├── utils/
│   ├── hooks/
│   │   ├── useClockTime.ts    # 1s updates — static displays
│   │   └── useSmoothClock.ts  # 60fps RAF — animations
│   └── fontLoader.tsx         # Suspense-based font loading
└── types/clock.ts
```

---

## Time Hooks

| Hook | Update rate | When to use |
|------|-------------|-------------|
| `useClockTime()` | 1s | Static time displays |
| `useSmoothClock()` | 60fps RAF | Smooth animations |
| `useMillisecondClock()` | 60fps RAF | Millisecond precision |

```tsx
// Static display
const Clock: React.FC = () => {
  const time = useClockTime();
  return <time dateTime={time.toISOString()}>{time.toLocaleTimeString()}</time>;
};

// Smooth animation
const AnimatedClock: React.FC = () => {
  const time = useSmoothClock();
  const rotation = (time.getMilliseconds() / 1000) * 360;
  return <div style={{ transform: `rotate(${rotation}deg)` }} />;
};
```

**Never use raw `setInterval` in clock components.**

---

## BaseClock Template

All new clocks should follow this structure:

```tsx
import React, { useMemo } from 'react';
import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

// Asset exports for preloading
import bgImage from '@/assets/images/YY-MM/YY-MM-DD/bg.webp';
export const assets = [bgImage];

// Font config
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'MyFont',
    fontUrl: '/fonts/YY-MM-DD-font.woff2',
  },
];

const Clock: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  const formatted = useMemo(() => {
    return time.toLocaleTimeString();
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()}>{formatted}</time>
    </main>
  );
};

export default Clock;
```

### Font Loading

```tsx
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  return <div style={{ fontFamily: 'MyClockFont' }}>12:00</div>;
};
```

The component must be wrapped in `<Suspense>` — handled by `ClockPage.tsx`.

### FontConfig Interface

```tsx
interface FontConfig {
  fontFamily: string;   // CSS font-family name
  fontUrl: string;     // Path to font file
  fontWeight?: string; // e.g. '400', '700'
  fontStyle?: string;  // e.g. 'normal', 'italic'
}
```

---

## CSS Conventions

- **Use CSS Modules** (`.module.css`) for all clock styles
- **Use Tailwind** for UI components (navigation, layout)
- **Use `useMemo`** for expensive style calculations
- **Use `useRef`** for canvas/animation references — never `document.querySelector`

```tsx
// Good — scoped, composable
<main className={styles.container}>
  <time className={styles.display} dateTime={...}>
    {formatted}
  </time>
</main>

// Cleanup — always clear timers/RAF on unmount
useEffect(() => {
  const interval = setInterval(/* ... */, 1000);
  return () => clearInterval(interval);
}, []);
```

---

## Asset Exports

Export assets for the preloading pipeline:

```tsx
import bgImage from '@/assets/images/YY-MM/YY-MM-DD/bg.webp';
export const assets = [bgImage];
```

Supported types: images (`.webp`, `.png`, `.jpg`), videos (`.mp4`, `.webm`), audio (`.mp3`, `.wav`).

---

## Common Patterns

### Conditional Rendering Based on Time

```tsx
const ConditionalClock: React.FC = () => {
  const time = useClockTime();
  const isNight = time.getHours() < 6 || time.getHours() > 18;

  return (
    <main className={isNight ? styles.night : styles.day}>
      <time dateTime={time.toISOString()}>{time.toLocaleTimeString()}</time>
    </main>
  );
};
```

### CSS Animation Sync

```tsx
const AnimatedClock: React.FC = () => {
  const time = useSmoothClock();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const rotation = (seconds + ms / 1000) * 6; // 6 degrees per second

  return (
    <div className={styles.hand} style={{ transform: `rotate(${rotation}deg)` }} />
  );
};
```

---

## Performance

- Use `useClockTime` for static displays (1s updates)
- Use `useSmoothClock` only for smooth animations — it runs at 60fps
- Memoize expensive calculations with `useMemo`
- Keep bundles under **5 MB** per clock
- Use **WebP** images; prefer **WOFF2** fonts

---

_Cubist Heart Laboratories_