import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const SHEET_ID = '11mYDoSA7Sl8Eb7-Fko4FGpk0e-3yS2VujkO02_f_LGE';
    const SHEET_NAME = 'Sheet1';

    const urls = [
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`
      )}`
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

        const parsedItems = result.data.map((row, index) => ({
          path: row.path?.toString().trim().replace(/^\/|\/$/g, '') || '',
          date: row.date?.toString().trim() || '',
          title: row.title?.toString().trim().replace(/\bclock\b/gi, '').trim() || 'No Title',
          clockNumber: index + 1,
        }));

        setItems(parsedItems);
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
              error: (err) => setError(`Parse error: ${err.message}`)
            });
          } else {
            Papa.parse(urls[i], {
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: handleParseSuccess,
              error: (err) => setError(`Parse error: ${err.message}`)
            });
          }
          break; // stop if successful
        } catch (err) {
          console.error(`Failed to fetch from URL ${i + 1}`, err.message);
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
