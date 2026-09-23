import { useClock } from '@/utils/hooks';
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

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const rows = [hours, minutes, seconds];

  return (
    <main className={styles.container}>
      <div className={styles.digitalDisplay}>
        {rows.map((row, rowIndex) => (
          <div className={styles.timeGroup} key={rowIndex}>
            {row.split('').map((digit, digitIndex) => (
              <div className={styles.digitBox} key={digitIndex}>
                <img
                  src={digitImages[digit]}
                  alt=""
                  loading="eager"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_18.displayName = 'Clock_26_09_18';

export default Clock_26_09_18;