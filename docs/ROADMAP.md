# BorrowedTime Development Roadmap

Last reviewed: 2026-09-29

This is the source of truth for the BorrowedTime project roadmap and planned work. It records project direction and sequencing; `docs/STATUS.md` records dated repository health measurements.

- **Architecture:** `docs/ARCHITECTURE.md`
- **Current clock contract:** `docs/CLOCKS.md`
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
current-clock contract in `docs/CLOCKS.md` exists to keep new daily clock pages
consistent and maintainable.

---

## 2. Current State

All measured figures (test, lint, type-check, and verifier results; clock counts;
repository and build size) live **only** in `docs/STATUS.md`. They are not repeated
here, because two copies drift apart.

Strengths:
- Modern stack (see `package.json`) with strict TypeScript on in-scope code.
- A written clock contract, executable in `scripts/verify-all-clocks.js`.
- Performance budgets and CI gates for changed clocks.
- Accessibility requirements built into the contract (`SRTime`).

Standing gaps:
- Legacy debt: full-fleet lint, TypeScript, and contract verification fail on historical clocks by design (ADR 0001).
- Unbounded growth of the repository and build output (Phase 4).
- The Three.js chunk is over its budget; the Thumbnail chunk is over its budget.
- Documentation and code drift: the verifier, `docs/CLOCKS.md`, and `docs/PERFORMANCE.md` must be kept in step.

---

## 3. Standards

Not summarized here. The authoritative sources are:

- Clock contract: `docs/CLOCKS.md`, enforced by `scripts/verify-all-clocks.js`.
- Code patterns: `docs/CLOCK_RECIPES.md`.
- Budgets: `docs/PERFORMANCE.md`.
- AI-agent workflow and validation commands: `AGENTS.md`.

---

## 4. Roadmap

### Phase 0: Immediate Stabilization (1–3 days, High Priority) — **COMPLETED**

| # | Action | Status |
|---|---|---|
| 0.1 | Isolate tests: add `.kilo/` and worktrees to Vitest `test.exclude` or delete stale worktrees | ✅ Done (tests pass) |
| 0.2 | Re-run `npm run test:run` until green or isolate remaining failures | ✅ Done (115 tests pass) |
| 0.3 | Restore `scripts/generate-status.js` to regenerate `docs/STATUS.md` | ⏸️ Deferred; status now manual |
| 0.4 | Restore `scripts/verify-all-clocks.js` against the current clock contract | ✅ Done (active, used in CI) |
| 0.5 | Fix `react-hooks/refs` violation in `26-08-24/Clock.tsx:134` | ⏳ Legacy; tracked in Phase 1 |
| 0.6 | Guard indexed access in `26-08-23/Clock.tsx` and `26-08-28/useMazeRenderer.ts` | ⏳ Legacy; tracked in Phase 1 |
| 0.7 | Update CI to surface lint/type results; keep tests+build hard-gated | ✅ Done (CI uses type-check, verify:clocks:changed) |
| 0.8 | Commit clean baseline and update `docs/STATUS.md` | ✅ Done |
| 0.9 | Make `npm run test:run` pass on a clean checkout: root `e2e-check.spec.ts` imports `@playwright/test` (not a dependency) and Vitest collects it. Move it under a Playwright config, delete it, or exclude it in `vitest.config.js` | ⏳ Open (see STATUS) |

### Phase 1: Quality Foundation (1–2 weeks)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 1.1 | Run `npm run lint:fix` where safe; remove `any` and non-null assertions in clusters | — | M | Lint error count drops materially |
| 1.2 | Enable stricter ESLint rules on new files; track legacy relaxations | — | M | **DONE** — eslint config enforces `@typescript-eslint/no-explicit-any: error`, `no-non-null-assertion: error`, `no-unused-vars: error` for `src/pages/2026/26-09/**` |
| 1.3 | Adopt `tsconfig.ci.json` progressively; target zero new errors on new clocks | — | M | **DONE** — tsconfig.ci.json excludes legacy months explicitly; `npm run type-check` passes |
| 1.4 | Wire `verify-all-clocks.js` into CI / pre-commit | — | S | **DONE** — CI runs `verify:clocks:changed` |
| 1.5 | Align the legacy `CLOCK_STANDARDS.md` reference document with the current clock contract | — | S | **DONE** — `docs/CLOCKS.md` is authoritative; `CLOCK_STANDARDS.md` and `AI_DEVELOPMENT_GUIDE.md` were removed 2026-09-29 |
| 1.6 | Fix test harness: wrap context-provider-dependent tests in real providers | — | M | Tests currently pass |
| 1.7 | Add 3–5 golden-path tests for recent clocks and routing/data layer | — | M | ⏳ Future |
| 1.8 | Address Three.js bundle: lazy-load or split `@react-three/drei` | — | M | **Partial** — 2026-09-27: `three` isolated in its own chunk and no longer preloaded on every page; chunk size itself still ~194KB br |

### Phase 2: Process & Automation (2–4 weeks)

