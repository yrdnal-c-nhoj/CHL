import { useState, useEffect } from 'react';
import customFont from './mau.ttf';
import cornerImage from './corner.gif';
import backgroundImage from './mau.gif'; // <-- your background image

function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Delay so fade-in looks smooth
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return { hours, minutes: formattedMinutes, ampm };
  };

  const { hours, minutes, ampm } = getTimeParts(time);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    backgroundColor: '#b784a7',
    backgroundImage: `url(${backgroundImage})`,
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',       // scales whole image, no clipping
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
    opacity: loaded ? 1 : 0,         // fade in
    transition: 'opacity 1.5s ease-in-out',
  };

  const clockStyle = {
    fontFamily: 'Digital7, sans-serif',
    fontSize: '18vw',
    color: '#E2BBFCFF',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1.25,
    letterSpacing: '0.05em',
    textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
  };

  const ampmStyle = {
    fontSize: '16vw',
  };

  const cornerStyle = (position) => {
    switch (position) {
      case 'top-left':
        return { position: 'absolute', top: 0, left: 0, width: '12rem', transform: 'rotate(0deg)' };
      case 'top-right':
        return { position: 'absolute', top: 0, right: 0, width: '12rem', transform: 'rotate(90deg)' };
      case 'bottom-left':
        return { position: 'absolute', bottom: 0, left: 0, width: '12rem', transform: 'rotate(-90deg)' };
      case 'bottom-right':
        return { position: 'absolute', bottom: 0, right: 0, width: '12rem', transform: 'rotate(180deg)' };
      default:
        return {};
    }
  };

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Digital7';
            src: url(${customFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div style={containerStyle}>
        <img src={cornerImage} alt="Corner" style={cornerStyle('top-left')} />
        <img src={cornerImage} alt="Corner" style={cornerStyle('top-right')} />
        <img src={cornerImage} alt="Corner" style={cornerStyle('bottom-left')} />
        <img src={cornerImage} alt="Corner" style={cornerStyle('bottom-right')} />

        <div style={clockStyle}>
          <div>{hours}</div>
          <div>{minutes}</div>
          <div style={ampmStyle}>{ampm}</div>
        </div>
      </div>
    </>
  );
}

export default DigitalClock;
