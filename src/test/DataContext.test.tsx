import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataProvider, useDataContext } from '../context/DataContext';

vi.mock('../context/clockpages.json', () => ({
  default: [
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
  ],
}));

vi.mock('../context/testclocks.json', () => ({
  default: [
    { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
    { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
    { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
  ],
}));

describe('DataContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide items through context', async () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      return <div data-testid="item-count">{items.length}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('item-count')).toHaveTextContent('3');
    });
  });

  it('should finish loading', async () => {
    const TestComponent = () => {
      const { loading } = useDataContext();
      return <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });
  });

  it('should have no error after load', async () => {
    const TestComponent = () => {
      const { error } = useDataContext();
      return (
        <div data-testid="error">{error ? error.message : 'no-error'}</div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });
  });

  it('should expose items with correct structure', async () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      const firstItem = items[0] ?? { path: '', date: '', title: '' };
      return (
        <div>
          <div data-testid="first-path">{firstItem.path}</div>
          <div data-testid="first-date">{firstItem.date}</div>
          <div data-testid="first-title">{firstItem.title}</div>
        </div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    // DataProvider sorts items ascending by date, so the earliest date
    // (26-03-03) is first.
    await waitFor(() => {
      expect(screen.getByTestId('first-path')).toHaveTextContent('26-03-03');
      expect(screen.getByTestId('first-date')).toHaveTextContent('26-03-03');
      expect(screen.getByTestId('first-title')).toHaveTextContent('Moon Clock');
    });
  });

  it('should throw when used outside provider', () => {
    const TestComponent = () => {
      useDataContext();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useDataContext must be used within a DataProvider',
    );
  });

  it('should have items sorted ascending by date', async () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      return (
        <div data-testid="paths">{items.map((i) => i.path).join(',')}</div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    // DataContext sorts ascending via localeCompare on the date string,
    // so the earliest date comes first.
    await waitFor(() => {
      expect(screen.getByTestId('paths')).toHaveTextContent(
        '26-03-03,26-03-04,26-03-05',
      );
    });
  });
});

describe('DataContext Provider', () => {
  it('should handle nested providers gracefully', async () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      return <div data-testid="count">{items.length}</div>;
    };

    render(
      <DataProvider>
        <DataProvider>
          <TestComponent />
        </DataProvider>
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('3');
    });
  });

  it('should provide context to multiple consumers', async () => {
    const Consumer = ({ id }: { id: string }) => {
      const { items } = useDataContext();
      return <div data-testid={id}>{items.length}</div>;
    };

    render(
      <DataProvider>
        <Consumer id="a" />
        <Consumer id="b" />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('a')).toHaveTextContent('3');
      expect(screen.getByTestId('b')).toHaveTextContent('3');
    });
  });
});
