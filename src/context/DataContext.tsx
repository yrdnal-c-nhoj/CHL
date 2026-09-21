/**
 * Global metadata for the clocks that actually exist in the clock registry.
 *
 * Clock component files are authoritative for publication/existence.
 * clockpages.json supplies descriptive metadata only.
 */
import type { ClockItem, DataContextType } from '@/types/data';
import { CLOCK_DATES } from '@/clock/clockRegistry';
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

function normalizeMetadata(data: unknown): Map<string, RawClockMetadata> {
  if (!Array.isArray(data)) {
    throw new Error('Clock metadata must be an array');
  }

  const metadata = new Map<string, RawClockMetadata>();

  for (const entry of data) {
    if (!entry || typeof entry !== 'object') continue;

    const item = entry as RawClockMetadata;
    const date = typeof item.date === 'string' ? item.date.trim() : '';

    if (date) {
      metadata.set(date, item);
    }
  }

  return metadata;
}

/**
 * Build the public clock list from actual Clock.tsx files, enriching those
 * clocks with optional metadata from clockpages.json.
 */
function buildClockItems(data: unknown): ClockItem[] {
  const metadata = normalizeMetadata(data);

  return CLOCK_DATES.map((date, index) => {
    const item = metadata.get(date);

    return {
      path:
        typeof item?.path === 'string' && item.path
          ? item.path
          : `/${date}`,
      date,
      title:
        typeof item?.title === 'string' && item.title
          ? item.title
          : date,
      tags: Array.isArray(item?.tags)
        ? item.tags.filter((tag): tag is string => typeof tag === 'string')
        : undefined,
      clockNumber: index + 1,
    };
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
        // Metadata is descriptive, not authoritative. If it is unavailable,
        // keep the real clock registry usable with date-based fallback items.
        console.warn('[DataContext] Clock metadata unavailable:', err);
        setItems(buildClockItems([]));
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
