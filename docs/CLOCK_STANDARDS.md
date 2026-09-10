# Clock Standards & Development Guide

**Authoritative reference for all `Clock.tsx` implementations in CHL.**  
*Consult this document first when creating, reviewing, or optimizing any clock.*

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Required Architecture](#required-architecture)
3. [Time Hook Inventory](#time-hook-inventory)
4. [Technical Standards](#technical-standards)
5. [Performance Budgets](#performance-budgets)
6. [Common Patterns & Examples](#common-patterns--examples)
7. [Optimization Checklist](#optimization-checklist)
8. [AI Agent Workflow](#ai-agent-workflow)

---

## Quick Start

### Minimal Compliant Clock

```tsx
import React from 'react';
import { useClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [];

const Clock = () => {
  const time = useClock();
  const isoTime = time.toISOString();

  return (
    <main className={styles.container}>
      <time dateTime={isoTime}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_YY_MM_DD';
```

**Required files:**
- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx`
- `src/pages/YYYY/YY-MM/YY-MM-DD/Clock.module.css`

---

## Required Architecture

### 1. File Structure (No Exceptions)

```
src/pages/YYYY/YY-MM/YY-MM-DD/
  ├── Clock.tsx              (Required: main component)
  ├── Clock.module.css       (Required: scoped styles)
  └── [Optional helpers]     (e.g., useMazeRenderer.ts for complex logic)
```

- **Every clock directory must contain** `Clock.tsx` + `Clock.module.css`.
- Optional helper modules are allowed **only** for genuinely non-trivial logic (canvas renderers, maze generators, etc.).

### 2. Component Definition

```tsx
const Clock = () => {
  // Implementation
};

export default Clock;
Clock.displayName = 'Clock_YY_MM_DD'; // Must match folder date
```

**Rules:**
- `export default` the component.
- Set `displayName` to `Clock_YY_MM_DD` (e.g., `Clock_26_08_15`).
- `React.memo()` is optional; apply only after profiling shows unnecessary re-renders.

### 3. Asset Exports (Required)

```tsx
import bgImage from '@/assets/images/...';
import fontUrl from '@/assets/fonts/...';

export const assets = [bgImage, fontUrl];  // Export even if empty
```

**Rules:**
- Always export `assets` array (empty `[]` if unused).
- Assets are preloaded by the `useClockPage` pipeline.
- Font: **WOFF2 only**, max 2 families per clock, max 100KB total.
- Images: **WEBP/PNG preferred**, max 200KB; GIF only for small animations.
- Videos: MP4/WEBM only, max 2MB; avoid if static image works.

### 4. Accessibility (Required)

```tsx
<time dateTime={time.toISOString()} className={styles.srOnly}>
  {time.toLocaleTimeString()}
</time>
```

OR use the shared `SRTime` component:

```tsx
import { SRTime } from '@/components/SRTime';

// In render:
<SRTime time={time} />
```

**Rules:**
- Every clock must include a semantic `<time>` element with valid `dateTime` attribute.
- Pair with screen-reader-only copy using `.srOnly` class or `SRTime` component.
- See `src/components/SRTime.tsx` for implementation.

### 5. Styling (Required)

**Allowed:**
- CSS Modules (`Clock.module.css`) for all static styles.
- Inline styles **only** for dynamic values (e.g., computed transforms, animation angles).

**Prohibited:**
- Inline `<style>` tags or `document.head.appendChild`.
- CSS-in-JS utilities for static styles.
- Global styles or mutations to `document.body`.

**Height requirement:**
```css
.container {
  height: 100dvh; /* NOT 100vh—accounts for mobile browser chrome */
}
```

### 6. Root Element

**Recommended:**
```tsx
<main className={styles.container}>
  {/* Clock content */}
</main>
```

- Use `<main>` for semantic clarity and accessibility.
- Apply your layout classes to `<main>`.

---

## Time Hook Inventory

### ✅ Canonical Hooks (Use These)

#### `useClock()` — 1-second granularity
- **Import:** `import { useClock } from '@/utils/hooks';`
- **Returns:** `Date` object, updates every ~1 second via `requestAnimationFrame`.
- **Use case:** Analog clocks, digit displays, any visual that updates once per second.
- **Performance:** Single rAF loop shared across all clocks on the page; minimal battery impact.

```tsx
const time = useClock();
const hours = time.getHours();
```

#### `useSmoothClock()` — ~50ms granularity
- **Import:** `import { useSmoothClock } from '@/utils/hooks';`
- **Returns:** `Date` object, updates ~20 times per second (50ms intervals).
- **Use case:** Smooth sweeping second hands, fluid animations.
- **Performance:** Single shared rAF loop; battery-efficient.

```tsx
const time = useSmoothClock();
const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
```

#### `useMillisecondClock()` — ~1ms granularity (Legacy, keep for compatibility)
- **Import:** `import { useMillisecondClock } from '@/utils/hooks';`
- **Status:** Deprecated re-export of `useSmoothClock`; will be removed in v2.
- **Recommendation:** Use `useSmoothClock()` in new code.

### ❌ Prohibited Hooks & Patterns

| Pattern | Why | Alternative |
|---------|-----|-------------|
| `setInterval(...)` | Defeats rAF battery optimization; stale closures | Use `useClock` or `useSmoothClock` |
| `setInterval(callback, 1000)` | Multiple independent timers bloat the event loop | Use `useClock` (1s updates) |
| Manual `requestAnimationFrame` loops | Uncoordinated with other clocks; battery drain | Use `useSmoothClock` |
| `useClockTime` (from `@/utils/clockUtils`) | Deprecated utility | Use `useClock` or `useSmoothClock` |
| Deprecated `useSecondClock` / `useMultiSecondClock` | Removed in favor of canonical hooks | Use `useClock` |

---

## Technical Standards

### ESLint & Code Quality

**All clocks must pass:**

```bash
npm run lint -- "src/pages/**/Clock.tsx"
```

**Key rules for clock files:**
- `react/no-danger` — error (blocks inline `<style>` injection)
- `react/no-unknown-property` — error (blocks `cssText` mutations)
- `react-hooks/exhaustive-deps` — error (safe dependency tracking)
- `react-hooks/rules-of-hooks` — error (enforce hook placement)
- `@typescript-eslint/no-explicit-any` — warn (type safety)
- `@typescript-eslint/no-non-null-assertion` — warn (avoid unsafe assertions)

### TypeScript Strict Mode

**All clocks must pass `npm run type-check`:**

```bash
npm run type-check
```

**Current strictness (effective `noUncheckedIndexedAccess: true`):**
- Array/object index access must be guarded: `arr?.[i]` or `if (arr?.[i]) { ... }`
- Example fix:
  ```tsx
  // ❌ Error: possibly undefined
  const digit = digits[0];

  // ✅ Correct: guarded
  const digit = digits?.[0];
  if (!digit) return null;
  ```

### Memoization Rules

**`useMemo` — Use Only for Expensive Operations**

✅ **Appropriate:**
```tsx
const { hourDeg, minuteDeg } = useMemo(() => {
  // Expensive trigonometry or canvas calculations
  return { hourDeg: ..., minuteDeg: ... };
}, [time]);
```

❌ **Inappropriate:**
```tsx
const formatted = useMemo(() => {
  return time.toLocaleTimeString(); // Cheap string formatting
}, [time]);
```

**`useCallback` — Use Sparingly**

- Only when passing handlers to memoized children.
- Only when the function is a dependency of another hook.
- **Not needed** for event handlers on static DOM elements.

**Prohibited:** Reading `ref.current` inside `useMemo` or `useState` initializer.

```tsx
// ❌ WRONG: ref.current is not populated during render
const items = useMemo(() => {
  return clocksRef.current.map(...);  // Undefined!
}, []);

// ✅ CORRECT: read ref in useEffect, update state
const [items, setItems] = useState<Clock[]>([]);
useEffect(() => {
  if (clocksRef.current) {
    setItems(clocksRef.current.map(...));
  }
}, []);
```

### Accessibility Requirements

**WCAG 2.1 Level AA minimum:**

1. **Semantic time element** with valid `dateTime`.
   ```tsx
   <time dateTime={new Date().toISOString()}>Clock display</time>
   ```

2. **Screen reader access** for time information.
   ```tsx
   <span className={styles.srOnly}>
     Current time: {time.toLocaleTimeString()}
   </span>
   ```

3. **Keyboard navigation** (if interactive).
   ```tsx
   <div
     role="button"
     tabIndex={0}
     onKeyDown={(e) => e.key === 'Enter' && handleClick()}
   >
     Interactive clock
   </div>
   ```

4. **Color contrast** for text: WCAG AA minimum 4.5:1.

5. **No automatic audio/video** that plays on load.

---

## Performance Budgets

### Per-Clock Limits

| Metric | Budget | Notes |
|--------|--------|-------|
| **JS chunk size** | < 50KB (gzipped) | Clock.tsx + dependencies |
| **CSS** | < 10KB (gzipped) | Clock.module.css |
| **Images** | < 200KB total | WEBP/PNG preferred |
| **Fonts** | < 100KB total | WOFF2 only, max 2 families |
| **Video** | < 2MB total | MP4/WEBM; auto-play discouraged |

### Initial Page Load

| Metric | Budget |
|--------|--------|
| **JS (all clocks + framework)** | < 150KB gzipped |
| **Three.js** | < 150KB gzipped (currently over; priority fix) |
| **Time to Interactive (TTI)** | < 3s on 4G |
| **First Contentful Paint (FCP)** | < 1.5s |

### Runtime Performance

| Metric | Target |
|--------|--------|
| **Frame rate** | 60 FPS (steady) |
| **CPU usage** | < 5% idle (per clock) |
| **Memory per clock** | < 20MB |
| **Battery impact** | Minimal (shared rAF loop) |

**Tools:**
```bash
npm run build         # Check bundle size
npm run type-check    # Catch TS errors early
npm run lint          # ESLint violations
npm run test:run      # Unit tests
```

---

## Common Patterns & Examples

### Pattern 1: Analog Clock with Hand Rotation

**Hook:** `useSmoothClock()`  
**Reference:** `src/pages/2026/26-07/26-07-29/Clock.tsx`

```tsx
import React, { type CSSProperties } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [/* images */];

const Clock = () => {
  const time = useSmoothClock();

  const hours = time.getHours();
  const minutes = time.getMinutes() + time.getSeconds() / 60;
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  return (
    <main className={styles.container}>
      <div className={styles.clock}>
        <img
          alt="hour hand"
          src={hourImg}
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        {/* minute, second hands */}
      </div>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_07_29';
```

### Pattern 2: Digital Display with Format

**Hook:** `useClock()`  
**Reference:** `src/templates/BaseClock.tsx`

```tsx
import React from 'react';
import { useClock } from '@/utils/hooks';
import { SRTime } from '@/components/SRTime';
import styles from './Clock.module.css';

export const assets = [];

const formatDigits = (num: number): string =>
  num.toString().padStart(2, '0');

const Clock = () => {
  const time = useClock();

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());
  const seconds = formatDigits(time.getSeconds());

  return (
    <main className={styles.container}>
      <div className={styles.display}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <SRTime time={time} />
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_YY_MM_DD';
```

### Pattern 3: Canvas/Three.js Renderer

**Hook:** `useSmoothClock()`  
**Reference:** Implementation guides in `docs/PERFORMANCE.md`

```tsx
import React, { useEffect, useRef } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [];

const Clock = () => {
  const time = useSmoothClock();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Render once per frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw using time.getHours(), etc.
  }, [time]);

  return (
    <main className={styles.container}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className={styles.canvas}
      />
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_YY_MM_DD';
```

---

## Optimization Checklist

Use this checklist to optimize an existing clock **without changing its visual appearance**.

- [ ] **Remove `setInterval` / `requestAnimationFrame`**
  - [ ] Replace with `useClock()` or `useSmoothClock()`
  - [ ] Verify update frequency still matches design (1s vs ~50ms)

- [ ] **Move styles to CSS Module**
  - [ ] Remove inline `<style>` tags
  - [ ] Move dynamic inline styles to `Clock.module.css`
  - [ ] Keep only computed transforms as inline styles

- [ ] **Guard array/object access**
  - [ ] Add `?.` or `?.[i]` checks
  - [ ] Test TS strict mode: `npm run type-check`

- [ ] **Fix memoization**
  - [ ] Remove unnecessary `useMemo` for cheap operations
  - [ ] Never read `ref.current` in `useMemo`/`useState` initializer
  - [ ] Move to `useEffect` + `useState` if needed

- [ ] **Export assets correctly**
  - [ ] Add `export const assets = [...]` (or `[]` if unused)
  - [ ] Verify images are in `.webp` or `.png` format
  - [ ] Verify fonts are `.woff2` only

- [ ] **Add accessibility**
  - [ ] Include `<time>` element with valid `dateTime`
  - [ ] Add screen-reader-only time text or use `<SRTime />`
  - [ ] Test with screen reader (NVDA, JAWS, VoiceOver)

- [ ] **Set displayName**
  - [ ] Add `Clock.displayName = 'Clock_YY_MM_DD'`

- [ ] **Pass linting**
  - [ ] `npm run lint -- "src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx"`

- [ ] **Pass type check**
  - [ ] `npm run type-check`

- [ ] **Check bundle size**
  - [ ] Run `npm run build` and inspect `dist/` for your clock's chunk
  - [ ] Verify < 50KB gzipped

- [ ] **Verify visual is unchanged**
  - [ ] Compare before/after in browser
  - [ ] Test responsive behavior (mobile, tablet, desktop)
  - [ ] Check animations frame rate (60 FPS target)

---

## AI Agent Workflow

**When an AI agent (including future Copilot instances) encounters a clock task, follow this workflow:**

### 1. Read This Document First
- Consult `docs/CLOCK_STANDARDS.md` (this file) before any other reference.
- Clarify requirements: Is this a new clock, an optimization, or a bug fix?

### 2. Inspect Existing Code
- Check if a similar clock already exists (e.g., analog or digital).
- Copy the closest matching pattern from the **Common Patterns** section above.
- Reference the example clock's commit in `docs/CLOCK_CONTRACT.md` or this guide.

### 3. Validate Against Required Architecture
- [ ] File pair exists: `Clock.tsx` + `Clock.module.css`
- [ ] Component is exported as default with `displayName`
- [ ] Hook is canonical: `useClock` or `useSmoothClock`
- [ ] Assets are exported (even if empty)
- [ ] Accessibility: `<time>` + screen-reader text
- [ ] Styles in CSS Module (inline only for dynamic values)

### 4. Run Quality Checks
```bash
npm run lint -- "src/pages/YYYY/YY-MM/YY-MM-DD/Clock.tsx"
npm run type-check
npm run build
```

### 5. Create or Update
- For **new clocks:** Copy `src/templates/BaseClock.tsx` + `BaseClock.module.css`.
- For **optimization:** Apply the Optimization Checklist above, verifying visual match after each change.
- Commit with a clear message: `"Add Clock YYYY-MM-DD: [description]"` or `"Optimize Clock YYYY-MM-DD: [optimization]"`.

### 6. Document Non-Standard Choices
If a clock deviates from these standards for justified reasons:
- Add a comment in `Clock.tsx` explaining why.
- Update `docs/EXCEPTIONS.md` (if that file exists) or add a note to `docs/STATUS.md`.

### 7. Reference This Guide in Code Reviews
- Point reviewers to this document for questions about patterns, hooks, or performance.
- Link to the relevant section (e.g., "See **Memoization Rules** above").

---

## References

- **`docs/CLOCK_CONTRACT.md`** — Detailed contract rules and pattern enforcement.
- **`docs/PERFORMANCE.md`** — Deep dive into budget calculations and optimization case studies.
- **`docs/ARCHITECTURE.md`** — System-wide design principles (if present).
- **`src/templates/BaseClock.tsx`** — Minimal compliant example.
- **`src/pages/2026/26-08/26-08-02/Clock.tsx`** — Best modern example (per STATUS.md).
- **`src/pages/2026/26-07/26-07-29/Clock.tsx`** — High-quality analog clock reference.
- **`src/utils/hooks/`** — Hook implementations and source.

---

**Last Updated:** 2026-09-10  
**Maintainer:** yrdnal-c-nhoj  
**Status:** Authoritative reference for all Clock.tsx implementations
