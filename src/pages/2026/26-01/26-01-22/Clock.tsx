import { memo, useMemo } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import backgroundUrl from '@/assets/images/26_images/26-01/26-01-22/1974.jpg';
import digitTextureUrl from '@/assets/images/26_images/26-01/26-01-22/liq.webp';
import fontUrl from '@/assets/fonts/26fonts/26-01-22-1974.ttf?url';
import styles from './Clock.module.css';

export const assets = [backgroundUrl, digitTextureUrl, fontUrl];

const FONT_FAMILY = '1974';

const fontConfigs = [{ fontFamily: FONT_FAMILY, fontUrl }];

const DynamicClock =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSmoothClock();
  const dateTime = time.toISOString();

  const timeString = useMemo(() => [time.getHours(), time.getMinutes(), time.getSeconds()]
    .map((n) => n.toString().padStart(2, '0'))
    .join(''), [time]);

  return (
    <main className={styles.container} style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <time dateTime={dateTime} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.digitsRow}>
        <time dateTime={dateTime}>
          {timeString.split('').map((char, i) => (
            <div key={i} className={styles.digitBox}>
              <div className={styles.digit} style={{ backgroundImage: `url(${digitTextureUrl})` }}>{char}</div>
            </div>
          ))}
        </time>
      </div>
    </main>
  );
};

const MemoizedDynamicClock = memo(DynamicClock);
MemoizedDynamicClock.displayName = 'Clock_26_01_22';
export default MemoizedDynamicClock;
