// DigitalClock.jsx
import React, { useState, useEffect } from 'react';

import clockfoont12012 from '@/assets/fonts/2025/25-12-01-shark.ttf?url';
import bgImg from '@/assets/images/2025/25-12/25-12-01/shark.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

const fontConfigs: FontConfig[] = [
    {
        fontFamily: 'ClockFont_2025_12_01',
        fontUrl: clockfoont12012,
    },
  {
    fontFamily: 'ClockFont_2025_12_01',
    fontUrl: clockfoont12012,
  },
];
const DigitalClock: React.FC = () => {
    const [time, setTime] = useState(() => new Date());

    // Use standardized font loader
    useSuspenseFontLoader(fontConfigs);
export default function DigitalClock() {
  const [time, setTime] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
  // Use standardized font loader
  useSuspenseFontLoader(fontConfigs);

    const formatTime = (num: number) => num.toString().padStart(2, '0');
    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const seconds = formatTime(time.getSeconds());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

    const containerStyle: React.CSSProperties = {
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
  const formatTime = (num: number) => num.toString().padStart(2, '0');
  const hours = formatTime(time.getHours());
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

    const digitStyle: React.CSSProperties = {
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
  const containerStyle: React.CSSProperties = {
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

    const digits = `${hours}${minutes}${seconds}`;
  const digitStyle: React.CSSProperties = {
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
};
  const digits = `${hours}${minutes}${seconds}`;

export default DigitalClock;
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
