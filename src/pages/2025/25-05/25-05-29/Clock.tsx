import watchFont from '@/assets/fonts/25fonts/25-05-29-watch.ttf';
import gearsGif from '@/assets/images/25_images/25-05/25-05-29/gears-13950_128.gif';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { memo, useEffect, useState } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports (Required for preloading pipeline)
export const assets = [gearsGif, watchFont];

const DIGIT_MAP: { [key: string]: string } = {
  '0': 'ZERO',
  '1': 'ONE',
  '2': 'TWO',
  '3': 'THREE',
  '4': 'FOUR',
  '5': 'FIVE',
  '6': 'SIX',
  '7': 'SEVEN',
  '8': 'EIGHT',
  '9': 'NINE',
};

const Clock =  () => {
  // 2. Use canonical font loader
  useSuspenseFontLoader([
    { fontFamily: 'WatchFont', fontUrl: watchFont },
  ]);

  const time = useSecondClock(); // Use canonical hook for time
  const [hoursDigits, setHoursDigits] = useState<string[]>([]);
  const [minutesDigits, setMinutesDigits] = useState<string[]>([]);
  const [secondsDigits, setSecondsDigits] = useState<string[]>([]);

  // 3. Update time digits when the time changes
  useEffect(() => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    setHoursDigits(hours.split(''));
    setMinutesDigits(minutes.split(''));
    setSecondsDigits(seconds.split(''));
  }, [time]);

  // Background styles remain the same
  const backgroundStyle = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#0066cc', // Blue background
    backgroundImage: `url(${gearsGif})`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    pointerEvents: 'none',
  };

  return (
    // 4. Use semantic <main> and add accessibility <time> element
    <main className={styles.container}>
      {/* Background Layers */}
      <div
        aria-hidden="true"
        style={{
          ...backgroundStyle,
          backgroundSize: '22vw 18vw',
          opacity: 0.3,
          zIndex: 5,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          ...backgroundStyle,
          backgroundSize: '21vw 17vw',
          opacity: 0.35,
          zIndex: 4,
        }}
      />

      {/* Accessible time for screen readers */}
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.clock}>
        <div className={styles.unit} id="hours">
          <div className={styles.value}>
            {hoursDigits.map((d, i) => (
              <span key={i} className={styles.digitBox}>
                {DIGIT_MAP[d]}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.unit} id="minutes">
          <div className={styles.value}>
            {minutesDigits.map((d, i) => (
              <span key={i} className={styles.digitBox}>
                {DIGIT_MAP[d]}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.unit} id="seconds">
          <div className={styles.value}>
            {secondsDigits.map((d, i) => (
              <span key={i} className={styles.digitBox}>
                {DIGIT_MAP[d]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

// 5. Memoize component and add display name for compliance
const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_05_29';

export default MemoizedClock;
