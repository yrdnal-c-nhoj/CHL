# CHL Current Status

Last reviewed: 2026-09-02

This file is the current source of truth for repository health. Historical audit
reports live in `docs/archive/`. Refresh with `npm run status` (script pending —
see "Known Gaps" below).

## Live Check Summary

These results were generated on 2026-09-02 by running the live checks manually.

| Check | Command | Result |
|---|---|---|
| Build | `npm run build` | ✅ Pass |
| Tests | `npm run test:run` | ❌ Failed |
| Lint | `npm run lint` | ❌ Failed |
| TypeScript | `npx tsc --noEmit` | ❌ Failed |
| Clock verification | `node scripts/verify-all-clocks.js` | ❌ Failed (script missing) |
| Status regen | `npm run status` | ❌ Failed (script missing) |

### Test detail

- 32 test files: **12 failed / 20 passed**
- 230 tests: **57 failed / 173 passed**
- 6 uncaught exceptions
- Dominant cause: `Error: useDataContext must be used within a DataProvider`
  thrown from `TopNav` while running `.kilo/worktrees/juvenile-lip/src/test/Home.test.tsx`.
  A stale Kilo worktree is leaking into the test run and bypassing the
  `DataProvider`. Investigate `vitest.config.js` include patterns and the
  `.kilo/worktrees/juvenile-lip/` directory.

### Lint detail

- 2434 problems: **776 errors / 1658 warnings**
- Headline error: `react-hooks/refs` — `Cannot access ref value during render`
  at `src/pages/2026/26-08/26-08-24/Clock.tsx:134` (`clocks: clocksRef.current`
  read inside a `useMemo` body). Refactor: lift the read into a `useRef` /
  `useState` that updates via `useEffect`, or move the calculation into an
  event-driven callback.
- Heavy warning clusters:
  - `@typescript-eslint/no-explicit-any` in `assetLoader.ts`,
    `consoleFilters.ts`, `debounce.ts`, `fontLoader.tsx`, `Home.tsx`
  - `@typescript-eslint/no-non-null-assertion` in `assetLoader.ts`,
    `fontLoader.tsx`, `isoEngine.ts`, `thumbnailMap.ts`
  - `@typescript-eslint/no-empty-object-type` in `src/types/global.d.ts`
  - Unused `useMemo` import in `src/pages/ClockPage.tsx`
  - Unescaped apostrophes in `src/pages/Contact.tsx`

### TypeScript detail

- ~50 errors, concentrated in three files:
  - `src/pages/2026/26-08/26-08-23/Clock.tsx` — array-index accesses not
    guarded against `undefined` (TS2532, TS18048)
  - `src/pages/2026/26-08/26-08-28/useMazeRenderer.ts` — same class of
    "Object is possibly 'undefined'" errors (TS2532, TS18048)
  - `src/test/DataLoading.test.tsx` — `first` from `find(...)` not narrowed
- Root cause: `noUncheckedIndexedAccess` is effectively on (or inferred from
  these patterns); recent clock code does not yet guard index lookups.

## Git State

- **Branch:** main
- **Recent commits:**
  - `8b38d7064d k`
  - `1195e16ede s`
  - `a79a9610d2 m`
  - `1ad14ca308 m`
  - `e1c7e040f0 m`
  - `449e81bcc3 b`
  - `07f5a658eb s`
  - `985a8ea2d6 s`
  - `3673715494 a`
  - `e2e89d0f07 x`
- **Working tree:**
  - **Dirty** — 1 modified file: `src/pages/2026/26-04/26-04-02/Clock.tsx`

## Clock Inventory

- **2025:** Apr–Dec (`25-04`…`25-12`) — 9 months of clocks
- **2026:** Jan–Aug (`26-01`…`26-08`) — 8 full months, latest day **2026-08-31**
- **Today (2026-09-02):** no clock yet — `src/pages/2026/26-09/` does not exist

## Known Gaps

- `scripts/verify-all-clocks.js` referenced by `docs/CLOCK_CONTRACT.md` is
  missing. Either restore it or remove the reference.
- `scripts/generate-status.js` referenced by `package.json` and this file is
  missing. Without it, `npm run status` fails.
- `.kilo/worktrees/juvenile-lip/` is being picked up by Vitest and is breaking
  the test run. Add it to the test ignore list or remove the worktree.
- `docs/CLOCK_CONTRACT.md` and `src/utils/hooks/index.ts` now agree on the
  canonical clock-hook API (`useClock` for 1-second updates,
  `useSmoothClock` for sub-second / smooth animation). The previous names
  (`useSecondClock`, `useMillisecondClock`) are still exported as
  `@deprecated` thin re-exports for backward compatibility and will be
  removed once all callers have been migrated.
- Remaining clock files have been bulk-migrated to `useClock` /
  `useSmoothClock`. Any new code must use the canonical names.
- `docs/PERFORMANCE.md` lists a Three.js budget of `< 150KB` gzipped but the
  current `three-[hash].js` chunk is **190.66KB brotli / 859.55KB raw**. This
  exceeds the budget and should be split or its limit revisited.
- Recent clock files (`26-08-23`, `26-08-28`) have not been migrated to
  guard against `undefined` index access — required before the
  `noUncheckedIndexedAccess` style is treated as the project baseline.

## Related Docs

- Clock component contract: `docs/CLOCK_CONTRACT.md`
- Performance budgets: `docs/PERFORMANCE.md`
- Architectural standards: `src/templates/BaseClock.tsx` + its module CSS
- Historical reports: `docs/archive/`