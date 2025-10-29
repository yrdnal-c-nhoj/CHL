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
  const [now, setNow] = useState(new Date());

  // Smoothly update time
  useEffect(() => {
    const update = () => {
      setNow(new Date());
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, []);

  // Load custom font
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${customFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Calculate angles
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = now.getHours() % 12 + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  const pageStyle = {
    width: '100vw',
    height: '100dvh',
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
    // width: '60vmin',   // bigger clock
    // height: '60vmin'
  };

  const handCommonStyle = {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'bottom center',
  };

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
                  width: '13vmin',      // bigger digits
                  height: '13vmin',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translate(0, -34vmin) rotate(-${angle}deg)`,
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

          {/* Words */}
          {words.map((word, index) => {
            const angle = (index + 1) * 30;
            return (
              <div
                key={`word-${index}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '10vmin',
                  transform: `rotate(${angle}deg) translateX(9vmin)`, // pushed closer to digits
                  transformOrigin: 'left center',
                  color: '#C8C1C1FF',
                  fontSize: '1.6rem',   // bigger font
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

          {/* Hour Hand */}
          <div
            style={{
              ...handCommonStyle,
              width: '1vmin',
              height: '22vmin',   // longer hand
              backgroundColor: '#F9F6F6FF',
              opacity: 0.6,
              transform: `translateX(-50%) rotate(${hourDeg}deg)`
            }}
          />
          {/* Minute Hand */}
          <div
            style={{
              ...handCommonStyle,
              width: '0.5vmin',
              height: '33vmin',
              backgroundColor: '#F7EFEFFF',
              opacity: 0.6,
              transform: `translateX(-50%) rotate(${minuteDeg}deg)`
            }}
          />
          {/* Second Hand */}
          <div
            style={{
              ...handCommonStyle,
              width: '0.25vmin',
              height: '33vmin',
              backgroundColor: '#F7EFEFFF',
              opacity: 0.6,
              transform: `translateX(-50%) rotate(${secondDeg}deg)`
            }}
          />

          {/* Center Circle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '1.5vmin',
              height: '1.5vmin',
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
