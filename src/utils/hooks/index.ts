/**
 * Standardized Clock Hooks
 *
 * This module exports the canonical clock hooks for the BorrowedTime project.
 *
 * - useClockTime: Basic 1-second interval (default for most clocks)
 * - useSmoothClock: High-precision 60fps RAF (for smooth animations)
 * - useNtpClock: NTP-synced with smooth seconds (for precise time display)
 *
 * Usage:
 *   import { useClockTime } from '@/utils/hooks';
 *   const time = useClockTime(); // Returns Date object, updates every second
 */

export { useClockTime } from './useClockTime';
export {
  useSmoothClock,
  useMillisecondClock,
  useSecondClock,
} from './useSmoothClock';
export { useClock as useNtpClock } from './useClock';
