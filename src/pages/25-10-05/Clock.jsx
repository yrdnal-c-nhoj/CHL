import React, { useState, useEffect } from 'react';
import bgImage from './16a.png';
import clockBgImage from './16.png';
import digitalFontUrl from './dode.ttf';
import analogFontUrl from './do.ttf';

export default function HexAnalogClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update viewport on resize/orientation
  useEffect(() => {
    const updateSize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    updateSize();
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  // Load assets (fonts + images)
  useEffect(() => {
    async function loadAssets() {
      try {
        const digitalFont = new FontFace('DigitalFont', `url(${digitalFontUrl})`);
        const analogFont = new FontFace('AnalogFont', `url(${analogFontUrl})`);
        await Promise.all([digitalFont.load(), analogFont.load()]);
        document.fonts.add(digitalFont);
        document.fonts.add(analogFont);

        const loadImage = (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
          });
        await Promise.all([loadImage(bgImage), loadImage(clockBgImage)]);

        setReady(true);
      } catch (err) {
        console.error('Asset load error:', err);
        setReady(true);
      }
    }
    loadAssets();
  }, []);

  // Clock tick
  useEffect(() => {
    if (!ready) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 100);
    return () => clearInterval(timer);
  }, [ready]);

  if (!ready) {
    return (
      <div
        style={{
          height: '100dvh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
          fontSize: '4vh',
          fontFamily: 'sans-serif',
        }}
      >
        Loading Hex Clock…
      </div>
    );
  }

  const unixTime = Math.floor(currentTime.getTime() / 1000);
  const hexTime = unixTime.toString(16).toUpperCase();

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();

  const clockSize = Math.min(viewport.width, viewport.height) * 0.8;
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
      height: '100dvh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5vh',
      padding: '0.5vh',
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: 0,
    },
    card: {
      background: '#fff',
      border: '4px solid #0E0404FF',
      borderRadius: '12px',
      padding: '1vh 2vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: '6vh',
      zIndex: 2,
      maxWidth: '95vw',
      transform: 'translateY(-3vh)', // <-- moves digital clock up
    },
    progressContainer: {
      width: '100%',
      height: '6vh',
      background: 'rgba(204, 187, 170, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      width: `${fractionOfDay * 100}%`,
      background: 'linear-gradient(90deg, #0b8d49, #EC2308FF, #0533ea)',
      transition: 'width 0.1s linear',
      border: '0.5px solid #000',
      boxSizing: 'border-box',
    },
    styleTag: `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
    svg: { width: clockSize, height: clockSize, zIndex: 2, position: 'relative' },
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
      width: '80dvw',
      height: '80dvw',
      maxWidth: '80dvh',
      maxHeight: '80dvh',
      borderRadius: '50%',
    },
    hexDigitBox: (index) => ({
      width: '8vw',
      height: '6vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'DigitalFont',
      fontSize: '7vh',
      background: 'linear-gradient(90deg, #00FF00, #FF0000, #0000FF, #FFFF00)',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      backgroundSize: '300% 100%',
      animation: 'gradientShift 1.5s linear infinite',
      animationDelay: `${index * 0.2}s`,
      textShadow: '1px 0px 0 #000',
    }),
    centerDot: { fill: '#E04807FF' },
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
