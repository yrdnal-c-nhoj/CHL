import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { memo, useMemo } from 'react';
import peacockImage from '@/assets/images/26_images/26-09/26-09-03/peacock.webp';
import eyesImage from '@/assets/images/26_images/26-09/26-09-03/eyes.webp';
import fontUrl from '@/assets/fonts/26fonts/26-09-03.otf?url';
import styles from './Clock.module.css';

export const assets = [peacockImage, eyesImage, fontUrl];

const FONT_FAMILY = 'ClockFont_26_09_03';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl,
};

const Clock_26_09_03 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(50);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds() + ms / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return {
      hourAngle: h * 30,
      minuteAngle: m * 6,
      secondAngle: s * 6,
    };
  }, [time]);

  const numerals = useMemo(() => {
    const ROMAN_NUMERALS = [
      'XII', 'I', 'II', 'III', 'IV', 'V',
      'VI', 'VII', 'VIII', 'IX', 'X', 'XI',
    ] as const;
    const RADIUS_PERCENT = 42;
    return ROMAN_NUMERALS.map((numeral, i) => {
      const angle = (i / 12) * 2 * Math.PI;
      const x = 50 + RADIUS_PERCENT * Math.sin(angle);
      const y = 50 - RADIUS_PERCENT * Math.cos(angle);
      const rotation = (i / 12) * 360;
      return { numeral, x, y, rotation, key: numeral };
    });
  }, []);

  return (
    <main className={styles.container}>
      <div
        className={styles.backgroundLayer}
        style={{ backgroundImage: `url(${peacockImage})` }}
      />
      <div
        className={styles.gridOverlay}
        style={{
          backgroundImage: `url(${eyesImage})`,
          backgroundSize: '190px 100px',
        }}
      />

      <div className={styles.clockFace}>
        {numerals.map(({ numeral, x, y, rotation, key }) => (
          <div
            key={key}
            className={styles.numeral}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
          >
            {numeral}
          </div>
        ))}

        <div
          className={styles.hand}
          style={{
            '--hand-width': '1.4vmin',
            '--hand-height': '22vmin',
            '--hand-rotate': `${hourAngle}deg`,
            '--hand-color': '#ffffff',
          } as React.CSSProperties}
        />
        <div
          className={styles.hand}
          style={{
            '--hand-width': '1vmin',
            '--hand-height': '32vmin',
            '--hand-rotate': `${minuteAngle}deg`,
            '--hand-color': '#ffffff',
          } as React.CSSProperties}
        />
        <div
          className={styles.hand}
          style={{
            '--hand-width': '0.4vmin',
            '--hand-height': '36vmin',
            '--hand-rotate': `${secondAngle}deg`,
            '--hand-color': '#a12235',
          } as React.CSSProperties}
        />
        <div className={styles.centerDot} />
      </div>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_09_03);
MemoizedClock.displayName = 'Clock_26_09_03';

export default MemoizedClock;
