import React, { useState, useEffect, useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

// --- FONT IMPORT (same folder) ---
import font_sdfsdfsdfsd from '@/assets/fonts/2025/25-11-21-omission.otf?url';

// --- IMAGE IMPORTS (same folder) ---
import img1 from '@/assets/images/2025/25-11/25-11-21/1.jpg';
import img2 from '@/assets/images/2025/25-11/25-11-21/2.jpg';
import img3 from '@/assets/images/2025/25-11/25-11-21/3.jpg';
import img4 from '@/assets/images/2025/25-11/25-11-21/4.jpg';
import img5 from '@/assets/images/2025/25-11/25-11-21/5.jpg';
import img6 from '@/assets/images/2025/25-11/25-11-21/6.jpg';

export { img1, img2, img3, img4, img5, img6 }; // Export for preloading pipeline
const images = [img1, img2, img3, img4, img5, img6];

const DigitalGridClock: React.FC = () => {
  const time = useClockTime();
  const [width, setWidth] = useState<number>(window.innerWidth);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'ClockFont_Omission', fontUrl: font_sdfsdfsdfsd }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // Separate images for hour and minute
  const [hourImage, setHourImage] = useState(
    images[Math.floor(Math.random() * images.length)],
  );
  const [minuteImage, setMinuteImage] = useState(() => {
    let img;
    do {
      img = images[Math.floor(Math.random() * images.length)];
    } while (img === hourImage);
    return img;
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Change images every minute
  const currentMinute = time.getMinutes();
  useEffect(() => {
    const changeImages = () => {
      const newHourImage = images[Math.floor(Math.random() * images.length)];
      let newMinuteImage;
      do {
        newMinuteImage = images[Math.floor(Math.random() * images.length)];
      } while (newMinuteImage === newHourImage);

      setHourImage(newHourImage);
      setMinuteImage(newMinuteImage);
    };

    changeImages();
  }, [currentMinute]);

  const hours = time.getHours();
  const minutes = currentMinute;
  const isDesktop = width >= 768;

  const cellStyle = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isDesktop ? '6vmin' : '6vmin',
    backgroundColor: '#2A0433FF',
    color: '#F9E8C8FF',
    transition: 'all 0.5s ease',
    fontFamily: 'ClockFont_Omission',
    overflow: 'hidden',
  });

  const activeCellStyle = (image) => ({
    ...cellStyle(),
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'transparent', // hide the number
  });

  return (
    <div
      style={{
        height: '100dvh', // Changed from 100vh to 100dvh to respect mobile browser bars
        width: '100vw',
        backgroundColor: '#CFCAD1FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'ClockFont_Omission',
      }}
    >
      <div
        style={{
          display: 'grid',
          // Using minmax(0, 1fr) forces rows/cols to shrink to fit the screen
          // preventing them from being pushed out by internal content size.
          gridTemplateColumns: isDesktop
            ? 'repeat(14, minmax(0, 1fr))'
            : 'repeat(6, minmax(0, 1fr))',
          gridTemplateRows: isDesktop
            ? 'repeat(6, minmax(0, 1fr))'
            : 'repeat(14, minmax(0, 1fr))',
          width: '100vw',
          height: '100dvh',
        }}
      >
        {/* Hours (0-23) */}
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={`hour-${i}`}
            style={i === hours ? activeCellStyle(hourImage) : cellStyle()}
          >
            {String(i).padStart(2, '0')}
          </div>
        ))}

        {/* Minutes (0-59) */}
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={`min-${i}`}
            style={
              i === minutes ? activeCellStyle(minuteImage) : cellStyle()
            }
          >
            {String(i).padStart(2, '0')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalGridClock;
