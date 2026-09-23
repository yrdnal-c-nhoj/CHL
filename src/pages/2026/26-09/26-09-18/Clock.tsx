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

// Indexed by digit value, so assets[7] is the image for "7".
export const assets = [
  digit0, digit1, digit2, digit3, digit4,
  digit5, digit6, digit7, digit8, digit9,
];

const pad = (n: number) => String(n).padStart(2, '0');

const Clock_26_09_18 = () => {
  const time = useClock();
  const groups = [time.getHours(), time.getMinutes(), time.getSeconds()].map(pad);

  return (
    <main className={styles.container}>
      <div className={styles.display}>
        {groups.map((group, i) => (
          <div className={styles.group} key={i}>
            {[...group].map((digit, j) => (
              <img
                className={styles.digit}
                key={j}
                src={assets[Number(digit)]}
                alt=""
                loading="eager"
                draggable={false}
              />
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