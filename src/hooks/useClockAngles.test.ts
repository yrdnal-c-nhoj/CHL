import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useClockAngles } from './useClockAngles';

/**
 * The hook reads local-time getters (getHours/getMinutes/getSeconds), so the
 * fixtures must be built with the local-time constructor. Using UTC "Z"
 * strings made these tests timezone-dependent and flaky (e.g. they failed on
 * machines where the local hour differs from the UTC hour).
 */
const local = (h: number, m: number, s: number, ms = 0) =>
  new Date(2024, 0, 1, h, m, s, ms);

describe('useClockAngles', () => {
  it('should return 0 degrees for all hands at midnight (00:00:00)', () => {
    const time = local(0, 0, 0);
    const { result } = renderHook(() => useClockAngles(time));

    expect(result.current.hourAngle).toBe(0);
    expect(result.current.minAngle).toBe(0);
    expect(result.current.secAngle).toBe(0);
  });

  it('should return correct angles for noon (12:00:00)', () => {
    const time = local(12, 0, 0);
    const { result } = renderHook(() => useClockAngles(time));

    // At 12:00, the hour hand has completed a full 360-degree rotation.
    expect(result.current.hourAngle).toBe(360);
    expect(result.current.minAngle).toBe(0);
    expect(result.current.secAngle).toBe(0);
  });

  it('should calculate correct angles for 6:30:15', () => {
    const time = local(6, 30, 15);
    const { result } = renderHook(() => useClockAngles(time));

    // Note: The original test had slightly incorrect expected values.
    // Corrected calculations:
    // hour: (6 + 30/60 + 15/3600) * 30 = 195.125
    // minute: (30 + 15/60) * 6 = 181.5
    // second: 15 * 6 = 90
    expect(result.current.hourAngle).toBeCloseTo(195.125);
    expect(result.current.minAngle).toBeCloseTo(181.5);
    expect(result.current.secAngle).toBe(90);
  });

  it('should handle fractional seconds for smooth animation', () => {
    const time = local(0, 0, 0, 500); // Half a second past midnight
    const { result } = renderHook(() => useClockAngles(time));

    expect(result.current.secAngle).toBe(3); // 0.5s * 6 deg/s
  });

  it('should return a stable object reference for the same time', () => {
    const time = local(10, 20, 30);
    const { result, rerender } = renderHook(() => useClockAngles(time));
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });
});
