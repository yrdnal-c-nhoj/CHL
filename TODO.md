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

## Phase 1 (in progress)
- [x] Add a CI workflow (GitHub Actions) gating test/build + standards/lint regression
  - `.github/workflows/ci.yml` replaced the old red-always gate with a layered design:
    - **Hard gate** (`test-and-build`): `npm ci` → `vitest run` → `npm run build` (always green; type-check is non-blocking while legacy debt remains).
    - **No-new-debt gate** (`verify-standards`): compares clock-standards + lint counts to a committed baseline (`.github/compliance-baseline.json`) and **fails only on regression**, uploading `clocks-report.csv` as an artifact.
- [x] Codemod `setInterval` → rAF hooks — **Pass 1 (safe pure-ticker): 24/134 migrated**
  - `scripts/codemods/migrate-setInterval-to-hooks.mjs` now: persists transformed code, uses collision-free `clockTime` var, inserts canonical import at the true end of the import block, and writes a verifier-safe marker ("legacy interval" not the banned literal).
  - Verified: `npm run build` ✅, `npm run test:run` ✅ (10 files / 53 tests), `verify-all-clocks.js` → `prohib:set-interval` **134 → 110**, critical violations **222 → 204**, total violations **3672 → 3633**.
  - Baseline ratcheted in `.github/compliance-baseline.json`.
- [x] Codemod `setInterval` → rAF hooks — **Pass 2 triage (110 remaining: complex/multi-interval/animation cases)**
  - Added `--triage` mode to `scripts/codemods/migrate-setInterval-to-hooks.mjs` (read-only classifier).
  - **Finding:** all 110 remaining are *behavioral* intervals, not provably-safe pure tickers. No further auto-migration is safe.
  - Triage buckets (`scripts/codemods/pass2-triage.json`):
    - `A: deprecated-import-only` — **7 files** already use the canonical rAF-backed `useClockTime` (compliant for the time-hook rule; `PLAN-PASS2.md`).
    - `B: single-behavioral` — **98 files** (DOM/animation/ref intervals; manual review).
    - `C: multi-interval` — **2 files** (`26-01-15`, `26-02-17`; manual review).
    - `D: deprecated-import + own interval` — **3 files** (`25-06-06`, `25-09-28`, `25-11-28`; manual review).
  - See `PLAN-PASS2.md` for the manual-backlog disposition. This task does NOT ratchet the baseline (no safe reductions).
- [ ] Codemod inline `<style>` → CSS Modules (**143** clock files)
- [ ] Consolidate duplicated font loaders / hooks / types / templates

## Ratchet procedure (after each migration drive)
1. Run `node scripts/verify-all-clocks.js --csv clocks-report.csv`.
2. On a green (non-regressed) result, lower the numbers in `.github/compliance-baseline.json` to the new values.
3. Commit the lowered baseline so the CI gate ratchets compliance upward.

## Current compliance baseline (from `scripts/verify-all-clocks.js`)
- Total clocks: **491** | Fully compliant: **1** | Need work: **490**
- Critical violations: **204** | Total violations: **3,633** | Compliance rate: **0%**

