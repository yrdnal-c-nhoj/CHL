# ADR 0001: September 2026 Architecture Boundary

- Status: Accepted
- Date: 2026-09-21

## Decision

September 2026 is the forward-looking architecture boundary for BorrowedTime.

New clocks and shared infrastructure follow the current React/TypeScript/Vite contract. Earlier clocks remain historical archive material unless a concrete production issue requires modification.

## Context

The project contains hundreds of daily artworks created under different implementation conventions. A fleet-wide migration would create substantial risk, consume time that should go toward new artwork, and provide little artistic value.

## Consequences

- Current code can improve without requiring a full historical rewrite.
- Historical implementations may remain inconsistent.
- Verification and TypeScript checks must distinguish current scope from legacy scope.
- Shared infrastructure remains responsible for supporting the archive where practical.
- Future archive-growth decisions must be explicit.
