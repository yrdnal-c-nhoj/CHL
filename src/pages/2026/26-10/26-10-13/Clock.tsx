import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';

import mummyImage from '@/assets/images/26_images/26-10/26-10-13/mummy.webp';

import styles from './Clock.module.css';

export const assets = [mummyImage];

const formatDigits = (num: number): string => num.toString().padStart(2, '0');

function Clock_26_10_13() {
  const time = useClock();

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());
  const seconds = formatDigits(time.getSeconds());

  // Load Metal Mania Google Font with preconnect (not in assets array —
  // Google Fonts are loaded via <link>, see AGENTS.md "Using a Google Font").
  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap';

    document.head.append(preconnect, stylesheet);

    return () => {
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  return (
    <main
      className={styles.clockField}
      style={
        {
          '--background-image': `url(${mummyImage})`,
        } as CSSProperties
      }
    >
      <SRTime time={time} />

      <time dateTime={time.toISOString()} className={styles.digitalClock}>
        <span className={styles.digitBox}>{hours[0] ?? '0'}</span>
        <span className={styles.digitBox}>{hours[1] ?? '0'}</span>
        <span className={styles.digitBox}>{minutes[0] ?? '0'}</span>
        <span className={styles.digitBox}>{minutes[1] ?? '0'}</span>
        <span className={styles.digitBox}>{seconds[0] ?? '0'}</span>
        <span className={styles.digitBox}>{seconds[1] ?? '0'}</span>
      </time>
    </main>
  );
}

Clock_26_10_13.displayName = 'Clock_26_10_13';

export default Clock_26_10_13;
