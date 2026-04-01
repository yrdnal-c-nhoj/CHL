import React, { useMemo } from 'react';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import { calculateAngles } from '../../../../utils/clockUtils';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import StarsBackground from './StarsBackground';
import styles from './Clock.module.css';

// Internal coordinate system constants
const BASE_SIZE = 500;
const CENTER = BASE_SIZE / 2;
const RADIUS = 160;
const TEXT_RADIUS = 200;

const hourNumbers = ["12", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ExoClock',
    fontUrl: new URL('../../../assets/fonts/26-03-24-exo.ttf', import.meta.url).href,
    options: {
      weight: 'normal',
      style: 'normal',
    }
  }
];

const Clock: React.FC = () => {
  // Load fonts via Suspense-compatible loader
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();
  const angles = calculateAngles(time);

  const staticElements = useMemo(() => (
    <>
      {/* Hour numbers with custom font */}
      {hourNumbers.map((num, i) => {
        const angle = ((i * 30) - 90) * (Math.PI / 180);
        const x = CENTER + Math.cos(angle) * TEXT_RADIUS;
        const y = CENTER + Math.sin(angle) * TEXT_RADIUS;
        const rotation = i * 30;

        return (
          <text
            key={`num-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className={styles.hourNumber}
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${x}px ${y}px`,
            }}
          >
            {num}
          </text>
        );
      })}

    
    </>
  ), []);

  return (
    <div className={styles.container}>
      <StarsBackground />
      <div className={styles.clockContent}>
        <svg 
          className={styles.clockSvg}
          viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
        >
          <defs>
            <filter id="digitShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="1" dy="1" stdDeviation="0" floodColor="#0D0D0D" floodOpacity="1"/>
            </filter>
          </defs>
          {staticElements}

          {/* Hour hand - tapered */}
          {(() => {
            const angle = (angles.hour - 90) * Math.PI / 180;
            const x2 = CENTER + Math.cos(angle) * 300;
            const y2 = CENTER + Math.sin(angle) * 300;
            const perpAngle = angle + Math.PI / 2;
            const w = 8;
            const xOff = Math.cos(perpAngle) * w / 2;
            const yOff = Math.sin(perpAngle) * w / 2;
            return (
              <path
                d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
                className={styles.hourHand}
              />
            );
          })()}

          {/* Minute hand - tapered */}
          {(() => {
            const angle = (angles.minute - 90) * Math.PI / 180;
            const x2 = CENTER + Math.cos(angle) * 800;
            const y2 = CENTER + Math.sin(angle) * 800;
            const perpAngle = angle + Math.PI / 2;
            const w = 5;
            const xOff = Math.cos(perpAngle) * w / 2;
            const yOff = Math.sin(perpAngle) * w / 2;
            return (
              <path
                d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
                className={styles.minuteHand}
              />
            );
          })()}

          {/* Second hand - tapered */}
          {(() => {
            const angle = (angles.second - 90) * Math.PI / 180;
            const x2 = CENTER + Math.cos(angle) * 1000;
            const y2 = CENTER + Math.sin(angle) * 1000;
            const perpAngle = angle + Math.PI / 2;
            const w = 2;
            const xOff = Math.cos(perpAngle) * w / 2;
            const yOff = Math.sin(perpAngle) * w / 2;
            return (
              <path
                d={`M ${CENTER - xOff} ${CENTER - yOff} L ${x2} ${y2} L ${CENTER + xOff} ${CENTER + yOff} Z`}
                className={styles.secondHand}
              />
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

export default Clock;