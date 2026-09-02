import glassbreak from '@/assets/images/26_images/26-07/26-07-03/kitty.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState, memo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-03.ttf?url';
import styles from './Clock.module.css';

export const assets = [glassbreak, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_19',
    fontUrl,
  },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const DigitalClock =  () => {
  const time = useClock();
  useSuspenseFontLoader(fontConfigs);
  const isMobile = useIsMobile();

  const { hours, minutes, ampm } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();

    const ampm = h >= 12 ? 'pm' : 'am';
    let hours12 = h % 12;
    if (hours12 === 0) hours12 = 12;

    return {
      hours: hours12.toString(),
      minutes: formatTime(m),
      ampm,
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      {/* Current Time Display */}
      <time
        dateTime={time.toISOString()}
        className={styles.digitalClock}
        style={{
          fontFamily: 'ClockFont_26_06_19, monospace',
          fontSize: '8dvh',
          color: '#B4D0F1BF',
          fontVariantNumeric: 'tabular-nums',
          position: 'absolute',
          zIndex: 2,
          ...(isMobile && {
            bottom: '2dvh',
            left: '50%',
            transform: 'translateX(-50%)',
          }),
          ...(!isMobile && {
            bottom: '2dvh',
            right: '2vw',
          }),
        }}
      >
        {hours}:{minutes}
        <span style={{ fontSize: '6dvh', marginLeft: '0.1em' }}>
          {ampm}
        </span>
      </time>
    </main>
  );
};

const MemoizedDigitalClock = memo(DigitalClock);
MemoizedDigitalClock.displayName = 'Clock_26_07_04';
export default MemoizedDigitalClock;
