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

    // Calculate ms until next full minute
    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;

    const timeout = setTimeout(() => {
      changeImages();
      // Then update every full minute
      const interval = setInterval(changeImages, 60000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [time]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const isDesktop = width >= 768;

  const cellStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isDesktop ? '3vmin' : '3vmin',
    backgroundColor: '#2A0433FF',
    color: '#F9E8C8FF',
    transition: 'all 0.5s ease',
    fontFamily: 'ClockFont_sdfsdfsdfsd',
    overflow: 'hidden',
  });

  const activeCellStyle = (image) => ({
    ...cellStyle(true),
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'transparent', // hide the number
  });

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#CFCAD1FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'ClockFont_sdfsdfsdfsd',
      }}
    >
      {/* Inject your @font-face safely */}
      <style>{fontStyle}</style>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(14, 1fr)' : 'repeat(6, 1fr)',
          gridTemplateRows: isDesktop ? 'repeat(6, 1fr)' : 'repeat(14, 1fr)',
          width: '100vw',
          height:  '100dvh',
        }}
      >
        {/* Hours (0-23) */}
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={`hour-${i}`}
            style={i === hours ? activeCellStyle(hourImage) : cellStyle(false)}
          >
            {String(i).padStart(2, '0')}
          </div>
        ))}

        {/* Minutes (0-59) */}
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
