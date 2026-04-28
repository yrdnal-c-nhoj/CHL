# BorrowedTime: Technical Evaluation & Audit

## 1. Architectural Overview

### Component Hierarchy
The application follows a strict hierarchical structure to ensure that global state (Data) and metadata (SEO) wrap the dynamic, often heavy, daily art components.

```text
App (Root)
├── ErrorBoundary (Global Crash Recovery)
├── DataProvider (Context: clockpages.json)
└── Router (React Router v6)
    ├── AnalyticsAndSEO (Dynamic Meta Tags)
    └── Routes
        ├── Home (Archive Grid)
        └── ClockPage (The Dynamic Renderer)
            └── Suspense (Loading State)
                ├── Dynamic Clock (YYYY/MM/DD/Clock.tsx)
                │   ├── useClockTime (RAF Engine)
                │   └── useSuspenseFontLoader (Font Sync)
                └── ClockPageNav (Fixed Overlay)
```

### Data Flow
The registry-first approach ensures that the build system knows exactly which modules exist without manual routing updates.

1.  **Registry**: `clockpages.json` defines the source of truth for all daily clocks.
2.  **Discovery**: `useClockPage.ts` utilizes `import.meta.glob` to map registry paths to physical `.tsx` files.
3.  **Loading**: The `Suspense` boundary in `ClockPage.tsx` holds the UI until all critical assets (fonts, images) are pre-buffered.

---

## 2. TypeScript Coverage & Type Safety

| Layer | Status | Migration Notes |
| :--- | :--- | :--- |
| **Core Utilities** | 100% | `clockUtils.ts`, `fontLoader.tsx`, and `assetLoader.ts` are fully typed. |
| **Navigation/UI** | 90% | Shared components like `TopNav` are being converted to TSX. |
| **Daily Pages** | 40% | All new clocks (2026+) must be `.tsx`. Historical 2025 pages are being refactored. |
| **Data Layer** | 100% | `clock.ts` defines rigid interfaces for `ClockTime` and `FontConfig`. |

**Technical Standard (BTS) Enforcement**:
- Any new file added to `src/pages/` must use `.tsx`.
- Manual `any` types are flagged in ESLint as warnings to encourage explicit interface definition.

---

## 3. Optimization Techniques

### High-Precision Rendering
We have moved away from `setInterval` (which is subject to browser throttling and "drift") to a `requestAnimationFrame` (RAF) model.

- **Impact**: Clock updates are synced to the display's refresh rate (usually 60Hz).

### FOUC Prevention (Zero-Flash Architecture)
Using the `useSuspenseFontLoader` hook, we hook into the React Suspense lifecycle.

- **Mechanism**: The component "throws" a promise until `document.fonts.ready` resolves.
- **Result**: Users never see a default system font before the custom "BorrowedTime" typography loads.

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
export const useClockTime = () => {
  const [time, setTime] = useState(new Date());
  useAnimationFrame(() => {
    const now = new Date();
    if (now.getSeconds() !== time.getSeconds()) {
      setTime(now);
    }
  });
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
- **Image Pipeline**: Integration of `sharp-cli` for automated WebP conversion to hit Phase 4 of the roadmap.
