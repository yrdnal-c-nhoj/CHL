import { useEffect } from 'react';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import paradeVideo from '@/assets/images/26_images/26-10/26-10-17/parade.webm';

import styles from './Clock.module.css';

export const assets = [paradeVideo];

const pad = (n: number): string => String(n).padStart(2, '0');

const Clock_26_10_17 = () => {
  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Diplomata+SC&display=swap';

    document.head.append(preconnect, stylesheet);
    return () => {
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  const time = useClock();
  const hours = time.getHours() % 12 || 12;
  const isPM = time.getHours() >= 12;
  const h = pad(hours);
  const m = pad(time.getMinutes());

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundVideo}
        src={paradeVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <SRTime time={time} />
      <time className={styles.digitalClock}>
        <span className={styles.digitBox}>{h[0]}</span>
        <span className={styles.digitBox}>{h[1]}</span>
        <span className={styles.colon}>:</span>
        <span className={styles.digitBox}>{m[0]}</span>
        <span className={styles.digitBox}>{m[1]}</span>
        <span className={styles.ampm}>{isPM ? 'PM' : 'AM'}</span>
      </time>
    </main>
  );
};

Clock_26_10_17.displayName = 'Clock_26_10_17';

export default Clock_26_10_17;
