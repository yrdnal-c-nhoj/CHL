import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { CSSProperties } from 'react';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-03/hourglass.mp4';
import font from '@/assets/fonts/26fonts/26-10-31.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig = {
  fontFamily: 'ClockFont_26_11_03',
  fontUrl: font,
};

type HandStyle = CSSProperties & { '--angle': string };

const Clock_26_11_03 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const hourAngle = (hours + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  const handStyle = (angle: number): HandStyle => ({ '--angle': `${angle}deg` });

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.hand} style={handStyle(hourAngle)} />
      <div className={styles.minuteHand} style={handStyle(minuteAngle)} />
      <div className={styles.secondHand} style={handStyle(secondAngle)} />

      <SRTime time={time} />
    </main>
  );
};

Clock_26_11_03.displayName = 'Clock_26_11_03';
export default Clock_26_11_03;