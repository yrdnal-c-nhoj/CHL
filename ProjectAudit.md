# BorrowedTime Technical Audit
Audit date: 2026-05-01 (Updated: 2026-06-17, Re-audited: 2026-06-17)

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
- TypeScript: **~3500+ errors** (significant increase from previous audit, concentrated in clock modules)
- ESLint: **499 errors, 3247 warnings** (improved from previous 518/3288 errors/warnings)
- Build: **passes** (`npm run build`) - production build successful
- Security: **0 vulnerabilities** (`npm audit`) - excellent security posture
- Dist footprint: **256 MB** across **2,829 files** (increase from 249.87 MB)
- Largest JS bundles:
  - `dist/assets/three-C9XuxQ2Y.js` (~747.23 KB) - Three.js library
  - `dist/assets/vendor-DgNhqpVS.js` (~273.36 KB) - Vendor dependencies
  - `dist/assets/Clock-BMICte71.js` (~58.62 KB) - Largest clock bundle
- Code metrics:
  - Total TypeScript files: **466**
  - Clock modules: **424** (91% of codebase)
  - Average errors per clock: **~8.25**

## 3. Asset Utilization Findings
Generated reports:
- `unused-images-report.txt`
- `unused-images-only-report.txt`
- `unused-videos-report.txt`
- `unused-fonts-report.txt`
- `non-standard-fonts.txt`

Verified unused assets:
- Unused images: 224 files, 6.88 MB (significant increase from 59 files)
- Unused videos: Not re-quantified in current audit
- Unused fonts: 3 files with non-standard names identified
- Total image storage: 211.88 MB
- Potential savings: 3.2% from unused images

Largest unused-image hotspots:
- `src/assets/images/2026/26-02/26-02-25` (2 files, 1190.6 KB)
- `src/assets/images/2026/26-03/26-03-14/mother.jpg` (939.8 KB)
- `src/assets/images/2026/26-04/26-04-06` (16 files, 878.5 KB)
- `src/assets/images/2026/26-04/26-04-27` (4 files, 734.3 KB)

**Note**: The audit incorrectly flagged `src/assets/images/2026/26-01/26-01-04/digits` (169 files, 2850.7 KB) as unused. These digit images are actively used by the corresponding Clock.tsx component via import.meta.glob statements and should not be removed.

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
- 3 files identified in current audit (`non-standard-fonts.txt`):
  - `src/assets/fonts/2026/26-03-31.ttf`
  - `src/assets/fonts/2026/26-04-23.otf`
  - `src/assets/fonts/2026/26-04-27.otf`

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

1. Remove the 224 verified unused images (6.88 MB) after one visual smoke pass.
2. Normalize 3 non-standard font names (`npm run standardize:fonts`) and review.
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

## 7. Changes Since Last Audit (June 2026 Update)

### Quality Metrics Trends
- **TypeScript Errors**: Increased from 3241 to ~3500+ (+260+ errors)
- **ESLint Errors**: Improved from 518 to 499 (-19 errors) 
- **ESLint Warnings**: Improved from 3288 to 3247 (-41 warnings)
- **Build Size**: Increased from 249.87 MB to 256 MB (+6.13 MB)
- **Security**: Excellent - 0 vulnerabilities (new metric added)

### Asset Management Changes
- **Unused Images**: Dramatically increased from 59 to 224 files (+165 files)
- **Image Storage**: Total 211.88 MB with 6.88 MB unused (3.2% savings potential)
- **Non-standard Fonts**: Reduced from 5 to 3 files (-2 files)
- **Build Files**: 2,829 files in dist (up from 2,836)

### Code Quality Insights
- **TypeScript Files**: 466 total, 424 clock modules (91% of codebase)
- **Error Distribution**: ~8.25 errors per clock module on average
- **Lint Improvements**: 229 errors and 1642 warnings are auto-fixable with `--fix`

### Key Observations
1. **Asset Hygiene Decline**: Significant increase in unused images suggests recent development without proper cleanup
2. **Type Debt Growth**: TypeScript errors increasing despite ESLint improvements
3. **Build Size Inflation**: 6MB increase likely from new assets and clock additions
4. **Lint Progress**: Small but measurable improvement in code consistency
5. **Security Excellence**: Zero vulnerabilities demonstrates strong dependency management
6. **Code Scale**: 424 clock modules represent substantial technical debt concentration

## 8. Recommended Working Policy

- Use `npm ci` for reproducible installs.
- Keep all new clock assets date-prefixed and explicitly referenced.
- Treat `unused-*.txt` reports as pre-release checks.
- Refactor large clock files by extracting hooks/util modules before adding new features.
- **New**: Run asset cleanup after each major clock addition to prevent accumulation.
