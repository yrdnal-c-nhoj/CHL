import React, { useState, useEffect } from 'react';
import backgroundImage from './crush.jpg'; // Replace with your actual background image path
import fontFile from './crush.ttf'; // Replace with your actual font file path

// Helper function to pad numbers with leading zero
const pad = (n) => n.toString().padStart(2, '0');

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Inject @font-face dynamically
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${fontFile}) format('truetype');
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
        font-variation-settings: 'wght' 400;
      }
    `;
    document.head.appendChild(style);

    // Preload font
    const fontPromise = document.fonts.load('10rem CustomClockFont');

    // Preload background image
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = resolve;
      img.onerror = reject;
    });

    // Wait for both font and image before showing anything
    Promise.all([fontPromise, imagePromise])
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error('Asset loading error:', err);
        setIsLoaded(true); // Fallback to loaded state if error
      });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = pad(time.getHours() % 12 || 12);
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  // Black screen until fully loaded
  if (!isLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'black',
          zIndex: 9999,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        fontFamily: 'CustomClockFont, sans-serif',
        fontVariationSettings: '"wght" 400',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(300%) hue-rotate(-240deg)',
          zIndex: 1,
        }}
      />

      {/* Clock digits */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Hours */}
        <div
          style={{
            position: 'absolute',
            top: '1vh',
            left: '2rem',
            transform: 'rotate(23deg)',
            fontSize: '23vh',
            color: '#F65427FF',
            opacity: 0.9,
          }}
        >
          {hours[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '16vh',
            left: '10rem',
            transform: 'rotate(-20deg)',
            fontSize: '29vh',
            color: '#F112C8FF',
            opacity: 0.8,
          }}
        >
          {hours[1]}
        </div>

        {/* Minutes */}
        <div
          style={{
            position: 'absolute',
            top: '33vh',
            left: '4rem',
            transform: 'rotate(27deg) translateY(50%)',
            fontSize: '33vh',
            color: '#07DFDFFF',
            opacity: 0.9,
          }}
        >
          {minutes[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '55vh',
            left: '3rem',
            transform: 'rotate(-67deg) translateY(50%)',
            fontSize: '33vh',
            color: '#F0F406FF',
          }}
        >
          {minutes[1]}
        </div>

        {/* Seconds */}
        <div
          style={{
            position: 'absolute',
            top: '1vh',
            right: '28vw',
            transform: 'rotate(52deg)',
            fontSize: '33vh',
            color: '#EB0CC5FF',
            opacity: 0.7,
          }}
        >
          {seconds[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '3vh',
            right: '5vw',
            transform: 'rotate(-22deg)',
            fontSize: '23vh',
            color: '#AEF606FF',
            opacity: 0.8,
          }}
        >
          {seconds[1]}
        </div>

        {/* AM/PM */}
        <div
          style={{
            position: 'absolute',
            top: '61vh',
            right: '5vw',
            transform: 'rotate(-6deg)',
            fontSize: '23vh',
            color: '#7A73E5FF',
            opacity: 0.7,
            fontWeight: 'bold',
          }}
        >
          {ampm[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '78vh',
            right: '3vw',
            transform: 'rotate(22deg)',
            fontSize: '19vh',
            color: '#E50AD6FF',
            opacity: 0.8,
            fontWeight: 'bold',
          }}
        >
          {ampm[1]}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
