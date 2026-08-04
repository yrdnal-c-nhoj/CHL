# TODO

## Task: Load 26-08-02.ttf font in 26-08-02 clock page

- [x] Import the font: `import fontUrl from '@/assets/fonts/26fonts/26-08-02.ttf?url';`
- [x] Add `fontUrl` to the `assets` array
- [x] Populate `fontConfigs` with `{ fontFamily: 'ClockFont_26_08_02', fontUrl }`
- [x] Verify the changes compile and the font loads correctly

## Task: Rotate clock digits to align with the perimeter

- [x] Add per-digit `--num-rotation` CSS variable (`num * 30` degrees)
- [x] Apply rotation in the `number` style base transform
- [x] Preserve rotation in the `auroraPulseNumber` keyframes
- [x] Verify no TypeScript errors in the 26-08-02 file
