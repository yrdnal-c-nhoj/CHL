# Clock Component Contract

Last reviewed: 2026-08-25

This is the single source of truth for clock component structure and behavior.
For architectural context, see `src/templates/ARCHITECTURE.md`.

---

## 1. File Structure

Every clock **must** use this pair:

```
src/pages/YYYY/YY-MM/YY-MM-DD/
  ├── Clock.tsx
  └── Clock.module.css
```

No exceptions.

---

## 2. Required Patterns

### 2.1 Component Definition

```tsx
const Clock = () => {
  // ...
};

export default Clock;
Clock.displayName = 'Clock_YY_MM_DD';
```

- **Recommended:** `React.memo` only if profiling shows unnecessary re-renders. Not blanket required.
- **Recommended:** `displayName` for debugging.
- **Required:** Export default the component.

### 2.2 Time Hook

```tsx
const time = useSecondClock();        // default: 1s updates
// or
const time = useMillisecondClock();   // smooth: ~50ms updates
```

- **Required:** Import from `@/utils/hooks` only.
- **Prohibited:** `setInterval`, `requestAnimationFrame`, `useClockTime` from `@/utils/clockUtils`.

### 2.3 Asset Exports

```tsx
export const assets = [backgroundImage, fontUrl];
```

- **Required:** When the clock renders assets that should be preloaded.
- **Required:** Empty array `[]` when no assets are used.

### 2.4 Accessibility

```tsx
<time dateTime={time.toISOString()} className={styles.srOnly}>
  {time.toLocaleTimeString()}
</time>
```

- **Required:** Semantic `<time>` element with valid `dateTime`.
- **Required:** Visually hidden but screen-reader accessible class (`styles.srOnly`).

### 2.5 Styling

- **Required:** CSS Modules (`Clock.module.css`).
- **Prohibited:** Inline style objects for static styles.
- **Allowed:** Inline styles for dynamic values (e.g., canvas transforms, computed dimensions).

### 2.6 Memoization

- **Recommended:** `useMemo` only for genuinely expensive calculations. Do **not** memoize simple string formatting or cheap derivations.
- **Recommended:** `useCallback` only when passing handlers to memoized children or when the function is a dependency of another hook.

**Examples of appropriate use:**
- Expensive geometry / packing algorithms
- Large array transformations
- Functions passed to `React.memo` children

**Examples of inappropriate use:**
- `String(time.getHours()).padStart(2, '0')`
- Simple angle arithmetic
- Inline arrow functions in render without memoized recipients

---

## 3. Recommended Patterns

### 3.1 Font Loading

```tsx
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const fontConfigs = [{ fontFamily: 'MyFont', fontUrl }];
useSuspenseFontLoader(fontConfigs);
```

- **Recommended:** For clocks using custom fonts.
- **Required if used:** `?url` suffix for font imports.

### 3.2 TypeScript

- **Required:** No `any` types. Use interfaces or type aliases.
- **Recommended:** Explicit return types on exported functions.
- **Recommended:** Strict null checks enabled (`tsconfig.json`).

### 3.3 Canvas / Animation

- **Required:** All animation must use canonical time hooks (`useSecondClock`, `useMillisecondClock`).
- **Required:** Clean up subscriptions/observers in `useEffect` return.
- **Prohibited:** Direct `requestAnimationFrame` loops in components.

---

## 4. React 19 / Vite 7 Notes

- **JSX:** No `import React` needed for JSX syntax (automatic runtime).
- **React import:** Required only when using `React.memo`, `React.forwardRef`, `React.lazy`, etc.
- **`React.memo`:** Use only when profiling shows a concrete re-render problem. Not a default optimization.
- **Vite glob:** Use `query: '?url', import: 'default'` instead of deprecated `as: 'url'`.
- **HMR:** `server.hmr.overlay: false` is configured in `vite.config.ts`.

---

## 5. Prohibited Patterns

| Pattern | Status | Reason |
|---|---|---|
| `setInterval` / `setTimeout` in components | ❌ Prohibited | Drift, memory leaks |
| `requestAnimationFrame` loops | ❌ Prohibited | Use canonical hooks |
| `useClockTime` from `@/utils/clockUtils` | ❌ Prohibited | Deprecated; use `@/utils/hooks` |
| `useGlobalStyles` / `useKeyframes` | ❌ Prohibited | Use CSS Modules |
| Inline `<style>` tags for static CSS | ❌ Prohibited | Use CSS Modules |
| `any` type | ❌ Prohibited | Type safety |
| TTF/WOFF fonts in production | ❌ Prohibited | Use WOFF2 only |
| `import React` for JSX only | ⚠️ Avoid | Not needed in React 19 |

---

## 6. Enforcement

- **CI:** `npm run test:run`, `npm run lint`, `npx tsc --noEmit`.
- **Verification:** `node scripts/verify-all-clocks.js` checks compliance.
- **Status:** `npm run status` refreshes `docs/STATUS.md`.
