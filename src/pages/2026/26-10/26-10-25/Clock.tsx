import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-25/fireplace.mp4';
import clockFont from '@/assets/fonts/26fonts/26-10-25.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_25',
  fontUrl: clockFont,
};

const formatDigits = (value: number): string =>
  value.toString().padStart(2, '0');

const Clock_26_10_25 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useClock();
  const timeGroups = [
    formatDigits(time.getHours()),
    formatDigits(time.getMinutes()),
    formatDigits(time.getSeconds()),
  ];

  return (
    <main className={styles.container}>
      <video
        className={styles.backgroundVideo}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <SRTime time={time} />

      <div className={styles.display} aria-hidden="true">
        <span className={styles.time}>
          {timeGroups.map((group, groupIndex) => (
            <span className={styles.timeGroup} key={groupIndex}>
              {Array.from(group, (digit, digitIndex) => (
                <span className={styles.digit} key={digitIndex}>
                  {digit}
                </span>
              ))}
            </span>
          ))}
        </span>
      </div>
    </main>
  );
};

Clock_26_10_25.displayName = 'Clock_26_10_25';

export default Clock_26_10_25;
