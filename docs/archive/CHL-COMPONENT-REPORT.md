> **HISTORICAL — snapshot**  
> This report is retained for reference only. For the current source of truth, see [`docs/STATUS.md`](../STATUS.md).

# BorrowedTime "Clock" Component — Best-Practices Audit & Improvement Report

**Audited by:** Automated static analysis
**Scope:** The `Clock.tsx` / `Clock.module.css` components across `src/pages/` (490 clocks), the canonical templates (`src/templates/`), the shared hooks (`src/utils/hooks/`), the font loader (`src/utils/fontLoader.tsx`), and the standards verifier (`scripts/verify-all-clocks.js`).
**Reference standard:** `src/templates/ARCHITECTURE.md` §4 (Clock Component Standards)

---

## 1. Executive Summary

The CHL component system is **architecturally sound and well-documented**, but it is **not yet "state of the art" in practice**. The project has an excellent, forward-looking technical foundation — a canonical template (`BaseClock.tsx`), a Suspense-based font loader, standard time hooks, CSS Modules, a preloading pipeline, and automated verification scripts. However, execution is inconsistent across the codebase:

- **490 clock components** exist; only **2 are fully compliant** with the project's own published standards.
- **488 clocks (99.6%)** need work; there are **3,400 total violations** and **222 critical violations** (prohibited `setInterval` and inline `<style>` tags).
- The **two most recent / reference clocks** (the ones open in the editor) are close to compliant but still miss key requirements.

The good news: the *architecture* is designed well. The gap is one of **migration discipline**, not design. The remediation path is clear and largely mechanizable.

---

## 2. What the Component Does Well (Strengths)

The system has several genuinely good, modern properties:

1. **Documented canonical architecture** — `ARCHITECTURE.md` §4 defines a precise component contract (asset exports, canonical hooks, CSS Modules, `<time>`, `React.memo`, `useSuspenseFontLoader`). This is rare and valuable.
2. **Suspense-based font loading** (`useSuspenseFontLoader`) — uses a global cache + reference counting + `display: 'block'` to prevent FOUC and double-loading. This is a sophisticated, correct approach.
3. **rAF-based time hooks** (`useSecondClock`/`useMillisecondClock`) — replace `setInterval` with `requestAnimationFrame` throttled to only re-render when the second changes. Battery/performance friendly.
4. **CSS Modules + design tokens** — scoped styles, no global leakage; a `@theme` design-token system in `globals.css`.
5. **Asset preloading pipeline** — `useClockPage` dynamically imports each clock and preloads exported `assets` (with fail-open behavior and a 10s safety timeout).
6. **Automated standards verification** — `verify-clock.js` / `verify-all-clocks.js` catch non-compliance and can emit a CSV report. This is exactly the right tooling to drive a migration.
7. **Accessibility fundamentals** — the template and newer clocks include a semantic `<time>` element with `dateTime` and a visually-hidden (`srOnly`) time string.
8. **Lazy loading via code splitting** — every clock is a separate chunk; framework/vendor code is split.

---

## 3. Principal Findings & Gaps

### 3.1. Not "State of the Art" — The Evidence

| Metric | Value |
|---|---|
| Total clock components | 490 |
| Fully compliant | **2** (0.4%) |
| Need work | **488** (99.6%) |
| Critical violations (setInterval / `<style>`) | **222** |
| Total violations | **3,400** |

The verifier's own summary: **Compliance rate: 0%**.

### 3.2. The Two Reference Clocks (open in editor)

