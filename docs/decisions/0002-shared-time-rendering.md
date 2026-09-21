# ADR 0002: Shared Time Source, Independent Rendering

- Status: Accepted
- Date: 2026-09-21

## Decision

Clock values must come from the shared time infrastructure. Rendering mechanisms may vary.

A Three.js/WebGL implementation may use `requestAnimationFrame` to render frames, but it must not use that loop as an independent source of clock time.

## Context

The project contains both ordinary DOM/CSS clocks and 3D/WebGL artwork. A blanket prohibition on `requestAnimationFrame` incorrectly treats a rendering loop as equivalent to an independent timing mechanism.

## Consequences

- DOM clocks use shared time hooks.
- Three.js clocks may retain a renderer loop when required by the graphics engine.
- The contract verifier should distinguish clock timekeeping from graphics rendering.
- Historical and current visual techniques remain flexible while time accuracy stays centralized.
