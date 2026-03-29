import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { DataProvider, useDataContext, DataContext } from '../context/DataContext';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock must define its values inside the factory function due to hoisting
// Note: mocking relative to the DataContext.jsx file location
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

// Mock import.meta.env
vi.mock('import.meta.env', () => ({
  DEV: true,
  VITE_ENVIRONMENT: 'testing',
}));

describe('DataContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide items through context', () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      return <div data-testid="item-count">{items.length}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('item-count')).toHaveTextContent('3');
  });

  it('should indicate not loading initially', () => {
    const TestComponent = () => {
      const { loading } = useDataContext();
      return <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('ready');
  });

  it('should have no error initially', () => {
    const TestComponent = () => {
      const { error } = useDataContext();
      return <div data-testid="error">{error || 'no-error'}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
  });

  it('should expose items with correct structure', () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      const firstItem = items[0] || { path: '', date: '', title: '' };
      return (
        <div>
          <div data-testid="first-path">{firstItem?.path}</div>
          <div data-testid="first-date">{firstItem?.date}</div>
          <div data-testid="first-title">{firstItem?.title}</div>
        </div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('first-path')).toHaveTextContent('26-03-05');
    expect(screen.getByTestId('first-date')).toHaveTextContent('26-03-05');
    expect(screen.getByTestId('first-title')).toHaveTextContent('Retro Terminal');
  });

  it('should provide empty array when used outside provider', () => {
    const TestComponent = () => {
      const { items, loading, error } = useDataContext();
      return (
        <div>
          <div data-testid="items">{items.length}</div>
          <div data-testid="loading">{loading ? 'true' : 'false'}</div>
          <div data-testid="error">{error || 'none'}</div>
        </div>
      );
    };

    // Render without DataProvider
    render(<TestComponent />);

    expect(screen.getByTestId('items')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('none');
  });

  it('should have items in correct order', () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      return (
        <div>
          {items.map((item, index) => (
            <div key={item.path} data-testid={`item-${index}`}>
              {item.date}
            </div>
          ))}
        </div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByTestId('item-0')).toHaveTextContent('26-03-05');
    expect(screen.getByTestId('item-1')).toHaveTextContent('26-03-04');
    expect(screen.getByTestId('item-2')).toHaveTextContent('26-03-03');
  });
});

describe('DataContext Provider', () => {
  it('should handle nested providers gracefully', () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      return <div data-testid="count">{items.length}</div>;
    };

    render(
      <DataProvider>
        <DataProvider>
          <TestComponent />
        </DataProvider>
      </DataProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('3');
  });

  it('should provide context to multiple consumers', () => {
    const Consumer1 = () => {
      const { items } = useDataContext();
      return <div data-testid="consumer1">{items[0]?.title}</div>;
    };

    const Consumer2 = () => {
      const { items } = useDataContext();
      return <div data-testid="consumer2">{items[1]?.title}</div>;
    };

    render(
      <DataProvider>
        <Consumer1 />
        <Consumer2 />
      </DataProvider>
    );

    expect(screen.getByTestId('consumer1')).toHaveTextContent('Retro Terminal');
    expect(screen.getByTestId('consumer2')).toHaveTextContent('Sun');
  });
});
