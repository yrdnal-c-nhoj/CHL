# BorrowedTime Technical Standards

One rulebook. Every rule has an ID, a plain statement, and how it is enforced.
Consolidated from `AGENTS.md`, `docs/CLOCKS.md`, `docs/PERFORMANCE.md`,
`scripts/verify-all-clocks.js`, and `scripts/conform.js`.

**Enforcement key**
- **CI** = `verify-all-clocks.js` (blocks commit and CI)
- **CONFORM** = `npm run conform` (FAIL blocks, REVIEW needs a decision)
- **MANUAL** = no tool checks it; verify by eye or browser

---

## 0. Scope

| ID | Rule | Enforced |
|---|---|---|
| S1 | Current standards apply to clocks dated **26-09-01 onward**. | CONFORM |
| S2 | Clocks before September 2026 are preserved, not rewritten. Change one only for a concrete production, security, accessibility, deployment, or shared-infrastructure problem. | MANUAL |
| S3 | Never weaken a rule to accommodate legacy artwork. | MANUAL |

## 1. Structure

| ID | Rule | Enforced |
|---|---|---|
| R1 | Each clock lives at `src/pages/YYYY/YY-MM/YY-MM-DD/` with `Clock.tsx` and `Clock.module.css`. Local helpers are allowed. | CI |
| R2 | A clock exists only if its `Clock.tsx` exists. Adding a date to `src/context/*.json` does not publish anything. | MANUAL |

## 2. Component

| ID | Rule | Enforced |
|---|---|---|
| R3 | Default export is written `export default Name;`. | CI |
| R4 | `Name.displayName = 'Clock_YY_MM_DD'`, and the date **matches the folder**. | CI (pattern), CONFORM (date match, auto-fix) |
| R5 | If the clock imports any local image, font, or video, it exports `assets = [...]` listing every one. No local assets means no export. | CONFORM (auto-fix) |
| R6 | Every imported asset is actually rendered. Remove unused imports and their `assets` entries. | CONFORM |
| R7 | Displayed time comes from `useClock` or `useSmoothClock`, imported from `@/utils/hooks`. | CI |
| R8 | Semantic time uses the shared `SRTime` component. Never use `styles.srOnly` directly. | CI |
| R9 | Strict TypeScript. No `any`. | CI |
| R10 | No deprecated hooks: `useClockTime`, `useSecondClock`, `useMillisecondClock`. | CI |
| R11 | No unnecessary new dependencies. | MANUAL |
| R12 | Guard array and object index access under strict TypeScript. Never assume `arr[i]` exists. | MANUAL |

## 3. Time

| ID | Rule | Enforced |
|---|---|---|
| T1 | No `setInterval` or `setTimeout` in a clock. | CI |
| T2 | No `requestAnimationFrame` as an independent time source. | CI |
| T3 | No `Date.now()` driving displayed time. | CONFORM (REVIEW) |
| T4 | Exception: a Three.js/WebGL render loop is allowed to render frames only. It must not compute the displayed time. | MANUAL |
| T5 | Use `useClock` for once-per-second displays, `useSmoothClock` only when sub-second motion is visibly needed. | MANUAL |

## 4. Styling

| ID | Rule | Enforced |
|---|---|---|
| Y1 | CSS Modules for static styles. | CONFORM |
| Y2 | Inline styles only for genuinely dynamic values (computed transforms, CSS variables for imported assets). | MANUAL |
| Y3 | No Tailwind in clocks. | CONFORM (FAIL in CSS, REVIEW for string `className`) |
| Y4 | No inline `<style>` tags. | CI |
| Y5 | No mutation of `document.body` or `document.documentElement`. | CONFORM (FAIL) |
| Y6 | `document.head` only for a Google Font `<link>` with a preconnect and cleanup. | CONFORM (REVIEW) |
| Y7 | Keep artwork-specific styles local to the clock. | MANUAL |

## 5. Layout

| ID | Rule | Enforced |
|---|---|---|
| L1 | Works on desktop, mobile portrait, mobile landscape, and tablet. | MANUAL (browser) |
| L2 | No page scrolling unless the artwork requires it. | MANUAL (browser) |
| L3 | Use `100dvh`, never `100vh`. | CONFORM (auto-fix) |
| L4 | Prefer `dvh`, `vw`, `vmin`, `rem`, `%`, `fr`. Fixed px only for deliberate visual details. | CONFORM (REVIEW at 100px or more on width, height, or font-size) |
| L5 | Repeating textures use CSS `background-repeat`, not dozens of `<img>` elements. List layers foreground-first and keep repeat/size/position lists in the same order. | MANUAL |
| L6 | Choose `background-size` deliberately: `cover` only when cropping is acceptable, `contain` when the whole artwork must show, explicit sizes for tiles. Avoid `object-fit: cover` where cropping would remove important artwork. | MANUAL |

