import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import bgImage from '@/assets/images/26_images/26-01/26-01-12/lala.jpg';
import customFont_2025_1210 from '@/assets/fonts/26fonts/26-01-12-26-01-19-lala.ttf?url';

import styles from './Clock.module.css';

export const assets = [bgImage, customFont_2025_1210];

const fontConfig: FontConfig = {
  fontFamily: 'MuybridgeFont',
  fontUrl: customFont_2025_1210,
};

const Clock_26_01_12 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(1000);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');

  const containerStyle: React.CSSProperties = {
    '--bg-image': `url(${bgImage})`,
  };

  return (
    <main className={styles.container} style={containerStyle}>
      <div className={styles.clockContainer}>
        <div className={styles.digitBox} aria-hidden="true">
          {hours[0]}
        </div>
        <div className={styles.digitBox} aria-hidden="true">
          {hours[1]}
        </div>
        <div className={styles.digitBox} aria-hidden="true">
          {minutes[0]}
        </div>
        <div className={styles.digitBox} aria-hidden="true">
          {minutes[1]}
        </div>
      </div>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>
    </main>
  );
};

Clock_26_01_12.displayName = 'Clock_26_01_12';

export default Clock_26_01_12;