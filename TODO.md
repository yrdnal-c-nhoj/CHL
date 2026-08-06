# TODO: Fix Clock 26-08-04 Smooth Movement

## Steps
- [x] 1. Update `Clock.tsx` to use `useMillisecondClock(16)` for ~60 FPS updates
- [x] 2. Remove CSS `transition` declarations from `.hourHand`, `.minuteHand`, and `.secondHand` in `Clock.module.css`
- [x] 3. Verify the clock runs smoothly and never moves backwards

## Notes
- Type check error in `src/context/testclocks.json` is pre-existing and unrelated to these changes.
