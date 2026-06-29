import chandelierBg from '@/assets/images/26_images/26-06/26-06-27/clover.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useRef, useState } from 'react';

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
    const number = i + 1;
    if (number % 3 === 0) {
      const angle = number * 30; // 30 degrees per hour
      const x = 100 + 80 * Math.sin((angle * Math.PI) / 180);
      const y = 100 - 80 * Math.cos((angle * Math.PI) / 180);
      return {
        key: i,
        x,
        y,
        number,
      };
    }
    return null;
  }).filter(Boolean) as { key: number; x: number; y: number; number: number }[];
};

const AnalogClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [now, setNow] = useState(new Date());
  const clockNumbers = useMemo(() => generateNumbers(), []);

  useEffect(() => {
    // Sync with requestAnimationFrame or high frequency to capture milliseconds smoothly
    const timerId = setInterval(() => setNow(new Date()), 16);
    return () => clearInterval(timerId);
  }, []);

  // Attempt to play the video programmatically on mount
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // We want to ensure it plays, so we call play()
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.error("Video play failed:", error));
      }
    }
  }, []);

  // Smooth hand movements
  const s = now.getSeconds() + now.getMilliseconds() / 1000;
  const m = now.getMinutes() + s / 60;
  const h = now.getHours() + m / 60;

  const secondDegrees = (s / 60) * 360;
  const minuteDegrees = (m / 60) * 360;
  const hourDegrees = (h / 12) * 360;

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        src={chandelierBg}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={styles.backgroundVideo}
      />
      <svg
        width="300"
        height="300"
        viewBox="0 0 200 200"
        style={styles.analogClock}
      >
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
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000', // Fallback color if video fails
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundVideo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    height: '100dvh',
    objectFit: 'cover',
    zIndex: 1,
  },
  analogClock: {
    width: '90vmin',
    height: '90vmin',
    maxWidth: '800px',
    maxHeight: '800px',
    zIndex: 2,
    position: 'relative',
  },
  numberText: {
    fontFamily: "'ClockFont_26_06_27', monospace",
    fontSize: '12px', // Scaled for viewBox units, will resize with SVG
    fill: '#F3E8DA',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    userSelect: 'none',
    opacity: 0.6,
    filter: 'drop-shadow(0 1px 0px rgba(233, 220, 220, 0.7))',
  },
  centerPin: {
    stroke: '#F3E8DA',
    strokeWidth: '1.0',
    opacity: 0.6,
  },
  hand: {
    strokeLinecap: 'round',
    stroke: '#F3E8DA',
    opacity: 0.6,
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
    stroke: '#F3E8DA', // A lighter color for visibility
  },
};

export default AnalogClock;