import fontUrl from '@/assets/fonts/26fonts/26-05-14.ttf?url';
import balloon3 from '@/assets/images/26_images/26-06/26-06-16/fire.gif';
import balloon4 from '@/assets/images/26_images/26-06/26-06-16/fire.webp';
import ram from '@/assets/images/26_images/26-06/26-06-16/ram.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { type FC } from 'react';
import styles from './Clock.module.css';

const assetsList = [balloon4, balloon3, ram];
export const assets = assetsList;

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_05_14',
    fontUrl,
  },
];

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

const AnalogClock: FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const now = useClockTime('ms');

  const h = now.getHours();
  const m = now.getMinutes();
  const sRaw = now.getSeconds();
  const s = sRaw + now.getMilliseconds() / 1000;

  const hour = (h % 12) + m / 60 + s / 3600;
  const minute = m + s / 60;

  const hourAngle = hour * 30 - 90;
  const minuteAngle = minute * 6 - 90;
  const secondAngle = s * 6 - 90;

  // Styling information passed as raw data to CSS Variables
  const clockStyle = {
    '--h-angle': hourAngle,
    '--m-angle': minuteAngle,
    '--s-angle': secondAngle,
  } as React.CSSProperties;

  return (
    <main className={styles.container} style={clockStyle}>
      {assetsList.map((src) => (
        <img
          key={src}
          src={src}
          alt=""
          className={styles.backgroundImage}
          aria-hidden="true"
        />
      ))}

      <section className={styles.analogClock} aria-label={`Analog clock ${pad2(h)}:${pad2(m)}:${pad2(sRaw)}`}>
        <div className={styles.face}>
          <div className={styles.hourHand} aria-hidden="true" />
          <div className={styles.minuteHand} aria-hidden="true" />
          <div className={styles.secondHand} aria-hidden="true" />
          <div className={styles.centerDot} aria-hidden="true" />
        </div>
      </section>
    </main>
  );
};

export default AnalogClock;
