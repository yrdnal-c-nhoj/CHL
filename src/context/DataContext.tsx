import type {
  ReactNode} from 'react';
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import type { ClockItem, DataContextType } from '../types/data';

import prodData from './clockpages.json';

// Optionally load testclocks.json — resolves gracefully if absent
const testModules = import.meta.glob('./testclocks.json', { eager: true });
const testData =
  (testModules['./testclocks.json'] as { default: typeof prodData } | undefined)
    ?.default ?? prodData;

const isValidDateFormat = (date: string): boolean =>
  /^\d{2}-\d{2}-\d{2}$/.test(date);

const EMPTY_CONTEXT: DataContextType = {
  items: [],
  loading: false,
  error: null,
};

export const DataContext = createContext<DataContextType>(EMPTY_CONTEXT);

export const useDataContext = (): DataContextType => useContext(DataContext);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [items, setItems] = useState<ClockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const isLocalDev = import.meta.env.DEV;
      const env = (import.meta.env.VITE_ENVIRONMENT as string) || 'production';
      const clockData = isLocalDev || env === 'testing' ? testData : prodData;

      // Vite imports JSON as objects, but guard against edge cases
      let dataToProcess: typeof prodData = clockData;
      if (typeof clockData === 'string') {
        try {
          dataToProcess = JSON.parse(clockData);
        } catch (e) {
          throw new Error(
            `JSON Syntax Error: ${(e as Error).message}. Please check your .json files.`,
          );
        }
      }

      if (!dataToProcess || dataToProcess.length === 0) {
        throw new Error('No data found in JSON file.');
      }

      const parsedItems: ClockItem[] = dataToProcess.map(
        (row: Record<string, unknown>, index: number) => {
          let path =
            (row.path as string | undefined)
              ?.toString()
              .trim()
              .replace(/^\/|\/$/g, '') ?? '';
          if (!path && row.date) path = (row.date as string).toString().trim();

          return {
            path,
            date: (row.date as string | undefined)?.toString().trim() ?? '',
            title:
              (row.title as string | undefined)
                ?.toString()
                .trim()
                .replace(/\bclock\b/gi, '')
                .trim() ?? 'No Title',
            clockNumber: index + 1,
          };
        },
      );

      const validItems = parsedItems.filter(
        (item) => item.path && isValidDateFormat(item.date),
      );

      if (validItems.length === 0) {
        throw new Error('No valid items with path and date found.');
      }

      setItems(validItems);
      setLoading(false);
    } catch (err) {
      setError(`Error processing JSON: ${(err as Error).message}`);
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};
