import React from 'react';

import sproutFontTtf from '@/assets/fonts/25fonts/25-05-26-sprout.ttf?url';
import spr from '@/assets/images/25_images/25-05/25-05-26/spr.gif';
import sprou from '@/assets/images/25_images/25-05/25-05-26/sprou.gif';
import sprout from '@/assets/images/25_images/25-05/25-05-26/sprout.gif';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

export const assets = [spr, sprou, sprout, sproutFontTtf];

const imagePositions = [
  { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
  { top: '50%', left: '10%', transform: 'translate(-50%, -50%)' },
  { top: '50%', left: '90%', transform: 'translate(-50%, -50%)' },
  { top: '40%', left: '70%', transform: 'translate(-50%, -50%) scaleY(-1)' },
  { top: '40%', left: '30%', transform: 'translate(-50%, -50%) scaleY(-1)' },
];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'sprout',
    fontUrl: sproutFontTtf,
    options: { weight: 'normal', style: 'normal' },
  },
];

const ClockComponent = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock(33);

  const pad = (num: number, length: number) => num.toString().padStart(length, '0').split('');

  const h = pad(time.getHours() % 12 || 12, 2);
  const m = pad(time.getMinutes(), 2);
  const s = pad(time.getSeconds(), 2);
  const ms = pad(Math.floor(time.getMilliseconds() / 10), 2);

  const renderDigits = (digits: string[]) =>
    digits.map((d, i) => (
      <div key={i} className={styles.digit}>
        {d}
      </div>
    ));

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
      <div className={styles.bgTiled} />
      <div className={styles.bgCover} />
      <div className={styles.content}>
        {imagePositions.map((pos, i) => (
          <img
            decoding="async"
            loading="lazy"
            key={i}
            src={sprou}
            alt=""
            style={pos}
            className={styles.imageBase}
            role="presentation"
          />
        ))}
        <div
          className={styles.clock}
          role="timer"
          aria-live="off"
          aria-label={`Current time ${h.join('')}:${m.join('')}:${s.join('')}.${ms.join('')}`}
        >
          <div className={styles.timeRow}>{renderDigits(h)}</div>
          <div className={styles.timeRow}>{renderDigits(m)}</div>
          <div className={styles.timeRow}>{renderDigits(s)}</div>
          <div className={styles.timeRow}>{renderDigits(ms)}</div>
        </div>
      </div>
    </main>
  );
}

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_25_05_26';

export default MemoizedClock;
