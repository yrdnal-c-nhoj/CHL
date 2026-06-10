import clockFont from '@/assets/fonts/26fonts/26-06-05.ttf?url';
import brainGif from '@/assets/images/26_images/26-06/26-06-05/brain.webp';
import sliceImg from '@/assets/images/26_images/26-06/26-06-05/slice.webp';
import type { FontConfig } from '@/types/clock';
import { calculateAngles } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import { useMemo } from 'react';

import styles from './Clock.module.css';

export const assets = [brainGif, sliceImg, clockFont];

const Clock: React.FC = () => {
  const time = useClockTime();
  
  const fontConfigs: FontConfig[] = useMemo(() => [
    {
      fontFamily: 'ClockFont_26_06_05',
      fontUrl: clockFont,
    },
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const { hour, minute, second } = useMemo(() => calculateAngles(time), [time]);
  const isoTime = useMemo(() => time.toISOString(), [time]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.overlay} />

      <time dateTime={isoTime} className={styles.analogClock}>
        <div className={styles.face}>
        
          <div 
            className={`${styles.hand} ${styles.hour}`} 
            style={{ '--rotation': `${hour}deg` } as React.CSSProperties} 
          />
          <div 
            className={`${styles.hand} ${styles.minute}`} 
            style={{ '--rotation': `${minute}deg` } as React.CSSProperties} 
          />
          <div 
            className={`${styles.hand} ${styles.second}`} 
            style={{ '--rotation': `${second}deg` } as React.CSSProperties} 
          />
          <div className={styles.centerDot} />
        </div>
      </time>
    </div>
  );
};

export default Clock;
