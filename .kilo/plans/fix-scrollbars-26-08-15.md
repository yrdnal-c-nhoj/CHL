# Plan: Fix scrollbars in 26-08-15 clock component

## Root cause
Two issues in `src/pages/2026/26-08/26-08-15/Clock.module.css`:

1. **`.container` missing `overflow: hidden`** — Any content extending beyond the viewport bounds creates scrollbars.
2. **`.centerLine` uses `height: 49vh`** — On portrait mobile (e.g., 390×844), `49vh` = 413px but the container is only `100vmin` = 390px tall. The center line overflows by ~218px above and below the container, directly causing scrollbars.

## Ring/number positioning audit
- `.clockContainer` is `100vmin` square — correct, fits viewport
- Hour ring `25vmin`, minute ring `50vmin`, second ring `95vmin` — all ≤ container, no overflow
- Number `translateY` values (`-24vmin`, `-36vmin`, `-43vmin`) are within their respective ring bounds
- Number `text-shadow: 3px 0px 0px` adds minor rightward overflow per glyph, but this is negligible and will be clipped by `overflow: hidden`

**Conclusion:** Only `.centerLine` and the missing `overflow: hidden` need fixing. No ring/number value changes required.

## Changes

### `src/pages/2026/26-08/26-08-15/Clock.module.css`
1. Add `overflow: hidden` to `.container`
2. Change `.centerLine` `height: 49vh` → `height: 50vmin` — makes the line exactly half the container height, so with `bottom: 50%` it extends exactly to the top edge with zero overflow

## Validation
- `npm run build` completes without errors
- Visually confirm no scrollbars appear on mobile or desktop viewports
