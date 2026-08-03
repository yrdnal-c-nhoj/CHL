# TODO - Align project with state-of-the-art technical standards

## Steps

- [x] Review `src/pages/2026/26-07/26-07-30/Clock.tsx` against `ARCHITECTURE.md`
- [x] Clean up `Clock.tsx`: remove dead constants, move static inline styles to CSS Module, use `<main>` root
- [x] Fix `tsconfig.json`: remove deprecated `baseUrl`, make `paths` relative (`./src/*`)
- [x] Fix `vite.config.ts` `manualChunks`: add explicit `return undefined` for non-matching path
- [x] Fix `src/utils/isoEngine.ts`: type `points` as tuples + add `noUncheckedIndexedAccess` guards
- [x] Fix `src/components/admin/TagManager.tsx`: guard `groupedByMonth[0]?.[0]`
- [x] Fix `src/components/ClockPageNav.tsx`: guard `mm`/`yy`/`dd`; remove unused `formatDate` from destructuring
- [x] Confirm clean type-check (`npx tsc --noEmit -p tsconfig.ci.json`, EXIT_CODE=0)
- [x] Align `scripts/verify-clock.js` with `ARCHITECTURE.md` §4 (canonical hook, semantic `<time>`, srOnly, memo+displayName, font loader)
- [x] Confirm verifier passes all standards on the cleaned `Clock.tsx`
- [x] Confirm production build succeeds (`npm run build`, BUILD_EXIT=0)
