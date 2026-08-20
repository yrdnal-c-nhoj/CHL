import customFont from '@/assets/fonts/25fonts/25-07-28-gol.ttf?url';
import backgroundImage from '@/assets/images/25_images/25-07/25-07-28/go.gif';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo, memo } from 'react';
import styles from './Clock.module.css';

export const assets = [customFont, backgroundImage];

const Clock =  () => {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'CustomFont',
        fontUrl: customFont,
        options: {
          weight: 'normal',
          style: 'normal',
        },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const getFormattedTime = () => {
    let h = time.getHours() % 12;
    if (h === 0) h = 12;
    const m = time.getMinutes();
    return `${h}${m.toString().padStart(2, '0')}`;
  };

  return (
    <main className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <time dateTime={time.toISOString()} className={styles.time}>
        {getFormattedTime()}
      </time>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_07_28';
export default MemoizedClock;
