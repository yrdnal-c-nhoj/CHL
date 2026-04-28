# BorrowedTime Technical Evaluation

## 1. Architectural Overview
The project follows a **Registry-Discovery** architecture, ensuring metadata drives routing and lazy-loading.
1.  **Registry**: `clockpages.json` defines the source of truth for all daily clocks.
2.  **Discovery**: `import.meta.glob` performs build-time mapping of paths to code-split bundles.
3.  **Loading Orchestration**: `ClockPage.tsx` uses React Suspense to delay rendering until custom fonts and media are pre-buffered.

---

## 2. BorrowedTime Technical Standard (BTS)
To ensure long-term stability and high production value, all daily modules must meet the following criteria:

### A. Sub-Millisecond Precision
Legacy `setInterval` patterns are forbidden. Components must consume the `useClockTime` hook, which utilizes `requestAnimationFrame` for drift-free, frame-perfect rendering.

### B. Zero-Flash Assets (FOUC Prevention)
Custom typography is managed via the `useSuspenseFontLoader`. This prevents the system font from flickering before the intended art typeface arrives.

### C. Semantic Machine Readability
Despite being an art project, we maintain semantic integrity for SEO and Accessibility:
*   `<main>` as the root clock container.
*   `<time>` tags wrap all visible digital clock strings.

---

## 3. Performance Metrics
*   **Code Splitting**: Each day is a separate chunk (~2-5kb), ensuring the home page and individual days remain lightweight.
*   **Asset Management**: An automated script (`audit:fonts`) identifies unused assets in the `dist` folder to prevent build bloat.
*   **LCP Optimization**: Strategic use of `decoding="async"` and pre-calculated aspect ratios for background imagery.

---
_Technical Standards supervised by Cubist Heart Laboratories._

---

## 4. Evolution: Refactoring Case Studies

### Case Study: Time Logic
**Before (Legacy Patterns):**
```javascript
// Found in legacy .html or .jsx files
useEffect(() => {
  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);
  return () => clearInterval(timer);
}, []);
```
*Issue: Drift, high overhead, continues running in background tabs.*

**After (BTS Standard):**
```typescript
// Standardized in useClockTime.ts
export const useClockTime = (precision: 'ms' | 'seconds' = 'seconds') => {
  const [time, setTime] = useState(new Date());
  // Logic inside useEffect handles RAF with conditional state updates 
  // based on the requested precision.
  return time;
};
```
*Result: Frame-perfect synchronization and automatic background throttling.*

### Case Study: Asset Discovery
**Before:**
Manual imports in `App.jsx` for every single daily clock, leading to a massive, unmaintainable main bundle.

**After:**
Dynamic glob-importing in `useClockPage.ts`. 
```typescript
const modules = import.meta.glob('../../pages/**/Clock.tsx');
```
*Result: Automated routing and perfect code-splitting. Each day's art is its own tiny bundle.*

---

## 5. Build Pipeline Optimization

- **Vite Compression**: Using `vite-plugin-compression` to serve Gzip/Brotli assets.
- **Asset Purging**: Automated scripts (`audit-fonts.mjs`) prevent the `dist` folder from bloating with unused typeface files.
- **Asset Naming Convention**: All clock-specific fonts and media must be prefixed with the `YY-MM-DD` date string. This prevents asset collisions in the global bundle and simplifies manual audits. 
- **Image Pipeline**: Integration of `sharp-cli` for automated WebP conversion to hit Phase 4 of the roadmap.
