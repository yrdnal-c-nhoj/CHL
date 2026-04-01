import React, { useMemo, useRef, memo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/useSmoothClock';
import skyImage from '@/assets/images/2026/26-03/26-03-22/sky.webp';
import balloonFont from '@/assets/fonts/2026/26-03-22-balloon.ttf';
import styles from './Clock.module.css';

const balloonColors = ['#FF2D2D', '#D4F904', '#32CD32', '#FFCC01FF', '#FF1493', '#FF4500', '#9A6BF9'];

// Shuffled once to ensure colors stay consistent for the session
const staticShuffledColors = [...balloonColors].sort(() => Math.random() - 0.5);

interface BalloonDigitProps {
  char: string;
  color: string;
}

const BalloonDigit = memo(({ char, color }: BalloonDigitProps) => {
  // Physics generated once per mount
  const p = useRef({
    floatSpeed: 3 + Math.random() * 2,
    floatAmplitude: 12 + Math.random() * 10,
    driftSpeed: 4 + Math.random() * 3,
    driftAmplitude: 3 + Math.random() * 1,
    rockSpeed: 2 + Math.random() * 2,
    rockAmplitude: 3 + Math.random() * 3,
    scaleSpeed: 2.5 + Math.random() * 1.5,
    scaleMin: 0.94,
    scaleMax: 1.06,
    delay: Math.random() * -20,
    baseOffsetY: Math.random() * 20 - 10,
    baseOffsetX: Math.random() * 15 - 7.5,
  }).current;

  if (char === ' ') return <span style={{ margin: '0 0.25em' }}>&nbsp;</span>;

  const cssVars = {
    '--float-amp': `${p.floatAmplitude}px`,
    '--drift-amp': `${p.driftAmplitude}px`,
    '--rock-amp': `${p.rockAmplitude}deg`,
    '--scale-min': p.scaleMin,
    '--scale-max': p.scaleMax,
    '--float-speed': `${p.floatSpeed}s`,
    '--drift-speed': `${p.driftSpeed}s`,
    '--rock-speed': `${p.rockSpeed}s`,
    '--scale-speed': `${p.scaleSpeed}s`,
    '--delay': `${p.delay}s`,
    transform: `translate(${p.baseOffsetX}px, ${p.baseOffsetY}px)`,
  } as React.CSSProperties;

  return (
    <span className={styles.balloonWrapper} style={{ margin: '0 4px', ...cssVars }}>
      <span className={styles.balloonFloat}>
        <span className={styles.balloonDrift}>
          <span className={styles.balloonRock}>
            <span className={`${styles.balloonString} ${styles.balloonBreathe}`} style={{ color }}>
              {char}
            </span>
          </span>
        </span>
      </span>
    </span>
  );
});
BalloonDigit.displayName = 'BalloonDigit';

const fontConfigs = [{
  fontFamily: 'Balloon',
  fontUrl: balloonFont,
  options: {
    weight: 'normal',
    style: 'normal'
  }
}];

const VIPParallaxClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  
  const time = useSecondClock();
  const timeString = useMemo(() => {
    return time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
  }, [time]);

  // Helper to render digits with consistent coloring
  const renderDigits = (offset: number) => {
    return timeString.split('').map((char, index) => (
      <BalloonDigit 
        key={`${offset}-${index}`} 
        char={char} 
        color={staticShuffledColors[(index + offset) % staticShuffledColors.length] ?? '#FF2D2D'} 
      />
    ));
  };

  return (
    <div className={styles.stage}>
      <div 
        className={`${styles.layer} ${styles.bg}`} 
        style={{ backgroundImage: `url(${skyImage})` }}
        aria-hidden="true" 
      />
      <div className={`${styles.layer} ${styles.fg}`}>
        <time className={styles.glassTile}>{renderDigits(0)}</time>
        <time className={styles.glassTile}>{renderDigits(2)}</time>
        <time className={styles.glassTile}>{renderDigits(4)}</time>
      </div>
    </div>
  );
};

export default VIPParallaxClock;