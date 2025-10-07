import React, { useState, useEffect } from 'react';
import bgImage from './16a.png';
import clockBgImage from './16.png';
import digitalFontUrl from './dode.ttf'; // digital clock font
import analogFontUrl from './do.ttf'; // analog clock font

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
      gap: '0.05rem',
      padding: '0.05rem',
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '180% auto',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      margin: 0,
    },
    card: {
      background: '#fff',
      border: '4px solid #0E0404FF',
      borderRadius: '12px',
      padding: '1vh 3vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: '9rem',
      zIndex: 2,
      maxWidth: '90%',
    },
    progressContainer: {
      width: '100%',
      height: '7vh',
      background: 'rgba(204, 187, 170, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      width: `${fractionOfDay * 100}%`,
      background: 'linear-gradient(90deg, #0b8d49, #EC2308FF, #0533ea)',
      transition: 'width 0.1s linear',
      border: '0.5px solid #000', // thin black border
      boxSizing: 'border-box',
    },
    styleTag: `
      @font-face {
        font-family: 'DigitalFont';
        src: url(${digitalFontUrl}) format('truetype');
        font-display: swap;
      }
      @font-face {
        font-family: 'AnalogFont';
        src: url(${analogFontUrl}) format('opentype');
        font-display: swap;
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
    svg: { width: clockSize, height: clockSize, zIndex: 2, position: 'relative' },
    centerDot: { fill: '#E04807FF' },
    markingText: {
      fontFamily: 'AnalogFont',
      fill: '#5B07A0FF',
      fontSize: Math.max(12, clockSize * 0.07),
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
    hexDigitBox: (index) => ({
      width: '9vw',
      height: '7vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'DigitalFont',
      fontSize: '9vh',
      background: 'linear-gradient(90deg, #00FF00, #FF0000, #0000FF, #FFFF00)',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      backgroundSize: '300% 100%',
      animation: 'gradientShift 1.5s linear infinite',
      animationDelay: `${index * 0.2}s`,
      textShadow: `
      
     
        1px 0px 0 #000
      `, // thin black outline
    }),
  };

  return (
    <div style={styles.root}>
      <style>{styles.styleTag}</style>

      <div style={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {`0x${hexTime}`.split('').map((char, index) => (
            <div key={index} style={styles.hexDigitBox(index)}>
              {char}
            </div>
          ))}
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}></div>
        </div>
      </div>

      <div style={styles.clockContainer}>
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
