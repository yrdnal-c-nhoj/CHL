# TODO

- [ ] Update `src/hooks/useClockPage.ts` to fail-open when `module.assets` is malformed or when `preloadAssets` fails.
- [ ] Add defensive logging to pinpoint which clock module/date caused failures in production.
- [ ] Ensure overlay behavior never blocks rendering due to asset preload errors.
- [ ] Run `npm test` and `npm run type-check` (or `npm run build`) to confirm the fix.

