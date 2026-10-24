import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DataContext } from '@/context/DataContext';
import type { ClockItem } from '@/types/data';
import ClockPage from '@/pages/ClockPage';
import TopNav from '@/components/TopNav';

vi.mock('@/hooks/useClockPage', () => ({
  useClockPage: () => ({
    ClockComponent: () => <div>clock artwork</div>,
    error: null,
    overlayVisible: false,
  }),
}));

const items: ClockItem[] = [
  { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
  { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
];

const LocationDisplay = () => {
  const location = useLocation();
  const randomMode =
    location.state !== null &&
    typeof location.state === 'object' &&
    'randomMode' in location.state &&
    location.state.randomMode === true;

  return (
    <output data-testid="location">
      {location.pathname}:{String(randomMode)}
    </output>
  );
};

const renderClockPage = (randomMode: boolean) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/26-03-05',
          state: randomMode ? { randomMode: true } : null,
        },
      ]}
    >
      <DataContext.Provider value={{ items, loading: false, error: null }}>
        <LocationDisplay />
        <Routes>
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </DataContext.Provider>
    </MemoryRouter>,
  );

describe('random clock navigation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts random mode from the RANDOM navigation link', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    render(
      <MemoryRouter>
        <DataContext.Provider value={{ items, loading: false, error: null }}>
          <TopNav />
          <LocationDisplay />
        </DataContext.Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('RANDOM'));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/26-03-05:true',
      );
    });
  });

  it('opens another random clock on each background click in random mode', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    renderClockPage(true);

    fireEvent.click(screen.getByText('clock artwork'));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/26-03-04:true',
      );
    });

    fireEvent.click(screen.getByText('clock artwork'));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/26-03-05:true',
      );
    });
  });

  it('keeps normal clock-page background clicks returning home', async () => {
    renderClockPage(false);

    fireEvent.click(screen.getByText('clock artwork'));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/:false');
    });
  });
});
