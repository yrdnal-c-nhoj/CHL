# BorrowedTime Development Roadmap

Last reviewed: 2026-09-21

This is the single source of truth for BorrowedTime project health, standards,
and the concrete plan to reach them. It supersedes scattered notes in
`docs/STATUS.md`, GitHub issues, and commit messages.

- **Contract:** `docs/CLOCK_STANDARDS.md`
- **Performance budgets:** `docs/PERFORMANCE.md`
- **Live status / test results:** `docs/STATUS.md`
- **Architecture / templates:** `src/templates/BaseClock.tsx`

---

## 1. Project Overview

**BorrowedTime** is a daily digital art project that publishes a unique clock
design every day. It is a React + TypeScript + Vite single-page application
with heavy creative use of Canvas, Three.js
(@react-three/fiber + drei), custom fonts, and date-based routing (`/YY-MM-DD`).

The project values artistic freedom, performance, and accessibility. The
`CLOCK_STANDARDS.md` exists to keep the fleet of daily clock pages consistent
and maintainable.

---

## 2. Current State (2026-09-21)

### Strengths
- Modern stack: React 19, Vite 7, TypeScript 5.9, strict TS options
- Clear clock contract and template architecture
- Good performance budgets and CI intent
- Security-conscious dependency management
- Strong accessibility requirements in contract

### Critical Gaps
| Area | State | Impact |
|---|---|---|
| Tests | ✅ Pass (115 tests) | — |
| Lint (full fleet) | ❌ Failed (legacy debt) | Hundreds of legacy clock violations |
| Lint (26-09 clocks) | ✅ Pass | Recent clocks clean |
| TypeScript (full fleet) | ❌ Failed (legacy debt) | Thousands of legacy errors |
| TypeScript (in-scope, tsconfig.ci.json) | ✅ Pass | `npm run type-check` clean |
| Clock verification (full fleet) | ❌ Failed (legacy debt) | 395/537 clocks violate contract |
| Clock verification (changed) | ✅ Pass | Recent changes verified |
| Three.js bundle | ~190KB br (target <150KB) | Misses performance budget |
| Consistency | Fleet-wide drift | Hundreds of clocks, uneven enforcement |

### Quick Metrics (refreshed 2026-09-21)
- **Clocks:** 537 total — 2025 full year + 2026 Jan–Aug + **2026-09 (20 clocks, through 26-09-20)**
- **Test files:** 16 files, 115 tests passing (last test run recorded 2026-09-20)
- **Lint problems (full):** 1,090 (297 errors, 793 warnings; measured 2026-09-20); **1 of 20** September 2026 clocks fails the *contract verifier* (`26-09-01`, see 4.8)
- **TypeScript errors (full fleet):** legacy debt remains outside CI scope; **in-scope (tsconfig.ci.json): 0**
- **Clock contract verification (full fleet):** 395 of 537 fail (73.6%) — 09-17 was 397 of 534; 09-20 was 396 of 537
- **Production build:** `dist/` = 353MB / 4,253 files; `.git` = 312MB (measured 2026-09-20) — both unbounded, see Phase 4
- **Status doc:** Manually maintained; `scripts/generate-status.js` does not exist

---

## 3. Standards (Summary)

The authoritative lists live in `docs/CLOCK_STANDARDS.md` and `docs/PERFORMANCE.md`.

### Non-negotiable rules for every clock
1. **File pair:** `Clock.tsx` + `Clock.module.css` in the date folder
2. **Time hooks:** `useClock` or `useSmoothClock` from `@/utils/hooks` only
3. **Styling:** CSS Modules for static styles; inline only for dynamic values
4. **Accessibility:** semantic `<time>` with `dateTime` + screen-reader-only copy
5. **Height:** `100dvh` for full-height containers
6. **Assets:** export used assets via `assets` array; fonts TTF/OTF/WOFF2 allowed, max 2 families
7. **Memoization:** `useMemo` only for genuinely expensive work; never read `ref.current` inside
8. **Index access:** guard against `undefined` under `noUncheckedIndexedAccess`
9. **No prohibited patterns:** no `setInterval`, `requestAnimationFrame`, `useGlobalStyles`, inline `<style>` tags, `any`

### Performance budgets (highlights)
- Initial JS: `< 150KB` gzipped
- Three.js: `< 150KB` gzipped *(currently over)*
- Clock page chunk: `< 50KB` gzipped
- Images: `< 200KB`; video: `< 2MB`

---

## 4. Roadmap

### Phase 0: Immediate Stabilization (1–3 days, High Priority) — **COMPLETED**

