# TODO - Optimize 26-06-02 Clock

- [ ] Refactor `src/pages/2026/26-06/26-06-02/Clock.tsx`
  - [ ] Switch time hook from local `useClockTime` to `useSecondClock`.
  - [ ] Precompute a fixed pool of VTEC image placements (size = `ALL_IMAGES.length * 2`) once on mount.
  - [ ] Replace per-tick `setVisibleImages([...prev, newImage])` + `slice()` with a rotating index update that keeps array length constant.
  - [ ] Disable `popIn` animation after the first render (via ref/flag or conditional CSS class).
  - [ ] Ensure memoization minimizes unnecessary re-renders.
- [ ] (Optional) Update `src/pages/2026/26-06/26-06-02/Clock.module.css` to add `.noPopIn`.
- [ ] Run `npm test` and `npm run build`.
- [ ] Manual verification of 26-06-02 page behavior and animation timing.

