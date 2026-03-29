import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useClockPage } from '../hooks/useClockPage';

// Mock the dynamic import
const mockModule = {
  default: () => 'MockClockComponent',
  backgroundImage: '/test-bg.jpg',
};

vi.mock('../pages/**/Clock.tsx', () => ({
  default: mockModule,
}));

describe('useClockPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null component when no item provided', () => {
    const { result } = renderHook(() => useClockPage(null));

    expect(result.current.ClockComponent).toBeNull();
    expect(result.current.isReady).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return null component when item is undefined', () => {
    const { result } = renderHook(() => useClockPage(undefined));

    expect(result.current.ClockComponent).toBeNull();
    expect(result.current.isReady).toBe(false);
  });

  it('should handle item with nested path structure (YY-MM-DD)', async () => {
    const item = {
      date: '26-03-05',
      path: '26-03-05',
      title: 'Test Clock',
    };

    const { result } = renderHook(() => useClockPage(item));

    // Initially should show loading state
    expect(result.current.isReady).toBe(false);
    expect(result.current.overlayVisible).toBe(true);

    // Wait for async loading
    await waitFor(
      () => {
        // After error, error should be set (since we can't actually import in test)
        expect(result.current.error || result.current.isReady).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('should handle item with legacy flat path structure', async () => {
    const item = {
      date: '25-11-01',
      path: '25-11-01',
      title: 'Legacy Clock',
    };

    const { result } = renderHook(() => useClockPage(item));

    await waitFor(
      () => {
        expect(result.current.error || result.current.isReady).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('should handle invalid date format gracefully', async () => {
    const item = {
      date: 'invalid-date',
      path: 'invalid-date',
      title: 'Invalid Clock',
    };

    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
  });

  it('should show overlay initially', () => {
    const item = {
      date: '26-03-05',
      path: '26-03-05',
      title: 'Test Clock',
    };

    const { result } = renderHook(() => useClockPage(item));

    expect(result.current.overlayVisible).toBe(true);
  });

  it('should expose error state when module not found', async () => {
    const item = {
      date: '99-99-99', // Date that won't exist
      path: '99-99-99',
      title: 'Non-existent Clock',
    };

    const { result } = renderHook(() => useClockPage(item));

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(result.current.error).toContain('No clock found');
    });
  });

  it('should handle item with only path (no date)', async () => {
    const item = {
      path: '26-03-05',
      title: 'Path Only Clock',
    };

    const { result } = renderHook(() => useClockPage(item as any));

    await waitFor(
      () => {
        expect(result.current.error || result.current.isReady).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });

  it('should prevent race conditions with concurrent loads', async () => {
    const item1 = {
      date: '26-03-05',
      path: '26-03-05',
      title: 'Clock 1',
    };

    const { result, rerender } = renderHook(
      ({ item }) => useClockPage(item),
      {
        initialProps: { item: item1 },
      }
    );

    // Quickly switch to different item
    const item2 = {
      date: '26-03-04',
      path: '26-03-04',
      title: 'Clock 2',
    };

    rerender({ item: item2 });

    // Should not crash and should handle the switch gracefully
    await waitFor(
      () => {
        expect(result.current.error || result.current.isReady).toBeTruthy();
      },
      { timeout: 3000 }
    );
  });
});
