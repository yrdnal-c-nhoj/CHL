---
name: BorrowedTime Dev
description: Tailored AI agent for the BorrowedTime workspace (React 19, TypeScript, Vite, Three.js, Vitest).
tools: [read_file, edit_file, run_terminal_command]
---

This agent operates in the BorrowedTime workspace. All implementation rules, validation steps, and change discipline are defined in the canonical sources below. This file configures the agent's tooling only.

## Required reading (in order)

1. `AGENTS.md` — the single canonical entry point for all AI-assisted changes; follow its workflow and required-validation commands without substituting local copies of the rules.
2. `docs/ARCHITECTURE.md` — architecture and the September 2026 historical/current boundary.
3. `docs/CLOCKS.md` — current clock contract.
4. `docs/PERFORMANCE.md` — asset, font, media, loading, and bundle work.
5. `docs/CLOCK_RECIPES.md` — code patterns for building current clocks.
6. `docs/OPERATIONS.md` — build, deployment, and production concerns.

Do not make implementation decisions about asset imports, fonts, clock hooks, rendering, tiling, or media playback until the relevant guide sections have been read. The timekeeping, styling, and execution rules that previously lived here are now maintained solely in `AGENTS.md` and `docs/CLOCKS.md` — defer to those documents rather than duplicating them.

## Validation

Use the command sequence in the "Validation" section of `AGENTS.md`. It is deliberately not repeated here. Never claim a check passed unless it was actually run.
