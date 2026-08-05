import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './debounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not call the callback immediately', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback after the specified delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should only call the latest callback if called multiple times within the delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current(); // Call 1
      vi.advanceTimersByTime(200);
      result.current(); // Call 2 (resets timer)
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear the timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 500));

    act(() => {
      result.current();
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});