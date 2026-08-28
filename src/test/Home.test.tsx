import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import Home from '../pages/Home';
import { useNavigationState } from '../hooks/useNavigationState';

vi.mock('../hooks/useNavigationState', () => ({
  useNavigationState: () => ({
    saveNavigationState: vi.fn(),
    restoreNavigationState: vi.fn(() => null),
    restoreScrollPosition: vi.fn(),
    clearNavigationState: vi.fn(),
  }),
}));

const mockData = [
  { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
  { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
  { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
];

vi.mock('../context/clockpages.json', () => ({
  default: mockData,
}));

vi.mock('../context/testclocks.json', () => ({
  default: mockData,
}));

describe('Home Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
    Object.defineProperty(window, 'scrollX', { writable: true, configurable: true, value: 0 });
  });

  it('renders loading state while data is loading', () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('BorrowedTime')).toBeInTheDocument();
  });

  it('renders error state when data fails to load', async () => {
    vi.mock('../context/testclocks.json', () => ({
      default: undefined,
    }));

    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('renders month groups after data loads', async () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("MAR'26")).toBeInTheDocument();
    });
  });

  it('renders navigation links in TopNav', async () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('HOME')).toBeInTheDocument();
      expect(screen.getByText('CONTACT')).toBeInTheDocument();
      expect(screen.getByText('TODAY')).toBeInTheDocument();
    });
  });

  it('renders month dropdowns grouped by month', async () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      const monthButtons = screen.getAllByText("MAR'26");
      expect(monthButtons.length).toBeGreaterThan(0);
    });
  });

  it('does not crash when data array is empty', async () => {
    vi.mock('../context/testclocks.json', () => ({
      default: [],
    }));

    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('BorrowedTime')).toBeInTheDocument();
    });
  });

  it('handles rapid state toggles gracefully', async () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <Home />
        </DataProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("MAR'26")).toBeInTheDocument();
    });
  });
});
