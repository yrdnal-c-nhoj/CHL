# AGENTS.md — BorrowedTime

Entry point for AI-assisted changes. This file holds the **workflow** and a **map of where each rule lives**. It does not restate rules that other documents own. If something here disagrees with the owner document, the owner wins — and please report the mismatch.

## Project principle

BorrowedTime is software **and** a historical art archive. **September 2026 is the architectural boundary.**

- `26-09-01` onward, and all shared infrastructure: follow the current contract.
- Earlier clocks: leave alone unless there is a concrete reason (production breakage, build failure, security, serious accessibility problem, shared-infrastructure incompatibility, material performance failure).
- Never refactor unrelated clocks. Never rename or move existing assets.

## Where each rule lives

| Topic | Owner (read this, don't guess) |
|---|---|
| Architecture, historical/current boundary, clock registry | `docs/ARCHITECTURE.md` |
| Clock contract (structure, `assets`, time, accessibility, motion, layout, styling) | `docs/CLOCKS.md` |
| Size/format/count budgets, `font-display`, caching, bundle limits | `docs/PERFORMANCE.md` |
| Code patterns for images, video, fonts, tiling | `docs/CLOCK_RECIPES.md` |
| Build, deploy, incident triage | `docs/OPERATIONS.md` |
| Priorities and technical debt | `docs/ROADMAP.md` |
| Measured health, counts, dates (a snapshot, never a rule) | `docs/STATUS.md` |
| Human contribution workflow, PR format | `CONTRIBUTING.md` |
| Decisions and their reasons | `docs/decisions/` |
| What is actually enforced | `scripts/verify-all-clocks.js`, `scripts/clock-verifier-rules.js` |

**Read before editing:** this file, then `docs/CLOCKS.md` for clock work, `docs/PERFORMANCE.md` for anything touching assets/fonts/media/loading/bundles, and `docs/ARCHITECTURE.md` when touching shared code. Read `docs/CLOCK_RECIPES.md` only when you need a pattern from it.

## Workflow

1. Identify the target (a clock or a shared module) and whether it is historical or current.
2. Read the target's `Clock.tsx`, `Clock.module.css`, and any helper it imports.
3. Look for an existing pattern before inventing one (see "Finding precedent").
4. For a new clock, scaffold it: `npm run new-clock YY-MM-DD "Title" tag1 tag2`.
5. Make the smallest complete change that preserves visual behavior.
6. Run the checks below, in order.
7. Report: files changed, checks run and their results, and anything still failing.

Do not silently replace a broken asset, swallow an import error, or claim a check passed that you did not run.

## Non-negotiables enforced by `verify:clocks`

These fail the verifier for current clocks. Full explanations are in `docs/CLOCKS.md`.

- `Clock.module.css` exists in the clock's directory.
- Default-exports the component; `Clock.displayName` ends in `_YY_MM_DD`.
- Imports `useClock` or `useSmoothClock` from `@/utils/hooks` (use `useSmoothClock` only when sub-second motion is visible).
- Renders time through the shared `SRTime` component (`26-09` and later). Do not use `styles.srOnly` directly.
- No `setInterval` / `setTimeout`. No `requestAnimationFrame` used to calculate clock time. A Three.js `renderer.render()` loop is allowed (ADR 0002).
- No inline `<style>` tags.
- The word `any` must not appear in the source, including comments (the check is a plain word match).
- Never use the deprecated hooks `useClockTime`, `useSecondClock`, `useMillisecondClock`.

## Also enforced by ESLint on current clocks

`eslint.config.js` applies these to every `.ts`/`.tsx` file under September 2026 and later clock folders (helpers included). They are errors, and the verifier does not catch them, so lint your clock:

- `setInterval` / `setTimeout` (including `window.` forms).
- `Date.now()` and `new Date()` with no arguments.
- `any`, non-null assertions (`!`), and unused variables (prefix intentionally unused ones with `_`).

## Required but enforced by neither

You are responsible for these; nothing will catch them automatically.

- If the clock imports any local image, font, or video, export an `assets` array listing it. Do not list assets that are never rendered.
- `prefers-reduced-motion` handling for animated clocks.
- `100dvh` for full-height roots; no page scroll unless the artwork needs it.
- Local assets only. No base64 blobs, no remote images or video.
- Autoplaying audio is not allowed.
- No Tailwind in new work. No new dependencies if existing utilities suffice.
- Strict TypeScript: guard indexed access, no non-null assertions.
- Asset size/format/count limits: see `docs/PERFORMANCE.md`.

## Validation

Run, in this order, and stop to fix problems as they appear:

```bash
npm run verify:clocks -- --path YY-MM-DD     # the clock's contract check
npx eslint src/pages/YYYY/YY-MM/YY-MM-DD     # lint scoped to the clock you changed
npm run type-check                            # in-scope TypeScript (tsconfig.ci.json)
npm run test:run                              # required if shared code changed
npm run build                                 # always, before you finish
```

Then do a browser smoke check of the clock's route.

Notes:

- CI runs `verify:clocks:changed`, `test:run`, `type-check`, and `build`. It does not run lint.
- Do **not** use `npm run lint` or `npm run check` as a pass/fail signal: they lint the whole legacy fleet, which has known failures (`docs/STATUS.md`). Lint only what you changed.
- If a check fails for a pre-existing reason, say so and name the failing files. Do not weaken rules or hide output to make it pass.
- `npm run status` is only a reminder. `docs/STATUS.md` is edited by hand.

## Finding precedent

Search the current clocks instead of relying on a remembered example:

```bash
# Font loaded through the shared hook (the default)
grep -l useSuspenseFontLoader src/pages/2026/26-09/*/Clock.tsx
# Hand-written @font-face (the exception)
grep -l "@font-face" src/pages/2026/26-09/*/Clock.module.css
# Clocks using sub-second motion
grep -l useSmoothClock src/pages/2026/26-09/*/Clock.tsx
# Clocks with a video
grep -l "<video" src/pages/2026/26-09/*/Clock.tsx
```

`docs/CLOCK_RECIPES.md` lists verified examples with the date they were checked.

## Keeping the documentation honest

- Update the owner document, not a copy of it. Do not restate a rule or a number in a second place; link to it.
- Put counts, dates, and measurements only in `docs/STATUS.md`.
- Do not cite section numbers (`§4.3`) in code comments; the documents are not numbered. Cite the file name.
- New markdown belongs in `docs/` (or `docs/decisions/` for ADRs). Root-level `.md` files are git-ignored except `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, and `SECURITY.md`; check with `git check-ignore -v <file>` before assuming a new file will be committed.
- If the verifier and `docs/CLOCKS.md` disagree, fix one of them in the same change and mention it in your report.
