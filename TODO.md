# CHL Component Assessment — Phase 0 Implementation

Tracked progress for the recommended fixes from `CHL-COMPONENT-ASSESSMENT-REPORT.md`.

## Phase 0 — Stop the bleeding & establish CI truth

- [ ] 1. Fix `tsconfig.ci.json` — include `src/pages/**` so CI type-checks the 491 clocks
  - ⚠️ Note: currently `src/pages/**` is NOT included, so the 3,125 pre-existing type errors in legacy clocks are hidden from CI. Include them only after the codemod removes the bulk.
- [x] 2. Fix the `useClockTime` contradiction — it's canonical-but-uses-`setInterval`
  - Migrated `src/utils/hooks/useClockTime.ts` to rAF-based logic (delegates to `useSecondClock`) and updated `index.ts` docs.
- [x] 3. Fix the a11y keyboard bug in `ClockPage.tsx` (`role="button"` without `onKeyDown`)
  - Added `onKeyDown` (Enter/Space → navigate home) + `aria-label="Return to home"`.
- [x] 4. Fix the failing tests (DataContext ordering, stale ClockPage mocks, etc.)
  - `DataContext.test.tsx`: expectations corrected to ascending sort.
  - `clockUtils.test.ts` + `useClockAngles.test.ts`: rAF + timezone fixes.
  - `ClockPage.test.js` → renamed to `ClockPage.test.jsx` and rewritten to test the real `ClockPage` with proper mocks (the old file tested a non-existent glob API).
  - `vitest.config.js`: added `@` path alias (was blocking the whole suite).
  - ✅ Suite green: **10 files / 53 tests passing.**

## Phase 1+ (future)
- [ ] Add a CI workflow (GitHub Actions) gating type-check/lint/test/verify
- [ ] Codemod `setInterval` → rAF hooks (**134** clock files)
- [ ] Codemod inline `<style>` → CSS Modules (**143** clock files)
- [ ] Consolidate duplicated font loaders / hooks / types / templates

## Current compliance baseline (from `scripts/verify-all-clocks.js`)
- Total clocks: **491** | Fully compliant: **1** | Need work: **490**
- Critical violations: **222** | Total violations: **3,672** | Compliance rate: **0%**

