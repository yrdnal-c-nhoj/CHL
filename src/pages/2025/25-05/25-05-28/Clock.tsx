import React from 'react';

import circleFont from '@/assets/fonts/25fonts/25-05-28-circle.ttf';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [circleFont];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'circle-local', fontUrl: circleFont },
];

const clockPositions = [
  { top: '10%', left: '10%' },
  { top: '10%', left: '90%' },
  { top: '90%', left: '10%' },
  { top: '90%', left: '90%' },
];

const SingleClock: React.FC<{ time: Date; positionStyle: React.CSSProperties }> = ({ time, positionStyle }) => {
  const ms = time.getMilliseconds();
  const s = time.getSeconds() + ms / 1000;
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  const hourAngle = h * 30;
  const minAngle = m * 6;
  const secAngle = s * 6;

  return (
    <div style={positionStyle} className={styles.clockWrapper}>
      <svg viewBox="0 0 100 100" className={styles.clockSvg}>
        <circle cx="50" cy="50" r="45" className={styles.faceRing} />
        {[...Array(12)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 30} 50 50)`}>
            <line x1="50" y1="5" x2="50" y2="8" className={styles.tick} />
            <text
              x="50"
              y="14"
              className={styles.number}
              style={{ transform: `rotate(-${i * 30}deg)` }}
            >
              {i === 0 ? 12 : i}
            </text>
          </g>
        ))}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="22"
          className={styles.hourHand}
          style={{ transform: `rotate(${hourAngle}deg)` }}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          className={styles.minuteHand}
          style={{ transform: `rotate(${minAngle}deg)` }}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="-1000"
          className={styles.secondHand}
          style={{ transform: `rotate(${secAngle}deg)` }}
        />
        <circle cx="50" cy="50" r="1.5" className={styles.centerPin} />
      </svg>
    </div>
  );
};

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      {clockPositions.map((pos, i) => (
        <SingleClock key={i} time={time} positionStyle={pos} />
      ))}
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_28';

export default MemoizedClock;
