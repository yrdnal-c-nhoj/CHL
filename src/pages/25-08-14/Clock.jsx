import React, { useState, useEffect } from 'react';

import backgroundImg from './1.webp';
import digit1 from './1.gif';
import digit2 from './2.gif';
import digit3 from './3.gif';
import digit4 from './4.gif';
import digit5 from './5.gif';
import digit6 from './6.gif';
import digit7 from './7.gif';
import digit8 from './8.gif';
import digit9 from './9.gif';
import digit10 from './10.gif';
import digit11 from './11.gif';
import digit12 from './12.gif';
import customFont from './bir.ttf';

const digitImages = [
  digit1, digit2, digit3, digit4, digit5, digit6,
  digit7, digit8, digit9, digit10, digit11, digit12
];

const words = [
  'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP',
  'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'
];

const AnalogClock = () => {
  const [initialTime] = useState(new Date());

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${customFont}) format('truetype');
      }

      @keyframes rotate {
        0% { transform: translateX(-50%) rotate(0deg); }
        100% { transform: translateX(-50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const ms = initialTime.getMilliseconds() / 1000;
  const seconds = initialTime.getSeconds() + ms;
  const minutes = initialTime.getMinutes() * 60 + seconds;
  const hours = (initialTime.getHours() % 12) * 3600 + minutes;

  const secondsDelay = -seconds;
  const minutesDelay = -minutes;
  const hoursDelay = -hours;

  const pageStyle = {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.4)',
    zIndex: 0
  };

  const clockContainerStyle = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  };

  const clockStyle = {
    position: 'relative',
    width: 'min(70vw, 70vh, 600px)', // Responsive: 80% of viewport width or height, max 500px
    height: 'min(70vw, 70vh, 600px)', // Same for height to maintain square aspect ratio
    borderRadius: '50%',
  };

  const handStyle = {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'bottom center',
    animation: 'rotate linear infinite',
  };

  // Calculate responsive sizes based on clock size
  const clockSize = 'min(80vw, 80vh, 500px)';
  const digitSize = 'calc(' + clockSize + ' * 0.12)'; // 12% of clock size
  const digitRadius = 'calc(' + clockSize + ' * 0.32)'; // 32% of clock size from center
  const wordRadius = 'calc(' + clockSize + ' * 0.20)'; // 20% of clock size from center
  const hourHandHeight = 'calc(' + clockSize + ' * 0.20)'; // 20% of clock size
  const minuteHandHeight = 'calc(' + clockSize + ' * 0.28)'; // 28% of clock size
  const secondHandHeight = 'calc(' + clockSize + ' * 0.32)'; // 32% of clock size

  return (
    <div style={pageStyle}>
      <div style={backgroundStyle}></div>

      <div style={clockContainerStyle}>
        <div style={clockStyle}>
          {/* Digits */}
          {digitImages.map((digit, index) => {
            const angle = (index + 1) * 30;
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: digitSize,
                  height: digitSize,
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, calc(-1 * ${digitRadius})) rotate(-${angle}deg)`,
                }}
              >
                <img
                  src={digit}
                  alt={`${index + 1}`}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            );
          })}

          {/* Words stretched as spokes, closer to center */}
          {words.map((word, index) => {
            const angle = (index + 1) * 30;
            return (
              <div
                key={`word-${index}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: wordRadius,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'left center',
                  color: '#C8C1C1FF',
                  fontSize: `calc(${clockSize} * 0.045)`, // Responsive font size
                  fontFamily: 'CustomClockFont, sans-serif',
                  textAlign: 'right',
                  letterSpacing: '0.1em',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}
              >
                {word}
              </div>
            );
          })}

          {/* Hands */}
          <div
            style={{
              ...handStyle,
              width: `calc(${clockSize} * 0.016)`, // Responsive width
              height: hourHandHeight,
              backgroundColor: '#F9F6F6FF',
              animationDuration: '43200s',
              opacity: '0.3',
              animationDelay: `${hoursDelay}s`,
            }}
          />
          <div
            style={{
              ...handStyle,
              width: `calc(${clockSize} * 0.008)`, // Responsive width
              height: minuteHandHeight,
              backgroundColor: '#F7EFEFFF',
              opacity: '0.3',
              animationDuration: '3600s',
              animationDelay: `${minutesDelay}s`,
            }}
          />
          <div
            style={{
              ...handStyle,
              width: `calc(${clockSize} * 0.004)`, // Responsive width
              height: secondHandHeight,
              backgroundColor: '#848184FF',
              animationDuration: '60s',
              animationDelay: `${secondsDelay}s`,
            }}
          />

          {/* Center circle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `calc(${clockSize} * 0.004)`, // Responsive size
              height: `calc(${clockSize} * 0.004)`,
              backgroundColor: 'grey',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;