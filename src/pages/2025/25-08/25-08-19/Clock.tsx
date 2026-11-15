import React from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/25fonts/25-08-19-cas.ttf?url';
import bgUrl from '@/assets/images/25_images/25-08/25-08-19/ap.jpeg';

export const assets = [fontUrl, bgUrl];

const fontConfig = {
  fontFamily: 'ClockFont_25_08_19',
  fontUrl,
};

const Clock_25_08_19 = () => {
  const time = useClock();
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeDigits = (hours + minutes + seconds).split('');

  return (
    <main
      className={styles.container}
      style={{ '--bg-image': `url(${bgUrl})` }}
    >
      <div className={styles.bgLayer} aria-hidden="true" />
      <SRTime time={time} />
      <div className={styles.pendulum} aria-hidden="true">
        {timeDigits.map((digit, index) => (
          <div
            key={index}
            className={`${styles.piece} ${
              index === 0
                ? styles.pieceFirstChild
                : index === timeDigits.length - 1
                  ? styles.pieceLastChild
                  : ''
            }`}
            data-digit={digit}
          />
        ))}
      </div>
    </main>
  );
};

Clock_25_08_19.displayName = 'Clock_25_08_19';
export default Clock_25_08_19;
