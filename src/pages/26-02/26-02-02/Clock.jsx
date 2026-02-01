import React, { useEffect, useState } from 'react';
import digitalBgImage from '../../../assets/clocks/26-02-01/boom.webp';

// Import Google Font CSS
import '@fontsource/share-tech-mono/index.css';

const FONT_CONFIG = {
  name: 'Share Tech Mono',
};

const UPDATE_INTERVAL_MS = 100;

// Custom hook for font loading
const useFontLoader = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Google Font is loaded via CSS import
    setIsReady(true);
  }, []);

  return isReady;
};

// Custom hook for time updates
const useTime = (updateInterval = 1000) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  return time;
};

// Utility function to format time
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = Math.floor(date.getMilliseconds() / 100).toString(); // Only 1 ms digit
  
  return `${hours}${minutes}${seconds}${milliseconds}`;
};

const TimeDisplay = ({ timeString, fontReady }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        fontSize: '8vmin',
        color: '#D0D6F276',
        textShadow: '0 0.4rem 0.5rem rgba(0,0,0,0.7)',
        fontFamily: fontReady ? `'${FONT_CONFIG.name}', monospace` : 'monospace',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
      }}
    >
      {timeString}
    </div>
  );
};

const SonicBoomClock = () => {
  const fontReady = useFontLoader();
  const time = useTime(UPDATE_INTERVAL_MS);
  const timeString = formatTime(time);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        backgroundImage: `url(${digitalBgImage})`,
        backgroundSize: 'auto', // Use original image size for repeating
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat', // Repeat the image to fill space
        backgroundAttachment: 'scroll',
        filter: 'saturate(3.5) contrast(1.2)',
        fontFamily: fontReady 
          ? `'${FONT_CONFIG.name}', system-ui, sans-serif` 
          : 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
  
      <TimeDisplay timeString={timeString} fontReady={fontReady} />
    </div>
  );
};

export default SonicBoomClock;