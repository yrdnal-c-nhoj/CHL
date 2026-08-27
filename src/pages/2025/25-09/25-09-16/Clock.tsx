import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// 1. Asset Exports
import d250916font from '@/assets/fonts/25fonts/25-09-16-baud.ttf?url';
import bgImage from '@/assets/images/25_images/25-09/25-09-16/bg.jpg';

export const assets = [bgImage, d250916font];

// 2. Styles
import styles from './Clock.module.css';

// --- Font Configuration ---
const fontConfigs: FontConfig[] = [
  { fontFamily: 'MyD250916font', fontUrl: d250916font },
];

// 3. Main Component
const ClockComponent =  () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  // Format time
  const { hours, minutes, seconds } = useMemo(() => {
    const h = String(((time.getHours() + 11) % 12) + 1).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return { hours: h, minutes: m, seconds: s };
  }, [time]);

  const renderDigits = (value: string) =>
    value.split('').map((d, i) => (
      <div key={i} className={styles.digitBox}>
        {d}
      </div>
    ));

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.face}>
        <span className={styles.srOnly}>{time.toLocaleTimeString()}</span>
        {renderDigits(hours)}
        <div className={styles.digitBox}>:</div>
        {renderDigits(minutes)}
        <div className={styles.digitBox}>:</div>
        {renderDigits(seconds)}
      </time>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_09_16';

export default MemoizedClock;
