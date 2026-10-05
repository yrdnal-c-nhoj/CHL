import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { memo, useMemo } from 'react';

import cinnabarImage from '@/assets/images/26_images/26-10/26-10-04/cinnabar.webp';
import mercImage from '@/assets/images/26_images/26-10/26-10-04/merc.webp';
import fontUrl from '@/assets/fonts/26fonts/26-10-04.otf';

import styles from './Clock.module.css';

export const assets = [
  cinnabarImage,
  mercImage,
  fontUrl,
];

const FONT_FAMILY = 'ClockFont_26_09_02';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl,
};

const Clock_26_10_04 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(50);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const milliseconds = time.getMilliseconds();

    const seconds = time.getSeconds() + milliseconds / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    return {
      hourAngle: hours * 30,
      minuteAngle: minutes * 6,
      secondAngle: seconds * 6,
    };
  }, [time]);

  const numerals = useMemo(() => {
    const ROMAN_NUMERALS = [
      'XII',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'XI',
    ] as const;

    const RADIUS_PERCENT = 42;

    return ROMAN_NUMERALS.map((numeral, index) => {
      const angle = (index / 12) * 2 * Math.PI;

      return {
        numeral,
        x: 50 + RADIUS_PERCENT * Math.sin(angle),
        y: 50 - RADIUS_PERCENT * Math.cos(angle),
        rotation: (index / 12) * 360,
      };
    });
  }, []);

  return (
    <main
      className={styles.container}
      style={
        {
          '--merc-border': `url(${mercImage})`,
        } as React.CSSProperties
      }
    >
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${cinnabarImage})`,
        }}
      />

      <div className={styles.mercuryTop} />
      <div className={styles.mercuryBottom} />
      <div className={styles.mercuryLeft} />
      <div className={styles.mercuryRight} />

      <div className={styles.clockFace}>
        {numerals.map(({ numeral, x, y, rotation }) => (
          <div
            key={numeral}
            className={styles.numeral}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `
                translate(-50%, -50%)
                rotate(${rotation}deg)
              `,
            }}
          >
            {numeral}
          </div>
        ))}

        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '1.4vmin',
              '--hand-height': '22vmin',
              '--hand-rotate': `${hourAngle}deg`,
              '--hand-color': '#ffffff',
            } as React.CSSProperties
          }
        />

        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '1vmin',
              '--hand-height': '32vmin',
              '--hand-rotate': `${minuteAngle}deg`,
              '--hand-color': '#ffffff',
            } as React.CSSProperties
          }
        />

        <div
          className={styles.hand}
          style={
            {
              '--hand-width': '0.4vmin',
              '--hand-height': '36vmin',
              '--hand-rotate': `${secondAngle}deg`,
              '--hand-color': '#a12235',
            } as React.CSSProperties
          }
        />

        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

const MemoizedClock = memo(Clock_26_10_04);

MemoizedClock.displayName = 'Clock_26_10_04';

export default MemoizedClock;