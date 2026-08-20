import { memo, useEffect } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import medievalFont from '@/assets/fonts/25fonts/25-09-11-ren.ttf?url';
import backgroundImage from '@/assets/images/25_images/25-09/25-09-11/ren.jpg';
import MedievalSVG from '@/assets/images/25_images/25-09/25-09-11/MedievalSVG.jsx';
import styles from './Clock.module.css';

export const assets = [medievalFont, backgroundImage];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_25_09_18',
    fontUrl: medievalFont,
  },
];

const MedievalBanner =  () => {
  const time = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const formatTime = (date) => {
    const hours = (date.getHours() % 12 || 12).toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);

  return (
    <main className={styles.container} style={{
      width: '100vw',
      height: '100dvh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'black',
    }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          transform: 'scaleX(-1)',
          filter: 'brightness(1.7) saturate(0.1)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100dvh',
          zIndex: 2,
        }}
      >
        <MedievalSVG />
      </div>

      <div
        className={styles.sparkle}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12dvh',
          background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFF8DC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em',
          fontFamily: 'ClockFont_25_09_18, monospace',
        }}
      >
        {hours}{minutes}
      </div>
    </main>
  );
};

const MemoizedMedievalBanner = memo(MedievalBanner);
MemoizedMedievalBanner.displayName = 'Clock_25_09_11';
export default MemoizedMedievalBanner;
