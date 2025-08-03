import { useState, useEffect } from 'react';
import myFontWoff2 from './zod.ttf'; // Place this in the same folder as this component

const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const containerStyle = {
    position: 'relative',
    width: '16rem',
    height: '16rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '50%',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const centerDotStyle = {
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: '#000',
    borderRadius: '50%',
    zIndex: 10,
  };

  const numeralStyle = (angle) => ({
    position: 'absolute',
    transform: `rotate(${angle}deg) translate(0, -6.5rem) rotate(-${angle}deg)`,
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'MyCustomFont',
  });

  const handStyle = (width, height, color, angle) => ({
    position: 'absolute',
    width,
    height,
    backgroundColor: color,
    transform: `rotate(${angle}deg) translate(0, -4px)`,
    transformOrigin: 'bottom center',
  });

  return (
    <div style={containerStyle}>
      <style>
        {`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${myFontWoff2}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      {/* Center dot */}
      <div style={centerDotStyle} />

      {/* Roman numerals */}
      {romanNumerals.map((numeral, index) => {
        const angle = (index / 12) * 360;
        return (
          <div key={numeral} style={numeralStyle(angle)}>
            {numeral}
          </div>
        );
      })}

      {/* Hour hand */}
      <div style={handStyle('0.25rem', '4rem', '#000', hourDeg)} />

      {/* Minute hand */}
      <div style={handStyle('0.15rem', '5rem', '#000', minuteDeg)} />

      {/* Second hand */}
      <div style={handStyle('0.1rem', '6rem', 'red', secondDeg)} />
    </div>
  );
};

export default AnalogClock;
