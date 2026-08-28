import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DataProvider, useDataContext } from '../context/DataContext';

const mockData = [
  { path: '26-03-05', date: '26-03-05', title: 'Retro Terminal' },
  { path: '26-03-04', date: '26-03-04', title: 'Sun Clock' },
  { path: '26-03-03', date: '26-03-03', title: 'Moon Clock' },
  { path: '26-03-06', date: '26-03-06', title: 'Z Clock', tags: ['z'] },
  { path: '26-03-01', date: '26-03-01', title: 'A Clock', tags: ['a'] },
];

vi.mock('../context/clockpages.json', () => ({
  default: mockData,
}));

vi.mock('../context/testclocks.json', () => ({
  default: mockData,
}));

describe('DataContext Loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading: true before data arrives', async () => {
    const TestComponent = () => {
      const { loading } = useDataContext();
      return <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });
  });

  it('should set loading to false after data finishes loading', async () => {
    const TestComponent = () => {
      const { loading } = useDataContext();
      return <div data-testid="loading-status">{String(loading)}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('false');
    });
  });

  it('should show loading container while loading', async () => {
    const TestComponent = () => {
      const { loading } = useDataContext();
      return loading ? <div data-testid="loading-box">Loading</div> : <div data-testid="content">Content</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    expect(screen.getByTestId('loading-box')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });
  });
});

describe('DataContext Error State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle API failures without crashing', async () => {
    vi.mock('../context/testclocks.json', () => ({
      default: undefined,
    }));

    const TestComponent = () => {
      const { error, loading } = useDataContext();
      if (loading) return <div data-testid="loading">loading</div>;
      if (error) return <div data-testid="error">Error: {error.message}</div>;
      return <div data-testid="data">Data loaded</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });

  it('should set error when JSON import throws', async () => {
    vi.mock('../context/testclocks.json', () => {
      throw new Error('Network failure');
    });

    const TestComponent = () => {
      const { error, loading } = useDataContext();
      if (loading) return <div data-testid="loading">loading</div>;
      return <div data-testid="error-state">{error ? error.message : 'no-error'}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toHaveTextContent('Network failure');
    });
  });

  it('should not crash when error object is provided', async () => {
    vi.mock('../context/testclocks.json', () => ({
      default: undefined,
    }));

    const TestComponent = () => {
      const { error } = useDataContext();
      return <div data-testid="error-msg">{error?.message || 'ok'}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-msg')).toBeTruthy();
    });
  });
});

describe('DataContext Data Formatting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should sort raw input data ascending by date before exposing to components', async () => {
    const unsortedData = [
      { path: '26-03-05', date: '26-03-05', title: 'C' },
      { path: '26-03-01', date: '26-03-01', title: 'A' },
      { path: '26-03-03', date: '26-03-03', title: 'B' },
    ];

    vi.mock('../context/testclocks.json', () => ({
      default: unsortedData,
    }));

    const TestComponent = () => {
      const { items } = useDataContext();
      return (
        <div data-testid="dates">
          {items.map((i) => i.date).join(',')}
        </div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('dates')).toHaveTextContent(
        '26-03-01,26-03-03,26-03-05',
      );
    });
  });

  it('should assign clockNumbers sequentially after sorting', async () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      return (
        <div data-testid="numbers">
          {items.map((i) => i.clockNumber).join(',')}
        </div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('numbers')).toHaveTextContent('1,2,3,4,5');
    });
  });

  it('should filter out items without a date', async () => {
    const dataWithNulls = [
      { path: '26-03-05', date: '26-03-05', title: 'Valid' },
      { path: 'no-date', date: '', title: 'Invalid' },
      { path: 'also-empty', date: null as any, title: 'Also Invalid' },
    ];

    vi.mock('../context/testclocks.json', () => ({
      default: dataWithNulls,
    }));

    const TestComponent = () => {
      const { items } = useDataContext();
      return <div data-testid="count">{items.length}</div>;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  it('should preserve all original item properties after sorting', async () => {
    const TestComponent = () => {
      const { items } = useDataContext();
      const first = items[0];
      return (
        <div>
          <div data-testid="path">{first.path}</div>
          <div data-testid="title">{first.title}</div>
          <div data-testid="clock-number">{first.clockNumber}</div>
          <div data-testid="tags">{first.tags?.join(',') || 'none'}</div>
        </div>
      );
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('path')).toHaveTextContent('26-03-01');
      expect(screen.getByTestId('title')).toHaveTextContent('A Clock');
      expect(screen.getByTestId('clock-number')).toHaveTextContent('1');
    });
  });
});
