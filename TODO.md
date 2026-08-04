# TODO — Avoid FOUC (26-08-02 clock)

## Steps
- [x] Explore repo & understand FOUC strategy (ARCHITECTURE.md §6, fontLoader, index.html)
- [x] Confirm scope with user (Option B: CSS cleanup only, leave ClockPage.tsx untouched)
- [x] Clean up duplicate/conflicting definitions in `src/pages/2026/26-08/26-08-02/Clock.module.css`
- [x] Verify with lint + type-check (pre-existing errors only, unrelated to CSS change)
- [x] Ensure digits start blurred: base `.number` `filter` set to `blur(7px)` matching animation start, `animation-fill-mode: both`, and `auroraPulseNumber` minimum blur raised from `1px` → `6px` so digits are never sharp
