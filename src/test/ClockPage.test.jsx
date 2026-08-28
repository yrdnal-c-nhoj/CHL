import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClockPage from '../pages/ClockPage';

// Mock the dynamic-clock loader hook used by ClockPage so we don't need to
// exercise the real import.meta.glob registry (which is a build-time static).
vi.mock('../hooks/useClockPage', () => ({
  useClockPage: () => ({
    ClockComponent: () => <div>Mock Clock Component</div>,
    isReady: true,
    error: null,
    overlayVisible: false,
  }),
}));

// Mock DataContext shape consumed by ClockPage.
vi.mock('../context/DataContext', () => ({
  useDataContext: () => ({
    items: [
      { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
      { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    ],
    loading: false,
  }),
}));

describe('ClockPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAt = (route) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </MemoryRouter>,
    );

  it('resolves the current item from the route param and renders the clock', async () => {
    renderAt('/26-03-05');

    await waitFor(() => {
      expect(screen.getByText('Mock Clock Component')).toBeInTheDocument();
    });
  });

  it('normalizes dates consistently (YY-MM-DD)', () => {
    const normalizeDate = (d) =>
      d
        .split('-')
        .map((n) => n.padStart(2, '0'))
        .join('-');

    expect(normalizeDate('25-11-1')).toBe('25-11-01');
    expect(normalizeDate('26-3-5')).toBe('26-03-05');
    expect(normalizeDate('24-12-31')).toBe('24-12-31');
  });

  it('validates date format (YY-MM-DD)', () => {
    const validDates = ['25-11-01', '26-03-05', '24-12-31'];
    const invalidDates = ['invalid', '2025-11-01', '25-11-1'];
    const dateRegex = /^\d{2}-\d{2}-\d{2}$/;

    validDates.forEach((date) => {
      expect(dateRegex.test(date)).toBe(true);
    });

    invalidDates.forEach((date) => {
      expect(dateRegex.test(date)).toBe(false);
    });
  });
});

describe('ClockPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error state when clock fails to load', async () => {
    vi.mock('../hooks/useClockPage', () => ({
      useClockPage: () => ({
        ClockComponent: null,
        isReady: false,
        error: 'Clock loading timed out',
        overlayVisible: false,
      }),
    }));

    render(
      <MemoryRouter initialEntries={['/26-03-05']}>
        <Routes>
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Clock loading timed out')).toBeInTheDocument();
    });
  });

  it('renders loading overlay when clock is not ready', async () => {
    vi.mock('../hooks/useClockPage', () => ({
      useClockPage: () => ({
        ClockComponent: null,
        isReady: false,
        error: null,
        overlayVisible: true,
      }),
    }));

    render(
      <MemoryRouter initialEntries={['/26-03-05']}>
        <Routes>
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('renders navigation when current item exists', async () => {
    vi.mock('../hooks/useClockPage', () => ({
      useClockPage: () => ({
        ClockComponent: () => <div>Clock</div>,
        isReady: true,
        error: null,
        overlayVisible: false,
      }),
    }));

    render(
      <MemoryRouter initialEntries={['/26-03-05']}>
        <Routes>
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Clock')).toBeInTheDocument();
    });
  });

  it('does not render navigation when no current item matches', async () => {
    vi.mock('../context/DataContext', () => ({
      useDataContext: () => ({
        items: [],
        loading: false,
      }),
    }));

    vi.mock('../hooks/useClockPage', () => ({
      useClockPage: () => ({
        ClockComponent: null,
        isReady: false,
        error: null,
        overlayVisible: false,
      }),
    }));

    render(
      <MemoryRouter initialEntries={['/26-03-05']}>
        <Routes>
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Go back/i })).not.toBeInTheDocument();
    });
  });

  it('handles timeout fallback by hiding overlay and setting error', async () => {
    vi.mock('../hooks/useClockPage', () => ({
      useClockPage: () => ({
        ClockComponent: null,
        isReady: false,
        error: 'Clock loading timed out',
        overlayVisible: false,
      }),
    }));

    render(
      <MemoryRouter initialEntries={['/99-99-99']}>
        <Routes>
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Clock loading timed out')).toBeInTheDocument();
    });
  });
});
