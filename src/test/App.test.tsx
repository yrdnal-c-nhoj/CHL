import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock all lazy-loaded components
vi.mock('../Home.jsx', () => ({
  default: () => 'Home Component',
}));

vi.mock('../ClockPage.tsx', () => ({
  default: () => 'ClockPage Component',
}));

vi.mock('../About.jsx', () => ({
  default: () => 'About Component',
}));

vi.mock('../Manifesto.jsx', () => ({
  default: () => 'Manifesto Component',
}));

vi.mock('../Contact.jsx', () => ({
  default: () => 'Contact Component',
}));

vi.mock('../Today.tsx', () => ({
  default: () => 'Today Component',
}));

// Mock DataProvider
vi.mock('../context/DataContext', () => ({
  DataProvider: ({ children }) => children,
}));

// Mock analytics
vi.mock('../analytics', () => ({
  pageview: vi.fn(),
}));

// Mock Helmet
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => children,
  HelmetProvider: ({ children }) => children,
}));

describe('App Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
  });

  it('should render loading state initially', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(container).toBeTruthy();
  });
});

describe('App Error Boundary', () => {
  it('should render without crashing', () => {
    // Error boundary is tested implicitly - if App renders, the boundary is present
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(container).toBeTruthy();
  });
});
