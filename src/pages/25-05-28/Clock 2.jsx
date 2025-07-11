import React, { useEffect } from 'react';
import circleFont from './circle.ttf'; // Local font file

const Clock = () => {
  useEffect(() => {
    // Load the font
    const font = new FontFace('circle', `url(${circleFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const updateClocks = () => {
      const now = new Date();
      const milliseconds = now.getMilliseconds();
      const seconds = now.getSeconds() + milliseconds / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;

      const hourAngle = hours * 30;
      const minuteAngle = minutes * 6;
      const secondAngle = seconds * 6;

      for (let i = 1; i <= 4; i++) {
        const h = document.getElementById(`hour${i}`);
        const m = document.getElementById(`minute${i}`);
        const s = document.getElementById(`second${i}`);

        if (h) h.setAttribute("transform", `rotate(${hourAngle} 50 50)`);
        if (m) m.setAttribute("transform", `rotate(${minuteAngle} 50 50)`);
        if (s) s.setAttribute("transform", `rotate(${secondAngle} 50 50)`);
      }

      requestAnimationFrame(updateClocks);
    };

    updateClocks();
    return () => cancelAnimationFrame(updateClocks);
  }, []);

  const clockSize = '82vh';

  const clockStyle = {
    fontFamily: 'circle, sans-serif',
    position: 'absolute',
    width: clockSize,
    height: clockSize,
    maxWidth: `calc(${clockSize} * 1)`,
    maxHeight: `calc(${clockSize} * 1)`,
  };

  const clockPositions = [
    {
      id: 'clock1',
      style: {
        ...clockStyle,
        top: '-76vh',
        left: '-76vh',
        transform: `translate(calc(${clockSize} / 2), calc(${clockSize} / 2))`,
      },
    },
    {
      id: 'clock2',
      style: {
        ...clockStyle,
        top: '-76vh',
        right: '-76vh',
        transform: `translate(calc(${clockSize} / -2), calc(${clockSize} / 2))`,
      },
    },
    {
      id: 'clock3',
      style: {
        ...clockStyle,
        bottom: '-76vh',
        left: '-76vh',
        transform: `translate(calc(${clockSize} / 2), calc(${clockSize} / -2))`,
      },
    },
    {
      id: 'clock4',
      style: {
        ...clockStyle,
        bottom: '-76vh',
        right: '-76vh',
        transform: `translate(calc(${clockSize} / -2), calc(${clockSize} / -2))`,
      },
    },
  ];

  const svgStyle = {
    overflow: 'visible',
    width: '100%',
    height: '100%',
  };

  const clockFaceStyle = {
    stroke: '#9de2ac',
    strokeWidth: `calc(${clockSize} * 0.0005)`,
    fill: 'transparent',
  };

  const handStyles = {
    hour: {
      stroke: '#f9d63a',
      strokeWidth: `calc(${clockSize} * 0.015)`,
      strokeLinecap: 'round',
    },
    minute: {
      stroke: '#1147ea',
      strokeWidth: `calc(${clockSize} * 0.01)`,
      strokeLinecap: 'round',
    },
    second: {
      stroke: '#f00',
      strokeWidth: `calc(${clockSize} * 0.002)`,
      strokeLinecap: 'round',
    },
  };

  const tickStyle = {
    stroke: '#9de2ac',
    strokeWidth: `calc(${clockSize} * 0.0005)`,
  };

  const numberStyle = {
    fontSize: `calc(${clockSize} * 0.02)`,
    fill: '#9de2ac',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    fontFamily: 'circle, sans-serif',
  };

  const renderClock = (id, index) => (
    <div key={id} id={id} style={clockPositions[index].style}>
      <svg viewBox="0 0 100 100" style={svgStyle}>
        <circle className="clock-face" cx="50" cy="50" r="45" style={clockFaceStyle} />
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <line className="tick" x1="50" y1="5" x2="50" y2="10" style={tickStyle} />
            <text className="number" x="50" y="15" style={numberStyle}>
              {i === 0 ? 12 : i}
            </text>
          </g>
        ))}
        <line className="hour-hand" x1="50" y1="50" x2="50" y2="22" id={`hour${index + 1}`} style={handStyles.hour} />
        <line className="minute-hand" x1="50" y1="50" x2="50" y2="9" id={`minute${index + 1}`} style={handStyles.minute} />
        <line className="second-hand" x1="50" y1="50" x2="50" y2="-500" id={`second${index + 1}`} style={handStyles.second} />
        <circle cx="50" cy="50" r="2" fill="#333" />
      </svg>
    </div>
  );

  return (
    <div
      style={{
        margin: 0,
        overflow: 'hidden',
        background: `linear-gradient(to bottom, #775011, #746c78)`,
        height: '100vh',
        width: '100vw',
        position: 'relative',
        fontFamily: 'circle, sans-serif',
      }}
    >
      {clockPositions.map((clock, index) => renderClock(clock.id, index))}
    </div>
  );
};

export default Clock;
