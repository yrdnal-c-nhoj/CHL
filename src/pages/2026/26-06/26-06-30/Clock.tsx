import React, { useEffect, useState } from 'react';

const CyanClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate angles (degrees)
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', width: 'min(90vmin, 620px)', height: 'min(90vmin, 620px)' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 200"
          style={{
            filter: 'drop-shadow(0 0 25px #00FFFF)',
          }}
        >
          {/* Clock face */}
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="#0A1F1F"
            stroke="#00FFFF"
            strokeWidth="9"
          />

          {/* Inner ring */}
          <circle
            cx="100"
            cy="100"
            r="81"
            fill="none"
            stroke="#00FFFF"
            strokeWidth="3"
            opacity="0.25"
          />

          {/* Hour ticks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const x1 = 100 + 69 * Math.cos((angle - 90) * (Math.PI / 180));
            const y1 = 100 + 69 * Math.sin((angle - 90) * (Math.PI / 180));
            const x2 = 100 + 83 * Math.cos((angle - 90) * (Math.PI / 180));
            const y2 = 100 + 83 * Math.sin((angle - 90) * (Math.PI / 180));
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#00FFFF"
                strokeWidth="7"
                strokeLinecap="round"
              />
            );
          })}

          {/* Minute ticks */}
          {Array.from({ length: 60 }).map((_, i) => {
            if (i % 5 === 0) return null;
            const angle = i * 6;
            const x1 = 100 + 75 * Math.cos((angle - 90) * (Math.PI / 180));
            const y1 = 100 + 75 * Math.sin((angle - 90) * (Math.PI / 180));
            const x2 = 100 + 83 * Math.cos((angle - 90) * (Math.PI / 180));
            const y2 = 100 + 83 * Math.sin((angle - 90) * (Math.PI / 180));
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#00FFFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.55"
              />
            );
          })}

          {/* Hour hand */}
          <g transform={`rotate(${hourAngle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="46"
              stroke="#00FFFF"
              strokeWidth="8.5"
              strokeLinecap="round"
            />
          </g>

          {/* Minute hand */}
          <g transform={`rotate(${minuteAngle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="36"
              stroke="#00FFFF"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          {/* Second hand */}
          <g transform={`rotate(${secondAngle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke="#00FFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="30"
              r="3.5"
              fill="#00FFFF"
            />
          </g>

          {/* Center hub */}
          <circle
            cx="100"
            cy="100"
            r="10"
            fill="#001414"
            stroke="#00FFFF"
            strokeWidth="4"
          />
          <circle
            cx="100"
            cy="100"
            r="4"
            fill="#00FFFF"
          />
        </svg>
      </div>
    </div>
  );
};

export default CyanClock;