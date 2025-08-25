import React, { useState, useEffect } from 'react';

// Import digit images
import digit0 from './0.gif';
import digit1 from './1.gif';
import digit2 from './2.gif';
import digit3 from './3.gif';
import digit4 from './4.gif';
import digit5 from './5.gif';
import digit6 from './6.gif';
import digit7 from './7.gif';
import digit8 from './8.gif';
import digit9 from './9.gif';

// Import background and overlay images
import backgroundImage from './g.webp';
import overlayImage from './fog.gif';

// Import custom font as module
import customFont from './fog.ttf';

const digitImages = {
  '0': digit0,
  '1': digit1,
  '2': digit2,
  '3': digit3,
  '4': digit4,
  '5': digit5,
  '6': digit6,
  '7': digit7,
  '8': digit8,
  '9': digit9,
};

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const timeDigits = `${hours}${minutes}${seconds}`.split('');

  // Inline font-face and floating animation
  const inlineStyle = `
    @font-face {
      font-family: 'CustomFont';
      src: url(${customFont}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-1rem); }
    }
  `;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <style>{inlineStyle}</style>

      {/* Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.7) contrast(0.4) saturate(.9)',
        zIndex: 0,
      }} />

      {/* Digits */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {timeDigits.map((digit, index) => (
          <div key={index} style={{
            position: 'relative',
            width: '18vw',
            marginLeft: index === 0 ? 0 : '-12vw',
            textAlign: 'center',
          }}>
            {/* Floating digit text above the image */}
            <span style={{
              position: 'absolute',
              top: '-5rem',
              width: '100%',
              color: 'white',
              fontSize: '3rem',
              fontFamily: 'CustomFont, sans-serif',
              textShadow: '0.2rem 0.2rem 0.4rem black',
              zIndex: 2,
              opacity: 0.2,
              animation: `float 2s ease-in-out ${index * 0.1}s infinite`, // stagger animation slightly
            }}>
              {digit}
            </span>

            <img
              src={digitImages[digit]}
              alt={digit}
              style={{
                width: '100%',
                height: 'auto',
                transform: 'rotate(90deg)',
                filter: 'drop-shadow(0.4rem 0.2rem 0.3rem grey) drop-shadow(-0.4rem -0.4rem 0.3rem grey)',
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${overlayImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5,
        transform: 'rotate(180deg)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default DigitalClock;
