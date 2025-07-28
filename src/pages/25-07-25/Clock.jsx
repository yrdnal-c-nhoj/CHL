import React, { useEffect, useState } from 'react';
import background2 from './bb.webp';   // front
import background1 from './bam.webp';  // back
import background3 from './bambu.gif'; // <- NEW static background
import customFont from './bamboo.ttf';

const Clock = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'CustomFont';
        src: url(${customFont}) format('woff2');
        font-weight: normal;
        font-style: normal;
      }

      @keyframes parallaxBack {
        0% { background-position: 0 0; }
        100% { background-position: -100vw 0; }
      }

      @keyframes parallaxFrontReverse {
        0% { background-position: 0 0; }
        100% { background-position: 200vw 0; } /* reversed direction */
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const isAM = hours < 12;
  const ampm = isAM ? 'AM' : 'PM';

  hours = hours % 12 || 12; // Convert to 12-hour format, removing 0
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr}${ampm}`;
};


  const timeString = formatTime(time);

  const wrapperStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const backgroundLayer1Style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background1})`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'cover',
    backgroundPosition: '0 0',
    animation: 'parallaxBack 160s linear infinite',
    opacity: 0.8,
    zIndex: 0,
  };

  const backgroundLayer2Style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background2})`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'cover',
    backgroundPosition: '0 0',
    animation: 'parallaxFrontReverse 120s linear infinite',
    opacity: 0.2,
    zIndex: 1,
  };

  const backgroundLayer3Style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background3})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    opacity: 0.2,
    zIndex: 2,
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 3,
  };

  const clockContainerStyle = {
    display: 'flex',
    zIndex: 4,
  };

  const digitBoxStyle = {
    width: '2rem',
    height: '10rem',
    fontSize: '6rem',
    color: '#98AF86FF',
    fontFamily: 'CustomFont, monospace',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={wrapperStyle}>
      <div style={backgroundLayer1Style}></div>
      <div style={backgroundLayer2Style}></div>
      <div style={backgroundLayer3Style}></div> {/* <-- Static background */}
      <div style={overlayStyle}></div>
      <div style={clockContainerStyle}>
        {timeString.split('').map((char, index) =>
          char !== ':' ? (
            <div key={index} style={digitBoxStyle}>
              {char}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Clock;
