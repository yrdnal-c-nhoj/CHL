import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import styles from './Clock.module.css';
import backgroundVideo from '@/assets/images/26_images/26-11/26-11-25/hydra.webm';
import font from '@/assets/fonts/26fonts/26-11-25.ttf?url';

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
});

export const assets = [backgroundVideo, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_25',
  fontUrl: font,
};

const Clock_26_11_25 = () => {
  useSuspenseFontLoader([fontConfig]);

  const time = useSmoothClock(16);

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
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {timeFormatter.formatToParts(time).map((part, index) =>
          part.type === 'literal' && part.value === ':' ? (
            <span key={index} className={styles.colon}>
              {part.value}
            </span>
          ) : (
            part.value
          ),
        )}
      </div>
    </main>
  );
};

Clock_26_11_25.displayName = 'Clock_26_11_25';

export default Clock_26_11_25;
