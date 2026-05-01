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
        const response = await fetch('/registry.json');
        if (!response.ok) throw new Error('Failed to load clock registry');
        const data = await response.json();
        setItems(data);
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