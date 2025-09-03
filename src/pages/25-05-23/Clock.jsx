import React, { useEffect, useState } from 'react';
import backgroundImage from './blank.jpg';
import crossFont from './Cross.otf';

const CrossClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const font = new FontFace('Cross', `url(${crossFont})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getRandomBrightColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 70%)`; // brighter saturation & lightness
  };

  const formatTime = () => {
    let hours = time.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return {
      hours: String(hours),
      minutes: String(time.getMinutes()).padStart(2, '0'),
      seconds: String(time.getSeconds()).padStart(2, '0'),
      ampm,
    };
  };

  const { hours, minutes, seconds, ampm } = formatTime();

  const digitStyle = {
    display: 'inline-block',
    width: '0.4em',
    textAlign: 'center',
    transition: 'color 0.3s ease',
    userSelect: 'none',
  };

  const unitStyle = {
    display: 'flex',
    gap: '0.1em',
    justifyContent: 'center',
  };

  const renderUnit = (value) => (
    <div style={unitStyle}>
      {value.split('').map((char, idx) => (
        <span key={idx} style={{ ...digitStyle, color: getRandomBrightColor() }}>
          {char}
        </span>
      ))}
    </div>
  );

  return (
    <div
      style={{
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        fontFamily: 'Cross, sans-serif',
      }}
    >
      <style>
        {`
          @font-face {
            font-family: 'Cross';
            src: url(${crossFont}) format('opentype');
          }

          .clock-container {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            font-size: 12rem;
            z-index: 4;
            line-height: 0.7;
          }

          .am-pm {
            font-size: 0.001rem;
            color: transparent;
          }

          @media (max-width: 768px) {
            .clock-container {
              flex-direction: column;
              font-size: 12rem;
              gap: 1rem;
              align-items: center;
            }

            .am-pm {
              font-size: 0.001rem;
              color: transparent;
            }
          }
        `}
      </style>

      <img
        src={backgroundImage}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      <div className="clock-container">
        {renderUnit(hours)}
        {renderUnit(minutes)}
        {renderUnit(seconds)}
        <div className="am-pm">{ampm}</div>
      </div>
    </div>
  );
};

export default CrossClock;
