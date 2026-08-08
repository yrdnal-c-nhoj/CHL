# Inline `<style>` → CSS Modules — Codemod Plan (triage-first, conservative)

Tracked progress for converting the 143 clock files with inline `<style>` tags
into CSS Modules, following the successful `setInterval` triage-first pattern.

## Goal

Eliminate the `inline-style` critical violation (`<style>` tags) across clock
files WITHOUT breaking rendering. CSS Modules scope/hash selectors, so a naive
auto-conversion of templated `@font-face`, `@keyframes`, or plain `.class{}`
selectors references by `className="..."` would silently break clocks. We
therefore classify first, auto-migrate only the provably-safe static subset,
and leave the rest as a documented manual backlog.

## Buckets (from `--triage`)

- **A: static-font-face** — `<style>` contains only static `@font-face`
  (no `${}` template literals, no keyframes, no class selectors). Safe to
  auto-migrate: extract to `Clock.module.css`, add `import styles`.
  **Result: EMPTY (0 files).** No file is provably-safe to auto-convert.
- **B: static-keyframes** — static `@keyframes` only (no templates, no class
  selectors). **21 files.** Not auto-safe: keyframes names are referenced by
  inline `animation:` style props, which CSS Modules would hash/break.
- **C: static-class-selectors** — `.class{}` selectors referenced by
  `className="..."` in JSX. **12 files.** Requires JSX className rewrites.
- **D: templated** — contains `${...}` (dynamic font URLs / computed values).
  **65 files.** Manual migration required.
- **E: mixed/other** — keyframes + classes + templates, or unusual structure.
  **41 files.** Manual migration required.
- **(none)** — 4 files flagged by regex but actually contain no `<style>` tag
  (false-positive from `<style` in comments). No action.

## Finding & disposition

**No provably-safe auto-migration exists.** Every inline `<style>` in the fleet
either (a) defines `@keyframes` referenced from inline `animation:` style props,
(b) defines `.class{}` selectors referenced by `className="..."`, or (c) contains
JS-templated `@font-face { url(${var}) }`. All three break under naive CSS-Module
conversion (scoped/hashed names). This mirrors the Pass 2 `setInterval` finding:
triage is the deliverable; the actual migration is manual per-clock.

## Steps

- [x] Build `scripts/codemods/migrate-inline-style-to-css-modules.mjs` with
      a `--triage` classifier over the 143 files.
- [x] Generate `scripts/codemods/inline-style-triage.json` (143 files classified).
- [ ] **Manual migration backlog** (all 143) — work off clock-by-clock, with
      screenshot verification via the existing Playwright capture pipeline.
- [ ] Verify: `node scripts/verify-all-clocks.js --csv clocks-report.csv`.
- [ ] Build: `npm run build`; tests: `npm run test:run`.
- [ ] On green, ratchet `.github/compliance-baseline.json` downward.
- [ ] Leave buckets as documented manual backlog in triage JSON.

## Ratchet procedure

1. `node scripts/verify-all-clocks.js --csv clocks-report.csv`
2. On green (non-regressed), lower numbers in `.github/compliance-baseline.json`.
3. Commit the lowered baseline so CI ratchets compliance upward.
