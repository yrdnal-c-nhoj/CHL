// DataProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import prodData from './clockpages.json';
import testData from './testclock.json';

// Create context
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate date format: "yy-mm-dd"
  const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);

  useEffect(() => {
    try {
      // Use environment variable to pick JSON
      const env = import.meta.env.VITE_ENVIRONMENT || 'production';
      const clockData = env === 'testing' ? testData : prodData;

      if (!clockData || clockData.length === 0) {
        throw new Error('No data found in JSON file.');
      }

      // Parse JSON rows
      const parsedItems = clockData.map((row, index) => {
        let path = row.path?.toString().trim().replace(/^\/|\/$/g, '') || '';
        if (!path && row.date) path = row.date.toString().trim();

        return {
          path,
          date: row.date?.toString().trim() || '',
          title:
            row.title?.toString().trim().replace(/\bclock\b/gi, '').trim() ||
            'No Title',
          clockNumber: index + 1,
        };
      });

      // Keep only valid items
      const validItems = parsedItems.filter(
        (item) => item.path && isValidDateFormat(item.date)
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
