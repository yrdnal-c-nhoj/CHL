# CHL Current Status

Last reviewed: 2026-09-17

This file is the current source of truth for repository health. For the full
project roadmap, standards, and phased improvement plan, see
[`docs/ROADMAP.md`](../ROADMAP.md). Historical audit reports live in
`docs/archive/`. The `npm run status` command is a placeholder; see live checks below.

## Live Check Summary

These results reflect the current state after recent fixes.

| Check | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ Pass |
| Tests | `npm run test:run` | ✅ Pass (115 tests) |
| Lint (recent 26-09 clocks) | `npx eslint "src/pages/2026/26-09/**/*.{ts,tsx}"` | ✅ Pass |
| TypeScript (in-scope, via tsconfig.ci.json) | `npm run type-check` | ✅ Pass |
| Clock verification (changed pages) | `npm run verify:clocks:changed` | ✅ Pass |
| Lint (full fleet) | `npm run lint` | ❌ Failed (legacy debt) |
| TypeScript (full fleet) | `npx tsc --noEmit` | ❌ Failed (legacy debt) |
| Clock verification (full fleet) | `npm run verify:clocks` | ❌ Failed (legacy debt) |

### Test detail

All 115 tests pass. Run `npm run test:run` to confirm.

### Lint detail

Full `npm run lint` shows legacy violations across 2025 and 2026 Jan-Aug clocks. Recent 26-09 clocks are clean.

### TypeScript detail

Full `npx tsc --noEmit` (using tsconfig.json) surfaces thousands of legacy errors. The CI type-check (`npm run type-check` via tsconfig.ci.json) is clean for in-scope code.

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