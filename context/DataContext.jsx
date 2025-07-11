import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('Request timed out while loading data from Google Sheet.');
        setLoading(false);
      }
    }, 10000);

    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vQc5qURFR9zL6d4ej5hbP4-XBd8k9SYHTYdOrxgDAWhQ6MCzDj-xPk3di8ymvXoJ8CfsQ3MctWs_PyF/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          const parsedItems = result.data
            .map((row, index) => ({
              path: row.path?.trim(),
              date: row.date?.trim(),
              title: row.title?.trim().replace(/\bclock\b/gi, '').trim(),
              clockNumber: index + 1,
            }))
            .filter(
              (item) =>
                item.path &&
                item.date &&
                item.date.match(/^\d{2}-\d{2}-\d{2}$/)
            );
          console.log('DataContext - Parsed Google Sheet data:', parsedItems);
          setItems(parsedItems);
          setLoading(false);
          clearTimeout(timeoutId);
        },
        error: (err) => {
          setError(`Failed to load data: ${err.message}`);
          console.error('Papa.parse error:', err);
          setLoading(false);
          clearTimeout(timeoutId);
        },
      }
    );

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <DataContext.Provider value={{ items, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};