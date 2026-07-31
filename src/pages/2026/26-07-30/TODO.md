# Task: Fill Clock Digits with Random CAMO Textures

## Steps
- [x] Explore repo: read Clock.tsx, Clock.module.css, locate camo textures
- [x] Confirm plan with user
- [x] Import all 12 camo textures (camo1.webp - camo12.webp) into Clock.tsx
- [x] Add camo textures to exported `assets` array
- [x] Implement random per-position camo assignment (6 distinct textures, shuffled)
- [x] Enforce constraint: same digit value never shares a pattern; seconds positions are exempt
- [x] Update positionedDigits to include the assigned camo texture per position
- [x] Update Clock.module.css: use `background-clip: text` to fill glyphs with camo textures
- [x] Remove obsolete text-shadow / solid color styles
- [x] Verify with TypeScript / lint checks

