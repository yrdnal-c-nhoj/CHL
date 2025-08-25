import React, { useState, useEffect } from 'react';

// Import digit images as modules
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

// Import background image as module
import backgroundImage from './g.webp';

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

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {timeDigits.map((digit, index) => (
          <img
            key={index}
            src={digitImages[digit]}
            alt={digit}
            style={{
              position: 'relative',
              width: '18vw',
              height: 'auto',
              transform: 'rotate(90deg)',
              marginLeft: index === 0 ? 0 : '-12vw', // very very close overlap
              zIndex: index,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DigitalClock;
