/**
 * This file manages the global state for all clock data in the application.
 */
import type { ClockItem, DataContextType } from '@/types/data';
import type {
  ReactNode
} from 'react';
import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

// Create the context with an initial value of undefined
export const DataContext = createContext<DataContextType | undefined>(
  undefined,
);

// Props interface for the DataProvider wrapper
interface DataProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app to provide clock data to all components
 */
export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // State for storing the list of clocks
  const [items, setItems] = useState<ClockItem[]>([]);
  // State to track loading status (defaults to true)
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    /**
     * Asynchronous function to load and process JSON data
     */
    const loadData = async () => {
      try {
        // Conditionally import the data based on the environment.
        // This prevents test data from being loaded or bundled in production.
        let data;
        if (import.meta.env.DEV) {
          // In development, import the test data directly.
          data = (await import('./testclocks.json')).default;
        } else {
          // In production, get the URL of the JSON file and fetch it.
          const clockPagesUrl = (await import('./clockpages.json?url')).default;
          const response = await fetch(clockPagesUrl);
          data = await response.json();
        }

        // Sort the data by date string (ascending) to determine the chronological order
        // We process this once and use it as our primary source of truth
        const processedItems: ClockItem[] = [...data]
          .filter((d: any) => d?.date)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .sort((a: any, b: any) =>
            String(a.date).localeCompare(String(b.date)),
          )
          .map((item, idx) => ({ ...item, clockNumber: idx + 1 }));

        // Update the state with the fully processed items
        setItems(processedItems);
      } catch (err) {
        // Catch and format any errors that occur during the import or processing
        setError(
          err instanceof Error
            ? err
            : new Error('An error occurred loading data'),
        );
      } finally {
        // Set loading to false whether it succeeded or failed
        setLoading(false);
      }
    };

    // Trigger the data loading function
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ items, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * Custom hook to easily access the clock data from any functional component
 */
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};