**`src/pages/2026/26-08/26-08-02/Clock.tsx`** — the *best* example in the repo. It follows the modern template: `React.memo` + `displayName`, semantic `<time>` + `srOnly`, canonical `useMillisecondClock`, `useSuspenseFontLoader`, CSS Modules, and a `backgroundVideo`. It has **exactly 1 violation**: it does not export `assets` in the canonical form (the `backgroundVideo` is a `.mp4` and is only used via `<video src>`, so it isn't preloaded). This is intentional per the preloading logic (videos >1 asset are filtered), but the linter/verifier still flags it.

**`src/pages/2025/25-08/25-08-20/Clock.tsx`** — a **legacy, non-compliant** clock. It uses a `useState` + manual `resize` listener, `useSuspenseFontLoader` (good), but:
- ❌ No `export const assets` (no preloading).
- ❌ No semantic `<time>` element / no `srOnly` accessibility text.
- ❌ No `React.memo` / `displayName`.
- ❌ Root element is `<div className={styles.container}>`, not `<main>`.
- ⚠️ Recomputes `window.innerWidth/Height` on every `resize` → re-renders the **entire grid of 24 analog clocks** on every resize event (no debounce/throttle).
- ⚠️ `new Date(time.toLocaleString('en-US', { timeZone: zone }))` inside every `AnalogClock` on every render — a timezone conversion per zone per frame. Inefficient and fragile (produces an "en-US" localized string, then re-parses it).
- ⚠️ 24 `AnalogClock` components each call `useMillisecondClock()` → **24 separate rAF loops** all re-rendering simultaneously. This is a performance concern on low-end devices.

---

### 3.3. Systemic Issues Across the Codebase

#### A. Prohibited `setInterval` (critical)
134 clocks use `setInterval` directly instead of the canonical `useSecondClock`/`useMillisecondClock`. This defeats the project's own rAF-based battery optimization and can cause stale closures / redundant re-renders.

#### B. Inline `<style>` tags (critical)
143 clocks inject `<style>` blocks (e.g., `25-08-01` creates a `<style>` element via `document.head.appendChild` and mutates `document.body` styles). This violates the "CSS Modules only" rule, risks global CSS leakage, and can cause FOUC/CLS. The `eslint` config even has a dedicated rule block for `**/pages/**/Clock.tsx` to block this, but many clocks predate it.

#### C. Deprecated font loaders
Many clocks import `useMultipleFontLoader` / `useMultiFontLoader` or `useFontLoader` from `assetLoader` instead of the canonical `useSuspenseFontLoader`. `ARCHITECTURE.md` explicitly deprecates these.

#### D. Root element is `<div>` not `<main>`
Many clocks use `<div className={styles.container}>` as the root, missing the semantic `<main>` landmark.

#### E. No `assets` export / no `<time>` / no `srOnly` / no `React.memo`
A majority of clocks (especially older ones) omit the accessibility and performance boilerplate that the template mandates.

#### F. Inconsistent use of `useClockTime` from `clockUtils`
44 clocks import the time hook from `@/utils/clockUtils` (deprecated re-export) instead of `@/utils/hooks`.

---

## 4. Detailed Best-Practice Assessment

### 4.1. Accessibility
- ✅ Template & new clocks: semantic `<time>` + `srOnly` text.
- ❌ Many clocks: no `<time>`, no sr-only text, no color-contrast verification.
- ⚠️ `ClockPage.tsx` wraps the whole page in a `role="button"` / `tabIndex={0}` div with an `onClick` that navigates home. There is **no keyboard `onKeyDown` handler** (Enter/Space), violating `jsx-a11y/click-events-have-key-events` and the "keyboard navigation" requirement. This is a real, actionable a11y bug.

### 4.2. Performance
- ✅ `React.memo` on new clocks; `useMemo` for angle math; lazy-loaded chunks; rAF hooks.
- ⚠️ `useMillisecondClock` (default 50ms) drives re-renders 20×/sec. For a clock whose hands rotate continuously this is necessary, but many clocks that only show whole seconds don't need it and should use `useSecondClock`.
- ⚠️ 24 concurrent rAF loops in `25-08-20` — should be a single shared time source.
- ⚠️ Unthrottled `resize` handler in `25-08-20` re-renders the whole grid on every resize pixel.
- ⚠️ Several clocks import large Google Fonts via `@import` inside inline `<style>` — blocks rendering and adds FOUC risk.

### 4.3. Maintainability / DRY
- ⚠️ **Massive duplication.** The analog-clock math (hand angles) is re-implemented inline in dozens of clocks instead of using shared helpers (`calculateAngles` in `clockUtils`/`useClockTime`). The `srOnly` style object is copy-pasted (e.g., in `26-08-01`). A shared `<AnalogClock>` primitive or a `useClockAngles` hook would eliminate this.
- ⚠️ `ClockTemplate.tsx` and `MasterTemplate.tsx` are **empty files (0 bytes)**. The `index.ts` only exports `BaseClock`. The "template" story is incomplete — the canonical example lives only in `BaseClock.tsx` and in `ARCHITECTURE.md`.
- ⚠️ `assets` export convention is inconsistent: some export `string[]`, some export nothing, and `26-08-02` exports `[backgroundVideo, fontUrl]` but the preloader filters out videos when there is >1 asset, so the video isn't actually preloaded.

### 4.4. Correctness / Robustness
- ⚠️ `25-08-20`'s timezone conversion `new Date(time.toLocaleString('en-US', { timeZone: zone }))` is fragile — it round-trips through a locale string. Better to use `Intl.DateTimeFormat` with `hour12: false` or `formatToParts`.
- ⚠️ `useClockPage` uses `import.meta.glob('../pages/**/Clock.tsx')` — a static registry. If a clock folder is renamed/moved, the lookup silently breaks with a generic "Clock lookup failed" error (acceptable, but a pre-build integrity check would be better).
- ✅ Good "fail-open" behavior and 10s safety timeout in the loader.

### 4.5. State Management
- ✅ No external global state — React Context + hooks, consistent with the declared architecture.
- ⚠️ Watch for **FOUC / hydration** handling: `26-08-02` had a documented FOUC issue (see `TODO.md`). The `TODO.md` indicates one fix was done, but this must be kept consistent across all clocks.

---

## 5. Recommended Steps (Action Plan)

These are ordered by impact. The good news is that the tooling already exists to measure and (partially) auto-fix.

### Phase 0 — Baseline & Tracking
1. **Run the audit** and persist a baseline:
   ```bash
   node scripts/verify-all-clocks.js --csv clocks-report.csv
   ```
2. **Fix the audit tooling itself** so it can be the source of truth:
   - Add a rule for "root element is `<main>`" as a **required** rule (it's currently only a "minor" prohibited pattern).
   - Teach the `--fix` mode to insert the missing boilerplate (`assets`, `<time>`, `srOnly`, `React.memo` + `displayName`) automatically for clocks that are otherwise close to compliant.
   - Wire the audit into CI (fail the build if compliance regresses).

### Phase 1 — Fix the reference clocks (quick wins, high teaching value)
3. **`26-08-02`**: Add the canonical `export const assets: string[] = [fontUrl];` (drop the video from `assets` since the preloader filters single videos, or keep it as a single-element array so it *is* preloaded — decide the intended contract and document it). This takes it from 1 → 0 violations.
4. **`25-08-20`** (legacy): Migrate to the modern template:
   - Add `export const assets = [bgImage, myFontUrl]`.
   - Wrap in `React.memo` + `displayName`.
   - Replace the root `<div>` with `<main>`.
   - Add a semantic `<time dateTime=...>` + `srOnly` text.
   - Replace the manual `useState` + window `resize` listener with a shared `useMediaQuery`/`useViewport` hook (or `window.matchMedia`), and **debounce/throttle** the resize handler.
   - **Share a single time source**: lift `useMillisecondClock()` up to the parent `WorldClockGrid` and pass the `Date` down to each `AnalogClock` (or memoize the whole grid on a single tick). This removes 24 concurrent rAF loops.
   - Replace the `toLocaleString` round-trip with `Intl.DateTimeFormat` + `formatToParts` for the zone offset.

### Phase 2 — Drive system-wide migration with scripts
5. **Mechanical migration of the common patterns** (write codemods / extend `verify-clock.js --fix`):
   - Replace `setInterval`-based time with `useSecondClock`/`useMillisecondClock` (134 files).
   - Replace deprecated `useClockTime`/`useMultiFontLoader`/`useFontLoader` imports with canonical ones (44 files).
   - Replace inline `<style>` blocks with CSS Modules (143 files) — this is the riskiest one and should be done per-clock with visual verification.
   - Insert `<main>` root, `<time>` + `srOnly`, `React.memo` + `displayName`, and `export const assets` (bulk).
6. **Extract shared primitives** to remove duplication:
   - Create `useClockAngles(date)` hook wrapping `calculateAngles` for analog clocks.
   - Create a shared `<SRTime>` component (the `srOnly` `<time>` element) and a shared `srOnly` CSS class in `globals.css`.
   - Create a shared `<AnalogClockZone>` primitive for multi-zone/multi-clock pages like `25-08-20`.
7. **Fix the real a11y bug in `ClockPage.tsx`**: add an `onKeyDown` (Enter/Space) handler to the clickable wrapper, or replace the `role="button"` div with a real navigation affordance.

### Phase 3 — Tooling, CI & documentation hardening
8. **Complete the template story**: populate `ClockTemplate.tsx` / `MasterTemplate.tsx` (currently empty) or remove them, and make `BaseClock.tsx` the single, enforced canonical template.
9. **Add Redux DevTools-free, standard performance guardrails**: add `react-hooks/exhaustive-deps` enforcement, and a lint rule/CI check that flags `setInterval`, `<style>` tags, and `toLocaleString`-based timezone math in clock pages.
10. **Add tests**: unit-test `useClockAngles`, `<SRTime>`, and the resize/viewport hook; add a component-level snapshot test for `BaseClock` that can be reused by every generated clock.

### Phase 4 — Performance & bundle hygiene
11. Sweep clocks that use `useMillisecondClock` but only render whole seconds → switch to `useSecondClock` (reduces re-render rate 20×→1×).
12. Audit font loading: consolidate Google Font imports into `globals.css` (single `@import`) instead of per-clock inline `<style>`; ensure `?url` suffix convention for all custom fonts.
13. Re-run `npm run type-check`, `npm run lint`, `npm run test:run`, and `npm run build` after each phase to catch regressions.

### Phase 5 — Verify & celebrate
14. Re-run the audit and confirm **0 violations** on the reference clocks and a **measurable compliance increase** across the fleet:
    ```bash
    node scripts/verify-all-clocks.js --csv clocks-report.csv
    ```
15. Optionally add a **Lighthouse CI** budget check (the repo targets >90 performance, <150KB initial JS, <500KB total weight) to prevent regressions.

---

## 6. Priority Matrix

| Priority | Item | Effort | Impact |
|---|---|---|---|
| P0 | Fix the real a11y keyboard bug in `ClockPage.tsx` | Low | High |
| P0 | Migrate `25-08-20` (legacy) to the template | Medium | High (it's a bad example) |
| P0 | Complete `26-08-02` (1 remaining violation) | Low | High (reference clock) |
| P1 | Fix audit tooling + wire into CI | Medium | High (prevents regression) |
| P1 | Bulk replace `setInterval` → canonical hooks | Medium | High (134 files) |
| P1 | Extract `useClockAngles` + `<SRTime>` primitives | Medium | High (removes duplication) |
| P2 | Replace inline `<style>` → CSS Modules | High | Medium (143 files, visual risk) |
| P2 | Consolidate Google Font loading | Medium | Medium |
| P2 | Populate/remove empty `ClockTemplate`/`MasterTemplate` | Low | Low |
| P3 | Switch `useMillisecondClock`→`useSecondClock` where possible | Low | Medium (perf) |

---

## 7. Conclusion

The CHL Clock component **architecture is above-average and forward-thinking** — Suspense font loading, rAF time hooks, CSS Modules, lazy loading, design tokens, and automated verification are all genuinely good engineering. **It is not yet "state of the art" in execution**: only 2 of 490 clocks meet the project's own standards, and hundreds of legacy patterns (34% using deprecated loaders, 27% inline `<style>`, 27% `setInterval`) remain. The single highest-leverage action is to **make the automated verifier the enforcement gate in CI** and then **codemod the fleet** toward the excellent `BaseClock` template. With the tooling already in place, this is a tractable, largely mechanical migration rather than a rewrite.
