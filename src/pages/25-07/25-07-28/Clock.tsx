import React, { useEffect, useState } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import customFont from '../../../assets/fonts/25-07-28-gol.ttf'; // Import your custom font
import backgroundImage from '../../../assets/images/25-07/25-07-28/go.gif';

const Clock: React.FC = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'CustomFont',
      fontUrl: customFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getFormattedTime: React.FC = () => {
    let h = time.getHours() % 12;
    if (h === 0) h = 12;
    const m = time.getMinutes();
    return `${h}${m.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'CustomFont, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <style>
        {`
          /* Font loading handled by useMultipleFontLoader */
        `}
      </style>
      <div
        style={{
          fontSize: '4rem',
          color: '#F0ECD8FF',
          textShadow: '0 0 1rem black',
        }}
      >
        {getFormattedTime()}
      </div>
    </div>
  );
};

export default Clock;
