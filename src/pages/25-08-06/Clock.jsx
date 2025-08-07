import React, { useEffect, useState } from 'react';

// Import background and digit images
import bgImage from './bg.gif';
import digit0 from './0-6.webp';
import digit1 from './1-6.webp';
import digit2 from './2-6.webp';
import digit3 from './3-6.webp';
import digit4 from './4-6.webp';
import digit5 from './5-6.webp';
import digit6 from './6-6.webp';
import digit7 from './7-6.webp';
import digit8 from './8-6.webp';
import digit9 from './9-6.webp';

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
  const [time, setTime] = useState(getTimeParts());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeParts());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function getTimeParts() {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    hours = hours % 12 || 12;
    return {
      hours: String(hours),
      minutes: String(minutes).padStart(2, '0'),
    };
  }

  const renderDigits = (text) =>
    [...text].map((char, index) => (
      <img
        key={index}
        src={digitImages[char]}
        alt={char}
        style={{
          height: '14vh',
          // margin: '0 0.3vw',
          filter: 'brightness(1.6)', // <<< Brightness filter on digit images
        }}
      />
    ));

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Background with filter */}
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7) contrast(1.6)', // <<< Filter on background
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />

      {/* Clock content on top */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderDigits(time.hours)}
          <div style={{ width: '0.1vw' }} />
          {renderDigits(time.minutes)}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
