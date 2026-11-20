import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useEffect } from 'react';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-18/libra.webm';
import scaleImage from '@/assets/images/26_images/26-11/26-11-18/scale.gif';
import starsImage from '@/assets/images/26_images/26-11/26-11-18/stars.webp';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, scaleImage, starsImage];

const Clock_26_11_18 = () => {
  const time = useSmoothClock(16);

  // Load Google Font Poiret One
  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Poiret+One&display=swap';

    document.head.append(preconnect, stylesheet);
    return () => {
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  // Allow stars overlay to extend beyond viewport (body & ClockPage have overflow: hidden globally)
  useEffect(() => {
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    const clockPageContainer = document.querySelector<HTMLElement>(
      '[class*="ClockPage"] .container, .ClockPage-module_container__',
    );
    const clockPageOverflow = clockPageContainer?.style.overflow;

    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';
    if (clockPageContainer) {
      clockPageContainer.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      if (clockPageContainer) {
        clockPageContainer.style.overflow = clockPageOverflow || 'hidden';
      }
    };
  }, []);

  const timeString = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Split time string into parts for colon styling: "3:45 PM" -> ["3", "45 PM"]
  const [hours, minutesAmpm] = timeString.split(':');

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      {/* Background video */}
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />

      {/* Overlay images */}
      <img
        src={scaleImage}
        alt=""
        aria-hidden="true"
        className={styles.scaleOverlay}
      />
      <img
        src={starsImage}
        alt=""
        aria-hidden="true"
        className={styles.starsOverlay}
      />

      {/* Digital clock */}
      <div className={styles.digitalClock} aria-hidden="true">
        <span>{hours}</span>
        <span className={styles.colon}>:</span>
        <span>{minutesAmpm}</span>
      </div>
    </main>
  );
};

Clock_26_11_18.displayName = 'Clock_26_11_18';

export default Clock_26_11_18;
