import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useClockTime } from '../hooks/useClockTime';
import { calculateAngles, formatTime } from '../utils/clockUtils';
// useClockTime is now an alias of the canonical rAF-based useClock
// (no setInterval), so these tests exercise the rAF-driven 1-second updates.

/**
 * jsdom does not queue requestAnimationFrame callbacks through fake timers,
 * so we shim it to run synchronously. This makes the rAF-based hooks
 * deterministic under vi.useFakeTimers().
 */
function installSyncRafShim() {
  let rafId = 0;
  const rafCallbacks = new Map<number, FrameRequestCallback>();

  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = ++rafId;
    rafCallbacks.set(id, cb);
    return id;
  });

  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    rafCallbacks.delete(id);
  });

  // Expose a helper to flush pending rAF callbacks during a test.
  return {
    flush() {
      const entries = Array.from(rafCallbacks.entries());
      rafCallbacks.clear();
      for (const [, cb] of entries) {
        cb(performance.now());
      }
    },
  };
}

describe('useClockTime', () => {
  let raf: ReturnType<typeof installSyncRafShim>;

  beforeEach(() => {
    vi.useFakeTimers();
    raf = installSyncRafShim();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('should return current time', () => {
    const testTime = new Date('2024-01-15T10:30:00');
    vi.setSystemTime(testTime);

    const { result } = renderHook(() => useClockTime());

    expect(result.current.getTime()).toBe(testTime.getTime());
  });

  it('should update time when the second changes', () => {
    const initialTime = new Date('2024-01-15T10:30:00');
    vi.setSystemTime(initialTime);

    const { result } = renderHook(() => useClockTime());

    expect(result.current.getTime()).toBe(initialTime.getTime());

    // Advance system time past the second boundary, then run a rAF tick.
    act(() => {
      vi.setSystemTime(new Date('2024-01-15T10:30:02'));
      raf.flush();
    });

    expect(result.current.getTime()).toBe(
      new Date('2024-01-15T10:30:02').getTime(),
    );
  });

  it('should cancel the rAF loop on unmount', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = renderHook(() => useClockTime());

    unmount();

    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
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