| # | Action | Status |
|---|---|---|
| 0.1 | Isolate tests: add `.kilo/` and worktrees to Vitest `test.exclude` or delete stale worktrees | ✅ Done (tests pass) |
| 0.2 | Re-run `npm run test:run` until green or isolate remaining failures | ✅ Done (115 tests pass) |
| 0.3 | Restore `scripts/generate-status.js` to regenerate `docs/STATUS.md` | ⏸️ Deferred; status now manual |
| 0.4 | Restore `scripts/verify-all-clocks.js` against `CLOCK_STANDARDS.md` rules | ✅ Done (active, used in CI) |
| 0.5 | Fix `react-hooks/refs` violation in `26-08-24/Clock.tsx:134` | ⏳ Legacy; tracked in Phase 1 |
| 0.6 | Guard indexed access in `26-08-23/Clock.tsx` and `26-08-28/useMazeRenderer.ts` | ⏳ Legacy; tracked in Phase 1 |
| 0.7 | Update CI to surface lint/type results; keep tests+build hard-gated | ✅ Done (CI uses type-check, verify:clocks:changed) |
| 0.8 | Commit clean baseline and update `docs/STATUS.md` | ✅ Done |

### Phase 1: Quality Foundation (1–2 weeks)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 1.1 | Run `npm run lint:fix` where safe; remove `any` and non-null assertions in clusters | — | M | Lint error count drops materially |
| 1.2 | Enable stricter ESLint rules on new files; track legacy relaxations | — | M | **DONE** — eslint config enforces `@typescript-eslint/no-explicit-any: error`, `no-non-null-assertion: error`, `no-unused-vars: error` for `src/pages/2026/26-09/**` |
| 1.3 | Adopt `tsconfig.ci.json` progressively; target zero new errors on new clocks | — | M | **DONE** — tsconfig.ci.json excludes legacy months explicitly; `npm run type-check` passes |
| 1.4 | Wire `verify-all-clocks.js` into CI / pre-commit | — | S | **DONE** — CI runs `verify:clocks:changed` |
| 1.5 | Update `CLOCK_STANDARDS.md` to match current hook names and React 19 patterns | — | S | ⏳ Pending (hook names correct; React 19 patterns in use) |
| 1.6 | Fix test harness: wrap context-provider-dependent tests in real providers | — | M | Tests currently pass |
| 1.7 | Add 3–5 golden-path tests for recent clocks and routing/data layer | — | M | ⏳ Future |
| 1.8 | Address Three.js bundle: lazy-load or split `@react-three/drei` | — | M | ⏳ Planned |

### Phase 2: Process & Automation (2–4 weeks)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 2.1 | Build `npm run new-clock YYYY-MM-DD` generator from `BaseClock.tsx` | — | M | New clocks are contract-compliant by construction |
| 2.2 | Add GitHub Action / pre-commit hook that runs `verify-all-clocks.js` | — | M | Bad clocks blocked before merge |
| 2.3 | Expand `README.md` with architecture overview, adding-a-clock guide, and links to docs | — | S | Onboarding is fast |
| 2.4 | Make `docs/STATUS.md` auto-generated and treat as single source of truth | — | M | Requires `generate-status.js` implementation |
| 2.5 | Add bundle-size checks to CI (fail if budgets exceeded) | — | M | Budgets enforced |
| 2.6 | Add Dependabot / Renovate for dependency updates | — | S | Security and freshness |
| 2.7 | Run Lighthouse / axe spot-checks on a sample of clocks | — | M | A11y gaps quantified |

### Phase 3: Sustainability & Debt Retirement (1–2 months)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 3.1 | Treat 2025 fleet as legacy; document and freeze | — | S | Scope bounded |
| 3.2 | Migrate 2026 clocks month-by-month to contract compliance | — | L | Debt reduces monotonically |
| 3.3 | Track compliance % in `docs/STATUS.md` | — | S | Progress is visible |
| 3.4 | Enforce image/font budgets in verify script or build step | — | M | Performance protected |
| 3.5 | Add Conventional Commits + lint-staged pre-commit hook | — | S | History is readable |
| 3.6 | Evaluate further shared logic extraction across clocks | — | M | Maintenance burden drops |
| 3.7 | Monitor Core Web Vitals on live site | — | M | Real-user performance tracked |

---

### Phase 4: Delivery & Repository Sustainability (ongoing, High Priority)

