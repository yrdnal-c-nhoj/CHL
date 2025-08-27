// DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Validate YY-MM-DD format
  const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);

  useEffect(() => {
    const SHEET_ID = '11mYDoSA7Sl8Eb7-Fko4FGpk0e-3yS2VujkO02_f_LGE';
    const SHEET_NAME = 'Sheet1';

    const urls = [
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`
      )}`,
    ];

    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('Google Sheet load timed out. Check if sheet is published to web.');
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
          if (!path && row.date) {
            path = row.date.toString().trim();
          }

          const item = {
            path,
            date: row.date?.toString().trim() || '',
            title: row.title?.toString().trim().replace(/\bclock\b/gi, '').trim() || 'No Title',
            clockNumber: index + 1,
          };
          return item;
        });

        // Filter out items with invalid path or date
        const validItems = parsedItems.filter((item) => item.path && isValidDateFormat(item.date));
        if (validItems.length === 0) {
          throw new Error('No valid items with path and date found.');
        }

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
            Papa.parse(urls[i], {
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: handleParseSuccess,
              error: (err) => setError(`Parse error: ${err.message}`),
            });
          }
          break;
        } catch (err) {
          console.error(`Failed to fetch from URL ${i + 1}:`, err.message);
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