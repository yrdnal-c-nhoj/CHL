# Clock Architecture Standards

This document defines the standardized architecture for BorrowedTime clock components.

## Directory Structure

```
src/
├── templates/           # Starter templates
│   ├── BaseClock.tsx   # ⭐ Recommended starting point
│   ├── BaseClock.module.css
│   └── index.ts
├── utils/
│   ├── hooks/          # Standardized clock hooks
│   │   ├── index.ts    # Central exports
│   │   ├── useClockTime.ts
│   │   ├── useSmoothClock.ts
│   │   └── useClock.ts
│   └── fontLoader.tsx  # Font loading utilities
└── types/
    └── clock.ts        # Shared TypeScript types
```

## Standard Hooks (from `@/utils/hooks`)

| Hook | Purpose | Update Rate |
|------|---------|-------------|
| `useClockTime` | Basic time display | 1 second |
| `useSecondClock` | Alias for useClockTime | 1 second |
| `useMillisecondClock` | Smooth animations | 60fps RAF |
| `useNtpClock` | NTP-synced precision | 60fps RAF |

```tsx
import { useClockTime } from '@/utils/hooks';

const Clock: React.FC = () => {
  const time = useClockTime(); // Date object, updates every second
  return <div>{time.toLocaleTimeString()}</div>;
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
  { fontFamily: 'MyFont', fontUrl: '/fonts/my-font.woff2' }
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

## Font Loading

```tsx
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const fontConfigs: FontConfig[] = [
  { fontFamily: 'MyFont', fontUrl: myFontFile }
];

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs); // Suspends until fonts load
  return <div style={{ fontFamily: 'MyFont' }}>12:00</div>;
};
```

The component must be wrapped in `<Suspense>` in the parent (handled by `ClockPage.tsx`).

## File Locations

- **Clock component**: `src/pages/YY-MM/YY-MM-DD/Clock.tsx`
- **Styles**: `src/pages/YY-MM/YY-MM-DD/Clock.module.css`
- **Assets**: `src/assets/images/YY-MM/YY-MM-DD/`
- **Fonts**: `src/assets/fonts/YY-MM-DD-name.ttf`

## Adding a New Clock

1. Create `src/pages/YY-MM/YY-MM-DD/Clock.tsx` using BaseClock as template
2. Create `src/pages/YY-MM/YY-MM-DD/Clock.module.css`
3. Add assets to `src/assets/images/YY-MM/YY-MM-DD/`
4. Add entry to `src/context/clockpages.json`
