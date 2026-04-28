# BorrowedTime Roadmap

Strategic evolution of the daily art engine.

## 🟢 Current: Phase 1 (Foundation & Type Safety)
*   [x] **TS Migration**: Convert core utilities and logic to TypeScript.
*   [x] **FOUC Prevention**: Implement Suspense-based font and video loading.
*   [x] **RAF Engine**: Centralize `useClockTime` for sub-millisecond sync.
*   [x] **Automated Asset Discovery**: Build-time discovery via `import.meta.glob`.

## 🟡 Upcoming: Phase 2 (UX Hardening)
*   [ ] **Accessibility**: WCAG 2.1 compliance audit.
*   [ ] **Responsive Typography**: Shift from `rem` to `vmin/vh` across all legacy 2025 clocks.
*   [ ] **Offline Access**: Service worker for cached "Clock of the Day."

## 🟠 Growth: Phase 3 (Tooling)
*   [ ] **CLI Linter**: Automated check for BTS compliance in `Clock.tsx`.
*   [ ] **Web Creator**: A GUI tool for found-imagery clock layouts.
*   [ ] **WebP Pipeline**: Automated asset optimization via Sharp.

## 🔵 Vision: Phase 4 (Platforms)
*   [ ] **Native Apps**: Standalone iOS/Android widget support.
*   [ ] **Public API**: External access for home automation (Smart Mirrors).
