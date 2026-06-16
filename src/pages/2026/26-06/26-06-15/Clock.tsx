import React, { useEffect, useState } from 'react';

const HexadecimalClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const { hours, minutes, seconds } = getTimeInHexadecimal();

  return (
    <div className="container">
      <div className="timeDisplay">
        <span className="digit">
          {hours[0]}
          {hours[1]}
        </span>
        <span className="separator">:</span>
        <span className="digit">
          {minutes[0]}
          {minutes[1]}
        </span>
        <span className="separator">:</span>
        <span className="digit">
          {seconds[0]}
          {seconds[1]}
        </span>
      </div>
    </div>
  );

  function getTimeInHexadecimal(): {
    hours: [string, string];
    minutes: [string, string];
    seconds: [string, string];
  } {
    const h = padHex(currentTime.getHours());
    const m = padHex(currentTime.getMinutes());
    const s = padHex(currentTime.getSeconds());

    return {
      hours: [h[0] ?? '0', h[1] ?? '0'],
      minutes: [m[0] ?? '0', m[1] ?? '0'],
      seconds: [s[0] ?? '0', s[1] ?? '0'],
    };
  }



  function padHex(value: number): string {
    const hexValue = value.toString(16).toUpperCase();
    return hexValue.length === 1 ? `0${hexValue}` : hexValue;
  }
};

export default HexadecimalClock;