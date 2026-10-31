import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';

import backgroundVideo from '@/assets/images/26_images/26-10/26-10-29/rave.mp4';
import font from '@/assets/fonts/26fonts/26-10-29.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_29',
  fontUrl: font,
};

const Clock_26_10_29 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  // Create items array with colons interleaved: H H : M M : S S
  const items = [
    { type: 'digit', value: hours[0] },
    { type: 'digit', value: hours[1] },
    { type: 'colon', value: ':' },
    { type: 'digit', value: minutes[0] },
    { type: 'digit', value: minutes[1] },
    { type: 'colon', value: ':' },
    { type: 'digit', value: seconds[0] },
    { type: 'digit', value: seconds[1] },
  ];

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <div className={styles.digitalClock} aria-hidden="true">
        {items.map((item, i) => (
          <span
            key={i}
            className={`${styles.cell} ${item.type === 'colon' ? styles.colonCell : styles.digitCell}`}
          >
            <span
              className={item.type === 'colon' ? styles.colon : styles.digit}
            >
              {item.value}
            </span>
          </span>
        ))}
      </div>
      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_29.displayName = 'Clock_26_10_29';
export default Clock_26_10_29;
