# Codemod Pass 2 — Provably-Safe `setInterval` Migrations

**Scope (user-confirmed):** Option 1 — only *provably-safe* migrations. Leave the
behavioral animation intervals (DOM spawn loops, image cycling, rAF animations)
for manual review.

## Key finding

The canonical `useClockTime` in `src/utils/hooks/useClockTime.ts` is **already
rAF-backed** (delegates to `useSecondClock`, no `setInterval`). So files that
import `useClockTime` from `@/utils/hooks/useClockTime` or `@/utils/hooks` are
already compliant w.r.t. the time hook — they do NOT need migration.

The 110 remaining `setInterval` files are **genuinely behavioral**:
- DOM node creation / spawning loops (`createClock`, confetti spawners)
- Animation loops (`requestAnimationFrame` already present; `setInterval` for
  cadence not tied to a single state setter)
- Image / background cycling
- Multiple intervals per file (`intervalCount=2|3`)

These are NOT safe to auto-transform because the `setInterval` is not a single
pure state ticker. They require per-clock manual review.

## Plan

1. **Confirm the deprecated-import subset is already safe** — files importing
   `useClockTime` from `@/utils/hooks` are compliant for the time-hook rule.
   No change needed (only inline `<style>` / other rules may still flag them).

2. **Keep the Pass 1 codemod as-is** (it correctly fails closed). Do NOT weaken
   it — behavioral intervals must stay manual.

3. **Add a codemod "triage" mode** that classifies the 110 review files into
   sub-buckets so the manual backlog is tractable:
   - `A: deprecated-import-only` — already safe (useClockTime/useSecondClock),
     only remaining violations are inline `<style>` / a11y / boilerplate.
   - `B: single-behavioral-interval` — one `setInterval` but not a pure ticker
     (needs manual judgment: keep-as-animation vs refactor).
   - `C: multi-interval` — `intervalCount>=2` (needs manual judgment).
   - `D: deprecated-import + interval` — uses `useClockTime` AND has its own
     `setInterval` for a subordinate behavior.

4. **Create a triage report** (`scripts/codemods/pass2-triage.json`) so each
   remaining file has a clear disposition and can be worked off one at a time.

5. **Do NOT ratchet the baseline** for untouched files. Only ratchet after real
   reductions.

## Status — DONE (provably-safe scope)

- ✅ Added `--triage` mode to `scripts/codemods/migrate-setInterval-to-hooks.mjs`.
- ✅ Generated `scripts/codemods/pass2-triage.json`.
- ✅ Verified dry-run still reports 0 safe (all Pass-1 transforms already applied)
  and 110 review files untouched.
- **Result:** all 110 remaining intervals are *behavioral* — no provably-safe
  auto-migration remains. Disposition:
  - **A: 7** files already use canonical rAF `useClockTime` (no time-hook action).
  - **B: 98** single-behavioral (manual review).
  - **C: 2** multi-interval (manual review): `26-01-15`, `26-02-17`.
  - **D: 3** deprecated-import + own interval (manual review):
    `25-06-06`, `25-09-28`, `25-11-28`.
- **Baseline NOT ratcheted** — no safe reductions occurred in this pass.

## Out of scope (manual review backlog)
- `25-06-06` RollingClock (DOM spawn + rAF + inline `<style>`)
- `25-08-20` world-clock (24 rAF loops, toLocaleString timezone)
- Confetti/animation spawners (behavioral `setInterval`)
- Inline `<style>` → CSS Modules (separate codemod task)

## Files
- `scripts/codemods/migrate-setInterval-to-hooks.mjs` — add triage mode (no
  behavioral transforms).
- `scripts/codemods/pass2-triage.json` — generated triage output.
- `TODO.md` — update Pass 2 status.
