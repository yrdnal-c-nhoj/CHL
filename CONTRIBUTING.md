# Contributing to BorrowedTime

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm run test:run

# Lint and format
npm run lint
npm run format
```

## Canonical Clock Template

Every clock in `src/pages/YY-MM/YY-MM-DD/Clock.tsx` must follow this structure:

```typescript
import React, { useMemo } from 'react';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

// 1. Asset exports (required for preloading)
import bgImage from '@/assets/images/26_images/YY-MM/YY-MM-DD/bg.webp';
import fontUrl from '@/assets/fonts/26fonts/YY-MM-DD.ttf?url';
export const assets = [bgImage, fontUrl];

// 2. Font config
const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont_YY_MM_DD', fontUrl }];

// 3. Component
const ClockComponent = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const timeString = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return `${h}${m}${s}`;
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      {/* clock UI */}
    </main>
  );
};

// 4. Memoize + displayName
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_YY_MM_DD';
export default MemoizedClock;
```

### Clock Requirements

| Requirement | Rule |
|---|---|
| **Styling** | CSS Modules (`Clock.module.css`) — no inline `<style>` tags |
| **Time** | `useSecondClock()` or `useMillisecondClock()` only — no `setInterval` |
| **Fonts** | `useSuspenseFontLoader()` only — no `@font-face` in JS |
| **Assets** | Export `assets: string[]` for the preloading pipeline |
| **A11y** | Include `<time dateTime={...}>` for screen readers |
| **Performance** | `React.memo` + `displayName` required |
| **Memoization** | `useMemo` for expensive calculations (angles, string formatting) |

## Migration Checklist (Legacy Clocks)

When updating an existing clock to current standards:

1. **Replace `setInterval`** with `useSecondClock()` or `useMillisecondClock()`
2. **Move inline styles** from `<style>` tags into `Clock.module.css`
3. **Remove inline `style={{...}}`** props — use CSS Module classes
4. **Replace custom font loading** with `useSuspenseFontLoader(fontConfigs)`
5. **Add asset exports**: `export const assets = [bgUrl, fontUrl]`
6. **Add `<time>` element** for accessibility
7. **Add `React.memo`** wrapper with `displayName`
8. **Verify with**: `node scripts/verify-clock.js src/pages/YY-MM/YY-MM-DD/Clock.tsx`

## Styling Rules

- **CSS Modules** are the canonical styling approach for all components
- **Tailwind** utilities are allowed for layout/spacing in shared components
- **No inline styles** in core pages (`src/pages/ClockPage.tsx`, `src/pages/Today.tsx`) or shared components
- **Legacy fleet** (`src/pages/2025/**`, `src/pages/2026/**`) is temporarily exempt from inline-style lint rules during migration

## Verification

```bash
# Verify a single clock
node scripts/verify-clock.js src/pages/26-08/26-08-12/Clock.tsx

# Verify entire fleet
node scripts/verify-all-clocks.js
```

## Code Quality

- TypeScript strict mode — no `any` types
- ESLint flat config — fix errors before committing
- Prettier for formatting
- Tests with Vitest + Testing Library
