import { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundImage from '@/assets/images/25_images/25-04/25-04-14/bricks.webp';
import styles from './Clock.module.css';

export const assets = [backgroundImage];

const BlueBrickClock = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useClock();

  const [time, setTime] = useState({
    hours: currentTime.getHours(),
    minutes: currentTime.getMinutes(),
    seconds: currentTime.getSeconds(),
  });

  const updateClock = useCallback((): void => {
    setTime({
      hours: currentTime.getHours(),
      minutes: currentTime.getMinutes(),
      seconds: currentTime.getSeconds(),
    });
  }, [currentTime]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  const ballStyle = {
    width: '2vw',
    height: '3vw',
    background: 'radial-gradient(circle at 30% 30%, #7d9ac9, #a5c1e6)',
    boxShadow: '0 0 1vw 0.4vw rgba(117, 151, 215, 0.8)',
  };

  const renderBalls = useCallback((count: number) =>
    Array.from({ length: count }, (_, i) => (
      <div key={i} className={styles.pop} style={ballStyle} />
    )),
    [ballStyle],
  );

  return (
    <main className={styles.container} style={{
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100dvh',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          transform: 'rotate(180deg)',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '33% 33%',
          backgroundRepeat: 'repeat',
          filter: 'blur(4px) hue-rotate(180deg)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {['hours', 'seconds', 'minutes'].map((unit) => (
          <div
            key={unit}
            style={{ position: 'relative', width: '90vw', marginBottom: '2dvh' }}
          >
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 0.2vw)',
                justifyContent: 'center',
                alignContent: 'center',
                gap: '3vw',
                zIndex: 2,
                pointerEvents: 'none',
                height: '23dvh',
              }}
            >
              {renderBalls(time[unit])}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const MemoizedBlueBrickClock = memo(BlueBrickClock);
MemoizedBlueBrickClock.displayName = 'Clock_25_04_14';
export default MemoizedBlueBrickClock;