| # | Action | Owner | Effort | Outcome |
|---|---|---|---|---|
| 2.1 | Build `npm run new-clock YYYY-MM-DD` generator from `BaseClock.tsx` | — | M | **DONE** — `scripts/new-clock.js` exists and is wired up via `npm run new-clock` |
| 2.2 | Add GitHub Action / pre-commit hook that runs `verify-all-clocks.js` | — | M | Bad clocks blocked before merge |
| 2.3 | Expand `README.md` with architecture overview, adding-a-clock guide, and links to docs | — | S | Onboarding is fast |
| 2.4 | Make `docs/STATUS.md` reproducible from a deterministic status generator | — | M | Requires `generate-status.js` implementation; STATUS remains a measured snapshot, not the standards source of truth |
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
| 4.2 | Extend `.gitattributes` LFS rules to cover `.webp`, `.gif`, `.mp4`, `.webm`, `.ttf`, `.otf`, `.woff2` — the formats that actually make up `src/assets/` | S | **DONE** (2026-09-20) — rules present in `.gitattributes`; existing history not migrated (4.3) |
| 4.3 | Migrate existing asset history into LFS (`git lfs migrate import`) or, if history rewrite is unacceptable, start a fresh shallow-friendly branch strategy | L | Bounds `.git` growth; requires coordinating a force-push / re-clone for anyone with a local copy |
| 4.4 | Switch CI checkout from `fetch-depth: 0` to a shallow fetch (e.g. `fetch-depth: 1`, or `2` if `verify:clocks:changed` needs a diff base) | S | **DONE** — `ci.yml` uses `fetch-depth: 50` |
| 4.5 | Decide an explicit **archival policy** for old clocks: keep assets in the repo forever, move older years to external object storage (S3/R2) referenced by URL, or generate/host only a rolling window (e.g. current year) from the SPA build while archiving prior years as static exports | M | Turns "grows forever" into a bounded, intentional decision instead of an emergent one |
| 4.6 | Add a build-size regression check to CI (fail or warn if `dist/` grows more than N% versus the previous release) | M | Makes the growth trend visible before it becomes a hosting-cost surprise |
| 4.7 | Add `Thumbnail-*.js` (currently ≈59KB br, larger than the framework chunk) to the `PERFORMANCE.md` budget table and investigate whether it can be split further or asset-loaded lazily | S | Budget **row added** 2026-09-21; split/lazy-load still open |
| 4.8 | Fix the September 2026 clocks currently failing the current clock contract verifier before adding more clocks to the "compliant by construction" window — see diagnosis below | S–M | **DONE** — all September 2026 clocks pass `scripts/verify-all-clocks.js`, including `26-09-01` |
| 4.9 | Confirm production cache headers: `/assets/*` must be `immutable`, `/` and `/index.html` `no-cache`. `vercel.json` has an overlapping catch-all `no-cache` rule; check with the `curl` commands in `docs/OPERATIONS.md`. Remove unused deploy configs (`netlify.toml`, `public/_headers`, and optionally `Dockerfile`/`nginx.conf`) | S | Caching policy is verified, not assumed |

**Diagnosis for 4.8** (rechecked 2026-09-26):

- **`26-09-13`** — **fixed.** Uses `useSmoothClock` from `@/utils/hooks`.
- **`26-09-04`** — **fixed** as a contract/identity issue. Component,
  `fontFamily`, and asset paths now use `26-09-04`; canonical `useClock()`;
  no rAF in source. (The 2026-09-20 note that it was a duplicate of
  `26-09-05` no longer applies to the current file.)
- **`26-09-01`** — **fixed.** It renders a Three.js scene (12 clock faces on
  a rotating ring) with its own `renderer.render()` call inside a
  `requestAnimationFrame` loop, while the accessible `<time>` element still
  gets its value from `useClock()`. `scripts/clock-verifier-rules.js` now
  carries a narrow exception (`hasThreeRenderLoop`) that recognizes a
  `renderer.render()` call from a `'three'` import as a rendering loop
  rather than an independent clock-time source, and `docs/CLOCKS.md`
  documents the same exception. No further action needed here.

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
- `docs/STATUS.md` accurately records the latest measured repository state
- Live site remains performant and accessible

---

## 6. Contribution & Workflow

1. Read `docs/ARCHITECTURE.md` and `docs/CLOCKS.md` before adding or modifying a current clock.
2. Run the checks listed under Validation in `AGENTS.md` before opening a PR. Lint only what you changed; the full-fleet lint has known legacy failures.
3. Use `npm run new-clock YYYY-MM-DD` to scaffold a new clock; otherwise follow the file structure in the contract.
4. Do not bypass lint or test failures; fix or track them explicitly.

---

## 7. Related Documents

| Document | Purpose |
|---|---|
| `docs/ARCHITECTURE.md` | Application architecture and historical/current boundary |
| `docs/CLOCKS.md` | Current clock component contract and engineering rules |
| `docs/CLOCK_RECIPES.md` | Code patterns for images, video, fonts, tiling |
| `AGENTS.md` | AI-agent workflow and validation commands |
| `docs/PERFORMANCE.md` | Asset budgets, cache headers, compression, chunk limits |
| `docs/STATUS.md` | Dated repository health measurements, inventory, and known gaps |
| `src/templates/BaseClock.tsx` | Canonical clock template and shared structure |
| `src/utils/hooks/` | Time hooks (`useClock`, `useSmoothClock`) |
| `src/components/SRTime.tsx` | Shared screen-reader-only time component |