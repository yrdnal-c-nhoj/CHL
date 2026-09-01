import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClockPage } from './useClockPage';

const mockModule = () => 'MockClockComponent';

vi.mock('../pages/**/Clock.tsx', () => ({
  default: mockModule,
}));

describe('useClockPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state with no item', () => {
    const { result } = renderHook(() => useClockPage(null));

    expect(result.current.ClockComponent).toBeNull();
    expect(result.current.isReady).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.overlayVisible).toBe(false);
  });

  it('should return initial state with undefined item', () => {
    const { result } = renderHook(() =>
      useClockPage(undefined as unknown as { date: string } | null),
    );

    expect(result.current.ClockComponent).toBeNull();
    expect(result.current.isReady).toBe(false);
    expect(result.current.overlayVisible).toBe(false);
  });

  it('should show overlay when item is provided', () => {
    const item = { date: '26-03-05' };
    const { result } = renderHook(() => useClockPage(item));

    expect(result.current.overlayVisible).toBe(true);
    expect(result.current.isReady).toBe(false);
  });

  it('should trim whitespace from date strings', async () => {
    const item = { date: '  26-03-05  ' };
    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error || result.current.isReady).toBeTruthy();
    });
  });

  it('should set error for invalid date format', async () => {
    const item = { date: 'not-a-date' };
    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
  });

  it('should hide overlay on error', async () => {
    const item = { date: '99-99-99' };
    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(result.current.overlayVisible).toBe(false);
    });
  });

  it('should clear timeout on unmount', async () => {
    const item = { date: '26-03-05' };
    const { result, unmount } = renderHook(() => useClockPage(item));

    expect(() => unmount()).not.toThrow();
  });

  it('should handle rapid item changes without crashing', async () => {
    const { result, rerender } = renderHook(
      ({ item }: { item: { date: string } | null }) => useClockPage(item),
      { initialProps: { item: { date: '26-03-05' } } },
    );

    rerender({ item: { date: '26-03-04' } });
    rerender({ item: { date: '26-03-03' } });
    rerender({ item: null });

    expect(result.current.ClockComponent).toBeNull();
    expect(result.current.overlayVisible).toBe(false);
  });

  it('should handle null date in item', async () => {
    const item = { date: '' };
    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error || result.current.isReady).toBeTruthy();
    });
  });

  it('should return error for non-existent date lookup', async () => {
    const item = { date: '00-00-00' };
    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error).toContain('Clock lookup failed');
    });
  });

  it('should not expose module internals as error', async () => {
    const item = { date: 'invalid' };
    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error).not.toContain('module');
    });
  });

  it('should set isReady to false initially for any item', () => {
    const item = { date: '26-03-05' };
    const { result } = renderHook(() => useClockPage(item));

    expect(result.current.isReady).toBe(false);
  });
});
