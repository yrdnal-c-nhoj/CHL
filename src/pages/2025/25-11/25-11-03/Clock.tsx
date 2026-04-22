import React, { useEffect, useState, useMemo } from 'react';
import { useMultipleFontLoader } from '@/utils/fontLoader';
import digi251103font from '@/assets/fonts/2025/25-11-03-bin3.ttf?url';
import tec251103font from '@/assets/fonts/2025/25-11-03-bin1.otf?url';
import styles from './Clock.module.css';

const digitalFont = 'digitalFont';
const techFont = 'techFont';

export default function BinaryClockWithColumns() {
  const fontConfigs = useMemo(() => [
    { fontFamily: digitalFont, fontUrl: digi251103font, options: { weight: 'normal', style: 'normal' } },
    { fontFamily: techFont, fontUrl: tec251103font, options: { weight: 'normal', style: 'normal' } }
  ], []);

  const fontsLoaded = useMultipleFontLoader(fontConfigs);
  const [time, setTime] = useState(new Date());
  const [overlayVisible, setOverlayVisible] = useState(true);

  // Fade out overlay once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => setOverlayVisible(false), 100);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

  const formatBinary = (num: number) => num.toString(2).padStart(8, '0').split('');

  const renderColumn = (val: number) => {
    const bits = formatBinary(val);
    return (
      <div className={styles.column}>
        <div className={styles.binaryContainer}>
          {bits.map((bit, idx) => (
            <div 
              key={idx} 
              className={`${styles.bitCell} ${bit === '1' ? styles.bitOn : styles.bitOff}`}
            >
              {bit}
            </div>
          ))}
        </div>
        <div className={styles.digitBox}>
          {val.toString().padStart(2, '0')}
        </div>
      </div>
    );
  };

  const ms = Math.floor(time.getMilliseconds() / 10);

  return (
    <div className={styles.container}>
      {/* Loading Overlay */}
      <div
        className={styles.loadingOverlay}
        style={{ opacity: overlayVisible ? 1 : 0 }}
      />

      <div className={styles.columnsWrapper}>
        {renderColumn(time.getHours())}
        {renderColumn(time.getMinutes())}
        {renderColumn(time.getSeconds())}
        {renderColumn(ms)}
      </div>
    </div>
  );
}