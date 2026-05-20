import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClockTime, formatTime, calculateAngles } from '../utils/clockUtils';

describe('useClockTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return current time', () => {
    const testTime = new Date('2024-01-15T10:30:00');
    vi.setSystemTime(testTime);

    const { result } = renderHook(() => useClockTime());

    expect(result.current.getTime()).toBe(testTime.getTime());
  });

  it('should update time every second', () => {
    const initialTime = new Date('2024-01-15T10:30:00');
    vi.setSystemTime(initialTime);

    const { result } = renderHook(() => useClockTime());

    expect(result.current.getTime()).toBe(initialTime.getTime());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.getTime()).toBe(initialTime.getTime() + 1000);
  });

  it('should clear interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

    const { unmount } = renderHook(() => useClockTime());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});

describe('formatTime', () => {
  it('should format time in 24h format by default', () => {
    const date = new Date('2024-01-15T14:30:45');
    expect(formatTime(date)).toBe('14:30:45');
  });

  it('should handle midnight in 12h format', () => {
    const date = new Date('2024-01-15T00:00:00');
    expect(formatTime(date, '12h')).toContain('12:00:00 AM');
  });
});

describe('calculateAngles', () => {
  it('should calculate correct angles at 12:00:00', () => {
    const time = new Date('2024-01-15T12:00:00');
    const angles = calculateAngles(time);

    expect(angles.hour).toBe(0);
    expect(angles.minute).toBe(0);
    expect(angles.second).toBe(0);
  });

  it('should calculate minute hand with seconds adjustment', () => {
    const time = new Date('2024-01-15T12:30:30');
    const angles = calculateAngles(time);

    expect(angles.minute).toBe(183);
  });
});
