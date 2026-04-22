import React, { useEffect, useState } from 'react';
import { useMultipleFontLoader } from '@/utils/fontLoader';
import issFont from '@/assets/fonts/2025/25-05-30-iss.ttf';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'iss',
      fontUrl: issFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const [time, setTime] = useState(new Date());

  // Font loading handled by useMultipleFontLoader

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatDigit = (value) => String(value).padStart(2, '0').split('');

  const [h1, h2] = formatDigit(time.getHours());
  const [m1, m2] = formatDigit(time.getMinutes());
  const [s1, s2] = formatDigit(time.getSeconds());

  return (
    <div className={styles.screen}>
      <iframe
        src="https://www.youtube.com/embed/iYmvCUonukw?autoplay=1&mute=1&controls=0&loop=1&playlist=iYmvCUonukw&rel=0&modestbranding=1"
        title="Background ambience"
        allow="autoplay; fullscreen"
        className={styles.backgroundIframe}
      />

      <div className={styles.clockWrapper} style={{ opacity: fontsLoaded ? 1 : 0 }}>
        <div className={styles.clockContainer}>
          <div className={styles.digitBox}>{h1}</div>
          <div className={styles.digitBox}>{h2}</div>
          <div className={styles.digitBox}>{m1}</div>
          <div className={styles.digitBox}>{m2}</div>
          <div className={styles.digitBox}>{s1}</div>
          <div className={styles.digitBox}>{s2}</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
