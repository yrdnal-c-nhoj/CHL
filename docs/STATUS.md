# CHL Current Status

Last reviewed: 2026-09-21

This document records the repository's known engineering status and current maintenance issues. It is a snapshot, not an automated source of truth.

For authoritative requirements, see:

- [docs/ARCHITECTURE.md](ARCHITECTURE.md) — system architecture and the September 2026 historical/current boundary.
- [docs/CLOCKS.md](CLOCKS.md) — authoritative contract for current clocks.
- [docs/PERFORMANCE.md](PERFORMANCE.md) — performance budgets and guidance.
- [docs/OPERATIONS.md](OPERATIONS.md) — build, deployment, and maintenance.
- [docs/ROADMAP.md](ROADMAP.md) — planned work.
- [docs/AI_DEVELOPMENT_GUIDE.md](AI_DEVELOPMENT_GUIDE.md) — AI development guidance.
- [CONTRIBUTING.md](../CONTRIBUTING.md) — human contribution workflow.

Historical reports are retained under [docs/archive/](archive/).

> **Important:** The figures below are dated measurements. They should not be treated as live results unless the listed checks have been run again.

## Current Health Snapshot

The following measurements were recorded during the September 20–21, 2026 repository review.

| Check | Command | Recorded result |
|---|---|---|
| Build | `npm run build` | Pass — 353 MB / 4,253 files in `dist/` |
| Tests | `npm run test:run` | Pass — 115 tests |
| TypeScript (CI scope) | `npm run type-check` | Pass |
| Changed-clock verification | `npm run verify:clocks:changed` | Pass when compared pages are clean |
| Full-fleet lint | `npx eslint .` | 1,090 problems: 297 errors / 793 warnings |
| Full-fleet TypeScript | `npx tsc --noEmit` | Fails on legacy code outside CI scope |
| Full-fleet clock verification | `npm run verify:clocks` | 395 of 537 clocks violate the current contract |

The full-fleet failures are primarily historical debt. The September 2026 architectural boundary means those clocks are not automatically candidates for wholesale refactoring.

## Clock Contract

The current clock contract begins with September 2026. See [docs/CLOCKS.md](CLOCKS.md) for the complete requirements.

At the time of this review, the September 2026 verifier work identified `26-09-01` as the remaining issue being addressed. Its Three.js `requestAnimationFrame` loop is a rendering loop; displayed time must come from the shared `useClock` / `useSmoothClock` infrastructure.

New clocks must satisfy the current contract rather than inheriting legacy patterns from the historical archive.

## Repository Footprint

| Metric | Recorded value |
|---|---|
| Production build | 353 MB / 4,253 files (2026-09-20) |
| `.git` directory | 312 MB (2026-09-20) |
| CI history checkout | Full history was recorded at review time |
| Largest non-Three.js route chunk | `Thumbnail-*.js`, approximately 58.96 KB brotli |

The archive's size is a sustainability concern rather than a reason to remove historical artwork. Asset history, deployment output, and Git history should be considered separately.

## Repository Hygiene

The following root-level scratch files were removed during the September 21 review:

- `Clock.tsx`
- `useClockPage.ts`
- `config.json`
- `path/to/filename.js`

Historical clock implementations remain in place unless a concrete production, security, accessibility, deployment, shared-infrastructure, or material browser/performance issue requires a change.

## Known Gaps

- `npm run status` remains a placeholder; no `scripts/generate-status.js` currently exists.
- Full-fleet lint and TypeScript checks still expose legacy debt.
- Full-fleet clock verification still reports historical contract violations.
- Repository and deployment footprint continues to grow with the daily archive.
- Three.js bundle size remains above the current performance budget.
- A visual regression strategy for representative current clocks remains future work.
- Tailwind-related configuration/dependencies still require a separate determination of whether they are unused before removal.
- Vercel configuration and cache policy still warrant a focused modernization pass.

## Current Priorities

1. Keep September 2026 onward clocks aligned with the current architecture.
2. Finish repository documentation and contract cleanup.
3. Establish a deterministic status-generation workflow rather than treating this manually maintained snapshot as live data.
4. Address repository/archive growth without deleting historical artwork.
5. Add targeted visual regression and performance enforcement where it provides meaningful protection.

## Related Documentation

Use the current hierarchy rather than treating this status snapshot as a standards document:

- Architecture: [docs/ARCHITECTURE.md](ARCHITECTURE.md)
- Current clock contract: [docs/CLOCKS.md](CLOCKS.md)
- Performance: [docs/PERFORMANCE.md](PERFORMANCE.md)
- Operations: [docs/OPERATIONS.md](OPERATIONS.md)
- Roadmap: [docs/ROADMAP.md](ROADMAP.md)
- AI development: [docs/AI_DEVELOPMENT_GUIDE.md](AI_DEVELOPMENT_GUIDE.md)
- Human contribution: [CONTRIBUTING.md](../CONTRIBUTING.md)
