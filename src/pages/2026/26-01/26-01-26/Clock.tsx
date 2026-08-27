import { memo, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import top260126Font from '@/assets/fonts/26fonts/26-01-26-halfb.ttf?url';
import bottom260126Font from '@/assets/fonts/26fonts/26-01-26-halft.ttf?url';
import styles from './Clock.module.css';

export const assets = [top260126Font, bottom260126Font];

const fontConfigs = useMemo(() => [
  { fontFamily: 'TopFont', fontUrl: top260126Font, options: { display: 'block' } },
  { fontFamily: 'BottomFont', fontUrl: bottom260126Font, options: { display: 'block' } },
], []);

const DynamicComponent =  () => {
  useSuspenseFontLoader(fontConfigs);
  const clockTime = useSecondClock();

  const timeString = useMemo(() => clockTime.toLocaleTimeString('en-US', {
    hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).replace(/[: ]/g, ''), [clockTime]);

  if (!clockTime) return null;

  return (
    <main className={styles.container}>
      <time dateTime={clockTime.toISOString()} className={styles.srOnly}>{clockTime.toLocaleTimeString()}</time>

      <div className={styles.clockWrapper}>
        <div className={styles.horizontalClock} style={{ fontFamily: 'TopFont', textShadow: '-0px 34.5dvh 1.7dvh rgba(0, 0, 0, 0.9), 0px 2px 12px rgb(240, 7, 7)' }}>
          {timeString.split('').map((d, i) => (
            <div key={`l-${i}`} className={styles.digitBox}>{d}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div className={styles.clockWrapper}>
        <div className={styles.horizontalClock} style={{ fontFamily: 'BottomFont', textShadow: '0px -34.5dvh 1.7dvh rgba(0, 0, 0, 0.9), 0px -2px 12px rgb(238, 9, 9)' }}>
          {timeString.split('').map((d, i) => (
            <div key={`r-${i}`} className={styles.digitBox}>{d}</div>
          ))}
        </div>
      </div>
    </main>
  );
};

const MemoizedDynamicComponent = memo(DynamicComponent);
MemoizedDynamicComponent.displayName = 'Clock_26_01_26';
export default MemoizedDynamicComponent;
