import wallFont from '@/assets/fonts/26fonts/26-08-22.ttf';
import bgImage from '@/assets/images/26_images/26-08/26-08-22/mars.webp';
import type { FontConfig } from '@/types/clock';
import { useSecondClock, useIsDesktop } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useMemo } from 'react';
import styles from './Clock.module.css';

export const assets = [bgImage, wallFont];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'Wall_26-08-22', fontUrl: wallFont },
];

const formatDigit = (num: number) => num.toString().padStart(2, '0');

interface DigitBoxProps {
  value: string;
}

const DigitBox: React.FC<DigitBoxProps> = React.memo(({ value }) => (
  <div className={styles.digitBox}>
    <span>{value}</span>
  </div>
));

DigitBox.displayName = 'DigitBox';

const ClockComponent: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSecondClock();
  const isDesktop = useIsDesktop();

  const hours = formatDigit(time.getHours());
  const minutes = formatDigit(time.getMinutes());
  const seconds = formatDigit(time.getSeconds());

  const timeString = useMemo(
    () => `${hours}:${minutes}:${seconds}`,
    [hours, minutes, seconds],
  );

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.backgroundWrapper} aria-hidden="true">
        <img src={bgImage} className={styles.bgImage} alt="" />
        <img src={bgImage} className={styles.bgImage} alt="" />
      </div>

      <div
        className={`${styles.clockWrapper}${isDesktop ? '' : ` ${styles.stacked}`}`}
      >
        {isDesktop ? (
          <>
            {[...hours, ...minutes, ...seconds].map((digit, i) => (
              <DigitBox key={i} value={digit} />
            ))}
          </>
        ) : (
          <>
            <div className={styles.digitRow}>
              {[...hours].map((digit, i) => (
                <DigitBox key={`h${i}`} value={digit} />
              ))}
            </div>
            <div className={styles.digitRow}>
              {[...minutes].map((digit, i) => (
                <DigitBox key={`m${i}`} value={digit} />
              ))}
            </div>
            <div className={styles.digitRow}>
              {[...seconds].map((digit, i) => (
                <DigitBox key={`s${i}`} value={digit} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

const Clock = React.memo(ClockComponent);
Clock.displayName = 'Clock_26_08_22';

export default Clock;
