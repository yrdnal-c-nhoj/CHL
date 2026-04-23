import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-05/meteor1.mp4';
import middleVideo from '@/assets/images/2026/26-04/26-04-05/meteor2.mp4';
import meteorFont from '@/assets/fonts/2026/26-04-05-meteor.ttf';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const time = useClockTime();

  // Load the meteor font using useSuspenseFontLoader
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Meteor', fontUrl: meteorFont }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  // Split time into 6 individual digits: [H, H, M, M, S, S]
  const digits = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return [...h, ...m, ...s];
  }, [time]);

  return (
    <div className={styles.container}>
      <video className={styles.videoLayer} autoPlay loop muted playsInline src={backgroundVideo} />
      <video className={styles.middleVideoLayer} autoPlay loop muted playsInline src={middleVideo} />

      <div className={styles.clockWrapper}>
        <div className={styles.digitGroup}>
          <div className={styles.digitBox}>{digits[0]}</div>
          <div className={styles.digitBox}>{digits[1]}</div>
          <div className={styles.digitBox}>{digits[2]}</div>
          <div className={styles.digitBox}>{digits[3]}</div>
          <div className={styles.digitBox}>{digits[4]}</div>
          <div className={styles.digitBox}>{digits[5]}</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;