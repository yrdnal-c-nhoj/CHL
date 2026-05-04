# Clock Architecture

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
│   │   └── useClock.ts         # Legacy
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
| `useNtpClock` | 60fps RAF | NTP-synced |

### Examples

```tsx
// Static display
const Clock: React.FC = () => {
  const time = useClockTime();
  return <div>{time.toLocaleTimeString()}</div>;
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
import bgImage from '../../../assets/images/YY-MM/YY-MM-DD/bg.webp';
export { bgImage };

// 2. Font configuration
const fontConfigs: FontConfig[] = [
  { fontFamily: 'MyFont', fontUrl: '/fonts/my-font.woff2' },
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

### Font File Requirements

- **Format**: WOFF2 only (better compression than TTF)
- **Naming**: `YY-MM-DD-descriptive-name.woff2`
- **Location**: `src/assets/fonts/YYYY/`
- **Public Path**: `/fonts/YY-MM-DD-name.woff2`

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
import bgImage from '../../../assets/images/26-04/26-04-30/bg.webp';

// Export for ClockPage preloader
export { bgImage };

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
4. **Export assets** for preloading to prevent layout shift
5. **Keep bundles under 5MB** per clock
6. **Use WebP images** for better compression
7. **Prefer WOFF2 fonts** over TTF

## Adding a New Clock

### Option 1: Automated (Recommended)

```bash
npm run clock:new
```

This creates:
- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx` (from MasterTemplate)
- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.module.css`

### Option 2: Manual

1. Create `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx` using BaseClock as template
2. Create `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.module.css`
3. Add assets to `src/assets/images/YY-MM/YY-MM-DD/`
4. Add fonts to `src/assets/fonts/YYYY/`
5. Add entry to `src/context/clockpages.json`:

```json
{
  "clocks": [
    {
      "date": "26-04-30",
      "title": "My Clock Title",
      "path": "src/pages/2026/26-04/26-04-30/Clock.tsx",
      "tags": ["minimal", "typography"]
    }
  ]
}
```

6. Verify with `npm run build` and `npm run type-check`
