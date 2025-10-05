import React, { useState, useEffect } from 'react';
import bgImage from './16a.png'; // Full component background
import clockBgImage from './16.png'; // Clock-face background

export default function HexAnalogClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  const unixTime = Math.floor(currentTime.getTime() / 1000);
  const hexTime = unixTime.toString(16).toUpperCase();

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();

  // Make clock size responsive: 80% of the smaller viewport dimension
  const clockSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  const center = clockSize / 2;
  const radius = center - 29;

  const totalSecondsInDay =
    hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  const fractionOfDay = totalSecondsInDay / 86400;
  const hexHours = fractionOfDay * 16;
  const hexMinutes = (hexHours % 1) * 256;
  const hexSeconds = (hexMinutes % 1) * 256;

  const hourAngle = (360 / 16) * hexHours;
  const minuteAngle = (360 / 256) * hexMinutes;
  const secondAngle = (360 / 256) * hexSeconds;

  const hexLabels = Array.from({ length: 16 }, (_, i) =>
    `0x${i.toString(16).toUpperCase().padStart(2, '0')}`
  );

  const styles = {
    root: {
      position: 'relative',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      boxSizing: 'border-box',
      fontFamily:
        "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
      overflow: 'hidden',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '180% auto', // Scale width to 150% of viewport, height preserves aspect ratio
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      margin: 0,
    },
    card: {
      background: '#fff',
      border: '3px solid #0E0404FF',
      borderRadius: '12px',
      padding: '0.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: 'clamp(1.5rem, 5vw, 2rem)',
      zIndex: 2,
      maxWidth: '90%',
    },
    hexValue: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      background: 'linear-gradient(90deg, #0b8d49, #587045, #9f5a05, #0533ea)',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      backgroundSize: '300% 100%',
      animation: 'gradientShift 3s linear infinite',
    },
    progressContainer: {
      width: '100%',
      height: '10px',
      background: 'rgba(204, 187, 170, 0.3)',
      borderRadius: '6px',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      width: `${fractionOfDay * 100}%`,
      background: 'linear-gradient(90deg, #0b8d49, #9f5a05, #0533ea)',
      transition: 'width 0.1s linear',
    },
    styleTag: `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
      }
    `,
    svg: { width: clockSize, height: clockSize, zIndex: 2, position: 'relative' },
    centerDot: { fill: '#0b8d49' },
    markingText: {
      fill: '#0f172a',
      fontSize: Math.max(12, clockSize * 0.045),
      textAnchor: 'middle',
      dominantBaseline: 'middle',
    },
    clockFaceBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: clockSize,
      height: clockSize,
      borderRadius: '50%',
      backgroundImage: `url(${clockBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: 1,
    },
    clockContainer: {
      position: 'relative',
      width: clockSize,
      height: clockSize,
      borderRadius: '50%',
      maxWidth: '90vw',
      maxHeight: '90vh',
    },
  };

  return (
    <div style={styles.root}>
      <style>{styles.styleTag}</style>

      <div style={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={styles.hexValue}>0x{hexTime}</div>
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}></div>
        </div>
      </div>

      {/* Clock Container */}
      <div style={styles.clockContainer}>
        {/* Clock-face background */}
        <div style={styles.clockFaceBackground}></div>

        <svg viewBox={`0 0 ${clockSize} ${clockSize}`} style={styles.svg}>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="rgba(225, 214, 196, 0.3)"
            stroke="rgba(204,187,170,0.5)"
            strokeWidth="2"
          />

          {hexLabels.map((label, i) => {
            const angle = (i / 16) * 2 * Math.PI - Math.PI / 2;
            const x = center + Math.cos(angle) * (radius - 20);
            const y = center + Math.sin(angle) * (radius - 20);
            return (
              <text key={i} x={x} y={y} style={styles.markingText}>
                {label}
              </text>
            );
          })}

          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((hourAngle - 90) * (Math.PI / 180)) * (radius - 60)}
            y2={center + Math.sin((hourAngle - 90) * (Math.PI / 180)) * (radius - 60)}
            stroke="#0b8d49"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((minuteAngle - 90) * (Math.PI / 180)) * (radius - 40)}
            y2={center + Math.sin((minuteAngle - 90) * (Math.PI / 180)) * (radius - 40)}
            stroke="#9f5a05"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <line
            x1={center}
            y1={center}
            x2={center + Math.cos((secondAngle - 90) * (Math.PI / 180)) * (radius - 30)}
            y2={center + Math.sin((secondAngle - 90) * (Math.PI / 180)) * (radius - 30)}
            stroke="#0533ea"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <circle cx={center} cy={center} r="6" style={styles.centerDot} />
        </svg>
      </div>
    </div>
  );
}