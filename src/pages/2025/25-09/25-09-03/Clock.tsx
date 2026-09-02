import { useState, useEffect } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import cus250903font from '@/assets/fonts/25fonts/25-09-03-mau.ttf';
import cornerImage from '@/assets/images/25_images/25-09/25-09-03/corner.gif';
import styles from './Clock.module.css';
export const assets = [cus250903font, cornerImage];


function DigitalClock() {
  const fontConfigs = [
    {
      fontFamily: 'Digital7',
      fontUrl: cus250903font,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ];
  useSuspenseFontLoader(fontConfigs);
  const time = useSmoothClock();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getTimeParts = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return { hours, minutes: formattedMinutes, ampm };
  };

  const { hours, minutes, ampm } = getTimeParts(time);

  return (
    <div className={`${styles.container} ${loaded ? styles.containerLoaded : ''}`}>
        <img
          decoding="async"
          loading="lazy"
          src={cornerImage}
          alt="Corner"
          className={styles.cornerTopLeft}
        />
        <img
          decoding="async"
          loading="lazy"
          src={cornerImage}
          alt="Corner"
          className={styles.cornerTopRight}
        />
        <img
          decoding="async"
          loading="lazy"
          src={cornerImage}
          alt="Corner"
          className={styles.cornerBottomLeft}
        />
        <img
          decoding="async"
          loading="lazy"
          src={cornerImage}
          alt="Corner"
          className={styles.cornerBottomRight}
        />

        <div className={styles.clockText}>
          <div>{hours}</div>
          <div>{minutes}</div>
          <div className={styles.clockAmpm}>
            {ampm}
          </div>
        </div>
      </div>
  );
}

export default DigitalClock;
