// src/components/Clock.jsx (or wherever you keep it)

import { useState, useEffect } from 'react';
import background from './swagr.webp';

// Font is now placed in public/fonts/custom-face.ttf
// This ensures the same path works in both dev and production
const FONT_URL = '/fonts/face.ttf';

const styleInject = () => {
  // Avoid injecting multiple times
  if (document.getElementById('custom-font-style')) return;

  const style = document.createElement('style');
  style.id = 'custom-font-style';
  style.textContent = `
    @font-face {
      font-family: 'CustomFont';
      src: url('${FONT_URL}') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap; /* Improves perceived performance */
    }

    .clock-container, .time-part, .digit {
      font-family: 'CustomFont', sans-serif;
    }

    .digit {
      display: inline-block;
      width: 0.9em;
      text-align: center;
      color: #276CE3;
      filter: drop-shadow(0 1px 0px rgba(220, 0, 0, 1));
    }
  `;
  document.head.appendChild(style);
};

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  useEffect(() => {
    styleInject();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map digits to your custom letters
  const digitToLetter = (digit) => {
    const letters = ['E', 'c', 'J', 'h', 'L', 'M', 'p', 'k', 'V', 'B'];
    return letters[digit] ?? digit;
  };

  const formatWithLetters = (value) => {
    return String(value)
      .padStart(2, '0')
      .split('')
      .map(d => digitToLetter(Number(d)));
  };

  const hours = formatWithLetters(time.getHours());
  const minutes = formatWithLetters(time.getMinutes());
  const seconds = formatWithLetters(time.getSeconds());

  const renderTimePart = (chars) => (
    <div className="time-part" style={{ display: 'flex' }}>
      {chars.map((char, i) => (
        <span key={i} className="digit">
          {char}
        </span>
      ))}
    </div>
  );

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.3) saturate(2) contrast(0.8) hue-rotate(-15deg)',
        }}
      />

      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Clock Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100dvh',
        }}
      >
        <div
          className="clock-container"
          style={{
            display: 'flex',
            flexDirection: isLargeScreen ? 'row' : 'column',
            gap: isLargeScreen ? '2vw' : '4vh',
            color: 'white',
            fontSize: isLargeScreen ? '15vw' : '20vw',
            letterSpacing: '0.5vw',
          }}
        >
          {renderTimePart(hours)}
          {renderTimePart(minutes)}
          {renderTimePart(seconds)}
        </div>
      </div>
    </div>
  );
}