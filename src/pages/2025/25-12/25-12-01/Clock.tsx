// DigitalClock.jsx
import React, { useState, useEffect } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import bgImg from '../../../../assets/images/2025/25-12/25-12-01/shark.webp';
import clockfoont12012 from '../../../../assets/fonts/2025/25-12-01-shark.ttf?url';
import type { FontConfig } from '../../../../types/clock';

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_2025_12_01',
    fontUrl: clockfoont12012,
  },
];

export default function DigitalClock() {
  const [time, setTime] = useState(() => new Date());

  // Use standardized font loader
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (num) => num.toString().padStart(2, '0');
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  const containerStyle = {
    width: '100vw',
    height: '100dvh', // THIS IS THE FIX
    minHeight: '100dvh', // extra safety
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'ClockFont_2025_12_01, sans-serif',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  };

  const digitStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '0.6em',
    fontSize: '10vh', // keep vh here — looks great and scales nicely
    color: '#EE4747',
    textShadow: '0 0 1vh rgba(0,0,0,0.9)',
    // Remove the huge paddingTop — that's pushing it down too far!
    // paddingTop: "45vh",   ← DELETE THIS LINE
  };

  const digits = `${hours}${minutes}${seconds}`;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {digits.split('').map((d, i) => (
          <div key={i} style={digitStyle}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
