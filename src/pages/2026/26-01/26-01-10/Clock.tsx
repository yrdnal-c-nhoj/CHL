import d25090116font from '@/assets/fonts/26fonts/26-01-10-bit.ttf?url';
import bgImage from '@/assets/images/26_images/26-01/26-01-10/moo.gif';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

// 1. Asset Exports
export const assets = [bgImage, d25090116font];

// 2. Font Configuration
const fontConfigs: FontConfig[] = [
  { fontFamily: 'MyD25090116font', fontUrl: d25090116font },
];

const ClockComponent =  () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  // LETTER MAPPING
  const digitToLetter = {
    0: ' ',
    1: 'd',
    2: 'a',
    3: 'M',
    4: 'x',
    5: 'k',
    6: 'm',
    7: 'n',
    8: 'o',
    9: 't',
  };

  const { hours, minutes, seconds } = useMemo(() => {
    return {
      hours: String(time.getHours()).padStart(2, '0'),
      minutes: String(time.getMinutes()).padStart(2, '0'),
      seconds: String(time.getSeconds()).padStart(2, '0'),
    };
  }, [time]);

  // RENDER HELPERS
  const renderUnit = (value) => (
    <div className={styles.unitGroup}>
      {value.split('').map((digit, i) => (
        <div key={i} className={styles.digitBox}>
          {digitToLetter[digit] || digit}
        </div>
      ))}
    </div>
  );

  return (
    <main className={styles.container}>
      {/* Accessible time element */}
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>
      {/* Mirror background effect */}
      <div className={styles.background}>
        <div
          className={styles.leftBackground}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div
          className={styles.rightBackground}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </div>
      {/* Clock content layer */}
      <div className={styles.layout}>
        {renderUnit(hours)}
        {renderUnit(minutes)}
        {renderUnit(seconds)}
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_01_10';

export default MemoizedClock;
