import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import airpoImage from '@/assets/images/26_images/26-09/26-09-25/vultures.webm';
import rainImage from '@/assets/images/26_images/26-09/26-09-25/wheat.webp';
import rainOverlayImage from '@/assets/images/26_images/26-09/26-09-25/rain.webp';
import font from '@/assets/fonts/26fonts/26-09-25.ttf?url';
import styles from './Clock.module.css';

export const assets = [airpoImage, font, rainImage, rainOverlayImage];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_04',
  fontUrl: font,
};

const Clock_26_09_04 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useClock();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const digits = hours + minutes;

  return (
    <main className={styles.container}>
      {/* Digital Clock Overlay */}
      <div className={styles.clock} aria-label="clock">
        {digits.split('').map((d, i) => (
          <span key={`digit${i}`} className={styles.digitBox}>
            {d}
          </span>
        ))}
      </div>

      {/* Video Element */}
      <video
        src={airpoImage}
        className={styles.image}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Rain overlay layered on top of the background */}
      <img
        className={styles.rainOverlay}
        src={rainImage}
        alt=""
        aria-hidden="true"
      />

      {/* Rain effect layered on top of all */}
      <img
        className={styles.rainEffect}
        src={rainOverlayImage}
        alt=""
        aria-hidden="true"
      />

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_04.displayName = 'Clock_26_09_04';

export default Clock_26_09_04;