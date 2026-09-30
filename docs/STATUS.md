# CHL Current Status

Last reviewed: 2026-09-29

This document records the repository's known engineering status and current maintenance issues. It is a snapshot, not an automated source of truth.

For authoritative requirements, see:

- [docs/ARCHITECTURE.md](ARCHITECTURE.md) — system architecture and the September 2026 historical/current boundary.
- [docs/CLOCKS.md](CLOCKS.md) — authoritative contract for current clocks.
- [docs/CLOCK_RECIPES.md](CLOCK_RECIPES.md) — code patterns for building current clocks.
- [docs/PERFORMANCE.md](PERFORMANCE.md) — performance budgets and guidance.
- [docs/OPERATIONS.md](OPERATIONS.md) — build, deployment, and maintenance.
- [docs/ROADMAP.md](ROADMAP.md) — planned work.
- [AGENTS.md](../AGENTS.md) — AI development guidance.
- [CONTRIBUTING.md](../CONTRIBUTING.md) — human contribution workflow.

Historical reports are retained under [docs/archive/](archive/).

> **Important:** The figures below are dated measurements. They should not be treated as live results unless the listed checks have been run again.

## Current Health Snapshot

Measurements dated 2026-09-29 were taken on a fresh clone with `npm ci` (Node 22). The build and repository-size rows are older because the clone used for the 09-29 run did not include Git LFS media, so a full production build could not be reproduced.

| Check | Command | Recorded result |
|---|---|---|
| Build | `npm run build` | Pass — 353 MB / 4,253 files in `dist/` (2026-09-20; not re-run 09-29) |
| Tests | `npm run test:run` | **Exits non-zero.** 128 tests pass in 18 files; 1 file fails to load: root `e2e-check.spec.ts` imports `@playwright/test`, which is not a dependency (2026-09-29) |
| TypeScript (CI scope) | `npm run type-check` | Pass (2026-09-29) |
| Changed-clock verification | `npm run verify:clocks:changed` | Pass when compared pages are clean |
| Full-fleet lint | `npx eslint .` | 1,062 problems: 286 errors / 776 warnings (2026-09-29) |
| September 2026 lint | `npx eslint src/pages/2026/26-09` | 1 error: `26-09-14/Clock.tsx` uses `Date.now()`, which the lint rule forbids (2026-09-29) |
| Full-fleet TypeScript | `npx tsc --noEmit` | Fails: about 2,350 errors, all outside the CI scope (2026-09-29) |
| Full-fleet clock verification | `npm run verify:clocks` | 373 of 545 clocks violate the current contract (2026-09-29); all 29 September 2026 clocks pass |

CI (`.github/workflows/ci.yml`) runs `verify:clocks:changed`, `test:run`, `type-check`, and `build`; it does not run lint. Because `test:run` fails on a clean checkout (row above), the CI test step is expected to fail as well; the Actions history was not accessible for this review, so that is unconfirmed.

The full-fleet failures are primarily historical debt. The September 2026 architectural boundary means those clocks are not automatically candidates for wholesale refactoring.

## Clock Contract

The current clock contract begins with September 2026. See [docs/CLOCKS.md](CLOCKS.md) for the complete requirements.

As of 2026-09-29, all 29 clocks in the September 2026 window pass `npm run verify:clocks`. The last remaining case, `26-09-01`, used a Three.js `requestAnimationFrame` render loop while sourcing its displayed time from `useClock()`; `scripts/clock-verifier-rules.js` now distinguishes that rendering loop from an independent clock-time source (see `docs/ROADMAP.md` 4.8), and `docs/CLOCKS.md` documents the exception.

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

The following root-level scratch files were removed during the September 21 review (they have since been joined by others; see Known Gaps):

- `Clock.tsx`
- `useClockPage.ts`
- `config.json`
- `path/to/filename.js`

Historical clock implementations remain in place unless a concrete production, security, accessibility, deployment, shared-infrastructure, or material browser/performance issue requires a change.

## Known Gaps

- `npm run test:run` fails on a clean checkout because of the root `e2e-check.spec.ts` (see Health Snapshot).
- Root-level files with no references from `package.json` or the docs: an empty file named `git`, two `.webm` files (one named `xdfsdfsdfsfswefswefwefwsef.webm`, one a screen recording), `threejs-chunking.patch`, `check-images.cjs`, `e2e-check.spec.ts`, a `new-clock.js` (a second, different implementation of `scripts/new-clock.js`; its path logic assumes it lives in `scripts/`), and `test-results/.last-run.json`.
- `26-09-14/Clock.tsx` uses `Date.now()` as an animation start anchor. The lint rule and `docs/CLOCKS.md` treat `Date.now()` as forbidden; either change the clock or narrow the rule. The clock verifier does not detect it.
- Production cache headers are unverified: `vercel.json` has a catch-all `no-cache` rule that also matches `/assets/*`. See `docs/OPERATIONS.md` for the check.
- Unused deployment configs remain: `netlify.toml`, `public/_headers`, `Dockerfile`, `nginx.conf`.
- `PERFORMANCE.md` requires `preload="none"` on background video, but most current video clocks omit it (open decision noted in `docs/CLOCK_RECIPES.md`).
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
- Current clock recipes: [docs/CLOCK_RECIPES.md](CLOCK_RECIPES.md)
- Performance: [docs/PERFORMANCE.md](PERFORMANCE.md)
- Operations: [docs/OPERATIONS.md](OPERATIONS.md)
- Roadmap: [docs/ROADMAP.md](ROADMAP.md)
- AI development: [AGENTS.md](../AGENTS.md)
- Human contribution: [CONTRIBUTING.md](../CONTRIBUTING.md)
