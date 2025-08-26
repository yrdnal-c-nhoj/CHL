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
    }, 15000); // Increased timeout

    const loadData = async () => {
      // Your original sheet ID
      const SHEET_ID = '11mYDoSA7Sl8Eb7-Fko4FGpk0e-3yS2VujkO02_f_LGE';
      const GID = '0'; // Usually 0 for the first sheet
      
      // Multiple URL formats to try
      const urls = [
        // Original format
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vQc5qURFR9zL6d4ej5hbP4-XBd8k9SYHTYdOrxgDAWhQ6MCzDj-xPk3di8ymvXoJ8CfsQ3MctWs_PyF/pub?output=csv`,
        
        // Alternative format with GID
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vQc5qURFR9zL6d4ej5hbP4-XBd8k9SYHTYdOrxgDAWhQ6MCzDj-xPk3di8ymvXoJ8CfsQ3MctWs_PyF/pub?gid=${GID}&single=true&output=csv`,
        
        // Direct sheet access (requires public sharing)
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`,
        
        // CORS proxy as fallback
        `https://api.allorigins.win/get?url=${encodeURIComponent(`https://docs.google.com/spreadsheets/d/e/2PACX-1vQc5qURFR9zL6d4ej5hbP4-XBd8k9SYHTYdOrxgDAWhQ6MCzDj-xPk3di8ymvXoJ8CfsQ3MctWs_PyF/pub?output=csv`)}`
      ];

      for (let i = 0; i < urls.length; i++) {
        try {
          console.log(`DataContext - Attempting URL ${i + 1}/${urls.length}:`, urls[i]);
          
          if (i === 3) {
            // Special handling for CORS proxy
            const response = await fetch(urls[i]);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            Papa.parse(data.contents, {
              header: true,
              complete: (result) => handleParseSuccess(result),
              error: (err) => {
                throw new Error(err.message);
              }
            });
          } else {
            // Regular PapaParse for direct URLs
            Papa.parse(urls[i], {
              download: true,
              header: true,
              complete: (result) => {
                if (result.errors && result.errors.length > 0) {
                  console.log(`DataContext - Parse errors on URL ${i + 1}:`, result.errors);
                  if (i === urls.length - 1) {
                    throw new Error('All URLs failed');
                  }
                  return; // Try next URL
                }
                handleParseSuccess(result);
              },
              error: (err) => {
                console.log(`DataContext - Error on URL ${i + 1}:`, err);
                if (i === urls.length - 1) {
                  throw new Error(err.message);
                }
              }
            });
          }
          
          // If we get here without error, break the loop
          break;
          
        } catch (err) {
          console.log(`DataContext - Failed URL ${i + 1}:`, err.message);
          if (i === urls.length - 1) {
            // All URLs failed
            setError(`Failed to load data from Google Sheet. Please check: 1) Sheet is published to web, 2) Sheet permissions are set to "Anyone with link can view", 3) Your internet connection. Error: ${err.message}`);
            setLoading(false);
            clearTimeout(timeoutId);
          }
        }
      }
    };

    const handleParseSuccess = (result) => {
      try {
        console.log('DataContext - Raw CSV data:', result.data);
        
        if (!result.data || result.data.length === 0) {
          throw new Error('No data found in spreadsheet');
        }

        const parsedItems = result.data
          .map((row, index) => {
            // More robust data cleaning
            const cleanRow = {
              path: row.path?.toString().trim(),
              date: row.date?.toString().trim(),
              title: row.title?.toString().trim().replace(/\bclock\b/gi, '').trim(),
              clockNumber: index + 1,
            };
            
            return cleanRow;
          })
          .filter((item) => {
            // More thorough validation
            const hasRequiredFields = item.path && item.date;
            const hasValidDate = item.date && item.date.match(/^\d{2}-\d{2}-\d{2}$/);
            
            if (!hasRequiredFields) {
              console.log('DataContext - Filtered out item missing required fields:', item);
            }
            if (!hasValidDate) {
              console.log('DataContext - Filtered out item with invalid date:', item);
            }
            
            return hasRequiredFields && hasValidDate;
          });

        console.log('DataContext - Final parsed data:', parsedItems);

        if (parsedItems.length === 0) {
          throw new Error('No valid items found after filtering. Check your sheet format.');
        }

        setItems(parsedItems);
        setLoading(false);
        clearTimeout(timeoutId);
        
      } catch (err) {
        console.error('DataContext - Parse processing error:', err);
        setError(`Error processing spreadsheet data: ${err.message}`);
        setLoading(false);
        clearTimeout(timeoutId);
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