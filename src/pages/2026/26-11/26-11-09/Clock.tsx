import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-09/giraffe.webm';
import posterImage from '@/assets/images/26_images/26-11/26-11-09/giraffe-poster.png';
import font from '@/assets/fonts/26fonts/26-11-09.otf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, posterImage, font];

const fontConfig = {
  fontFamily: 'ClockFont_26_11_09',
  fontUrl: font,
};

const Clock_26_11_09 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useSmoothClock(16);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds().toString().padStart(3, '0').slice(0, 2);

  const digits = [...hours, ':', ...minutes, ':', ...seconds, '.', ...ms];

  return (
    <main className={styles.container}>
      <video
        src={backgroundVideo}
        poster={posterImage}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <SRTime time={time} />
      <div className={styles.content} aria-hidden="true">
        {digits.map((d, i) => (
          <span
            key={i}
            className={`${styles.digitBox} ${d === ':' ? styles.colon : d === '.' ? styles.dot : ''}`}
          >
            {d}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_11_09.displayName = 'Clock_26_11_09';

export default Clock_26_11_09;
