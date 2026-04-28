// DataProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import prodData from './clockpages.json';

// Use Vite's glob import to handle cases where testclock.json might be missing.
const testModules = import.meta.glob('./testclock.json', { eager: true });
const testData = testModules['./testclock.json']?.default || prodData;

// Create context
export const DataContext = createContext();

// Custom hook to use the DataContext
export const useDataContext = () => {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    return { items: [], loading: false, error: null };
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate date format: "yy-mm-dd"
  const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);

  useEffect(() => {
    try {
      // Use test data for local development, production data otherwise
      const isLocalDev = import.meta.env.DEV;
      const env = import.meta.env.VITE_ENVIRONMENT || 'production';
      const clockData = isLocalDev
        ? testData
        : env === 'testing'
          ? testData
          : prodData;

      // If the data is still a string (failed auto-parse), attempt manual parse to catch errors
      let dataToProcess = clockData;
      if (typeof clockData === 'string') {
        try {
          dataToProcess = JSON.parse(clockData);
        } catch (e) {
          throw new Error(`JSON Syntax Error: ${e.message}. Please check your .json files.`);
        }
      }

      if (!dataToProcess || dataToProcess.length === 0) {
        throw new Error('No data found in JSON file.');
      }

      // Parse JSON rows
      const parsedItems = dataToProcess.map((row, index) => {
        let path =
          row.path
            ?.toString()
            .trim()
            .replace(/^\/|\/$/g, '') || '';
        if (!path && row.date) path = row.date.toString().trim();

        return {
          path,
          date: row.date?.toString().trim() || '',
          title:
            row.title
              ?.toString()
              .trim()
              .replace(/\bclock\b/gi, '')
              .trim() || 'No Title',
          clockNumber: index + 1,
        };
      });

      // Keep only valid items
      const validItems = parsedItems.filter(
        (item) => item.path && isValidDateFormat(item.date),
      );

      if (validItems.length === 0) {
        throw new Error('No valid items with path and date found.');
      }

      setItems(validItems);
      setLoading(false);
    } catch (err) {
      setError(`Error processing JSON: ${err.message}`);
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};