## 6. Accessibility

| ID | Rule | Enforced |
|---|---|---|
| A1 | A semantic `<time>` or `SRTime` with a valid ISO `dateTime`. | CI |
| A2 | Every `<img>` has `alt` (`alt=""` if decorative). | CONFORM (FAIL) |
| A3 | Animated clocks have a `prefers-reduced-motion: reduce` treatment that keeps the time readable. | CONFORM (REVIEW) |
| A4 | No autoplay audio. Audio is user-initiated unless the product requirement explicitly says otherwise. | CONFORM (FAIL) |
| A5 | A decorative background `<video>` has `aria-hidden="true"`. | MANUAL |

## 7. Assets and performance

| ID | Rule | Enforced |
|---|---|---|
| P1 | Assets are local, imported from the established asset directories. No remote media URLs, no base64 images. | CONFORM |
| P2 | Images under **200KB**. Prefer WebP or AVIF. | CONFORM (REVIEW) |
| P3 | Video backgrounds under **2MB**, rendered as a plain `<video src={...}>` with `autoPlay muted loop playsInline` (no `<source>` child unless serving a format fallback chain). Prefer WebM. Do not use video where a static image communicates the same design. | CONFORM (REVIEW size, FAIL and auto-fix attributes) |
| P4 | Fonts under **100KB** each, WOFF2 preferred, subset to needed glyphs. | CONFORM (REVIEW size) |
| P5 | At most **2** custom font families per page. | CONFORM (REVIEW) |
| P6 | Each clock's `fontFamily` name is unique to it (contains `YY_MM_DD`). | CONFORM (REVIEW) |
| P7 | Choose `font-display` deliberately: `block` only for small, art-critical fonts, otherwise `swap` or `fallback`. | MANUAL |
| P8 | No unexplained media files in the repo root. | CONFORM (REVIEW) |
| P9 | Never rename or move existing historical assets just to match current conventions. | MANUAL |
| P10 | Preload only above-the-fold fonts and critical CSS. | MANUAL |
| P11 | Local fonts use the default pattern: import with `?url`, register in `assets`, load through `useSuspenseFontLoader` with a unique `fontFamily`. Manual `@font-face` only when Suspense loading is inappropriate. Do not hand-roll a competing loader. | MANUAL |
| P12 | Google Fonts load via `<link>` (never a blocking `@import` in inline `<style>`) with a `preconnect`, include `display=swap`, count toward the family limit (P5), and are **not** listed in `assets`. | MANUAL |
| P13 | Meaningful images use `<img>` with useful `alt`; decorative art uses CSS `background-image`. Content images with several local resolutions use `srcSet` and `sizes`. Do not `loading="lazy"` the primary above-the-fold image if it delays first paint. | MANUAL |

## 8. Verification and process

| ID | Rule | Enforced |
|---|---|---|
| V1 | Before finishing any change, run the checks that apply: `npm run conform`, `npm run type-check`, `npm run build`, and `npm run test:run` if shared code changed. | MANUAL |
| V2 | Report exactly which checks were run. **Never claim an unrun check passed.** | MANUAL |
| V3 | Fix only what a rule requires. No unrelated refactors. | MANUAL |
| V4 | When asked "does this conform?", run `npm run conform -- --fix`, fix every FAIL, decide every REVIEW, re-run until no FAIL remains, then report. Oversized assets are reported and asked about, never deleted or re-encoded automatically. | MANUAL |

---

## Open decisions (rules that currently conflict or are unmet)

1. **Video `preload`.** `PERFORMANCE.md` says background video uses `preload="none"`, which conflicts with `autoPlay`. The established September 2026 pattern in `AGENTS.md` (20 of ~26 clocks) omits `preload`, and P3 follows it. Recommended: update `PERFORMANCE.md` to exempt autoplay backgrounds.
2. **Three.js chunk** is about 194KB against a 150KB budget. Either raise the budget and document why, or reduce what is imported.
3. **Thumbnail chunk** is about 59KB against a 50KB budget, and the fix is still open.
4. **LFS in CI.** `ci.yml` does not check out LFS files, so the CI build may not contain your real media. Set `lfs: true` on the checkout step if you want P2 to P4 verified in CI.
