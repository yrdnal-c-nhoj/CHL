import customFont from '@/assets/fonts/25fonts/25-08-09-box.ttf?url'; // Custom font file
import { useClockAngles } from '@/hooks/useClockAngles';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports
export const assets = [customFont]; // Ensure customFont is correctly preloaded

// Standardized font loading with font-display: swap to avoid FOUC
const fontConfigs = [
  {
    fontFamily: 'MyCustomFont',
    fontUrl: customFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

const ClockComponent =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();
  const { hourAngle, minAngle, secAngle } = useClockAngles(time);

  // Render multi-angle clock hand
  const renderMultiAngleHand = (
    angleDeg: number,
    radialTotal: number,
    perpStep: number,
    segments: number,
    stroke: string,
    strokeWidth: number,
    keyPrefix: string,
    startPerpRight: boolean = true,
  ) => {
    const segmentsAdjusted = Math.max(
      3,
      segments % 2 === 0 ? segments + 1 : segments,
    );
    const cx = 50;
    const cy = 50;
    const rad = (angleDeg * Math.PI) / 180;
    const radialCount = Math.ceil(segmentsAdjusted / 2);
    const radialStep = radialTotal / radialCount;
    let perpSign = startPerpRight ? 1 : -1;

    const points = [[cx, cy]];
    let curX = cx;
    let curY = cy;

    for (let i = 0; i < segmentsAdjusted; i++) {
      if (i % 2 === 0) {
        curX += Math.cos(rad) * radialStep;
        curY += Math.sin(rad) * radialStep;
      } else {
        const perpDir = rad + (Math.PI / 2) * perpSign;
        curX += Math.cos(perpDir) * perpStep;
        curY += Math.sin(perpDir) * perpStep;
        perpSign = -perpSign;
      }
      points.push([curX, curY]);
    }

    return (
      <g key={keyPrefix}>
        {points.slice(0, -1).map(([x1, y1], i) => (
          <line
            key={`${keyPrefix}-seg-${i}`}
            x1={x1.toFixed(4)}
            y1={y1.toFixed(4)}
            x2={points[i + 1][0].toFixed(4)}
            y2={points[i + 1][1].toFixed(4)}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  };

  // Compute tick positions for grid lines
  const computeTickPositions = () => {
    const topXs = Array.from({ length: 15 }, (_, i) => 10 + (i * 80) / 14);
    const leftYs = Array.from(
      { length: 13 },
      (_, i) => 95 - ((i + 1) * 90) / 14,
    );
    return { topXs, leftYs };
  };

  // Render grid lines
  const renderGridLines = () => {
    const { topXs, leftYs } = computeTickPositions();
    return [
      ...topXs.map((x, idx) => (
        <line
          key={`v-${idx}`}
          x1={x.toFixed(4)}
          y1={5}
          x2={x.toFixed(4)}
          y2={95}
          stroke="#F3F4F7FF"
          strokeWidth={0.4}
        />
      )),
      ...leftYs.map((y, idx) => (
        <line
          key={`h-${idx}`}
          x1={5}
          y1={y.toFixed(4)}
          x2={95}
          y2={y.toFixed(4)}
          stroke="#F3F4F7FF"
          strokeWidth={0.4}
        />
      )),
    ];
  };

  // Generate hour markers
  const generateHourMarkers = () => {
    const positions = [
      { num: 12, x: 50, y: 15 },
      { num: 1, x: 75, y: 20 },
      { num: 2, x: 85, y: 35 },
      { num: 3, x: 85, y: 50 },
      { num: 4, x: 85, y: 65 },
      { num: 5, x: 75, y: 80 },
      { num: 6, x: 50, y: 85 },
      { num: 7, x: 25, y: 80 },
      { num: 8, x: 15, y: 65 },
      { num: 9, x: 15, y: 50 },
      { num: 10, x: 15, y: 35 },
      { num: 11, x: 25, y: 20 },
    ];

    return positions.map((pos) => (
      <text
        key={pos.num}
        x={pos.x}
        y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#22FB05FF"
        filter="url(#multiShadow)"
        style={{
          fontFamily: 'MyCustomFont, system-ui, sans-serif', // Use the loaded custom font
          fontSize: '2.5vmin', // Standardize on vmin for responsive sizing
          userSelect: 'none',
        }}
      >
        {pos.num}
      </text>
    ));
  };

  // Use the canonical angles from useClockAngles
  const handColor = '#22FB05FF';
  const handStroke = 0.4;

  return (
    <main className={styles.container}>
      {/* Accessible time element */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <svg
        className={styles.clockSvg}
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id="multiShadow">
            <feDropShadow
              dx="1.5"
              dy="1.5"
              stdDeviation="0.53"
              floodColor="#540579FF"
            />
            <feDropShadow
              dx="1.5"
              dy="1.5"
              stdDeviation="0.65"
              floodColor="#480462FF"
            />
          </filter>
        </defs>

        <rect width="100" height="100" fill="transparent" />
        {renderGridLines()}
        {generateHourMarkers()}
        {renderMultiAngleHand(
          hourAngle,
          18,
          6,
          11,
          handColor,
          handStroke,
          'hour',
          true,
        )}
        {renderMultiAngleHand(
          minAngle,
          28,
          8,
          15,
          handColor,
          handStroke,
          'minute',
          false,
        )}
        {renderMultiAngleHand(
          secAngle,
          36,
          10,
          19,
          handColor,
          handStroke,
          'second',
          true,
        )}
        <circle cx="50" cy="50" r="0.4" fill={handColor} />
      </svg>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_08_09';

export default MemoizedClock;
