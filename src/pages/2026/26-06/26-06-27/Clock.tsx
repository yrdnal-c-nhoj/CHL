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
// Scaled coordinates up to an 800x800 internal grid system
const generateNumbers = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const number = i + 1;
    if (number % 3 === 0) {
      const angle = number * 30; // 30 degrees per hour
      // Center is now 400, 400. Radius is expanded to 280 to accommodate large font padding
      const x = 400 + 280 * Math.sin((angle * Math.PI) / 180);
      const y = 400 - 280 * Math.cos((angle * Math.PI) / 180);
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
    const timerId = setInterval(() => setNow(new Date()), 16);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
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
        width="400"
        height="400"
        viewBox="0 0 800 800"
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

        {/* Hands — Center point shifted to 400 400 */}
        <g>
          <line
            x1="400" y1="400" x2="400" y2="260"
            style={{ ...styles.hand, ...styles.hourHand }}
            transform={`rotate(${hourDegrees} 400 400)`}
          />
          <line
            x1="400" y1="400" x2="400" y2="180"
            style={{ ...styles.hand, ...styles.minuteHand }}
            transform={`rotate(${minuteDegrees} 400 400)`}
          />
          <line
            x1="400" y1="400" x2="400" y2="140"
            style={{ ...styles.hand, ...styles.secondHand }}
            transform={`rotate(${secondDegrees} 400 400)`}
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
    backgroundColor: '#000',
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
    fontSize: '43vh',
    fill: '#359C45',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    userSelect: 'none',
    opacity: 0.6,
    filter: 'drop-shadow(0 4px 0px rgba(233, 220, 220, 0.7))',
  },
  hand: {
    strokeLinecap: 'round',
    opacity: 0.6,
    filter: 'drop-shadow(-3px 4px 0px rgba(233, 220, 220, 0.88))',
  },
  hourHand: {
    strokeWidth: 66,
    stroke: '#359C45',
  },
  minuteHand: {
    strokeWidth: 42,
    stroke: '#359C45',
  },
  secondHand: {
    strokeWidth: 16,
    stroke: '#359C45',
  },
};

export default AnalogClock;