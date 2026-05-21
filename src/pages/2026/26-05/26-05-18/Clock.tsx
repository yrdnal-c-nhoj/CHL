import React, { memo, useEffect, useRef } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

import bellImage2 from '@/assets/images/26_images/26-05/26-05-18/accordion.webp';
import accordionBg from '@/assets/images/26_images/26-05/26-05-18/accordion2.webp';
import customFont from '@/assets/fonts/26fonts/26-05-18.ttf?url';

// ======================================================
// Config & Constants
// ======================================================

const CLOCK_CONFIG = {
  NUMERAL_RADIUS: 40,
} as const;

type HandType = 'hour' | 'minute' | 'second';

const HAND_DIMENSIONS: Record<
  HandType,
  { width: string; height: string; zIndex: number }
> = {
  hour: { width: '0.9vmin', height: '10vmin', zIndex: 3 },
  minute: { width: '0.7vmin', height: '16vmin', zIndex: 4 },
  second: { width: '0.2vmin', height: '22vmin', zIndex: 5 },
};

// Pre-calculate positions statically once at runtime
const NUMERALS = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;
  const angle = (number / 12) * Math.PI * 2;
  return {
    number,
    x: 50 + CLOCK_CONFIG.NUMERAL_RADIUS * Math.sin(angle),
    y: 50 - CLOCK_CONFIG.NUMERAL_RADIUS * Math.cos(angle),
    rotation: (number / 12) * 360,
  };
});

export const assets = [bellImage2, accordionBg];

// ======================================================
// Pure Presentational Components (Render Once)
// ======================================================

const BackgroundLayers = memo(() => (
  <>
    <div
      className={styles.backgroundLayer}
      style={{
        backgroundImage: `url(${accordionBg})`,
        backgroundSize: '30vmin',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        zIndex: -1,
      }}
    />
    <div
      className={styles.backgroundLayer}
      style={{ opacity: 0.12, zIndex: 0 }}
    />
    <div
      className={styles.backgroundLayer}
      style={{
        backgroundImage: `url(${bellImage2})`,
        backgroundSize: '90vmin',
        zIndex: 1,
      }}
    />
  </>
));
BackgroundLayers.displayName = 'BackgroundLayers';

const ClockNumerals = memo(() => (
  <>
    {NUMERALS.map(({ number, x, y, rotation }) => (
      <div
        key={number}
        className={styles.numeral}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate3d(-50%,-50%,0) rotate(${rotation}deg)`,
        }}
      >
        {number}
      </div>
    ))}
  </>
));
ClockNumerals.displayName = 'ClockNumerals';

const ClockHand = memo<{ type: HandType }>(({ type }) => {
  const { width, height, zIndex } = HAND_DIMENSIONS[type];
  return (
    <div
      className={`${styles.hand} ${styles[`${type}Hand`]}`}
      style={{
        width,
        height,
        zIndex,
        transform: `translate3d(-50%,0,0) rotate(var(--${type}-rotation, 0deg))`,
      }}
    />
  );
});
ClockHand.displayName = 'ClockHand';

const CenterDot = memo(() => <div className={styles.centerDot} />);
CenterDot.displayName = 'CenterDot';

// ======================================================
// Main Component
// ======================================================

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
  },
];

const AnalogClock: React.FC = () => {
  const currentTime = useSecondClock();
  const clockFaceRef = useRef<HTMLDivElement>(null);

  useSuspenseFontLoader(FONT_CONFIGS);

  // Directly update CSS properties on tick without re-rendering React sub-trees
  useEffect(() => {
    if (!clockFaceRef.current) return;

    const ms = currentTime.getMilliseconds();
    const seconds = currentTime.getSeconds() + ms / 1000;
    const minutes = currentTime.getMinutes() + seconds / 60;
    const hours = (currentTime.getHours() % 12) + minutes / 60;

    const face = clockFaceRef.current;
    face.style.setProperty('--hour-rotation', `${hours * 30}deg`);
    face.style.setProperty('--minute-rotation', `${minutes * 6}deg`);
    face.style.setProperty('--second-rotation', `${seconds * 6}deg`);
  }, [currentTime]);

  return (
    <div className={styles.container}>
      <BackgroundLayers />

      <div ref={clockFaceRef} className={styles.clockFace}>
        <time dateTime={currentTime.toISOString()} className={styles.timeA11y}>
          {currentTime.toTimeString()}
        </time>

        <ClockNumerals />

        <ClockHand type="hour" />
        <ClockHand type="minute" />
        <ClockHand type="second" />

        <CenterDot />
      </div>
    </div>
  );
};

export default memo(AnalogClock);
