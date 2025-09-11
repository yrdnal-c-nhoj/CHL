import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

// Context
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load env variables
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEET_NAME || 'Sheet1';

  if (!SHEET_ID) {
    console.warn('VITE_GOOGLE_SHEET_ID is missing in .env!');
  }

  // URLs to fetch CSV
  const urls = [
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`
    )}`,
  ];

  const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('Google Sheet load timed out. Check if sheet is published.');
        setLoading(false);
      }
    }, 7000);

    const handleParseSuccess = (result) => {
      try {
        if (!result.data || result.data.length === 0) {
          throw new Error('No data found in sheet.');
        }

        const parsedItems = result.data.map((row, index) => {
          let path = row.path?.toString().trim().replace(/^\/|\/$/g, '') || '';
          if (!path && row.date) path = row.date.toString().trim();

          return {
            path,
            date: row.date?.toString().trim() || '',
            title: row.title?.toString().trim().replace(/\bclock\b/gi, '').trim() || 'No Title',
            clockNumber: index + 1,
          };
        });

        const validItems = parsedItems.filter((item) => item.path && isValidDateFormat(item.date));
        if (validItems.length === 0) throw new Error('No valid items with path and date found.');

        setItems(validItems);
        setLoading(false);
        clearTimeout(timeoutId);
      } catch (err) {
        setError(`Error processing data: ${err.message}`);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    const loadData = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          if (i === 1) {
            // Use proxy to avoid CORS issues
            const response = await fetch(urls[i]);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            Papa.parse(data.contents, {
              header: true,
              skipEmptyLines: true,
              complete: handleParseSuccess,
              error: (err) => setError(`Parse error: ${err.message}`),
            });
          } else {
            // Direct fetch
            Papa.parse(urls[i], {
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: handleParseSuccess,
              error: (err) => setError(`Parse error: ${err.message}`),
            });
          }
          break; // stop after successful fetch
        } catch (err) {
          console.error(`Failed URL ${i + 1}:`, err.message);
          if (i === urls.length - 1) {
            setError(`All attempts failed: ${err.message}`);
            setLoading(false);
            clearTimeout(timeoutId);
          }
        }
      }
    };

    loadData();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <DataContext.Provider value={{ items, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};
