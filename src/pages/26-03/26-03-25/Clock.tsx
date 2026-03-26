import React, { useMemo, memo } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { calculateAngles } from '../../../utils/clockUtils';
import styles from './Clock.module.css';

const BASE_SIZE = 500;
const CENTER = BASE_SIZE / 2;
const RADIUS = 200;
const TEXT_RADIUS = 160;

const hourNumbers = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const colors = ['Purple', 'Pink', 'Orange', 'Yellow', 'Green', 'Blue']; // 6 colors for 60 ticks

const ClockFace = memo(() => {
  const ticks = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const angle = i * 6;
      const isHour = i % 5 === 0;
      const length = isHour ? 15 : 8;
      const colorName = colors[i % 6]; // Cycle through the 6 rainbow colors
      const tickClass = isHour ? styles[`hourTick${colorName}`] : styles[`minuteTick${colorName}`];
      
      return (
        <line
          key={`tick-${i}`}
          x1={CENTER} y1={RADIUS - length}
          x2={CENTER} y2={RADIUS}
          className={tickClass}
          transform={`rotate(${angle}, ${CENTER}, ${CENTER})`}
        />
      );
    });
  }, []);

  const numbers = useMemo(() => {
    return hourNumbers.map((num, i) => {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = CENTER + Math.cos(angle) * TEXT_RADIUS;
      const y = CENTER + Math.sin(angle) * TEXT_RADIUS;
      return (
        <text
          key={`num-${num}`}
          x={x} y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${styles.hourNumber} ${styles[`hourNumber${num}`]}`}
        >
          {num}
        </text>
      );
    });
  }, []);

  return <g>{ticks}{numbers}</g>;
});

const Clock: React.FC = () => {
  const time = useSecondClock();
  const { hour, minute, second } = calculateAngles(time);

  return (
    <div className={styles.container}>
      <div className={styles.bgGrid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={styles.bgCell} />
        ))}
      </div>

      <svg className={styles.clockSvg} viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}>
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
        </defs>
        
        <circle cx={CENTER} cy={CENTER} r={RADIUS} className={styles.clockRing} />
        <ClockFace />

        {/* Use 'path' for tapered hands since you liked that look */}
        <line 
          x1={CENTER} y1={CENTER} x2={CENTER} y2={CENTER - 120} 
          className={styles.hourHand}
          transform={`rotate(${hour}, ${CENTER}, ${CENTER})`}
        />
        <line 
          x1={CENTER} y1={CENTER} x2={CENTER} y2={CENTER - 170} 
          className={styles.minuteHand}
          transform={`rotate(${minute}, ${CENTER}, ${CENTER})`}
        />
        <line 
          x1={CENTER} y1={CENTER} x2={CENTER} y2={CENTER - 180} 
          className={styles.secondHand}
          transform={`rotate(${second}, ${CENTER}, ${CENTER})`}
        />

        <circle cx={CENTER} cy={CENTER} r={6} className={styles.centerDot} />
      </svg>
    </div>
  );
};

export default Clock;