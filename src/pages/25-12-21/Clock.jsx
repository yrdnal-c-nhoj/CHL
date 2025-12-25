import { useState, useEffect } from 'react';
import background from './cass.jpg';
import fontDate20251219zz from '../../../public/fonts/cas.ttf';

const styleInject = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'CustomFont';
      src: url('${fontDate20251219zz}') format('truetype');
    }

    .clock-container,
    .time-part,
    .digit {
      font-family: 'CustomFont', sans-serif;
    }

    .digit {
      display: inline-block;
      width: 3vh;           
      text-align: center;
      color: #473803FF;
      filter: drop-shadow(0 0.4vh 0.3vh rgba(220, 222, 220));
      transform: rotate(90deg);
      transform-origin: center center;
      font-size: 6vh;
      line-height: 1;
      user-select: none;
    }

    @keyframes rotateGrid {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
  `;
  document.head.appendChild(style);
};

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    styleInject();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const digitToLetter = (digit) => {
    const letters = ['0', 'G', 'b', 'W', 'z', 'u', 'v', 'w', 'a', 's'];
    return letters[digit] || digit;
  };

  const formatWithLetters = (value) =>
    value
      .toString()
      .padStart(2, '0')
      .split('')
      .map(d => digitToLetter(parseInt(d, 10)));

  const renderTimePart = (chars) => (
    <div
      className="time-part"
      style={{
        display: 'flex',
        gap: '4vh',        /* digit spacing */
      }}
    >
      {chars.map((char, i) => (
        <span key={i} className="digit">{char}</span>
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
      {/* background */}
      <div
        style={{
          position: 'absolute',
          inset: '-100%', // Extend far beyond viewport to prevent any gaps during rotation
          backgroundImage: `url(${background})`,
          backgroundSize: '300px auto', // Size control - maintains aspect ratio
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center center',
          filter: 'brightness(1.4) saturate(1.2) contrast(0.8) hue-rotate(-25deg)',
          animation: 'rotateGrid 360s linear infinite',
          transformOrigin: 'center center',
        }}
      />



      {/* clock */}
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
            flexDirection: 'row',
            gap: '4vh',       /* HH ↔ MM ↔ SS spacing */
          }}
        >
          {renderTimePart(formatWithLetters(time.getHours()))}
          {renderTimePart(formatWithLetters(time.getMinutes()))}
          {renderTimePart(formatWithLetters(time.getSeconds()))}
        </div>
      </div>
    </div>
  );
}
