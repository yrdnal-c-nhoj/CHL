import { useClock } from '@/utils/hooks';
import { useMemo } from 'react';
import SRTime from '@/components/SRTime';
import digit0 from '@/assets/images/26_images/26-09/26-09-18/0.webp';
import digit1 from '@/assets/images/26_images/26-09/26-09-18/1.webp';
import digit2 from '@/assets/images/26_images/26-09/26-09-18/2.webp';
import digit3 from '@/assets/images/26_images/26-09/26-09-18/3.webp';
import digit4 from '@/assets/images/26_images/26-09/26-09-18/4.webp';
import digit5 from '@/assets/images/26_images/26-09/26-09-18/5.webp';
import digit6 from '@/assets/images/26_images/26-09/26-09-18/6.webp';
import digit7 from '@/assets/images/26_images/26-09/26-09-18/7.webp';
import digit8 from '@/assets/images/26_images/26-09/26-09-18/8.webp';
import digit9 from '@/assets/images/26_images/26-09/26-09-18/9.webp';
import styles from './Clock.module.css';

export const assets = [
  digit0,
  digit1,
  digit2,
  digit3,
  digit4,
  digit5,
  digit6,
  digit7,
  digit8,
  digit9,
];

const digitImages: Record<string, string> = {
  '0': digit0,
  '1': digit1,
  '2': digit2,
  '3': digit3,
  '4': digit4,
  '5': digit5,
  '6': digit6,
  '7': digit7,
  '8': digit8,
  '9': digit9,
};

const Clock_26_09_18 = () => {
  const time = useClock();

  const { h1, h2, m1, m2, s1, s2 } = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return {
      h1: h.charAt(0),
      h2: h.charAt(1),
      m1: m.charAt(0),
      m2: m.charAt(1),
      s1: s.charAt(0),
      s2: s.charAt(1),
    };
  }, [time]);

  return (
    <main className={styles.container}>
      <div className={styles.digitalDisplay}>
        <div className={styles.timeGroup}>
          <span className={styles.digitBox}>
            <img src={digitImages[h1]} alt={h1} loading="eager" />
          </span>
          <span className={styles.digitBox}>
            <img src={digitImages[h2]} alt={h2} loading="eager" />
          </span>
        </div>
        <div className={styles.timeGroup}>
          <span className={styles.digitBox}>
            <img src={digitImages[m1]} alt={m1} loading="eager" />
          </span>
          <span className={styles.digitBox}>
            <img src={digitImages[m2]} alt={m2} loading="eager" />
          </span>
        </div>
        <div className={styles.timeGroup}>
          <span className={styles.digitBox}>
            <img src={digitImages[s1]} alt={s1} loading="eager" />
          </span>
          <span className={styles.digitBox}>
            <img src={digitImages[s2]} alt={s2} loading="eager" />
          </span>
        </div>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_18.displayName = 'Clock_26_09_18';
export default Clock_26_09_18;
