import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/2025/25-09/25-09-16/bg.jpg';
import d250916font from '@/assets/fonts/2025/25-09-16-baud.ttf?url';

const Clock: React.FC = () => {
  const time = useClockTime();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'MyD250916font', fontUrl: d250916font }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // Handle background image preloading separately as font is handled by Suspense
  useEffect(() => {
    const img = new Image();
    img.src = bgImage;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true);
  }, []);

  // Format time
  const hours = String(((time.getHours() + 11) % 12) + 1).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  const digitBox: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'MyD250916font', sans-serif", // Use the loaded custom font
    fontSize: '10vmin', // Standardize on vmin for responsive sizing
    color: '#ffffff',
    margin: '0 0.5vw',
    minWidth: '8vw',
    textShadow: `
      0 0 5px #ff0000,
      0 0 10px #ff9900,
      0 0 15px #ffff00,
      0 0 20px #00ff00,
      0 0 25px #00ffff,
      0 0 30px #0000ff,
      0 0 35px #ff00ff,
      0 0 45px #ff0000,
      0 0 50px #ff9900,
      0 0 55px #ffff00,
      0 0 60px #00ff00,
      0 0 65px #00ffff,
      0 0 70px #0000ff,
      0 0 75px #ff00ff,
      0 0 80px #ffffff,
      0 0 90px #ffffff,
      0 0 99px #ffffff
    `,
  };

  const containerStyle: React.CSSProperties = {
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // fallback black until loaded
    backgroundImage: isLoaded ? `url(${bgImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const faceStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const renderDigits = (value: string) =>
    value.split('').map((d, i) => (
      <div key={i} style={digitBox}>
        {d}
      </div>
    ));

  // Show black screen until everything is ready
  if (!isLoaded) {
    return (
      <div
        style={{ height: '100dvh', width: '100vw', backgroundColor: 'black' }}
      />
    );
  }

  return (
    <main style={containerStyle}>
      <time dateTime={time.toISOString()} style={faceStyle}>
        {renderDigits(hours)}
        <div style={digitBox}>:</div>
        {renderDigits(minutes)}
        <div style={digitBox}>:</div>
        {renderDigits(seconds)}
      </time>
    </main>
  );
};

export default Clock;
