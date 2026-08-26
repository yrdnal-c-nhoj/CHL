/**
 * Standardized Clock Hooks
 *
 * This module exports the canonical clock hooks for the BorrowedTime project.
 * All time hooks are rAF-based (no `setInterval`) and only re-render when the
 * relevant time unit changes, per ARCHITECTURE.md §4.3.
 *
 * - useSecondClock:      updates once per second (default for most clocks)
 * - useClockTime:        alias of useSecondClock (backward-compatible)
 * - useMillisecondClock: updates every ~50ms (smooth animations)
 * - useSmoothClock:      custom rAF interval (configurable)
 * - useIsDesktop:        matchMedia-based desktop breakpoint
 *
 * Usage:
 *   import { useSecondClock } from '@/utils/hooks';
 *   const time = useSecondClock(); // Returns Date object, updates every second
 */

export { useClockTime, formatTime, calculateAngles, generateTickMarks, isValidTime, timeStringToDate } from './useClockTime';
export { useIsDesktop } from './useIsDesktop';
export {
  useMillisecondClock,
  useSecondClock, useSmoothClock
} from './useSmoothClock';
export { useVisibilitySchedule } from './useVisibilitySchedule';

