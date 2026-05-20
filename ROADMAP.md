# BorrowedTime Roadmap (Future Improvements)

This roadmap is derived from a survey of the current repo architecture and documentation. It prioritizes improvements across correctness, performance, developer experience, and operational robustness.

## Guiding Principles
- Keep the **clock module contract** unambiguous.
- Ensure **documentation is executable** (commands and checks in docs must reflect actual behavior).
- Optimize perceived performance: reduce blank screens, prewarm assets, minimize expensive work.
- Maintain standards: BTS/AGENTS should match the implementation.

---

## Priority 0 — Documentation correctness (Immediate)

1. **Unify the “preloadable assets” contract**
   - Current gap: `useClockPage.ts` preloads with `new Image()` only.
   - Decide one:
     - (A) Update loader to support images + video + audio.
     - (B) Restrict BTS/template `assets` exports to image-like assets only.
   - Update docs accordingly.
   - Verification:
     - A clock exporting mp4 in `assets` should not regress loading UX.

2. **Unify font policy across docs**
   - Templates emphasize WOFF2-only; AGENTS/README hint broader support.
   - Choose canonical rules:
     - allowed formats
     - naming convention
     - expected hosting/public path
   - Verification:
     - finalize + build + a sample clock with each allowed font format.

3. **Clarify typing/BTS around `any`**
   - `ClockItem` includes `[key: string]: any`.
   - Either remove index signature or document the allowed extension fields.
   - Verification:
     - `npm run type-check` stays green.

4. **Remove/label legacy loader ambiguity**
   - There is a second `useClockPage.ts` under `src/pages/2025/.../useClockPage.ts`.
   - Ensure docs state which loader powers the route.

---

## Priority 1 — Performance and reliability

1. **Upgrade asset preloader to support multiple asset types**
   - Extend `useClockPage.ts` to preload:
     - images (Image)
     - videos (HTMLVideoElement preload metadata)
     - audio (HTMLAudioElement)
   - Keep “fail open” behavior (missing assets should not crash the page).
   - Verification:
     - clock module with `assets = [videoUrl]` should reduce first-frame delays.

2. **Reduce overlay/ready flicker edge-cases**
   - Current transitions use RAF + a short `setTimeout` buffer.
   - Add instrumentation (optional) to measure:
     - import duration
     - preload duration
     - first paint
   - Verification:
     - compare before/after metrics for 5–10 representative clocks.

3. **Improve thumbnail/mapping robustness**
   - `thumbnailMap` maps filenames by regex from filename prefix.
   - Ensure naming rules are enforced by finalize.
   - Verification:
     - finalize fails or fixes if thumbnail naming doesn’t match.

---

## Priority 2 — Developer experience (DX)

1. **Make “Clock Module Contract” a single canonical doc**
   - Include:
     - required exports
     - accepted asset formats/types for preloading
     - font loading contract (Suspense requirement)
     - HTML semantics requirements
   - Verification:
     - new clocks created from template pass finalize.

2. **Expose a “contract lint” mode in finalize**
   - Add a `--contract-only` flag to check module exports and patterns without screenshot capture.
   - Useful for CI speed.
   - Verification:
     - CI runs contract checks quickly.

3. **Add “template conformance” tests**
   - Unit tests or snapshot tests for:
     - font loader usage
     - time hook usage
     - asset export presence

---

## Priority 3 — Quality gates and observability

1. **Add lightweight performance budgets per clock**
   - Use bundle analyzer output and enforce thresholds.
   - Verification:
     - PRs fail when thresholds are exceeded.

2. **Lighthouse CI + visual regression (where feasible)**
   - README mentions Lighthouse CI and visual regression as goals.
   - Implement a minimal baseline suite:
     - route `/list`
     - one representative clock page for each major type (analog/digital/hybrid)
   - Verification:
     - establish golden images.

3. **Add runtime error reporting (non-blocking)**
   - Current ErrorBoundary logs to console.
   - Consider capturing errors via a reporting endpoint.
   - Verification:
     - test error boundary triggers and event emission.

---

## Proposed Sequence (Practical)
1. Fix docs that contradict code (preloading contract, font policy, any/type policy).
2. Decide preloader behavior and update code + docs together.
3. Add contract checks and faster finalize mode.
4. Add performance instrumentation and budgets.
5. Add Lighthouse/visual regression.

---

## Deliverables Checklist
- [ ] Updated docs: `README.md`, `CSS_ARCHITECTURE.md`, `src/templates/ARCHITECTURE.md`, scripts READMEs
- [ ] New canonical “Clock Module Contract” section
- [ ] `ROADMAP.md` maintained for future updates
- [ ] (Optional) CI job(s) for lighthouse + regression tests

