import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNavigationState } from '../hooks/useNavigationState';

describe('useNavigationState', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should return all navigation state methods', () => {
    const { result } = renderHook(() => useNavigationState());

    expect(typeof result.current.saveNavigationState).toBe('function');
    expect(typeof result.current.restoreNavigationState).toBe('function');
    expect(typeof result.current.clearNavigationState).toBe('function');
    expect(typeof result.current.restoreScrollPosition).toBe('function');
  });

  it('should return null when no navigation state exists', () => {
    const { result } = renderHook(() => useNavigationState());

    expect(result.current.restoreNavigationState()).toBeNull();
  });

  it('should save and restore navigation state', () => {
    const { result } = renderHook(() => useNavigationState());

    result.current.saveNavigationState('26-03');
    const restored = result.current.restoreNavigationState();

    expect(restored).not.toBeNull();
    expect(restored?.expandedMonth).toBe('26-03');
    expect(typeof restored?.scrollX).toBe('number');
    expect(typeof restored?.scrollY).toBe('number');
  });

  it('should save scroll position in the state object', () => {
    const { result } = renderHook(() => useNavigationState());

    result.current.saveNavigationState('test-month');
    const restored = result.current.restoreNavigationState();

    expect(restored?.scrollX).toBe(window.scrollX);
    expect(restored?.scrollY).toBe(window.scrollY);
  });

  it('should clear navigation state', () => {
    const { result } = renderHook(() => useNavigationState());

    result.current.saveNavigationState('26-03');
    result.current.clearNavigationState();

    expect(result.current.restoreNavigationState()).toBeNull();
  });

  it('should handle restoreScrollPosition without crashing', () => {
    const { result } = renderHook(() => useNavigationState());

    const state = {
      scrollX: 100,
      scrollY: 200,
      expandedMonth: '26-03',
    };

    expect(() => result.current.restoreScrollPosition(state)).not.toThrow();
  });

  it('should handle corrupted sessionStorage data gracefully', () => {
    sessionStorage.setItem('clockNavigationState', 'not-valid-json{{{');

    const { result } = renderHook(() => useNavigationState());

    expect(result.current.restoreNavigationState()).toBeNull();
  });

  it('should handle missing sessionStorage implementation', () => {
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = () => {
      throw new Error('sessionStorage unavailable');
    };

    const { result } = renderHook(() => useNavigationState());

    expect(() => result.current.saveNavigationState('test')).not.toThrow();

    sessionStorage.setItem = originalSetItem;
  });

  it('should save state without expanded month when called without argument', () => {
    const { result } = renderHook(() => useNavigationState());

    result.current.saveNavigationState();
    const restored = result.current.restoreNavigationState();

    expect(restored).not.toBeNull();
    expect(restored?.expandedMonth).toBeUndefined();
  });

  it('should overwrite previous state on subsequent saves', () => {
    const { result } = renderHook(() => useNavigationState());

    result.current.saveNavigationState('month-a');
    result.current.saveNavigationState('month-b');

    const restored = result.current.restoreNavigationState();
    expect(restored?.expandedMonth).toBe('month-b');
  });

  it('should handle rapid state toggles', () => {
    const { result } = renderHook(() => useNavigationState());

    for (let i = 0; i < 10; i++) {
      result.current.saveNavigationState(`month-${i}`);
      const restored = result.current.restoreNavigationState();
      expect(restored?.expandedMonth).toBe(`month-${i}`);
    }
  });

  it('should not throw when clearing non-existent state', () => {
    const { result } = renderHook(() => useNavigationState());

    expect(() => result.current.clearNavigationState()).not.toThrow();
  });
});
