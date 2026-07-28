import React, { useMemo } from 'react';

import cyanImage from '@/assets/images/26_images/26-07/26-07-27/cyan.webp';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

// Authentic Prussian Blue & Sun-Exposed Paper Palette
const INK = '#F5F9F8A9';                 // Creamy, unexposed paper silhouette
const VEIN = 'rgba(14, 34, 61, 0.45)';       // Darker, unexposed leaf skeleton lines
const PAPER_LIGHT = '#254E7D91';         // Sun-washed hot center
const PAPER_MID = '#16365C61';           // Classic Prussian blue
const PAPER_DEEP = '#08162910';          // Rich, dense chemical borders (thick hand-brushed look)

// A highly irregular, organic hand-torn paper shape (500x620)
const DECKLE =
  'M 35,22 C 110,12 210,28 310,15 C 390,5 440,18 465,35 C 490,65 475,150 482,240 C 490,340 472,420 478,510 C 482,565 455,595 390,602 C 310,610 205,592 115,605 C 55,612 22,585 15,530 C 5,450 18,350 10,250 C 4,160 12,85 35,22 Z';

export const assets = [cyanImage];

const CyanotypeClock: React.FC = React.memo(() => {
  const now = useSecondClock();

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return {
      secondDeg: seconds * 6,
      minuteDeg: minutes * 6 + seconds * 0.1,
      hourDeg: hours * 30 + minutes * 0.5,
      isoTime: now.toISOString(),
    };
  }, [now]);

  // Memoize the fern leaflets as they don't change
  const fernLeaflets = useMemo(() => {
    // Centered inside the 500x620 canvas
    const cx = 250;
    const cy = 310;

    // Fern frond built from paired leaflets that taper toward the tip (Scaled up by ~1.4x)
    return Array.from({ length: 8 }, (_, i) => {
      const d = 30 + i * 20;
      const size = 18 - i * 1.8;
      const tilt = 36 - i * 2;
      return (
        <g key={i}>
          <ellipse
            cx={cx - 4}
            cy={cy - d}
            rx={size}
            ry={size * 0.4}
            fill={INK}
            transform={`rotate(${-tilt} ${cx - 4} ${cy - d})`}
          />
          <ellipse
            cx={cx + 4}
            cy={cy - d}
            rx={size}
            ry={size * 0.4}
            fill={INK}
            transform={`rotate(${tilt} ${cx + 4} ${cy - d})`}
          />
        </g>
      );
    });
  }, []);

  // Center points for SVG transforms
  const cx = 250;
  const cy = 310;

  return (
    <main className={styles.container} style={{ backgroundImage: `url(${cyanImage})` }}>
      <time dateTime={isoTime} className={styles.semanticTime}>
        {now.toLocaleTimeString()}
      </time>
      <svg viewBox="0 0 500 620" className={styles.clockSvg}>
        <defs>
          <clipPath id="deckleClip">
            <path d={DECKLE} />
          </clipPath>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={4} seed={42} result="noise" />
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.04 0 0 0 0 0.12 0 0 0 0 0.24 0 0 0 0.45 0" />
          </filter>
          <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="5" dy="12" stdDeviation="10" floodColor="#060503" floodOpacity="0.75" />
          </filter>
          <radialGradient id="wash" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor={PAPER_LIGHT} />
            <stop offset="55%" stopColor={PAPER_MID} />
            <stop offset="88%" stopColor={PAPER_DEEP} />
            <stop offset="100%" stopColor="#040b14" />
          </radialGradient>
        </defs>
        <path d={DECKLE} fill="none" filter="url(#dropshadow)" />
        <g clipPath="url(#deckleClip)">
          <rect x={0} y={0} width={500} height={620} fill="url(#wash)" />
          <rect x={0} y={0} width={500} height={620} filter="url(#grain)" opacity={0.6} />
          <path d={DECKLE} fill="none" stroke={PAPER_DEEP} strokeWidth={40} opacity={0.85} filter="blur(6px)" />
          <path d={DECKLE} fill="none" stroke="#03080f" strokeWidth={15} opacity={0.5} filter="blur(2px)" />
          <g transform={`rotate(${hourDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy} Q ${cx - 16} ${cy - 60} ${cx} ${cy - 125} Q ${cx + 16} ${cy - 60} ${cx} ${cy} Z`}
              fill={INK}
              opacity={0.95}
              style={{ filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.15))' }}
            />
            <line x1={cx} y1={cy} x2={cx} y2={cy - 122} stroke={VEIN} strokeWidth={1.5} strokeLinecap="round" />
          </g>
          <g transform={`rotate(${minuteDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy} Q ${cx - 1} ${cy - 90} ${cx} ${cy - 185}`}
              fill="none"
              stroke={INK}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.95}
            />
            {fernLeaflets}
          </g>
          <g transform={`rotate(${secondDeg} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy + 30} Q ${cx + 8} ${cy - 60} ${cx - 6} ${cy - 160} Q ${cx - 12} ${cy - 200} ${cx} ${cy - 230}`}
              fill="none"
              stroke={INK}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.85}
            />
            {[0.12, 0.32, 0.52, 0.70, 0.86].map((f, i) => {
              const yy = cy + 30 - f * 260;
              const xx = cx - f * 6;
              return <circle key={i} cx={xx} cy={yy} r={4.5 - f * 2} fill={INK} opacity={0.75} />;
            })}
          </g>
        </g>
      </svg>
    </main>
  );
});

CyanotypeClock.displayName = 'CyanotypeClock_26_07_27';

export default CyanotypeClock;