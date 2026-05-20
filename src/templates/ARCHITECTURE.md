# Clock Architecture

> **Workflow (scaffold, manual registry, finalize, CI):** [`docs/DEVELOPMENT.md`](../../docs/DEVELOPMENT.md) — canonical.  
> This file covers **component structure, hooks, and CSS patterns** only.

## Structure

```text
src/
├── templates/
│   ├── BaseClock.tsx      # Starting point
│   └── BaseClock.module.css
├── utils/
│   ├── hooks/
│   │   ├── useClockTime.ts     # 1s updates
│   │   ├── useSmoothClock.ts   # 60fps RAF
│   │   └── index.ts            # Hook barrel file
│   ├── fontLoader.tsx          # Suspense-based font loading
│   └── clockUtils.ts           # Time formatting & math
└── types/
    └── clock.ts
```

## Hooks

| Hook | Updates | Use Case |
|------|---------|----------|
| `useClockTime` | 1s | Static displays |
| `useSmoothClock` | 60fps RAF | Smooth animations |
| `useMillisecondClock` | 60fps RAF | Millisecond precision |

### Examples

```tsx
// Static display
const Clock: React.FC = () => {
  const time = useClockTime();
  return <time dateTime={time.toISOString()}>{time.toLocaleTimeString()}</time>;
};
```

```tsx
// Smooth animation
const SmoothClock: React.FC = () => {
  const time = useSmoothClock();
  const rotation = (time.getMilliseconds() / 1000) * 360;
  return <div style={{ transform: `rotate(${rotation}deg)` }} />;
};
```

## BaseClock Architecture

All new clocks should follow this structure:

```tsx
import React, { useMemo } from 'react';
import type { FontConfig } from '@/types/clock';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

// 1. Export assets for preloading
import bgImage from '@/assets/images/YY-MM/YY-MM-DD/bg.webp';
export const assets = [bgImage];

// 2. Font configuration
const fontConfigs: FontConfig[] = [
  { fontFamily: 'MyFont', fontUrl: new URL('@/assets/fonts/YYYY/YY-MM-DD-font.woff2', import.meta.url).href },
];

// 3. Component
const Clock: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  const formatted = useMemo(() => {
    return time.toLocaleTimeString();
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={formatted}>{formatted}</time>
    </main>
  );
};

export default Clock;
```

## Key Principles

1. **CSS Modules**: Always use `.module.css` for scoped styles
2. **Asset Exports**: Export images/fonts for the preloading pipeline
3. **Semantic HTML**: Use `<time datetime="...">` for accessibility
4. **Suspense**: Wrap components using `useSuspenseFontLoader` in `<Suspense>`
5. **Memoization**: Use `useMemo` for expensive calculations
6. **Path Aliases**: Use `@/utils/hooks` and `@/types/clock`
7. **Cleanup**: Clear all timers/RAF on unmount
8. **No Direct DOM**: Use `useRef` for canvas/animation references


## Font Loading Deep Dive

### FontConfig Interface

```tsx
interface FontConfig {
  fontFamily: string;      // CSS font-family name
  fontUrl: string;         // Path to font file
  fontWeight?: string;     // e.g., '400', '700'
  fontStyle?: string;      // e.g., 'normal', 'italic'
}
```

### Font File Requirements (Current Policy)

- **Format**: Prefer WOFF2 (better compression than TTF).
- **Naming**: `YY-MM-DD-descriptive-name.woff2` (or the equivalent ext allowed by the repository policy).
- **Location**: `src/assets/fonts/YYYY/`
- **Public Path**: `/fonts/YY-MM-DD-name.woff2` (used by the font preloading pipeline).

If your repo policy supports additional font formats (e.g., TTF/OTF), keep the naming convention consistent so the automation scripts can reliably organize and rename fonts.


### Complete Font Loading Example

```tsx
import React, { Suspense } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

const fontConfigs: FontConfig[] = [
  { 
    fontFamily: 'MyClockFont', 
    fontUrl: '/fonts/26-04-30-myfont.woff2',
    fontWeight: '400'
  },
];

const ClockContent: React.FC = () => {
  // Suspends until fonts load
  useSuspenseFontLoader(fontConfigs);
  
  return (
    <div style={{ fontFamily: 'MyClockFont' }}>
      12:00
    </div>
  );
};

// Wrap in Suspense (handled by ClockPage.tsx parent)
const Clock: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ClockContent />
  </Suspense>
);
```

## Time Formatting Utilities

```tsx
// Use padStart for consistent digit display
const pad = (num: number) => num.toString().padStart(2, '0');

const hours = pad(time.getHours());
const minutes = pad(time.getMinutes());
const seconds = pad(time.getSeconds());

// ISO format for datetime attribute
const isoString = time.toISOString();
```

## Font Loading

```tsx
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const fontConfigs: FontConfig[] = [
  { fontFamily: 'MyFont', fontUrl: myFontFile },
];

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs); // Suspends until fonts load
  return <div style={{ fontFamily: 'MyFont' }}>12:00</div>;
};
```

The component must be wrapped in `<Suspense>` in the parent (handled by `ClockPage.tsx`).

## File Locations

| File Type | Path | Required |
|-----------|------|----------|
| **Clock component** | `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx` | ✅ Yes |
| **Styles** | `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.module.css` | ✅ Yes |
| **Images** | `src/assets/images/YY-MM/YY-MM-DD/` | Optional |
| **Fonts** | `src/assets/fonts/YYYY/YY-MM-DD-name.woff2` | Optional |

## Common Patterns

### Pattern: Conditional Rendering Based on Time

```tsx
const ConditionalClock: React.FC = () => {
  const time = useClockTime();
  const isNight = time.getHours() < 6 || time.getHours() > 18;
  
  return (
    <main className={isNight ? styles.night : styles.day}>
      <time dateTime={time.toISOString()}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};
```

### Pattern: CSS Animation Sync

```tsx
const AnimatedClock: React.FC = () => {
  const time = useSmoothClock();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();
  
  // Calculate rotation for smooth second hand
  const rotation = (seconds + ms / 1000) * 6; // 6 degrees per second
  
  return (
    <div 
      className={styles.hand}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
};
```

### Pattern: Background Image Preloading

```tsx
import bgImage from '@/assets/images/2026/26-04/26-04-30/bg.webp';

// Export for ClockPage preloader
export const assets = [bgImage];

const Clock: React.FC = () => {
  return (
    <main 
      className={styles.container}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Clock content */}
    </main>
  );
};
```

## Performance Considerations

1. **Use `useClockTime`** for static displays (1s updates)
2. **Use `useSmoothClock`** only for smooth animations (60fps cost)
3. **Memoize expensive calculations** with `useMemo`
4. **Export `assets` for preloading**
   - Clocks may export image/video/audio URLs via `export const assets`.
   - The loader attempts to preload each asset type and remains **fail-open** (missing/broken assets should not prevent the clock from mounting).

5. **Keep bundles under 5MB** per clock
6. **Use WebP images** for better compression
7. **Prefer WOFF2 fonts** over TTF


## Adding a New Clock

See **[`docs/DEVELOPMENT.md#new-clock-workflow`](../../docs/DEVELOPMENT.md#new-clock-workflow)** for the full checklist (scaffold → **manual** `clockpages.json` → finalize → CI).

After scaffolding, implement using the patterns in this file (`BaseClock`, hooks, CSS modules, asset exports).