Not previously tracked. Measured 2026-09-20: production `dist/` is 353MB
(4,253 files) and `.git` is 312MB, both growing by roughly one clock's worth
of assets every day with no ceiling. Per-page runtime delivery is already
solid (route-based code splitting + lazy asset preload in `useClockPage.ts`
mean a visitor only ever downloads the current day's clock); this phase is
about the *build artifact and repository*, not the page-load experience.

| # | Action | Effort | Outcome |
|---|---|---|---|
| 4.1 | Remove stray root-level files (`Clock.tsx`, `useClockPage.ts`, `config.json`, `path/to/filename.js`) — unused scratch files outside `src/` | S | **DONE** (2026-09-21) — those paths are no longer in the repo root |
| 4.2 | Extend `.gitattributes` LFS rules to cover `.webp`, `.gif`, `.mp4`, `.webm`, `.ttf`, `.otf`, `.woff2` — the formats that actually make up `src/assets/` | S | New commits stop growing `.git` at full blob size |
| 4.3 | Migrate existing asset history into LFS (`git lfs migrate import`) or, if history rewrite is unacceptable, start a fresh shallow-friendly branch strategy | L | Bounds `.git` growth; requires coordinating a force-push / re-clone for anyone with a local copy |
| 4.4 | Switch CI checkout from `fetch-depth: 0` to a shallow fetch (e.g. `fetch-depth: 1`, or `2` if `verify:clocks:changed` needs a diff base) | S | Faster, cheaper CI runs; `fetch-depth: 0` is rarely necessary for a build+test+verify pipeline |
| 4.5 | Decide an explicit **archival policy** for old clocks: keep assets in the repo forever, move older years to external object storage (S3/R2) referenced by URL, or generate/host only a rolling window (e.g. current year) from the SPA build while archiving prior years as static exports | M | Turns "grows forever" into a bounded, intentional decision instead of an emergent one |
| 4.6 | Add a build-size regression check to CI (fail or warn if `dist/` grows more than N% versus the previous release) | M | Makes the growth trend visible before it becomes a hosting-cost surprise |
| 4.7 | Add `Thumbnail-*.js` (currently ≈59KB br, larger than the framework chunk) to the `PERFORMANCE.md` budget table and investigate whether it can be split further or asset-loaded lazily | S | Budget **row added** 2026-09-21; split/lazy-load still open |
| 4.8 | Fix the September 2026 clocks currently failing `verify-all-clocks.js` before adding more clocks to the "compliant by construction" window — see diagnosis below | S–M | **Partial** — `26-09-04` and `26-09-13` now pass; `26-09-01` still fails |

**Diagnosis for 4.8** (rechecked 2026-09-21):

- **`26-09-13`** — **fixed.** Uses `useSmoothClock` from `@/utils/hooks`.
- **`26-09-04`** — **fixed** as a contract/identity issue. Component,
  `fontFamily`, and asset paths now use `26-09-04`; canonical `useClock()`;
  no rAF in source. (The 2026-09-20 note that it was a duplicate of
  `26-09-05` no longer applies to the current file.)
- **`26-09-01`** — **still failing.** A genuine exception the verifier does
  not currently account for. It renders a Three.js scene (12 clock faces on
  a rotating ring) with its own `renderer.render()` call inside a
  `requestAnimationFrame` loop. Three.js requires a render loop distinct
  from the `useClock`/`useSmoothClock` time source used for the accessible
  `<time>` element; the current "no direct rAF loops" rule does not
  distinguish a WebGL canvas render loop from a setInterval-style animation
  hack. Next: add a narrow exception to `CLOCK_STANDARDS.md` **and** to
  `scripts/verify-all-clocks.js` for Three.js/canvas render loops, rather
  than rewriting a working 3D scene to fit a rule written for 2D CSS clocks.

**Why this belongs above some of Phase 2/3:** bundle-size and lint debt are
recoverable at any time; unbounded git/deploy-artifact growth compounds daily
and gets more expensive (in clone time, CI time, and hosting cost) the longer
it's deferred. Recommend sequencing 4.2–4.4 alongside Phase 1 (4.1 is done), and treating
4.5 as a deliberate architectural decision to make before the repository
passes ~1GB.

---

## 5. Success Criteria

- `npm run test:run`, `npm run type-check`, and `npm run verify:clocks:changed` are green
- `npm run lint` on recent (26-09+) clocks is green; full fleet debt is tracked
- Three.js and initial bundles meet documented budgets, or budgets are consciously revised
- New clocks are contract-compliant by construction
- `docs/STATUS.md` accurately reflects reality after every significant change
- Live site remains performant and accessible

---

## 6. Contribution & Workflow

1. Read `docs/CLOCK_STANDARDS.md` before adding or modifying a clock.
2. Run `npm run lint`, `npm run test:run`, `npm run type-check`, and `npm run build` before opening a PR.
3. Use `npm run new-clock YYYY-MM-DD` once available; otherwise follow the file structure in the contract.
4. Do not bypass lint or test failures; fix or track them explicitly.

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| `docs/CLOCK_STANDARDS.md` | Clock component structure, hooks, styling, and prohibited patterns |
| `docs/PERFORMANCE.md` | Asset budgets, cache headers, compression, chunk limits |
| `docs/STATUS.md` | Live check results, test details, lint details, clock inventory, known gaps |
| `src/templates/BaseClock.tsx` | Canonical clock template and shared structure |
| `src/utils/hooks/` | Time hooks (`useClock`, `useSmoothClock`) |
| `src/components/SRTime.tsx` | Shared screen-reader-only time component |