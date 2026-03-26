import React, { useMemo } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { calculateAngles } from '../../../utils/clockUtils';
import styles from './Clock.module.css';

const BASE_SIZE = 500;
const CENTER = BASE_SIZE / 2;
const RADIUS = 200;
const TEXT_RADIUS = 160;

const hourNumbers = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const numberColorClasses = [
  styles.hourNumber12,
  styles.hourNumber1,
  styles.hourNumber2,
  styles.hourNumber3,
  styles.hourNumber4,
  styles.hourNumber5,
  styles.hourNumber6,
  styles.hourNumber7,
  styles.hourNumber8,
  styles.hourNumber9,
  styles.hourNumber10,
  styles.hourNumber11,
];

const tickColorClasses = [
  [styles.hourTickPink, styles.minuteTickPink],
  [styles.hourTickOrange, styles.minuteTickOrange],
  [styles.hourTickYellow, styles.minuteTickYellow],
  [styles.hourTickGreen, styles.minuteTickGreen],
  [styles.hourTickBlue, styles.minuteTickBlue],
  [styles.hourTickPurple, styles.minuteTickPurple],
];

const Clock: React.FC = () => {
  const time = useSecondClock();
  const angles = calculateAngles(time);

  const tickMarks = useMemo(() => {
    const ticks: React.ReactElement[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const isHour = i % 5 === 0;
      const innerRadius = isHour ? RADIUS - 15 : RADIUS - 8;
      const outerRadius = RADIUS;
      const x1 = CENTER + Math.cos(angle) * innerRadius;
      const y1 = CENTER + Math.sin(angle) * innerRadius;
      const x2 = CENTER + Math.cos(angle) * outerRadius;
      const y2 = CENTER + Math.sin(angle) * outerRadius;
      const colorIdx = i % 6;
      const tickClasses = tickColorClasses[colorIdx] || tickColorClasses[0];
      const className = isHour ? tickClasses![0] : tickClasses![1];

      ticks.push(
        <line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className={className}
        />
      );
    }
    return ticks;
  }, []);

  const hourNumbersElements = useMemo(() => {
    return hourNumbers.map((num, i) => {
      const angle = ((i * 30) - 90) * (Math.PI / 180);
      const x = CENTER + Math.cos(angle) * TEXT_RADIUS;
      const y = CENTER + Math.sin(angle) * TEXT_RADIUS;
      return (
        <text
          key={`num-${i}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${styles.hourNumber} ${numberColorClasses[i]}`}
        >
          {num}
        </text>
      );
    });
  }, []);

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
            <stop offset="50%" stopColor="#ffec8b" />
            <stop offset="100%" stopColor="#ffd700" />
          </linearGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={RADIUS} className={styles.clockRing} />
        {tickMarks}
        {hourNumbersElements}
        <circle cx={CENTER} cy={CENTER} r={6} className={styles.centerDot} />

        {(() => {
          const angle = (angles.hour - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 120;
          const y2 = CENTER + Math.sin(angle) * 120;
          const perpAngle = angle + Math.PI / 2;
          const w = 10;
          const xOff = (Math.cos(perpAngle) * w) / 2;
          const yOff = (Math.sin(perpAngle) * w) / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              className={styles.hourHand}
            />
          );
        })()}

        {(() => {
          const angle = (angles.minute - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 170;
          const y2 = CENTER + Math.sin(angle) * 170;
          const perpAngle = angle + Math.PI / 2;
          const w = 6;
          const xOff = (Math.cos(perpAngle) * w) / 2;
          const yOff = (Math.sin(perpAngle) * w) / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              className={styles.minuteHand}
            />
          );
        })()}

        {(() => {
          const angle = (angles.second - 90) * Math.PI / 180;
          const x2 = CENTER + Math.cos(angle) * 180;
          const y2 = CENTER + Math.sin(angle) * 180;
          const perpAngle = angle + Math.PI / 2;
          const w = 3;
          const xOff = (Math.cos(perpAngle) * w) / 2;
          const yOff = (Math.sin(perpAngle) * w) / 2;
          return (
            <path
              d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
              className={styles.secondHand}
            />
          );
        })()}
      </svg>
    </div>
  );
};

export default Clock;

