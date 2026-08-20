import { memo, useEffect, useRef, useMemo } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import KinaFont from '@/assets/fonts/25fonts/25-05-09-Kina.ttf?url';
import swurl from '@/assets/images/25_images/25-05/25-05-09/swurl.gif';
import styles from './Clock.module.css';

export const assets = [KinaFont, swurl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'KinaFont',
    fontUrl: KinaFont,
    options: { weight: 'normal', style: 'normal' },
  },
];

const Clock =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSecondClock();
  const clockRef = useRef<HTMLDivElement>(null);

  const clockSizeVW = 100;
  const clockMaxRem = 60;
  const radiusVW = 20;

  const ms = time.getMilliseconds();
  const second = time.getSeconds() + ms / 1000;
  const minute = time.getMinutes() + second / 60;
  const hour = time.getHours() + minute / 60;
  const secondDeg = second * 6;
  const minuteDeg = minute * 6;
  const hourDeg = (hour % 12) * 30;

  return (
    <main className={styles.container} style={{
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100dvh',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'KinaFont', sans-serif",
    }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <img
        decoding="async"
        loading="lazy"
        src={swurl}
        alt="Swirling background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.5,
          filter: 'hue-rotate(290deg) contrast(200%) saturate(200%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={clockRef}
        id="clock"
        className={styles.spin}
        style={{
          position: 'relative',
          width: '100vw',
          maxWidth: `${clockMaxRem}rem`,
          height: '100vw',
          maxHeight: `${clockMaxRem}rem`,
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0.5rem',
            height: '0.5rem',
            backgroundColor: '#000',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}
        />

        {[12, 3, 6, 9].map((num) => {
          const angle = ((num - 3) / 12) * 2 * Math.PI;
          const x = Math.cos(angle);
          const y = Math.sin(angle);
          return (
            <div
              key={num}
              className={styles.number}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                fontSize: '7rem',
                color: '#f199c8',
                textShadow: '5px 5px #100f10, -2px -2px white, 6px 6px white',
                fontFamily: "'KinaFont', sans-serif",
                pointerEvents: 'none',
                zIndex: 1,
                opacity: 0.7,
                transform: `translate(calc(${x} * ${radiusVW}vw), calc(${y} * ${radiusVW}vw)) translate(-50%, -50%)`,
                userSelect: 'none',
              }}
            >
              {num}
            </div>
          );
        })}

        <div
          id="hour"
          className={`${styles.hand} ${styles.hour}`}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '2rem',
            height: '8rem',
            backgroundColor: '#FB8906FF',
            color: '#F87D0AFF',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            zIndex: 4,
          }}
        />
        <div
          id="minute"
          className={`${styles.hand} ${styles.minute}`}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '1rem',
            height: '12rem',
            backgroundColor: '#f0df6e',
            color: '#f0df6e',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
            zIndex: 5,
          }}
        />
        <div
          id="second"
          className={`${styles.hand} ${styles.second}`}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '0.5rem',
            height: '150vh',
            backgroundColor: '#ee0909',
            color: '#ee0909',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) rotate(${secondDeg}deg)`,
            zIndex: 6,
          }}
        />
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_05_09';
export default MemoizedClock;
