import { useState, useEffect } from 'react';
import background from './swagr.webp';
import fontDate20251219 from './face.ttf';

const styleInject = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'CustomFont';
      src: url('${fontDate20251219}') format('truetype');
    }
    .clock-container, .time-part, .digit {
      font-family: 'CustomFont', sans-serif;
    }
    .digit {
      display: inline-block;
      width: 0.9em;
      text-align: center;
      color: #276CE3FF;
      filter: drop-shadow(0 1px 0px rgba(220, 0, 0));
    }
  `;
  document.head.appendChild(style);
};

export default function App() {
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
      setTime(new Date()); // Trigger re-render to recalculate layout
      setIsLargeScreen(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const digitToLetter = (digit) => {
    const letters = ['E', 'c', 'J', 'h', 'L', 'M', 'p', 'k', 'V', 'B'];
    return letters[digit] || digit;
  };

  const formatWithLetters = (timeValue) => {
    return timeValue
      .toString()
      .padStart(2, '0')
      .split('')
      .map(d => digitToLetter(parseInt(d, 10)));
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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
    
        }}
      />
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