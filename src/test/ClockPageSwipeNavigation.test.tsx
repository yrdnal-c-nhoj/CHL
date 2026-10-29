import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { DataProvider } from '@/context/DataContext';
import ClockPage from '@/pages/ClockPage';

// NOTE: the mocked `ClockComponent` is intentionally a stable reference. An
// inline function on every mock call would make React treat it as a new
// component type, unmounting/remounting the artwork on each render and
// leaving any cached element reference detached from the DOM.
const MockClock = () => <div>clock artwork</div>;

vi.mock('@/hooks/useClockPage', () => ({
  useClockPage: () => ({
    ClockComponent: MockClock,
    error: null,
    overlayVisible: false,
  }),
}));

vi.mock('@/context/clockpages.json', () => ({
  default: [
    { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
  ],
}));

vi.mock('@/context/testclocks.json', () => ({
  default: [
    { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
  ],
}));

const LocationDisplay = () => {
  const { pathname } = useLocation();
  return <output data-testid="location">{pathname}</output>;
};

// `swipe` moves the pointer from `fromX` to `toX` on `el`.
//   fromX=400, toX=100 -> finger moves leftward (dx<0) -> "left" -> NEXT clock
//   fromX=100, toX=400 -> finger moves rightward (dx>0) -> "right" -> PREV clock
const swipe = (el: Element, fromX: number, toX: number, y = 100) => {
  fireEvent.pointerDown(el, {
    pointerType: 'touch',
    pointerId: 1,
    button: 0,
    clientX: fromX,
    clientY: y,
    bubbles: true,
  });
  fireEvent.pointerMove(el, {
    pointerType: 'touch',
    pointerId: 1,
    button: 0,
    clientX: toX,
    clientY: y,
    bubbles: true,
  });
  fireEvent.pointerUp(el, {
    pointerType: 'touch',
    pointerId: 1,
    button: 0,
    clientX: toX,
    clientY: y,
    bubbles: true,
  });
};

const renderAt = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <DataProvider>
        <LocationDisplay />
        <Routes>
          <Route index element={<div>home</div>} />
          <Route path="/:date" element={<ClockPage />} />
        </Routes>
      </DataProvider>
    </MemoryRouter>,
  );

// Renders the page and waits until the clock registry has loaded (the nav
// only appears once `currentItem` resolves), returning the live artwork node.
const renderClockAt = async (route: string) => {
  renderAt(route);
  await screen.findByRole('button', { name: /Go back/i });
  return screen.getByText('clock artwork');
};

describe('ClockPage swipe navigation', () => {
  it('swipe left advances to the next clock', async () => {
    const artwork = await renderClockAt('/26-03-04');
    expect(screen.getByTestId('location')).toHaveTextContent('/26-03-04');

    swipe(artwork, 400, 100); // leftward -> next

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/26-03-05'),
    );
  });

  it('swipe right returns to the previous clock', async () => {
    const artwork = await renderClockAt('/26-03-04');
    expect(screen.getByTestId('location')).toHaveTextContent('/26-03-04');

    swipe(artwork, 100, 400); // rightward -> prev

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/26-03-03'),
    );
  });

  it('suppresses the trailing click so a swipe does not also go home', async () => {
    const artwork = await renderClockAt('/26-03-04');

    swipe(artwork, 400, 100); // leftward -> next (26-03-05)
    // After the swipe the route changed; re-query the now-live artwork.
    fireEvent.click(await screen.findByText('clock artwork'));

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/26-03-05'),
    );
  });

  it('keeps the existing tap-to-go-home behaviour (no swipe)', async () => {
    const artwork = await renderClockAt('/26-03-04');

    fireEvent.pointerDown(artwork, {
      pointerType: 'touch',
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 100,
      bubbles: true,
    });
    fireEvent.pointerUp(artwork, {
      pointerType: 'touch',
      pointerId: 1,
      button: 0,
      clientX: 100,
      clientY: 100,
      bubbles: true,
    });
    fireEvent.click(artwork);

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/'),
    );
  });

  it('swiping past the last clock returns home', async () => {
    const artwork = await renderClockAt('/26-03-05'); // last clock; nextItem is null

    swipe(artwork, 400, 100); // leftward -> no next -> home

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent('/'),
    );
  });
});
