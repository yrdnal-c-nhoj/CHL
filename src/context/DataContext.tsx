import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ClockItem {
  path: string;
  date: string;
  title: string;
  [key: string]: any;
}

export interface DataContextType {
  items: ClockItem[];
  loading: boolean;
  error: Error | null;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [items, setItems] = useState<ClockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const clockPages = await import('./clockpages.json');
        const testClocks = await import('./testclocks.json');

        const data = import.meta.env.DEV ? testClocks.default : clockPages.default;

        // Add clockNumber for UI display.
        // We number by ascending date (oldest => #1).
        const sorted = [...data]
          .filter((d: any) => d?.date)
          .sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)));
        const withNumbers = data.map((item: any) => {
          const idx = sorted.findIndex((s: any) => s?.date === item?.date && s?.path === item?.path);
          return {
            ...item,
            clockNumber: idx >= 0 ? idx + 1 : undefined,
          };
        });

        setItems(withNumbers);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred loading data'));
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