import myFontUrl from '@/assets/fonts/25fonts/25-08-20-go.otf?url';
import bgImage from '@/assets/images/25_images/25-08/25-08-20/24.webp'; // background image
import SRTime from '@/components/SRTime';
import { useClockAngles } from '@/hooks/useClockAngles';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

export const assets = [bgImage, myFontUrl];
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
const AnalogClock: React.FC<{ time: Date; zone: string; clockSize: number }> = ({
  time,
  zone,
  clockSize,
}) => {  
  const zonedTime = useMemo(() => {
    // Create a formatter for the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric',
    });
    // Get the time parts in the target zone and construct a new Date object
    const parts = formatter.formatToParts(time);
    const find = (type: string) => parts.find(p => p.type === type)?.value ?? '0';
    return new Date(time.getFullYear(), time.getMonth(), time.getDate(), parseInt(find('hour'), 10), parseInt(find('minute'), 10), parseInt(find('second'), 10));
  }, [time, zone]);
  const { hourAngle, minAngle, secAngle } = useClockAngles(zonedTime);

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
};

const WorldClockGrid =  () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'MyCustomFont', fontUrl: myFontUrl }],
    [],
  );

  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const isMobile = dimensions.width < 768;
  const cols = isMobile ? 6 : 12;
  const rows = isMobile ? 4 : 2;

  const clockSize =
    Math.min((dimensions.width - 20) / cols, (dimensions.height - 20) / rows) -
    10;

  return (
    <main
      className={styles.container}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <SRTime time={time} />
      {TIMEZONES.map((zone) => (
        <AnalogClock key={zone} time={time} zone={zone} clockSize={clockSize} />
      ))}
    </main>
  );
};

const MemoizedClock = React.memo(WorldClockGrid);
MemoizedClock.displayName = 'Clock_25_08_20';
export default MemoizedClock;
