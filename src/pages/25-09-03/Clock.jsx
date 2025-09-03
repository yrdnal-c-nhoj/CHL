import { useState, useEffect } from 'react';
import customFont from './mau.ttf';

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
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
    backgroundColor: '#BB85AB',
  };

  const clockStyle = {
    fontFamily: 'Digital7, sans-serif',
    fontSize: '6rem',
    color: '#E0B0FF',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1.2,
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
        <div style={clockStyle}>
          <div>{hours}</div>
          <div>{minutes}</div>
          <div>{ampm}</div>
        </div>
      </div>
    </>
  );
}

export default DigitalClock;
