import { useState, useEffect, useRef } from 'react';
import SRTime from '@/components/SRTime';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundVideo from '@/assets/images/26_images/26-10/26-10-07/chess.webm';
import font from '@/assets/fonts/26fonts/26-10-07.otf?url';
import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const FONT_FAMILY = 'ClockFont_26_10_07';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl: font,
};

const pad = (value: number, length: number): string =>
  value.toString().padStart(length, '0');

const Clock_26_10_07 = () => {
  useSuspenseFontLoader([fontConfig]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => undefined);
        }
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 50);

  const hours = pad(time.getHours(), 2);
  const minutes = pad(time.getMinutes(), 2);
  const seconds = pad(time.getSeconds(), 2);
  const milliseconds = pad(time.getMilliseconds(), 3);

  return (
    <main className={styles.container}>
      <video
        ref={videoRef}
        src={backgroundVideo}
        autoPlay={!prefersReducedMotion}
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.digitalDisplay} aria-hidden="true">
        <span className={styles.digitGroup}>
          {hours.split('').map((digit, i) => (
            <span key={`h${i}`} className={styles.digitBox}>
              {digit}
            </span>
          ))}
        </span>
        <span className={`${styles.separator} ${styles.colon}`}>:</span>
        <span className={styles.digitGroup}>
          {minutes.split('').map((digit, i) => (
            <span key={`m${i}`} className={styles.digitBox}>
              {digit}
            </span>
          ))}
        </span>
        <span className={`${styles.separator} ${styles.colon}`}>:</span>
        <span className={styles.digitGroup}>
          {seconds.split('').map((digit, i) => (
            <span key={`s${i}`} className={styles.digitBox}>
              {digit}
            </span>
          ))}
        </span>
        <span className={`${styles.separator} ${styles.period}`}>.</span>
        <span className={styles.digitGroup}>
          {milliseconds.split('').map((digit, i) => (
            <span key={`ms${i}`} className={styles.digitBox}>
              {digit}
            </span>
          ))}
        </span>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_07.displayName = 'Clock_26_10_07';

export default Clock_26_10_07;
