/**
 * Global metadata for the clocks that actually exist in the clock registry.
 *
 * Clock component files are authoritative for publication/existence.
 * clockpages.json supplies descriptive metadata only.
 */
import type { ClockItem, DataContextType } from '@/types/data';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

interface DataProviderProps {
  children: ReactNode;
}

interface RawClockMetadata {
  path?: unknown;
  date?: unknown;
  title?: unknown;
  tags?: unknown;
}

/**
 * Build the public clock list from clockpages.json entries.
 * Only clocks listed in the JSON are displayed.
 */
function buildClockItems(data: unknown): ClockItem[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .filter((entry): entry is RawClockMetadata & { date: string; path: string } => {
      return (
        entry &&
        typeof entry === 'object' &&
        typeof entry.date === 'string' &&
        entry.date.trim() !== '' &&
        typeof entry.path === 'string' &&
        entry.path.trim() !== ''
      );
    })
    .map((item, index) => {
      const tags = Array.isArray(item.tags)
        ? item.tags.filter((tag): tag is string => typeof tag === 'string')
        : undefined;
      const result: ClockItem = {
        path: item.path,
        date: item.date,
        title:
          typeof item.title === 'string' && item.title
            ? item.title
            : item.date,
        clockNumber: index + 1,
      };
      if (tags !== undefined) {
        result.tags = tags;
      }
      return result;
    });
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [items, setItems] = useState<ClockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let data: unknown;

        if (import.meta.env.DEV || import.meta.env.MODE === 'test') {
          data = (await import('./testclocks.json')).default;
        } else {
          const clockPagesUrl = (await import('./clockpages.json?url')).default;
          const response = await fetch(clockPagesUrl);

          if (!response.ok) {
            throw new Error(
              `Failed to load clock metadata: ${response.status} ${response.statusText}`,
            );
          }

          data = await response.json();
        }

        setItems(buildClockItems(data));
      } catch (err) {
        console.warn('[DataContext] Clock metadata unavailable:', err);
        setItems([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ items, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);

  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }

  return context;
};