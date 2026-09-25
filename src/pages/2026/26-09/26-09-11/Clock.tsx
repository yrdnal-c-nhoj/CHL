import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import launchVideo from '@/assets/images/26_images/26-09/26-09-11/train.webm';
import fontUrl from '@/assets/fonts/26fonts/26-09-11.otf?url';
import styles from './Clock.module.css';

export const assets = [launchVideo, fontUrl];

const FONT_FAMILY = 'ClockFont_26_09_07';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl,
};

const Clock_26_09_11 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const allDigits = [
    ...hours.split(''),
    ...minutes.split(''),
    ...seconds.split(''),
  ];

  return (
    <main className={styles.container}>
      <video
        src={launchVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      <div className={styles.clock}>
        {allDigits.map((digit, index) => (
          <span key={index} className={styles.digitBox}>
            {digit}
          </span>
        ))}
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_11.displayName = 'Clock_26_09_11';

export default Clock_26_09_11;