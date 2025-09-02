import React, { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';

// Create a context to hold our data
export const DataContext = createContext();

// Create a provider component to wrap around parts of the app that need access to the data
export const DataProvider = ({ children }) => {
  // State to store the parsed items from the Google Sheet
  const [items, setItems] = useState([]);
  // State to indicate whether data is still loading
  const [loading, setLoading] = useState(true);
  // State to store any errors encountered while fetching or parsing
  const [error, setError] = useState(null);

  // Function to validate date strings in the format YY-MM-DD
  const isValidDateFormat = (date) => /^\d{2}-\d{2}-\d{2}$/.test(date);

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Google Sheet ID and the sheet name we want to fetch
    const SHEET_ID = '11mYDoSA7Sl8Eb7-Fko4FGpk0e-3yS2VujkO02_f_LGE';
    const SHEET_NAME = 'Sheet1';

    // Two URLs: direct CSV from Google and a proxy through allorigins.win
    const urls = [
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`
      )}`,
    ];

    // Set a timeout to prevent hanging if Google Sheet does not respond
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError('Google Sheet load timed out. Check if sheet is published to web.');
        setLoading(false);
      }
    }, 7000); // 7 seconds

    // Function to handle successful parsing of CSV data
    const handleParseSuccess = (result) => {
      try {
        // If no data is found, throw an error
        if (!result.data || result.data.length === 0) {
          throw new Error('No data found in sheet.');
        }

        // Map each row of the CSV into a structured item object
        const parsedItems = result.data.map((row, index) => {
          // Determine the path: prefer 'path' column, fallback to 'date' if missing
          let path = row.path?.toString().trim().replace(/^\/|\/$/g, '') || '';
          if (!path && row.date) {
            path = row.date.toString().trim();
          }

          // Build the item object
          const item = {
            path,
            date: row.date?.toString().trim() || '',
            // Remove the word "clock" from the title if present
            title: row.title?.toString().trim().replace(/\bclock\b/gi, '').trim() || 'No Title',
            // Assign a sequential number to each item
            clockNumber: index + 1,
          };
          return item;
        });

        // Filter out any items missing a path or with an invalid date
        const validItems = parsedItems.filter((item) => item.path && isValidDateFormat(item.date));
        if (validItems.length === 0) {
          throw new Error('No valid items with path and date found.');
        }

        // Update state with valid items and stop loading
        setItems(validItems);
        setLoading(false);
        clearTimeout(timeoutId); // Clear the timeout once successful
      } catch (err) {
        // Handle any errors during processing
        setError(`Error processing data: ${err.message}`);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    // Function to load data from the URLs
    const loadData = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          if (i === 1) {
            // Use fetch for the allorigins proxy URL
            const response = await fetch(urls[i]);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            // Parse CSV from the JSON response
            Papa.parse(data.contents, {
              header: true,
              skipEmptyLines: true,
              complete: handleParseSuccess,
              error: (err) => setError(`Parse error: ${err.message}`),
            });
          } else {
            // Direct CSV parsing from Google Sheet
            Papa.parse(urls[i], {
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: handleParseSuccess,
              error: (err) => setError(`Parse error: ${err.message}`),
            });
          }
          // Stop trying other URLs if successful
          break;
        } catch (err) {
          // Log error and continue to next URL
          console.error(`Failed to fetch from URL ${i + 1}:`, err.message);
          if (i === urls.length - 1) {
            // If all URLs fail, show final error
            setError(`All attempts failed: ${err.message}`);
            setLoading(false);
            clearTimeout(timeoutId);
          }
        }
      }
    };

    // Start loading the data
    loadData();

    // Cleanup: clear timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array = run once on mount

  // Provide the data, loading state, and errors to any child components
  return (
    <DataContext.Provider value={{ items, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};
