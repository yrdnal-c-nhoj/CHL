import { useEffect, useState } from 'react';

function getClockAngles(date) {
  const sec = date.getSeconds();
  const min = date.getMinutes();
  const hr = date.getHours() % 12;
  return {
    second: (sec / 60) * 360,
    minute: ((min + sec / 60) / 60) * 360,
    hour: ((hr + min / 60) / 12) * 360,
  };
}

export default function AnalogClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { second, minute, hour } = getClockAngles(now);

  // Make clock a big circle, but numbers larger and closer to center
  const clockSize = '42vw';     // main clock diameter
  const numbersRadius = 30;     // SVG units, closer to center
  const numbersFontSize = 24;   // SVG font size, larger digits

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e8efff 0%, #f5f7fa 100%)'
    }}>
      <svg viewBox="0 0 100 100"
        style={{
          width: clockSize,
          height: clockSize,
          display: 'block',
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 2vh 8vh rgba(70,97,135,0.13)',
        }}>
        {/* Outer frame */}
        <circle cx="50" cy="50" r="46" fill="#f0f6ff" stroke="#b7cef4" strokeWidth="3"/>
        {/* Center dot */}
        <circle cx="50" cy="50" r="2.5" fill="#377dff"/>

        {/* Large, close-to-center numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const ang = ((i + 1) * 30 - 90) * (Math.PI / 180);
          const x = 50 + numbersRadius * Math.cos(ang);
          const y = 50 + numbersRadius * Math.sin(ang) + numbersFontSize/4;
          return (
            <text
              key={i+1}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize={numbersFontSize}
              fill="#377dff"
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 700,
                userSelect: 'none'
              }}>
              {i+1}
            </text>
          );
        })}
        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6) * (Math.PI / 180);
          const long = i % 5 === 0;
          const r1 = 43, r2 = long ? 38 : 41.5;
          const x1 = 50 + r1 * Math.cos(angle);
          const y1 = 50 + r1 * Math.sin(angle);
          const x2 = 50 + r2 * Math.cos(angle);
          const y2 = 50 + r2 * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke="#a7b4c8"
              strokeWidth={long ? 1.5 : 0.5}
            />
          );
        })}

        {/* Hour hand */}
        <line
          x1="50" y1="50"
          x2={50 + 23 * Math.cos((Math.PI/180)*(hour-90))}
          y2={50 + 23 * Math.sin((Math.PI/180)*(hour-90))}
          stroke="#377dff"
          strokeWidth="2.7"
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="50" y1="50"
          x2={50 + 33 * Math.cos((Math.PI/180)*(minute-90))}
          y2={50 + 33 * Math.sin((Math.PI/180)*(minute-90))}
          stroke="#495268"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1="50" y1="50"
          x2={50 + 39 * Math.cos((Math.PI/180)*(second-90))}
          y2={50 + 39 * Math.sin((Math.PI/180)*(second-90))}
          stroke="#ff514b"
          strokeWidth="0.7"
        />
      </svg>
    </div>
  );
}
