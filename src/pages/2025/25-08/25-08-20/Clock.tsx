import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import myFontUrl from '../../../../assets/fonts/25-08-20-go.otf?url';
import bgImage from '../../../../assets/images/2025/25-08/25-08-20/24.webp'; // background image
import styles from './Clock.module.css';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Hong_Kong',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  'Europe/Istanbul',
  'Europe/Athens',
];

// Analog clock component
const AnalogClock: React.FC<{ zone: string; clockSize: number }> = ({ zone, clockSize }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const local = new Date(time.toLocaleString('en-US', { timeZone: zone }));
  const seconds = local.getSeconds();
  const minutes = local.getMinutes();
  const hours = local.getHours();

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  const hourHandHeight = clockSize * 0.4;
  const minuteHandHeight = clockSize * 0.55;
  const secondHandHeight = clockSize * 0.66;

  const handShadow = 'drop-shadow(-4px 0px white) drop-shadow(4px -0px pink)';

  return (
    <div className={styles.clockContainer}>
      <div 
        className={styles.clockFace} 
        style={{ width: `${clockSize}px`, height: `${clockSize}px` }}
      >
        <div
          className={styles.hand}
          style={{
            width: '3px',
            height: `${hourHandHeight}px`,
            background: '#FC9905FF',
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            filter: handShadow,
          }}
        />
        <div
          className={styles.hand}
          style={{
            width: '2px',
            height: `${minuteHandHeight}px`,
            background: '#F7EF06FF',
            transform: `translate(-50%, -100%) rotate(${minAngle}deg)`,
            filter: handShadow,
          }}
        />
        <div
          className={styles.hand}
          style={{
            width: '1px',
            height: `${secondHandHeight}px`,
            background: 'red',
            transform: `translate(-50%, -100%) rotate(${secAngle}deg)`,
            filter: handShadow,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '6px',
            height: '6px',
            background: '#444',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div
        className={styles.label}
        style={{
          fontSize: `${Math.max(8, clockSize * 0.25)}px`,
        }}
      >
        {zone.split('/').pop().replace(/_/g, ' ')}
      </div>
    </div>
  );
}

export default function WorldClockGrid() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'MyCustomFont', fontUrl: myFontUrl }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const handleResize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = dimensions.width < 768;
  const cols = isMobile ? 6 : 12;
  const rows = isMobile ? 4 : 2;

  const clockSize =
    Math.min((dimensions.width - 20) / cols, (dimensions.height - 20) / rows) -
    10;

  return (
    <div 
      className={styles.container}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {TIMEZONES.map((zone) => (
        <AnalogClock
          key={zone}
          zone={zone}
          clockSize={clockSize}
        />
      ))}
    </div>
  );
}
