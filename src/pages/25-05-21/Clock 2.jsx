import { useEffect, useState } from 'react';
import background from './signals.jpg';
import semFont from './sem.ttf';

// Inject font-face using JS
const injectFont = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @font-face {
      font-family: 'sem';
      src: url(${semFont}) format('truetype');
    }
  `;
  document.head.appendChild(style);
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    injectFont(); // Inject the font when component mounts
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDigits = (value) => String(value).padStart(2, '0').split('');
  const [hourTens, hourUnits] = getDigits(time.getHours());
  const [minuteTens, minuteUnits] = getDigits(time.getMinutes());
  const [secondTens, secondUnits] = getDigits(time.getSeconds());

  const bodyStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: 0,
    background: 'rgb(99, 93, 93)',
    overflow: 'hidden',
    position: 'relative',
  };

  const bgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'invert(0.6) hue-rotate(180deg)',
    // zIndex: 3,
  };

  const containerStyle = {
    fontFamily: 'sem, sans-serif',
    fontSize: isMobile ? '20vh' : '25vh',
    color: 'rgb(245, 19, 19)',
    textShadow: '#fff000 2px 2px, #fff000 -2px 2px, #fff000 2px -2px, #fff000 -2px -2px',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.1vh',
    zIndex: 1,
  };

  const timeGroupStyle = {
    display: 'flex',
    gap: isMobile ? '0.5ch' : '0.1ch',
  };

  const digitStyle = {
    width: '1ch',
    textAlign: 'center',
  };

  return (
    <div style={bodyStyle}>
      <div style={bgStyle}></div>
      <div style={containerStyle}>
        <div style={timeGroupStyle}>
          <div style={digitStyle}>{hourTens}</div>
          <div style={digitStyle}>{hourUnits}</div>
        </div>
        <div style={timeGroupStyle}>
          <div style={digitStyle}>{minuteTens}</div>
          <div style={digitStyle}>{minuteUnits}</div>
        </div>
        <div style={timeGroupStyle}>
          <div style={digitStyle}>{secondTens}</div>
          <div style={digitStyle}>{secondUnits}</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
