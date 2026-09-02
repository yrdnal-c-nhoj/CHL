import { memo, useMemo } from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { BackgroundGrid } from './BackgroundGrid';
import styles from './Clock.module.css';

export const assets = [];

const fontConfigs = [{ fontFamily: 'CustomClockFont', fontUrl: '' }];

const TicTacToeClock = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClock();

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return {
      h1: Math.floor(displayHours / 10),
      h2: displayHours % 10,
      m1: Math.floor(minutes / 10),
      m2: minutes % 10,
      s1: Math.floor(seconds / 10),
      s2: seconds % 10,
      ms1: 0,
      ampm,
    };
  };

  const displayTime = useMemo(() => formatTime(time), [time]);

  const timeValues = useMemo(() => [
    displayTime.h1, displayTime.h2, displayTime.m1, displayTime.m2,
    displayTime.s1, displayTime.s2, displayTime.ms1,
    ...displayTime.ampm,
  ], [displayTime]);

  return (
    <BackgroundGrid>
      <main className={styles.container}>
        <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>
        <div className={styles.grid}>
          {timeValues.map((value, index) => {
            const isEven = index % 2 === 0;
            const color = isEven ? '#ff4444' : '#4444ff';
            const shadowColor = isEven ? '255, 68, 68' : '68, 68, 255';

            return (
              <div
                key={index}
                className={styles.cell}
                style={{ color, textShadow: `0 0 10px rgba(${shadowColor}, 0.5)` }}
                aria-hidden="true"
              >
                {value}
              </div>
            );
          })}
        </div>
      </main>
    </BackgroundGrid>
  );
};

const MemoizedTicTacToeClock = memo(TicTacToeClock);
MemoizedTicTacToeClock.displayName = 'Clock_26_01_09';
export default MemoizedTicTacToeClock;
