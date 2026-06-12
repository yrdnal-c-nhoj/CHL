import officeImg from '@/assets/images/26_images/26-06/26-06-10/office.webp';
import phoneImg from '@/assets/images/26_images/26-06/26-06-10/phone.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks/useSmoothClock';
import styles from './Clock.module.css';

export const assets = [phoneImg, officeImg];

const fontConfigs: FontConfig[] = [];

export default function DigitalClock() {
  const time = useSecondClock();

  useSuspenseFontLoader(fontConfigs);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM'; // Using 24h hours for logic, but displaying AM/PM per request

  const digits = `${hours}${minutes}`;

  return (
    <main 
      className={styles.container}
      style={{ 
        '--phone-img': `url(${phoneImg})`,
        '--office-img': `url(${officeImg})`
      } as React.CSSProperties}
    >
      <time className={styles.timeRow} dateTime={time.toISOString()}>
        {digits.split('').map((d, i) => (
          <div key={i} className={styles.digit}>
            {d}
          </div>
        ))}
        <div className={styles.digit}>{ampm}</div>
      </time>
    </main>
  );
}
