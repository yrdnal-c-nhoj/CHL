import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useClockAngles } from './useClockAngles';

describe('useClockAngles', () => {
  it('should return 0 degrees for all hands at midnight (00:00:00)', () => {
    const time = new Date('2024-01-01T00:00:00.000Z');
    const { result } = renderHook(() => useClockAngles(time));

    expect(result.current.hourAngle).toBe(0);
    expect(result.current.minAngle).toBe(0);
    expect(result.current.secAngle).toBe(0);
  });

  it('should return correct angles for noon (12:00:00)', () => {
    const time = new Date('2024-01-01T12:00:00.000Z');
    const { result } = renderHook(() => useClockAngles(time));

    // At 12:00, the hour hand has completed a full 360-degree rotation.
    expect(result.current.hourAngle).toBe(360);
    expect(result.current.minAngle).toBe(0);
    expect(result.current.secAngle).toBe(0);
  });

  it('should calculate correct angles for 6:30:15', () => {
    const time = new Date('2024-01-01T06:30:15.000Z');
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
    const time = new Date('2024-01-01T00:00:00.500Z'); // Half a second past midnight
    const { result } = renderHook(() => useClockAngles(time));

    expect(result.current.secAngle).toBe(3); // 0.5s * 6 deg/s
  });

  it('should return a stable object reference for the same time', () => {
    const time = new Date('2024-01-01T10:20:30.000Z');
    const { result, rerender } = renderHook(() => useClockAngles(time));
    const firstResult = result.current;

    rerender();

    expect(result.current).toBe(firstResult);
  });
});