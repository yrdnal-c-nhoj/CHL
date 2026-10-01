import { act, renderHook, waitFor } from '@testing-library/react';
import type { ComponentType } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClockPage } from './useClockPage';

const { getClockImport } = vi.hoisted(() => ({ getClockImport: vi.fn() }));

vi.mock('@/clock/clockRegistry', () => ({ getClockImport }));
vi.mock('@/utils/assetLoader', () => ({
  preloadAssets: vi.fn().mockResolvedValue(undefined),
}));

const Fake: ComponentType = () => null;

describe('useClockPage', () => {
  beforeEach(() => {
    getClockImport.mockReset();
  });

  it('is idle with no date', () => {
    const { result } = renderHook(() => useClockPage(undefined));
    expect(result.current.ClockComponent).toBeNull();
    expect(result.current.isReady).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.overlayVisible).toBe(false);
  });

  it('shows the overlay while loading', () => {
    getClockImport.mockReturnValue(() => new Promise(() => {}));
    const { result } = renderHook(() => useClockPage('26-03-05'));
    expect(result.current.overlayVisible).toBe(true);
    expect(result.current.isReady).toBe(false);
  });

  it('loads a clock', async () => {
    getClockImport.mockReturnValue(() => Promise.resolve({ default: Fake }));
    const { result } = renderHook(() => useClockPage('26-01-01'));
    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.ClockComponent).toBe(Fake);
    expect(result.current.overlayVisible).toBe(false);
  });

  it('trims whitespace from the date', async () => {
    getClockImport.mockReturnValue(() => Promise.resolve({ default: Fake }));
    renderHook(() => useClockPage('  26-01-01  '));
    await waitFor(() =>
      expect(getClockImport).toHaveBeenCalledWith('26-01-01'),
    );
  });

  it('errors for an unknown date and hides the overlay', async () => {
    getClockImport.mockReturnValue(undefined);
    const { result } = renderHook(() => useClockPage('99-99-99'));
    await waitFor(() =>
      expect(result.current.error).toContain('No clock exists for 99-99-99'),
    );
    expect(result.current.overlayVisible).toBe(false);
  });

  it('errors for a malformed date', async () => {
    getClockImport.mockReturnValue(undefined);
    const { result } = renderHook(() => useClockPage('not-a-date'));
    await waitFor(() => expect(result.current.error).not.toBeNull());
  });

  it('errors when the import fails', async () => {
    getClockImport.mockReturnValue(() => Promise.reject(new Error('boom')));
    const { result } = renderHook(() => useClockPage('26-01-01'));
    await waitFor(() => expect(result.current.error).toContain('boom'));
  });

  it('errors on a missing default export', async () => {
    getClockImport.mockReturnValue(() => Promise.resolve({}));
    const { result } = renderHook(() => useClockPage('26-01-01'));
    await waitFor(() =>
      expect(result.current.error).toContain('default export'),
    );
  });

  it('does not throw on unmount while loading', () => {
    getClockImport.mockReturnValue(() => new Promise(() => {}));
    const { unmount } = renderHook(() => useClockPage('26-03-05'));
    expect(() => unmount()).not.toThrow();
  });

  it('returns to idle when the date goes away', async () => {
    getClockImport.mockReturnValue(() => Promise.resolve({ default: Fake }));
    const { result, rerender } = renderHook(
      ({ d }: { d: string | undefined }) => useClockPage(d),
      { initialProps: { d: '26-03-05' } as { d: string | undefined } },
    );
    await waitFor(() => expect(result.current.isReady).toBe(true));
    rerender({ d: undefined });
    await waitFor(() => expect(result.current.ClockComponent).toBeNull());
    expect(result.current.overlayVisible).toBe(false);
  });

  it('ignores a stale load that finishes after navigation', async () => {
    const Other: ComponentType = () => null;
    let resolveA!: (m: { default: ComponentType }) => void;
    getClockImport.mockImplementation((d: string) =>
      d === '26-01-01'
        ? () =>
            new Promise((r) => {
              resolveA = r;
            })
        : () => Promise.resolve({ default: Fake }),
    );

    const { result, rerender } = renderHook(
      ({ d }: { d: string | undefined }) => useClockPage(d),
      { initialProps: { d: '26-01-01' } as { d: string | undefined } },
    );
    rerender({ d: '26-01-02' });
    await waitFor(() => expect(result.current.ClockComponent).toBe(Fake));

    await act(async () => {
      resolveA({ default: Other });
    });
    expect(result.current.ClockComponent).toBe(Fake);
  });
});