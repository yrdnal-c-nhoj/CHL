> **HISTORICAL — snapshot**  
> This report is retained for reference only. For the current source of truth, see [`docs/STATUS.md`](../STATUS.md).

# CHL (BorrowedTime) Component — Full-Codebase Assessment Report

**Date:** 2026-02 (current audit)
**Scope:** Every file and folder in the repository (config, source, components, hooks, utils, types, templates, tests, scripts, deployment, assets pipeline)
**Method:** Files read in full + live validation runs (`verify-all-clocks.js`, `tsc --noEmit`, `vitest run`, `eslint .`)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Measured Baseline (Live Validation)](#2-measured-baseline)
3. [What Is Done Well (Strengths)](#3-what-is-done-well)
4. [Stack & Architecture Assessment](#4-stack--architecture-assessment)
5. [State-of-the-Art Gaps](#5-state-of-the-art-gaps)
6. [Future-Proofing Concerns](#6-future-proofing-concerns)
7. [File-by-File Findings](#7-file-by-file-findings)
8. [Recommendations (Prioritized)](#8-recommendations)
9. [Priority Matrix](#9-priority-matrix)
10. [Conclusion](#10-conclusion)

---

## 1. Executive Summary

The **CHL BorrowedTime** project is a React 19 + Vite 7 + TypeScript 5.9 SPA that renders a **new clock every day** (491 clock components). Its **architecture is genuinely forward-thinking** — Suspense-based font loading, rAF-driven time hooks, CSS Modules, lazy-loaded per-clock chunks, a documented canonical template, and automated standards verification are all above-average engineering.

**However, the *execution* lags the architecture.** Live validation shows the codebase is **not currently in a healthy, buildable, state-of-the-art state**:

- **0% standards compliance** across the 491 clock components.
- **3,125 TypeScript compile errors** (the app does not type-check).
- **579 ESLint errors** (plus 794 warnings).
- **5 failing tests** across 4 test files.
- **222 "critical" clock violations** (prohibited `setInterval` and inline `<style>` tags).

The gap is **not architectural design** — it is **migration discipline and engineering hygiene**. The remediation path is clear, largely mechanizable, and fully within reach because the architectural foundation is sound.

**Bottom line:** The *design* is near state-of-the-art; the *implementation* is not. The project needs a disciplined, tooling-driven migration campaign plus a CI gate to lock in the gains.

---

## 2. Measured Baseline (Live Validation)

I ran the project's own tooling to get an authoritative, current snapshot:

| Check | Command | Result |
|---|---|---|
| Clock standards compliance | `node scripts/verify-all-clocks.js` | **491 total, 1 compliant, 490 need work** |
| Critical clock violations | `verify-all-clocks.js` | **222** (setInterval / `<style>`) |
| Total clock violations | `verify-all-clocks.js` | **3,672** |
| TypeScript type-check | `npm run type-check:all` (`tsc --noEmit`) | **3,125 errors** |
| ESLint | `npm run lint` | **579 errors, 794 warnings** (1,373 total) |
| Tests | `npm run test:run` | **5 failed / 38 passed** (4 files failing) |

**Interpretation:** The project's own verifier reports **"Compliance rate: 0%"**. The good news is the tooling to *measure* the problem exists and works — the missing piece is the enforcement loop and the migration.

---

## 3. What Is Done Well (Strengths)

These are genuinely modern, correct decisions:

1. **Documented canonical architecture** — `src/templates/ARCHITECTURE.md` §4 defines a precise clock contract (asset exports, canonical hooks, CSS Modules, `<time>`, `React.memo`, `useSuspenseFontLoader`). Rare and valuable.
2. **Suspense-based font loading** (`fontLoader.tsx`) — global cache + reference counting + `display: 'block'` prevents FOUC and double-loading. Correct and sophisticated.
3. **rAF-based time hooks** (`useSmoothClock.ts`) — `useSecondClock`/`useMillisecondClock` replace `setInterval`, only re-render when the second changes. Battery/performance friendly.
4. **CSS Modules + design tokens** — scoped styles; `@theme` tokens in `globals.css`.
5. **Asset preloading pipeline** (`useClockPage`) — dynamic import + preload with fail-open and a 10s safety timeout.
6. **Automated verification** (`verify-clock.js` / `verify-all-clocks.js`) — catches non-compliance, emits CSV, has a `--fix` mode. Exactly the right tooling.
7. **Accessibility primitives** — shared `<SRTime>` component (centrally defined `srOnly`) + semantic `<time>` in newer clocks.
8. **Lazy loading / code-splitting** — every clock is its own chunk; framework/three/gsap/vendor split.
9. **Modern stack** — React 19 (`createRoot`, native title/meta hoisting, `StrictMode`), Vite 7, TS 5.9 strict, Vitest 4, `esbuild` minify, Brotli compression.
10. **FOUC prevention strategy** — layered (inline script + `fonts.ready` + 3s hard timeout + CSS classes).
11. **Good foundational shared hooks** — `useIsDesktop` (matchMedia-based), `useDebounce`, `useClockAngles`.
12. **Deployment readiness** — Netlify, Vercel, Docker/nginx, Lighthouse CI config, security headers.

---

## 4. Stack & Architecture Assessment

### 4.1 Stack is current

| Layer | Used | State-of-the-art? |
|---|---|---|
| React | 19.2 | ✅ Yes (concurrent, `createRoot`, native metadata) |
| Vite | 7.3 | ✅ Yes |
| TypeScript | 5.9 | ✅ Yes (strict, `exactOptionalPropertyTypes`) |
| Vitest | 4.0 | ✅ Yes |
| Tailwind | 4.x | ✅ Current |
| Bundling | esbuild + manual chunks + Brotli | ✅ Good |
| Animation | GSAP 3.13, Three/R3F, Pixi 8 | ✅ Current |

### 4.2 Architecture contradictions / duplication

There are **multiple competing implementations** of the same concept, which is a maintainability and future-proofing risk:

1. **Time hooks** exist in 3+ places:
   - `src/utils/hooks/useClockTime.ts` (uses `setInterval` — the *canonical-but-wrong* one)
   - `src/utils/hooks/useSmoothClock.ts` (rAF-based — the good ones)
   - `src/hooks/useClockTime.ts` (re-export shim)
   - `src/utils/clockUtils.ts` (re-export shim)
   - `src/hooks/useClock.ts` (re-export shim)
   - **`ARCHITECTURE.md` and `index.ts` both export `useClockTime` as "canonical", yet `useClockTime` uses `setInterval`** — directly contradicting the project's own "no setInterval" rule.

2. **Font loaders** exist in 4+ places:
   - `fontLoader.tsx` (canonical, Suspense) ✅
   - `enhancedFontLoader.ts` (deprecated but still exports `useGlobalStyles`/`useKeyframes`)
   - `assetLoader.ts` (`useFontLoader`, `useMultiFontLoader`, `useMultipleFontLoader` — deprecated)
   - `fontLoader.ts` (re-export shim)

3. **`useDebounce`** is defined in **both** `utils/debounce.ts` and `utils/performance.ts`.

4. **`calculateAngles`** exists in `clockUtils.ts` AND `useClockAngles` in `src/hooks/useClockAngles.ts` — but dozens of clocks re-implement the angle math inline.

5. **`ClockItem` / `DataContextType`** are defined in **two** files (`types/data.ts` and `types/utils.ts` and `context/DataContext.tsx` interface) with slightly different shapes (`error: Error | null` vs `error: string | null`). Type drift risk.

6. **`ClockTemplate.tsx` and `MasterTemplate.tsx` are byte-identical**, and differ from `BaseClock.tsx`. Three "templates" saying different things.

7. **`ClockPage.tsx` and `Today.tsx` duplicate** the loading-overlay + error + clock-mounting logic.

---

## 5. State-of-the-Art Gaps

### 5.1 Not "state of the art" — the evidence
- Only **1 of 491** clock components passes the project's own published standards.
- The app **does not compile** under strict TypeScript (3,125 errors).
- The linter reports **579 errors**.
- **5 tests fail** — including a test that pins the *wrong* expected behavior (`DataContext` test expects `26-03-03,26-03-04,26-03-05` but the provider sorts ascending to `26-03-05,26-03-04,26-03-03`... the test and implementation disagree).

### 5.2 Concrete state-of-the-art misses

**A. Prohibited patterns at scale**
- **`setInterval`** in 134 clocks (defeats the project's own rAF optimization).
- **Inline `<style>` tags** in ~143 clocks (global CSS leakage, FOUC/CLS risk).
- **`new Date(time.toLocaleString(...))`** timezone round-trip in several clocks (fragile, locale-dependent).

**B. Accessibility bug (real, actionable)**
- `ClockPage.tsx` wraps the whole page in `<div role="button" tabIndex={0} onClick={navigate('/')}>` with **no `onKeyDown` handler**. Screen-reader/keyboard users cannot activate it. This violates the project's own a11y rules (`jsx-a11y/click-events-have-key-events`) and its Lighthouse a11y assertion (score 1.0 target).

**C. Inline styles / hardcoded UI in core pages**
- `ClockPage.tsx`, `Today.tsx` use large inline `style={{...}}` blocks instead of CSS Modules — inconsistent with the "CSS Modules only" rule.
- Admin components (`AdminDashboard`, `TagManager`, `TagByImage`) are almost entirely inline-styled.

**D. Hydration/SSR inconsistency**
- `App.tsx` and `main.tsx` reference React Router **v7 future flags** (`v7_startTransition`, `v7_relativeSplatPath`) but the codebase targets **React Router 6.30** and the docs say "v7 compatibility". The flags are on the *v6* API. This is a forward-compat shim but is undocumented and easy to break.

**E. No test coverage for the caliber of the project**
- Only 10 test files; no coverage on the 491 clocks (acceptable for integration), but critical shared modules (`useClockPage`, `useSuspenseFontLoader`, `useSecondClock`) lack robust unit tests. `useClockPage.test` uses fuzzy "error OR ready" assertions that don't actually verify loading behavior.

**F. No CI/CD enforcement**
- Despite `lighthouserc.js`, `tsconfig.ci.json`, and a verifier script, there is **no GitHub Actions / CI workflow** in the repo. The standards verifier is not wired to fail the build.

**G. `useSmoothClock`/`useSecondClock`/`useMillisecondClock` use `requestAnimationFrame` with no `setInterval`, but several clocks still call 24 concurrent rAF loops** (e.g. `25-08-20` world clocks) — no shared single time source.

---

## 6. Future-Proofing Concerns

1. **Two font-loading systems and two time-hook systems** must be consolidated to one canonical path or the "canonical" label becomes meaningless and future clocks will pick the wrong one.
2. **`useClockTime` is exported from `@/utils/hooks/index.ts` as canonical but uses `setInterval`** — this will actively mislead new contributors. This is the single most confusing contradiction in the codebase.
3. **`import.meta.glob('../pages/**/Clock.tsx')`** is a static registry — renaming/moving a clock folder silently breaks the lookup with a generic error. A pre-build integrity check is needed.
4. **`assets` export contract is ambiguous** — some clocks export `string[]`, some export nothing, and the preloader filters out videos when >1 asset, so the intended contract is undocumented and shifts behavior.
5. **`TODO.md`** tracks only one clock's FOUC fix; there's no central tracking of the 490-clock migration.
6. **Version pinning** — `package.json` uses `^` ranges on React 19, Vite 7, etc. Fine, but the `overrides` on `lodash`/`three-mesh-bvh`/`basic-ftp` suggest some transitive pain that should be documented.
7. **`DataContext` dev/prod split** (`testclocks.json` in dev, `clockpages.json?url` fetched in prod) is a reasonable pattern but the tests mock both inconsistently, causing the failing tests.
8. **`npm run setup`** references `screen-caps/screen-caps` and several package.json scripts (`capture:thumbs`, `capture:daily`, `scaffold:may`, `finalize`) reference **scripts that don't exist in the repo** (`scripts/clock-new.mjs`, `scripts/DailyThumb/daily-square-capture.ts`, `scripts/thumbnail/capture.ts`, `scripts/scaffold-may-clocks.js`, `scripts/UploadFinalize/finalize-component.ts`). Dead/broken script references will confuse tooling and CI.

---

## 7. File-by-File Findings

### Root / Config
| File | Verdict | Notes |
|---|---|---|
| `package.json` | ⚠️ | Modern stack; several `scripts` reference missing files; `engines: node 22` but Docker/Netlify use node 24. |
| `vite.config.ts` | ✅ | Good chunking, Brotli, esbuild minify, `drop: debugger`. Circular-dep warnings suppressed (should be fixed, not ignored). |
| `tsconfig.json` | ✅ | Strict, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`. |
| `tsconfig.ci.json` | ⚠️ | Excludes `src/pages/**` — so CI type-check **never checks the 491 clocks**. This is why type errors go unnoticed. |
| `eslint.config.js` | ⚠️ | Very thorough, but last block disables dozens of rules globally (including `react/no-unknown-property`, style rules) which undermines enforcement. Many `stylelint-*` rules referenced that aren't installed. |
| `index.html` | ⚠️ | Good FOUC script + SEO; but inline `<style>` in `<head>` mixes with the "CSS Modules only" philosophy (acceptable for critical CSS, should be documented). Loads a Google font (Finger Paint) directly. |
| `netlify.toml` / `vercel.json` / `Dockerfile` / `nginx.conf` | ✅ | All present and reasonable. |
| `lighthouserc.js` | ✅ | Good budgets (a11y=1.0, perf>0.9, TTI<3s, JS<150KB). |
| `.gitattributes` | ✅ | LFS for media. |
| `.gitignore` | ✅ | Solid. |

### Source — Core
| File | Verdict | Notes |
|---|---|---|
| `src/main.tsx` | ✅ | React 19 `createRoot`, StrictMode, good init error handling. |
| `src/App.tsx` | ✅ | Clean lazy-loaded routes, ErrorBoundary, SEO meta. Good. |
| `src/analytics.ts` | ✅ | DNT/GA guards, manual pageview. Good. |
| `src/context/DataContext.tsx` | ⚠️ | `any` types, dev/prod import split, `error: Error` vs `types/data.ts` `string`. |
| `src/pages/ClockPage.tsx` | ❌ | **a11y bug** (role=button no key handler), inline `<style>` injection, inline styles, duplicated logic with `Today`. |
| `src/pages/Today.tsx` | ⚠️ | Duplicates ClockPage overlay/error logic; inline styles. |

### Templates
| File | Verdict | Notes |
|---|---|---|
| `src/templates/BaseClock.tsx` | ✅ | **Best canonical example** — `<main>`, `<time>`, `useSecondClock`, `useSuspenseFontLoader`, `React.memo`. |
| `src/templates/ClockTemplate.tsx` | ⚠️ | **Byte-identical to MasterTemplate.tsx**; uses deprecated import pattern (`import` after code), references `./Clock.module.css` in a template. |
| `src/templates/MasterTemplate.tsx` | ⚠️ | Duplicate of ClockTemplate. |
| `src/templates/index.ts` | ✅ | Exports only BaseClock. |
| `src/templates/ARCHITECTURE.md` | ✅ | Excellent spec — but **contradicts itself** by declaring `useClockTime` canonical (which uses `setInterval`). |

### Hooks
| File | Verdict | Notes |
|---|---|---|
| `src/hooks/useClockPage.ts` | ✅ | Solid dynamic loader + fail-open + timeout. |
| `src/hooks/useClockAngles.ts` | ✅ | Good, memoized. |
| `src/hooks/useNavigationState.ts` | ✅ | sessionStorage scroll restore. |
| `src/hooks/useAutoHeader.ts` | ⚠️ | Unclear purpose; only used by Header (which is mostly unused). |
| `src/hooks/useTrackLastNonClockRoute.ts` | ✅ | Good. |
| `src/hooks/useClockTime.ts` | ⚠️ | Re-export shim (fine) but feeds the duplicate-hook problem. |
| `src/utils/hooks/useClockTime.ts` | ❌ | **Uses `setInterval`** but is exported as canonical. |
| `src/utils/hooks/useSmoothClock.ts` | ✅ | rAF-based; good. `useMillisecondClock` default 50ms re-renders 20×/s. |
| `src/utils/hooks/useIsDesktop.ts` | ✅ | matchMedia-based, SSR-safe. Excellent. |

### Utils
| File | Verdict | Notes |
|---|---|---|
| `src/utils/fontLoader.tsx` | ✅ | Canonical Suspense loader. Good. |
| `src/utils/enhancedFontLoader.ts` | ⚠️ | Deprecated but still exports `useGlobalStyles`/`useKeyframes` (explicitly prohibited by ARCHITECTURE.md). |
| `src/utils/assetLoader.ts` | ⚠️ | Huge; deprecated font loaders + TS `RefObject` nullable errors; `any` types. |
| `src/utils/performance.ts` | ⚠️ | Duplicate `useDebounce`; `any` types; unused in app. |
| `src/utils/debounce.ts` | ✅ | Good. |
| `src/utils/clockUtils.ts` | ⚠️ | Duplicate `useClockTime` + `calculateAngles`; deprecated re-exports. |
| `src/utils/dateUtils.ts` | ✅ | Clean. |
| `src/utils/tagUtils.ts` | ✅ | Clean. |
| `src/utils/thumbnailMap.ts` | ✅ | `import.meta.glob` eager. |
| `src/utils/isoEngine.ts` | ✅ | Self-contained canvas engine, well-typed. |
| `src/utils/glyphMap.ts` / `latinNumberSpelling.ts` | ✅ | Fine. |
| `src/utils/consoleFilters.ts` | ✅ | Well-scoped (only filters debug/info). |

### Components
| File | Verdict | Notes |
|---|---|---|
| `SRTime.tsx` + `.module.css` | ✅ | **Exemplary** shared a11y primitive. |
| `Thumbnail.tsx` | ✅ | Good error/fallback handling; enforces 1:1. |
| `ClockPageNav.tsx` | ✅ | Good touch/mouse handling, a11y labels. |
| `TopNav.tsx` | ✅ | Clean. |
| `MonthDropdown.tsx` | ⚠️ | Inline styles; `role="button"` div **has** key handler here (good) but inconsistent. |
| `Header.tsx` | ⚠️ | Mostly decorative; `useAutoHeader` coupling. |
| `Footer.tsx` | ⚠️ | Hardcoded year 2026; stray emoji. |
| `TagList.tsx` | ⚠️ | `any` casts; inline styles; duplicates list UI with ClockList. |
| `admin/AdminDashboard.tsx` | ❌ | 100% inline styles. |
| `admin/Tagger.tsx` | ⚠️ | Inline styles mixed with CSS module. |
| `admin/TagManager.tsx` | ⚠️ | Very large; inline styles; heavy DOM. |
| `admin/TagByImage.tsx` | ⚠️ | Inline styles; `onMouseDown/Up` scale hack. |

### Pages (non-clock)
| File | Verdict | Notes |
|---|---|---|
| `Home.tsx` | ✅ | Good; uses `useNavigationState`, fonts-ready gating. |
| `ClockList.tsx` | ✅ | Good memoized sort; `time` element. |
| `AllTagsPage.tsx` | ✅ | Clean. |
| `Contact.tsx` | ⚠️ | Tailwind utility classes + inline `hr` styles; forms to external services. |

### Types
- `clock.ts`, `data.ts`, `utils.ts`, `global.d.ts`, `vite-env.d.ts` — **duplicate `ClockItem`/`DataContextType` with conflicting `error` types** (`Error | null` vs `string | null`). Needs consolidation.

### Tests
- Good foundational tests exist (SRTime, useClockAngles, debounce, DataContext, navigation).
- **5 failing**: `DataContext.test.tsx` (ordering expectation contradicts implementation), `ClockPage.test.js` (mocks stale old logic), etc.
- `tsconfig.ci.json` excludes pages, so clocks aren't type-checked in CI.

### Scripts
- `verify-clock.js` / `verify-all-clocks.js` — **excellent**, the backbone of remediation.
- `capture.js` (root) — **empty file** (0 bytes).
- `screencaps/capture.js`, `social_media/capture-social-images.mjs` — good Playwright+Sharp pipelines.
- `convert-instagram-images.js` — uses `require` (CommonJS) in an ESM project (works via Node, but inconsistent).
- Several scripts referenced in `package.json` **do not exist**.

---

## 8. Recommendations (Prioritized)

### Phase 0 — Stop the bleeding & establish CI truth
1. **Fix `tsconfig.ci.json`** to **include** `src/pages/**`. Right now CI never type-checks the 491 clocks — the primary reason 3,125 errors went unnoticed.
2. **Add a CI workflow** (GitHub Actions) that runs: `npm ci` → `npm run type-check` (CI) → `npm run lint` → `npm run test:run` → `node scripts/verify-all-clocks.js --quiet` → (optional) Lighthouse. **Fail the build on any regression.**
3. **Resolve the `useClockTime` contradiction**: remove `setInterval` from `useClockTime` or stop exporting it as canonical. Make `useSmoothClock`/`useSecondClock`/`useMillisecondClock` the *only* canonical time hooks (update `ARCHITECTURE.md` + `utils/hooks/index.ts`).

### Phase 1 — Fix the real bugs (quick, high-impact)
4. **Fix the a11y bug in `ClockPage.tsx`**: add `onKeyDown` (Enter/Space) to the clickable wrapper, or replace the `role="button"` div with a real semantic navigation affordance.
5. **Fix the 5 failing tests**: align the `DataContext` ordering test with the implemented (ascending) sort, and update `ClockPage.test.js` stale mocks.
6. **Consolidate `ClockItem`/`DataContextType`** into one type definition and one `error` type.

### Phase 2 — Consolidate the duplicated systems
7. **Pick one font loader** (keep `useSuspenseFontLoader`); delete/annotate `enhancedFontLoader` and the `assetLoader` font hooks as legacy-only.
8. **Pick one `useDebounce`** (remove from `performance.ts`).
9. **Extract shared primitives** to kill inline duplication:
   - Promote `useClockAngles` as the single angle source.
   - Promote `<SRTime>` everywhere (already exists).
   - Create a shared `<AnalogClock>` / multi-zone primitive so `25-08-20` no longer runs 24 rAF loops.
10. **Delete the root `capture.js` (empty)** and **remove dead `package.json` scripts** that reference missing files, or add the missing scripts.

### Phase 3 — Drive the 490-clock migration with codemods
11. Extend `verify-clock.js --fix` to auto-insert missing boilerplate (`export const assets`, `<main>`, `<time>`+`srOnly`, `React.memo`+`displayName`).
12. Codemod: `setInterval` → `useSecondClock`/`useMillisecondClock` (134 files).
13. Codemod: inline `<style>` → CSS Modules (143 files) — **highest visual risk**, do per-clock with screenshot verification (the Playwright capture pipeline already exists for exactly this).
14. Codemod deprecated imports → canonical ones (44 files).
15. Replace `toLocaleString` timezone round-trips with `Intl.DateTimeFormat`/`formatToParts`.

### Phase 4 — Performance & bundle hygiene
16. Sweep `useMillisecondClock(50)` → `useSecondClock` where whole-second display suffices (reduces re-render 20×→1×).
17. Consolidate Google Font `@import`s into `globals.css` (single import) instead of per-clock inline `<style>`.
18. Move `ClockPage`/`Today`'s inline styles + global margin-reset `<style>` into a CSS module / `globals.css` (remove dynamic `<style>` injection).
19. Add `export const assets` contract documentation; decide and document the video-preload behavior.

### Phase 5 — Completeness & documentation
20. Collapse `ClockTemplate.tsx`/`MasterTemplate.tsx` into one (or remove both and keep `BaseClock.tsx` + `ARCHITECTURE.md` as the single source).
21. Add `prebuild integrity check` for the static clock registry (warn on missing/renamed folders).
22. Add unit tests for `useClockPage`, `useSecondClock`, `useSuspenseFontLoader`, and a snapshot test for `BaseClock`.
23. Document the `overrides` (lodash, three-mesh-bvh, basic-ftp) and the node 22 vs 24 engine mismatch.

---

## 9. Priority Matrix

| Priority | Item | Effort | Impact |
|---|---|---|---|
| **P0** | Include `src/pages/**` in CI type-check + add CI workflow | Low | **Critical** (unblocks everything) |
| **P0** | Fix `useClockTime` uses `setInterval` contradiction | Low | High (prevents new bad clocks) |
| **P0** | Fix `ClockPage.tsx` a11y keyboard bug | Low | High (real user-impacting bug) |
| **P0** | Fix 5 failing tests | Low | High (CI gate) |
| **P1** | Codemod `setInterval` → canonical hooks (134) | Med | High |
| **P1** | Codemod inline `<style>` → CSS Modules (143) | High | Med (visual risk) |
| **P1** | Consolidate font loaders + `useDebounce` | Med | High (DRY) |
| **P1** | Extract shared `<AnalogClock>`/`useClockAngles` primitives | Med | High (removes duplication) |
| **P2** | Auto-fix boilerplate via `verify-clock.js --fix` | Med | High (bulk) |
| **P2** | Consolidate types (`ClockItem`/`DataContextType`) | Low | Med |
| **P2** | Consolidate templates (3 → 1) | Low | Low |
| **P3** | `useMillisecondClock`→`useSecondClock` sweeps | Low | Med (perf) |
| **P3** | Consolidate Google Font imports | Med | Med |
| **P3** | Clock registry integrity check | Low | Med |

---

## 10. Conclusion

The **CHL component architecture is genuinely above-average and forward-looking** — Suspense font loading, rAF time hooks, CSS Modules, per-clock code-splitting, design tokens, and automated verification are all sound, modern engineering. The **design is near state-of-the-art**.

**But the implementation is not.** The app currently **does not type-check (3,125 errors), does not lint clean (579 errors), has failing tests, and 99.8% of clocks violate the project's own standards.** The single highest-leverage action is to **wire the existing verification tooling into a CI gate that includes the clock pages**, then **codemod the fleet** toward the excellent `BaseClock` template. Because the architecture and tooling already exist, this is a **tractable, largely mechanical migration** rather than a rewrite — and the payoff is a codebase that both *designs* and *executes* at a state-of-the-art level and is robustly future-proof.

---

*Report generated from a full-codebase read + live validation runs.*
