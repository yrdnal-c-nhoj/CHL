import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import { useEffect, useMemo, useState } from 'react';

import limesImage from '@/assets/images/26_images/26-09/26-09-05/limm.webp';
import limeImage from '@/assets/images/26_images/26-09/26-09-05/lime2.webp';
import limeslImage from '@/assets/images/26_images/26-09/26-09-05/lime3.webp';

import minuteDot from '@/assets/images/26_images/26-09/26-09-05/hour.webp';
import hourDot from '@/assets/images/26_images/26-09/26-09-05/minute.webp';
import secondDot from '@/assets/images/26_images/26-09/26-09-05/second.webp';

import font from '@/assets/fonts/26fonts/26-09-05.ttf?url';

import styles from './Clock.module.css';

export const assets = [
  limesImage,
  limeImage,
  limeslImage,
  hourDot,
  minuteDot,
  secondDot,
  font,
];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_05',
  fontUrl: font,
};

/* -------------------------------------------------------------------------- */
/* Image preload                                                              */
/* -------------------------------------------------------------------------- */

const backgroundImages = [
  limesImage,
  limeImage,
  limeslImage,
];

const preloadImages = async (sources: string[]) => {
  await Promise.all(
    sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image();

          image.onload = async () => {
            try {
              if (image.decode) {
                await image.decode();
              }
            } catch {
              // Image is still usable if decode() is unavailable/fails.
            }

            resolve();
          };

          image.onerror = () => resolve();
          image.src = src;
        }),
    ),
  );
};

const Clock_26_09_05 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const [imagesReady, setImagesReady] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Make sure Chrome has decoded the background images before showing them.  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    preloadImages(backgroundImages).then(() => {
      if (mounted) {
        // Give Chrome one paint cycle after image decoding/layout.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (mounted) {
              setImagesReady(true);
            }
          });
        });
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Smooth analog clock angles                                               */
  /* ------------------------------------------------------------------------ */

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

  return (
    <main
      className={`${styles.container} ${
        imagesReady ? styles.ready : styles.loading
      }`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Background image layers                                            */}
      {/* ------------------------------------------------------------------ */}

      <img
        src={limesImage}
        alt=""
        aria-hidden="true"
        className={styles.backgroundImagePrimary}
        draggable={false}
      />

      <img
        src={limeImage}
        alt=""
        aria-hidden="true"
        className={styles.backgroundImageSecondary}
        draggable={false}
      />

      <img
        src={limeslImage}
        alt=""
        aria-hidden="true"
        className={styles.backgroundImageTertiary}
        draggable={false}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Analog clock                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={
            {
              '--angle': `${hourAngle}deg`,
            } as React.CSSProperties
          }
        >
          <img
            src={hourDot}
            alt=""
            aria-hidden="true"
            className={styles.handDot}
            draggable={false}
          />
        </div>

        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={
            {
              '--angle': `${minuteAngle}deg`,
            } as React.CSSProperties
          }
        >
          <img
            src={minuteDot}
            alt=""
            aria-hidden="true"
            className={styles.handDot}
            draggable={false}
          />
        </div>

        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={
            {
              '--angle': `${secondAngle}deg`,
            } as React.CSSProperties
          }
        >
          <img
            src={secondDot}
            alt=""
            aria-hidden="true"
            className={styles.handDot}
            draggable={false}
          />
        </div>

        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_05.displayName = 'Clock_26_09_05';

export default Clock_26_09_05;