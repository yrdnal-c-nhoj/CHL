import React, { useEffect, useState } from "react";
import "./25-04-17.css";

const digitStyles = {
  '0': { bg: '#0E51FAFF', color: '#F87E04FF' },
  '1': { bg: '#FA0820FF', color: '#2F9B04FF' },
  '2': { bg: '#F7FF06FF', color: '#A205C2FF' },
  '3': { bg: '#2F9B04FF', color: '#FA0820FF' },
  '4': { bg: '#FC8004FF', color: '#0E51FAFF' },
  '5': { bg: '#A205C2FF', color: '#F7FF06FF' },
  '6': { bg: '#141313FF', color: '#F4F2F2FF' },
  '7': { bg: '#F4F2F2FF', color: '#141313FF' },
  '8': { bg: '#966105FF', color: '#F92FB9FF' },
  '9': { bg: '#F92FB9FF', color: '#966105FF' },
};

function StripeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('en-GB', { hour12: false }).replace(/:/g, '');

  return (
    <div className="clock-container">
      {timeStr.split('').map((char, idx) => {
        const style = digitStyles[char];
        return (
          <div
            key={idx}
            className="stripe"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
}

export default StripeClock;
