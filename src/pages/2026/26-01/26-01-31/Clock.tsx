import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/clockUtils';
import type { FontConfig } from '@/types/clock';
import lemonFont from '@/assets/fonts/2026/26-01-31-lemon.otf';
import lemonBg from '@/assets/images/2026/26-01/26-01-31/lemon.gif';
import rainBg from '@/assets/images/2026/26-01/26-01-31/lu.webp';
import lemGif from '@/assets/images/2026/26-01/26-01-31/lemslo.gif';
import lemons2Bg from '@/assets/images/2026/26-01/26-01-31/lemons2.jpg';
import centerImage from '@/assets/images/2026/26-01/26-01-31/lem.gif';
import styles from './Clock.module.css';

export const assets = [lemonBg, rainBg, lemGif, lemons2Bg, centerImage];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'LemonFont', fontUrl: lemonFont }
];

const SimpleBackground: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  const cells = useMemo(() => {
    let h = time.getHours();
    const isPm = h >= 12;
    h = h % 12 || 12;
    return [h.toString().padStart(2, '0')[0], h.toString().padStart(2, '0')[1], 
            time.getMinutes().toString().padStart(2, '0')[0], time.getMinutes().toString().padStart(2, '0')[1],
            time.getSeconds().toString().padStart(2, '0')[0], time.getSeconds().toString().padStart(2, '0')[1],
            Math.floor(time.getMilliseconds() / 100).toString(), isPm ? 'p' : 'a', 'm'];
  }, [time]);

  const rotations = [0, 45, 90, 135, 0, 225, 270, 315, 0];

  return (
    <div className={styles.container}>
      <div className={styles.layerColor} />
      <div className={styles.layerTiling} />
      <div className={styles.layerLemon} />
      <div className={styles.layerRain} />
      <div className={`${styles.layerRain} ${styles.layerRainFlipped}`} />

      <div className={styles.grid}>
        {cells.map((char, i) => (
          <div key={i} className={styles.cell}>
            <div 
              className={i === 4 ? styles.centerImage : styles.cellImage} 
              style={i !== 4 ? { transform: `rotate(${rotations[i]}deg)` } : undefined} 
            />
            <span className={styles.char}>{char}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleBackground;
