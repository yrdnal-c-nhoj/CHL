import React, { useEffect, useState } from 'react';
import './Clock.css';
import bg from './q.webp';
import fontUrl from './q.otf';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [shift, setShift] = useState(false);
  const [posToggle, setPosToggle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

  // Start background shifting after 2 seconds
  useEffect(() => {
    const startShiftTimer = setTimeout(() => {
      setShift(true);
    }, 100);

    return () => clearTimeout(startShiftTimer);
  }, []);

  // Handle position toggling when shift starts
  useEffect(() => {
    if (!shift) return;

    const shiftInterval = setInterval(() => {
      setPosToggle(prev => !prev);
    }, 60); // every 0.1 seconds

    return () => clearInterval(shiftInterval);
  }, [shift]);

  const pad = (n, digits = 2) => n.toString().padStart(digits, '0');

  const getGroupedDigits = () => {
    const h = pad(time.getHours());
    const m = pad(time.getMinutes());
    const s = pad(time.getSeconds());
    const ms = pad(time.getMilliseconds(), 3).slice(0, 2); // Only first 2 digits
    return {
      hours: [...h],
      minutes: [...m],
      seconds: [...s],
      milliseconds: [...ms],
    };
  };

  const { hours, minutes, seconds, milliseconds } = getGroupedDigits();

  // Background styles with side-to-side shift effect
  const backgroundStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: '110%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: shift
      ? (posToggle ? '48% center' : '52% center') // left/right shift
      : 'center center',
    transition: 'background-position 0.08s ease-in-out', // smooth
  };

  return (
    <div className="clock-container" style={backgroundStyle}>
      <style>
        {`@font-face {
          font-family: 'CustomFont';
          src: url(${fontUrl});
        }`}
      </style>
      <div className="clock-wrapper">
        <div className="digit-group">
          {hours.map((d, i) => (
            <div key={`h${i}`} className="digit-box">{d}</div>
          ))}
        </div>
        <div className="digit-group">
          {minutes.map((d, i) => (
            <div key={`m${i}`} className="digit-box">{d}</div>
          ))}
        </div>
        <div className="digit-group">
          {seconds.map((d, i) => (
            <div key={`s${i}`} className="digit-box">{d}</div>
          ))}
        </div>
        <div className="digit-group">
          {milliseconds.map((d, i) => (
            <div key={`ms${i}`} className="digit-box">{d}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clock;
