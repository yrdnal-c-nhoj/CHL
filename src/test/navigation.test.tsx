import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import TopNav from '../components/TopNav';

// Mock must define its values inside the factory function due to hoisting
vi.mock('../context/clockpages.json', () => ({
  default: [
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
  ],
}));

vi.mock('../context/testclock.json', () => ({
  default: [
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
  ],
}));

describe('TopNav', () => {
  it('should render navigation links', () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <TopNav />
        </DataProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('BorrowedTime')).toBeInTheDocument();
  });

  it('should render Home link', () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <TopNav />
        </DataProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('HOME')).toBeInTheDocument();
  });

  it('should render Contact link', () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <TopNav />
        </DataProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('CONTACT')).toBeInTheDocument();
  });

  it('should render Today link', () => {
    render(
      <MemoryRouter>
        <DataProvider>
          <TopNav />
        </DataProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('TODAY')).toBeInTheDocument();
  });
});
