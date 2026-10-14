import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import font from '@/assets/fonts/26fonts/26-10-11.ttf?url';

import styles from './Clock.module.css';

export const assets = [font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_11',
  fontUrl: font,
};

const pad = (value: number): string => value.toString().padStart(2, '0');

const Clock_26_10_11 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  return (
    <main className={styles.container}>
      <div className={styles.digitalGrid} aria-hidden="true">
        <span className={styles.digitBox}>{hours[0]}</span>
        <span className={styles.digitBox}>{hours[1]}</span>
        <span className={styles.digitBox}>{minutes[0]}</span>
        <span className={styles.digitBox}>{minutes[1]}</span>
        <span className={styles.digitBox}>{seconds[0]}</span>
        <span className={styles.digitBox}>{seconds[1]}</span>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_11.displayName = 'Clock_26_10_11';

export default Clock_26_10_11;
