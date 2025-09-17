import React, { useState, useEffect } from 'react';
import backgroundImage from './crush.jpg';
import fontFile from './crush.ttf';
import centerImage from './cru.gif'; // replace with your image file

const pad = (n) => n.toString().padStart(2, '0');

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [blinkIndex, setBlinkIndex] = useState(-1); // -1 = no blinking

  // Load font and image
  useEffect(() => {
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

    const fontPromise = document.fonts.load('10rem CustomClockFont');
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = backgroundImage;
      img.onload = resolve;
      img.onerror = reject;
    });

    const centerImgPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = centerImage;
      img.onload = resolve;
      img.onerror = reject;
    });

    Promise.all([fontPromise, imagePromise, centerImgPromise])
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error('Asset loading error:', err);
        setIsLoaded(true);
      });

    return () => document.head.removeChild(style);
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Blink logic
  useEffect(() => {
    const blinkTimeout = setTimeout(() => {
      let currentIndex = 0;
      const digitsCount = 10; // hours, minutes, seconds, AM/PM
      const blinkInterval = setInterval(() => {
        setBlinkIndex(currentIndex);
        currentIndex = (currentIndex + 1) % digitsCount;
      }, 1000);
      return () => clearInterval(blinkInterval);
    }, 1000);

    return () => clearTimeout(blinkTimeout);
  }, []);

  const hours = pad(time.getHours() % 12 || 12);
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const digits = [
    hours[0], hours[1],
    minutes[0], minutes[1],
    seconds[0], seconds[1],
    ampm[0], ampm[1],
  ];

  if (!isLoaded) {
    return <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 9999 }} />;
  }

  const getOpacity = (index, defaultOpacity = 1) =>
    blinkIndex === index ? 0 : defaultOpacity;

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
      {/* Background */}
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

      {/* Center Image */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '25vw',
          height: '25vh',
          opacity:'0.6',
          transform: 'rotate(32deg)',
          zIndex: 2, // above background but below digits
        }}
      >
        <img
          src={centerImage}
          alt="Center"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Clock digits */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Hours */}
        <div
          style={{
            position: 'absolute',
            top: '1vh',
            left: '2rem',
            transform: 'rotate(23deg)',
            fontSize: '23vh',
            color: '#F65427FF',
            opacity: getOpacity(0, 0.9),
          }}
        >
          {digits[0]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '16vh',
            left: '10rem',
            transform: 'rotate(-20deg)',
            fontSize: '29vh',
            color: '#F112C8FF',
            opacity: getOpacity(1, 0.8),
          }}
        >
          {digits[1]}
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
            opacity: getOpacity(2, 0.9),
          }}
        >
          {digits[2]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '55vh',
            left: '3rem',
            transform: 'rotate(-67deg) translateY(50%)',
            fontSize: '33vh',
            color: '#F0F406FF',
            opacity: getOpacity(3, 1),
          }}
        >
          {digits[3]}
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
            opacity: getOpacity(4, 0.7),
          }}
        >
          {digits[4]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '3vh',
            right: '5vw',
            transform: 'rotate(-22deg)',
            fontSize: '23vh',
            color: '#AEF606FF',
            opacity: getOpacity(5, 0.8),
          }}
        >
          {digits[5]}
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
            opacity: getOpacity(6, 0.7),
            fontWeight: 'bold',
          }}
        >
          {digits[6]}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '78vh',
            right: '3vw',
            transform: 'rotate(22deg)',
            fontSize: '19vh',
            color: '#E50AD6FF',
            opacity: getOpacity(7, 0.8),
            fontWeight: 'bold',
          }}
        >
          {digits[7]}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
