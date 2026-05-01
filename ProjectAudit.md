# BorrowedTime Technical Audit
Audit date: 2026-05-01

## 1. Executive Summary
BorrowedTime’s architecture is fundamentally strong (registry-driven routing, code-split daily clocks, successful production build), but delivery quality and long-term maintainability are currently constrained by large static-asset volume and substantial lint/type debt concentrated in clock modules.

Current state:
- Build pipeline: production build succeeds.
- Type quality: high-error baseline that blocks safe large-scale refactors.
- Lint quality: high warning/error baseline with consistency and purity violations.
- Asset hygiene: confirmed removable unused fonts/images/videos.

## 2. Verified Build, Quality, and Delivery Baseline
Commands run:
- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npm run audit:images`
- `npm run audit:fonts`

Measured outcomes:
- TypeScript: 3241 errors (`typecheck-report.txt`)
- ESLint: 518 errors, 3288 warnings (`eslint-report.json`)
- Build: passes (`npm run build`)
- Dist footprint: 249.87 MB across 2836 files
- Largest JS bundles:
  - `dist/assets/three-C9XuxQ2Y.js` (~747.2 KB)
  - `dist/assets/vendor-DgNhqpVS.js` (~273.4 KB)
  - `dist/assets/dateUtils-DVuClMY7.js` (~65.5 KB)
- Dist size by extension (largest):
  - `.mp4`: ~81.76 MB
  - `.webp`: ~60.01 MB
  - `.gif`: ~42.92 MB
  - `.ttf`: ~30.08 MB

## 3. Asset Utilization Findings
Generated reports:
- `unused-images-report.txt`
- `unused-images-only-report.txt`
- `unused-videos-report.txt`
- `unused-fonts-report.txt`
- `non-standard-fonts.txt`

Verified unused assets:
- Unused images (non-video): 228 files, 9.06 MB
- Unused videos: 2 files, 1.18 MB
- Unused fonts: 12 files, 2.14 MB
- Total removable (confirmed by reference scan): 242 files, 12.38 MB

Largest unused-image hotspots:
- `src/assets/images/2026/26-01/26-01-04/digits` (169 files, 2850.7 KB)
- `src/assets/images/2026/26-02/26-02-25` (2 files, 1190.6 KB)
- `src/assets/images/2026/26-03/26-03-14/mother.jpg` (939.8 KB)
- `src/assets/images/2026/26-04/26-04-06` (16 files, 878.5 KB)
- `src/assets/images/2026/26-04/26-04-27` (4 files, 734.3 KB)

Unused videos:
- `src/assets/images/2025/25-10/25-10-14/air.webm` (33.8 KB)
- `src/assets/images/2026/26-02/26-02-15/caldera.mp4` (1176.0 KB)

Unused fonts:
- `src/assets/fonts/2025/25-06-20-inde1.ttf`
- `src/assets/fonts/2025/25-06-20-inde2.ttf`
- `src/assets/fonts/2025/25-09-14-swi.ttf`
- `src/assets/fonts/2025/25-09-18-matrix.ttf`
- `src/assets/fonts/2025/25-09-20-orb.ttf`
- `src/assets/fonts/2025/25-12-10-jup.ttf`
- `src/assets/fonts/2026/26--03-25-ride.ttf`
- `src/assets/fonts/2026/26-03-01-270west.ttf`
- `src/assets/fonts/2026/26-03-02-ripple.ttf`
- `src/assets/fonts/2026/26-03-31-crab.ttf`
- `src/assets/fonts/2026/26-04-04.ttf`
- `src/assets/fonts/2026/26-04-27.otf`

Non-standard font names:
- 5 files reported by `npm run audit:fonts` (`non-standard-fonts.txt`)

## 4. Code Health and Maintainability Risk
Primary quality blockers:
- Type-check debt concentrated in specific daily clock modules (top offenders listed in `typecheck-report.txt`).
- ESLint findings dominated by:
  - `import/order`
  - `max-lines-per-function`
  - `@typescript-eslint/no-unused-vars`
  - `react/self-closing-comp`
  - `react-hooks/purity`

Observed structural contributors:
- High per-clock complexity and long render functions.
- Inconsistent import/style/typing patterns across date-based modules.
- Heavy use of media-first animation logic in component bodies.

## 5. Documentation Survey Findings (May 2026)
- **Implementation Drift**: 40% of reviewed clocks bypass CSS Modules in favor of inline styles.
- **Font Support**: 65% of clocks use `.otf` or `.ttf`. TTF/OTF are accepted standards; WOFF2 conversion is not a priority.
- **A11y Regression**: Several Canvas-based clocks (notably `26-04-21`) are missing semantic `<time>` tags, impacting SEO and screen readers.
- **Utility Fragmentation**: Some clocks use `@/utils/hooks` while newer ones use `@/utils/clockUtils`. 

### Resolution Plan
1. Standardize all time hooks into `@/utils/hooks`.
2. Retrofit missing `<time>` tags into all Canvas implementations.

## 6. Performance and Delivery Strategy (Future-Proofing)
### Phase A: Safe Cleanup (immediate)
1. Remove the 242 confirmed unused assets after one visual smoke pass.
2. Normalize 5 non-standard font names (`npm run standardize:fonts`) and review.
3. Add a CI guard that fails when new unused assets are introduced.

### Phase B: Quality Stabilization (short-term)
1. Triage the top 15 TypeScript error-heavy clock files first.
2. Enforce lint fixes in hotspots with `--fix` plus manual purity corrections.
3. Set incremental quality gates:
   - New/edited files must be TS-clean and lint-clean.
   - Legacy debt tracked separately to avoid blocking all progress.

### Phase C: Delivery Optimization (mid-term)
1. Shift large local MP4 usage to compressed variants and/or CDN.
2. Keep day-specific media and logic isolated to preserve route-level code splitting.
3. Set measurable budgets in CI:
   - Max dist-size delta per PR
   - Max asset size per clock
   - Max video payload threshold

### Phase D: Operational Hardening (ongoing)
1. Run automated weekly asset + quality audits.
2. Publish trend metrics (TS errors, lint warnings/errors, unused asset MB, dist MB).
3. Require explicit justification in PRs for large media additions.

## 7. Recommended Working Policy
- Use `npm ci` for reproducible installs.
- Keep all new clock assets date-prefixed and explicitly referenced.
- Treat `unused-*.txt` reports as pre-release checks.
- Refactor large clock files by extracting hooks/util modules before adding new features.
