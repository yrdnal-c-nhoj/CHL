/**
 * Standardized Clock Hooks
 *
 * This module exports the canonical clock hooks for the BorrowedTime project.
 * All time hooks are rAF-based (no `setInterval`) and only re-render when the
 * relevant time unit changes, per ARCHITECTURE.md §4.3.
 *
 * Canonical names:
 * - useClock:          updates once per second (default for most clocks)
 * - useSmoothClock:    updates every animation frame, throttled to a
 *                      configurable interval (default 1000ms). Use for
 *                      smooth hand rotations and sub-second animations.
 *
 * Deprecated aliases (kept as thin re-exports for backward compatibility —
 * see CLOCK_CONTRACT.md §2.2 / §5):
 * - useSecondClock       -> useClock
 * - useMillisecondClock  -> useSmoothClock
 * - useClockTime         -> useClock
 *
 * Usage:
 *   import { useClock } from '@/utils/hooks';
 *   const time = useClock();           // Date, updates every second
 *
 *   import { useSmoothClock } from '@/utils/hooks';
 *   const time = useSmoothClock(16);   // Date, updates ~60fps
 */

export { useClock } from './useClock';
export { useSmoothClock } from './useSmoothClock';
export {
  useSecondClock,
  useMillisecondClock,
} from './useSmoothClock';
export {
  useClockTime,
  formatTime,
  calculateAngles,
  generateTickMarks,
  isValidTime,
  timeStringToDate,
} from './useClockTime';
export { useIsDesktop } from './useIsDesktop';
export { useVisibilitySchedule } from './useVisibilitySchedule';