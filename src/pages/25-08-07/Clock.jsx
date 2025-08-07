import React, { useEffect, useState } from 'react';
import './Clock.css';
import bg from './q.webp';
import fontUrl from './q.otf';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

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
    milliseconds: [...ms], // Now only two digits
  };
};


  const { hours, minutes, seconds, milliseconds } = getGroupedDigits();

  return (
    <div className="clock-container" style={{ backgroundImage: `url(${bg})` }}>
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
