# CHL Current Status

Last reviewed: 2026-09-20

This file is the current source of truth for repository health. For the full
project roadmap, standards, and phased improvement plan, see
[`docs/ROADMAP.md`](../ROADMAP.md). Historical audit reports live in
`docs/archive/`. The `npm run status` command is a placeholder; see live checks below.

## Live Check Summary

These results reflect the current state after recent fixes.

| Check | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ Pass (dist/ = 353MB, 4,253 files) |
| Tests | `npm run test:run` | ✅ Pass (115 tests) |
| TypeScript (in-scope, via tsconfig.ci.json) | `npm run type-check` | ✅ Pass |
| Clock verification (changed pages) | `npm run verify:clocks:changed` | ✅ Pass |
| Lint (full fleet) | `npx eslint .` | ❌ 1,090 problems (297 errors, 793 warnings) |
| TypeScript (full fleet) | `npx tsc --noEmit` | ❌ Failed (legacy debt, not re-counted this pass) |
| Clock verification (full fleet) | `npm run verify:clocks` | ❌ **396 of 537** clocks violate the contract (73.7%) |

### Test detail

All 115 tests pass. Run `npm run test:run` to confirm.

### Lint detail

Full-fleet lint is **1,090 problems** (297 errors / 793 warnings) as of 2026-09-20 —
down from the ~2,400 figure previously recorded, but still substantial. Legacy
violations remain concentrated in 2025 and 2026 Jan–Aug clocks.

### TypeScript detail

Full `npx tsc --noEmit` (using tsconfig.json) surfaces legacy errors outside the
CI scope. The CI type-check (`npm run type-check` via tsconfig.ci.json) is clean
for in-scope code.

### Clock contract detail — correction

The previous entry (2026-09-17) implied the September 2026 fleet was fully
contract-compliant ("26-09 clocks: 0 errors"). Re-running
`node scripts/verify-all-clocks.js` on 2026-09-20 shows that is true for
**lint** but not for the **clock contract verifier**: `26-09-01`, `26-09-04`,
and `26-09-13` currently fail (missing `useClock`/`useSmoothClock` imports,
deprecated hook usage, or a direct timer/rAF loop). These are within the
"in-scope, should be clean" window and should be fixed first, since they
undermine confidence that new clocks are compliant by construction.

### Delivery / repository footprint (new — not previously tracked)

| Metric | Value | Trend |
|---|---|---|
| Production build (`dist/`) | 353MB / 4,253 files | Grows ~daily, unbounded |
| `.git` directory | 312MB | Grows unbounded; not all binary types route through LFS |
| CI checkout | `fetch-depth: 0` (full history) on every run | Cost grows with `.git` size |
| Largest non-Three.js route chunk | `Thumbnail-*.js` ≈ 58.96KB br | Exceeds the framework chunk (50.89KB br); not in the `PERFORMANCE.md` budget table |

This does not currently harm the experience of someone loading a single
day's clock — `useClockPage.ts` correctly lazy-loads only that day's module
and (non-video) assets. It is a **build-artifact and repository sustainability**
issue: every day adds roughly a clock's worth of permanent weight to the
deploy output and git history, with no retention, archival, or LFS strategy
in place. See `ROADMAP.md` Phase 4.

### Repository hygiene (new)

Stray, non-`src/` files exist at the repository root and are not part of the
built app: `Clock.tsx`, `useClockPage.ts`, `config.json`, `path/to/filename.js`.
These appear to be scratch/debug artifacts that were accidentally committed.
None are imported by anything in `src/`; recommend deleting them (see
`ROADMAP.md` Phase 4.1).

## Git State

- **Branch:** agents/next-steps-guidance
- **Working tree:** Clean
- **Recent commits:**
  - Fix 26-09-16 clock contract violations
  - Fix tsconfig.ci.json exclude for legacy clocks
  - Fix test file TS errors for clean type-check
  - Add type-check npm script and update CI
  - cf320c4bb fix: simplify september clock layout
  - a6ec5ea8e fix: clean up pirate skew and canvas clocks
  - 94e756bf9 fix: stabilize analog image clock refs
  - 769858d2f fix: clean up legacy clock lint errors
  - d5baf1a7b fix: stabilize brick clock ball style

## Clock Inventory

- **2025:** Apr–Dec (`25-04`…`25-12`) — 9 months of clocks
- **2026:** Jan–Aug (`26-01`…`26-08`) — 8 full months, latest day **2026-08-31**
- **2026-09:** Sep 1–17 (`26-09-01`…`26-09-17`) — **17 clocks**, in-scope for CI strict checks

## Known Gaps

- `scripts/verify-all-clocks.js` is active; run with `npm run verify:clocks` or `verify:clocks:changed`.
- `scripts/generate-status.js` does NOT exist; `npm run status` is a placeholder.
- `.kilo/worktrees/juvenile-lip/` may cause stale test leakage if present.
- Legacy clocks (2025, 2026 Jan–Aug) have outstanding lint, TypeScript, and contract violations tracked in `docs/ROADMAP.md`.
- Three.js bundle (~190KB brotli) exceeds the <150KB budget; lazy-loading or splitting `@react-three/drei` is planned.

## Related Docs

- Clock component contract: `docs/CLOCK_STANDARDS.md`
- Performance budgets: `docs/PERFORMANCE.md`
- Architectural standards: `src/templates/BaseClock.tsx` + its module CSS
- Historical reports: `docs/archive/`