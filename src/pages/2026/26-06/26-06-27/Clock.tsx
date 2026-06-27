import chandelierBg from '@/assets/images/26_images/26-06/26-06-27/clover.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useState } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-06-27.otf?url';

export const assets = [chandelierBg, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_27',
    fontUrl,
  },
];

// --- Helper for generating clock numerals ---
const generateNumbers = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const angle = (i + 1) * 30; // 30 degrees per hour
    const x = 100 + 80 * Math.sin((angle * Math.PI) / 180);
    const y = 100 - 80 * Math.cos((angle * Math.PI) / 180);
    return {
      key: i,
      x,
      y,
      number: i + 1,
    };
  });
};

const AnalogClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const [now, setNow] = useState(new Date());
  const clockNumbers = useMemo(() => generateNumbers(), []);

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // Smooth hand movements
  const s = now.getSeconds() + now.getMilliseconds() / 1000;
  const m = now.getMinutes() + s / 60;
  const h = now.getHours() + m / 60;

  const secondDegrees = (s / 60) * 360;
  const minuteDegrees = (m / 60) * 360;
  const hourDegrees = (h / 12) * 360;

  return (
    <main style={styles.container}>
      <svg
        width="300"
        height="300"
        viewBox="0 0 200 200"
        style={styles.analogClock}
      >
        <defs>
          <filter id="glow-light">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Image */}
        <image href={chandelierBg} height="200" width="200" />

        {/* Clock Face */}
        <g>
          {clockNumbers.map(({ key, x, y, number }) => (
            <text key={key} x={x} y={y} style={styles.numberText}>
              {number}
            </text>
          ))}
        </g>

        {/* Center Pin */}
        <circle cx="100" cy="100" r="4" style={styles.centerPin} />

        {/* Hands */}
        <g>
          <line
            x1="100" y1="100" x2="100" y2="65"
            style={{ ...styles.hand, ...styles.hourHand }}
            transform={`rotate(${hourDegrees} 100 100)`}
          />
          <line
            x1="100" y1="100" x2="100" y2="45"
            style={{ ...styles.hand, ...styles.minuteHand }}
            transform={`rotate(${minuteDegrees} 100 100)`}
          />
          <line
            x1="100" y1="100" x2="100" y2="35"
            style={{ ...styles.hand, ...styles.secondHand }}
            transform={`rotate(${secondDegrees} 100 100)`}
          />
        </g>
      </svg>
    </main>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  analogClock: {
    width: '70vmin',
    height: '70vmin',
    maxWidth: '600px',
    maxHeight: '600px',
    filter: 'saturate(1.2) contrast(1.1) drop-shadow(0 0 10px rgba(0,0,0,0.5))',
  },
  numberText: {
    fontFamily: "'ClockFont_26_06_27', monospace",
    fontSize: '20px',
    fill: '#F3E8DA',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    userSelect: 'none',
    filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.7))',
  },
  centerPin: {
    fill: '#D99946',
    stroke: '#F3E8DA',
    strokeWidth: '1.5',
  },
  hand: {
    strokeLinecap: 'round',
    stroke: '#F3E8DA',
    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.8))',
  },
  hourHand: {
    strokeWidth: 4,
    stroke: '#EDE1D2',
  },
  minuteHand: {
    strokeWidth: 3,
  },
  secondHand: {
    strokeWidth: 1.5,
    filter: 'url(#glow-light) drop-shadow(0 0 2px rgba(0,0,0,0.8))',
  },
};

export default AnalogClock;