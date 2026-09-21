# CHL Current Status

Last reviewed: 2026-09-21

This file is the current source of truth for repository health. For the full
project roadmap, standards, and phased improvement plan, see
[`docs/ROADMAP.md`](../ROADMAP.md). Historical audit reports live in
`docs/archive/`. The `npm run status` command is a placeholder; see live checks below.

## Live Check Summary

Fleet-wide lint, TypeScript, and `dist/` size figures were last measured
**2026-09-20**. Clock inventory, git state, stray-root hygiene, and the
September contract-verifier set were rechecked **2026-09-21**.

| Check | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ Pass (dist/ = 353MB, 4,253 files; measured 2026-09-20) |
| Tests | `npm run test:run` | ✅ Pass (115 tests; measured 2026-09-20) |
| TypeScript (in-scope, via tsconfig.ci.json) | `npm run type-check` | ✅ Pass |
| Clock verification (changed pages) | `npm run verify:clocks:changed` | ✅ Pass (when the compared pages are clean) |
| Lint (full fleet) | `npx eslint .` | ❌ 1,090 problems (297 errors, 793 warnings; measured 2026-09-20) |
| TypeScript (full fleet) | `npx tsc --noEmit` | ❌ Failed (legacy debt, not re-counted this pass) |
| Clock verification (full fleet) | `npm run verify:clocks` | ❌ **395 of 537** clocks violate the contract (73.6%; rechecked 2026-09-21) |

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

### Clock contract detail

September 2026 **lint** remains in-scope and is expected to stay clean. The
**clock contract verifier** (rechecked 2026-09-21) now fails **one** September
clock:

- **`26-09-01`** — Three.js render loop uses `requestAnimationFrame`. Canonical
  time should still come from `useClock` / `useSmoothClock` for the accessible
  `<time>` element; the verifier does not yet distinguish a WebGL render loop
  from a prohibited animation timer. See `ROADMAP.md` Phase 4.8.

`26-09-04` and `26-09-13` now **pass** the verifier (they failed as of
2026-09-20). New September clocks (`26-09-18`–`26-09-20`) pass the verifier
pattern-match but still need the Optimization Checklist in
`CLOCK_STANDARDS.md` (copy-paste `displayName`s, cheap `useMemo`, asset
budgets).

### Delivery / repository footprint

| Metric | Value | Trend |
|---|---|---|
| Production build (`dist/`) | 353MB / 4,253 files (2026-09-20) | Grows ~daily, unbounded |
| `.git` directory | 312MB (2026-09-20) | Grows unbounded; not all binary types route through LFS |
| CI checkout | `fetch-depth: 0` (full history) on every run | Cost grows with `.git` size |
| Largest non-Three.js route chunk | `Thumbnail-*.js` ≈ 58.96KB br | Exceeds the framework chunk (50.89KB br); now listed in `PERFORMANCE.md` |

This does not currently harm the experience of someone loading a single
day's clock — `useClockPage.ts` correctly lazy-loads only that day's module
and (non-video) assets. It is a **build-artifact and repository sustainability**
issue: every day adds roughly a clock's worth of permanent weight to the
deploy output and git history, with no retention, archival, or LFS strategy
in place. See `ROADMAP.md` Phase 4.

### Repository hygiene

Root-level scratch files (`Clock.tsx`, `useClockPage.ts`, `config.json`,
`path/to/filename.js`) are **gone** as of 2026-09-21. `ROADMAP.md` Phase 4.1
is complete.

## Git State

- **Branch:** `main` (tracks `origin/main`)
- **Working tree:** Dirty — uncommitted asset edits under
  `src/assets/images/26_images/26-09/` (26-09-18 digits, 26-09-19
  `implode.webm`, deleted unused `.webm` files) plus this documentation pass
- **Recent commits of record:**
  - Fix 26-09-16 clock contract violations
  - Fix tsconfig.ci.json exclude for legacy clocks
  - Fix test file TS errors for clean type-check
  - Add type-check npm script and update CI

## Clock Inventory

- **2025:** Apr–Dec (`25-04`…`25-12`) — 9 months of clocks
- **2026:** Jan–Aug (`26-01`…`26-08`) — 8 full months, latest day **2026-08-31**
- **2026-09:** Sep 1–20 (`26-09-01`…`26-09-20`) — **20 clocks**, in-scope for CI
  strict checks
- **Fleet total:** 537 `Clock.tsx` pages

Canonical implementation template: `src/templates/BaseClock.tsx`. Analog /
video references (not claimed as fully contract-perfect):
`src/pages/2026/26-08/26-08-02/Clock.tsx`,
`src/pages/2026/26-07/26-07-29/Clock.tsx`.

## Known Gaps

- `scripts/verify-all-clocks.js` is active; run with `npm run verify:clocks` or
  `verify:clocks:changed`.
- `scripts/generate-status.js` does NOT exist; `npm run status` is a placeholder.
- `.kilo/worktrees/juvenile-lip/` may cause stale test leakage if present.
- Legacy clocks (2025, 2026 Jan–Aug) have outstanding lint, TypeScript, and
  contract violations tracked in `docs/ROADMAP.md`.
- Three.js bundle (~190KB brotli) exceeds the <150KB budget; lazy-loading or
  splitting `@react-three/drei` is planned.
- `26-09-01` is the remaining in-scope verifier failure (Three.js rAF loop).
- `docs/ARCHITECTURE.md` and `docs/EXCEPTIONS.md` do not exist; note justified
  exceptions in this file (and in the clock source) instead.

## Related Docs

- Clock component contract: `docs/CLOCK_STANDARDS.md`
- Performance budgets: `docs/PERFORMANCE.md`
- Agent playbook: `docs/AI_DEVELOPMENT_GUIDE.md`
- Architectural standards: `src/templates/BaseClock.tsx` + its module CSS
- Historical reports: `docs/archive/`
