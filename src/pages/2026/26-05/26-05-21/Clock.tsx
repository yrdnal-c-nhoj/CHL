import React, { useMemo, memo } from 'react';
import canisBg from '@/assets/images/26_images/26-05/26-05-21/canis.webp';
import canisComponent from '@/assets/images/26_images/26-05/26-05-21/canis2.webp';
import canisComponent4 from '@/assets/images/26_images/26-05/26-05-21/canis4.webp';
import fontUrl from '@/assets/fonts/26fonts/26-05-21.otf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

export const assets = [canisBg, canisComponent, fontUrl];

export const fontConfigs: FontConfig[] = [
  {
    fontFamily: '26-05-21',
    fontUrl,
  },
];

const BackgroundLayers =  () => (
  <div
    className={styles.backgroundImage}
    style={{ backgroundImage: `url(${canisBg})` }}
  />
);

const ComponentLayers =  () => (
  <>
    <div
      className={styles.componentImage1}
      style={{ backgroundImage: `url(${canisComponent})` }}
    />

    <div
      className={styles.componentImage3}
      style={{ backgroundImage: `url(${canisComponent4})` }}
    />
  </>
);

const ClockFace: React.FC<{ fontFamily: string }> = ({ fontFamily }) => {
  const time = useSmoothClock();

  const { hourDeg, minuteDeg, secondDeg, isoTime } = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds() + ms / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;

    return {
      secondDeg: s * 6,
      minuteDeg: m * 6,
      hourDeg: h * 30,
      isoTime: time.toISOString(),
    };
  }, [time]);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className={styles.clockWrapper}>
      <time className={styles.face} dateTime={isoTime}>
        {numbers.map((num) => (
          <span
            key={num}
            className={styles.number}
            style={{
              transform: `translate(-50%, -50%) rotate(${num * 30}deg) translateY(-35dvh)`,
              fontFamily: `${fontFamily}, sans-serif`,
            }}
          >
            {num}
          </span>
        ))}
        <div
          className={styles.hourHand}
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        <div
          className={styles.minuteHand}
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        <div
          className={styles.secondHand}
          style={{ transform: `rotate(${secondDeg}deg)` }}
        />
        <div className={styles.centerDot} />
      </time>
    </div>
  );
};

const AnalogClock =  () => {
  useSuspenseFontLoader(fontConfigs);

  return (
    <main className={styles.container}>
      <time dateTime={new Date().toISOString()} className={styles.srOnly}>{new Date().toLocaleTimeString()}</time>
      <BackgroundLayers />
      <ComponentLayers />
      <ClockFace fontFamily="26-05-21" />
    </main>
  );
};

const MemoizedAnalogClock = memo(AnalogClock);
MemoizedAnalogClock.displayName = 'Clock_26_05_21';
export default MemoizedAnalogClock;
