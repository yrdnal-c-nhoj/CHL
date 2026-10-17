import { useEffect } from 'react';
import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';

import mummyImage from '@/assets/images/26_images/26-10/26-10-13/mummy.webp';

import styles from './Clock.module.css';

export const assets = [mummyImage];

const formatTime = (time: Date): string =>
  `${String(time.getHours()).padStart(2, '0')}${String(
    time.getMinutes(),
  ).padStart(2, '0')}`;

function Digits({ time }: { time: string }) {
  return (
    <div className={styles.clockDigits}>
      {time.split('').map((digit, index) => (
        <span className={styles.clockDigit} key={index}>
          {digit}
        </span>
      ))}
    </div>
  );
}

function Track({ time }: { time: string }) {
  const COPIES = 24;

  return (
    <div className={styles.clockTrack}>
      {[0, 1].map((copy) => (
        <div className={styles.clockGroup} key={copy}>
          {Array.from({ length: COPIES }, (_, index) => (
            <Digits time={time} key={index} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Clock_26_10_13() {
  const time = useClock();
  const display = formatTime(time);

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

      <time dateTime={time.toISOString()} hidden>
        {display}
      </time>

      <div className={styles.clockDesktop}>
        {Array.from({ length: 5 }, (_, index) => (
          <div className={styles.clockLane} key={index}>
            <Track time={display} />
          </div>
        ))}
      </div>

      <div className={styles.clockMobile}>
        {Array.from({ length: 3 }, (_, index) => (
          <div className={styles.clockLane} key={index}>
            <Track time={display} />
          </div>
        ))}
      </div>
    </main>
  );
}

Clock_26_10_13.displayName = 'Clock_26_10_13';

export default Clock_26_10_13;
