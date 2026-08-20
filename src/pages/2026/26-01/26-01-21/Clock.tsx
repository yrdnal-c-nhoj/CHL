import { memo, useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import backgroundImage from '@/assets/images/26_images/26-01/26-01-21/fllap.webp';
import tileImage from '@/assets/images/26_images/26-01/26-01-21/flap.webp';
import custom260121Font from '@/assets/fonts/26fonts/26-01-21-migrate.ttf?url';
import styles from './Clock.module.css';

export const assets = [backgroundImage, tileImage, custom260121Font];

const fontFamilyName = 'Custom260121Font';

const fontConfigs = [
  { fontFamily: fontFamilyName, fontUrl: custom260121Font },
];

const ClockNumbers = memo(({ fontFamily }) => (
  <>
    {[...Array(12)].map((_, i) => (
      <div key={i} className={styles.numberSlot} style={{ transform: `rotate(${i * 30}deg)` }}>
        <span className={styles.number} style={{ fontFamily }}>{i === 0 ? 12 : i}</span>
      </div>
    ))}
  </>
));
ClockNumbers.displayName = 'ClockNumbers';

const AnalogBirdMigrateClock =  () => {
  const clockTime = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const hourDeg = (clockTime.getHours() % 12) * 30 + clockTime.getMinutes() * 0.5;
  const minuteDeg = clockTime.getMinutes() * 6;

  return (
    <main className={styles.container}>
      <time dateTime={clockTime.toISOString()} className={styles.srOnly}>{clockTime.toLocaleTimeString()}</time>

      <div className={styles.gpuLayer}>
        <div className={styles.backgroundLayer} style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className={styles.backgroundLayer} style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className={styles.tileBase} style={{ backgroundImage: `url(${tileImage})`, backgroundSize: '600px', opacity: 0.8 }} />
      </div>

      <div className={styles.clockFace}>
        <ClockNumbers fontFamily={fontFamilyName} />

        <div className={styles.hand} style={{ height: '24%', width: 'min(1.8vw, 3px)', transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
        <div className={styles.hand} style={{ height: '45%', width: 'min(1.2vw, 2px)', transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} />

        <div className={styles.pin} />
      </div>
    </main>
  );
};

const MemoizedAnalogBirdMigrateClock = memo(AnalogBirdMigrateClock);
MemoizedAnalogBirdMigrateClock.displayName = 'Clock_26_01_21';
export default MemoizedAnalogBirdMigrateClock;
