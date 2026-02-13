// src/components/AstronomyPictureOfTheDay.jsx
import { useState, useEffect } from 'react';
import './apod.css';

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'xxxxxxxxxx'; 
// You can get a free key at: https://api.nasa.gov/

export default function AstronomyPictureOfTheDay() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`NASA API error: ${response.status}`);
        }

        const data = await response.json();
        setApod(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load Astronomy Picture of the Day');
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();

    // Optional: only run once on mount
  }, []);

  if (loading) {
    return (
      <div className="apod-container">
        <div className="loading">Loading today's space picture...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="apod-container">
        <div className="error">Error: {error}</div>
        <p>Tip: Make sure you have a valid NASA API key in your .env file</p>
      </div>
    );
  }

  if (!apod) return null;

  const isImage = apod.media_type === 'image';
  const isVideo = apod.media_type === 'video';

  return (
    <div className="apod-container">
      <h2>{apod.title}</h2>
      
      {isImage && (
        <div className="media-wrapper">
          <img
            src={apod.hdurl || apod.url}
            alt={apod.title}
            loading="lazy"
            className="apod-image"
          />
        </div>
      )}

      {isVideo && (
        <div className="media-wrapper">
          <iframe
            src={apod.url}
            title={apod.title}
            allowFullScreen
            frameBorder="0"
            className="apod-video"
          />
        </div>
      )}

      {!isImage && !isVideo && (
        <p>(Media type: {apod.media_type}) — cannot display</p>
      )}

      <div className="explanation">
        <p><strong>Date:</strong> {apod.date}</p>
        <p>{apod.explanation}</p>
        {apod.copyright && (
          <p className="copyright">© {apod.copyright}</p>
        )}
      </div>
    </div>
  );
}