import React, { useState, useEffect } from 'react';

// --- FONT IMPORT (same folder) ---
import font_sdfsdfsdfsd from './omission.otf';

// --- IMAGE IMPORTS (same folder) ---
import img1 from './1.jpg';
import img2 from './2.jpg';
import img3 from './3.jpg';
import img4 from './4.jpg';
import img5 from './5.jpg';
import img6 from './6.jpg';

const images = [img1, img2, img3, img4, img5, img6];

const DigitalGridClock = () => {
  // --- INTERNAL FONTFACE ---
  const fontStyle = `
    @font-face {
      font-family: 'ClockFont_sdfsdfsdfsd';
      src: url(${font_sdfsdfsdfsd}) format('woff2');
      font-weight: normal;
      font-style: normal;
    }
  `;

  const [time, setTime] = useState(new Date());
  const [width, setWidth] = useState(window.innerWidth);

  // Separate images for hour and minute
  const [hourImage, setHourImage] = useState(images[Math.floor(Math.random() * images.length)]);
  const [minuteImage, setMinuteImage] = useState(() => {
    let img;
    do {
      img = images[Math.floor(Math.random() * images.length)];
    } while (img === hourImage);
    return img;
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Change images every minute
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

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      changeImages();
      const interval = setInterval(changeImages, 60000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [time]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const isDesktop = width >= 768;

  const cellFontSize = isDesktop ? '6vmin' : '4vmin';

  const cellStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: cellFontSize,
    backgroundColor: '#2A0433FF',
    color: '#F9E8C8FF',
    transition: 'all 0.5s ease',
    fontFamily: 'ClockFont_sdfsdfsdfsd',
    overflow: 'hidden',
    border: '1px solid #00000033',
  });

  const activeCellStyle = (image) => ({
    ...cellStyle(true),
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'transparent',
  });

  // Calculate grid columns dynamically
  const hourColumns = isDesktop ? 12 : 6;
  const minuteColumns = isDesktop ? 12 : 10;

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#CFCAD1FF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        fontFamily: 'ClockFont_sdfsdfsdfsd',
      }}
    >
      <style>{fontStyle}</style>

      {/* Hours Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${hourColumns}, 1fr)`,
          width: '90%',
          marginBottom: '2vh',
          gap: '0.2vh',
        }}
      >
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={`hour-${i}`}
            style={i === hours ? activeCellStyle(hourImage) : cellStyle(false)}
          >
            {String(i).padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Minutes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${minuteColumns}, 1fr)`,
          width: '90%',
          gap: '0.2vh',
        }}
      >
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={`min-${i}`}
            style={i === minutes ? activeCellStyle(minuteImage) : cellStyle(false)}
          >
            {String(i).padStart(2, '0')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalGridClock;
