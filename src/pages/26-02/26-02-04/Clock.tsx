import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import styles from './Clock.module.css';

// Assets
import digitalFontUrl from '../../../assets/fonts/26-02-04-trans.ttf?url';
import digitalBgImage from '../../../assets/images/26-02/26-02-04/trans.webp';
import backgroundImage from '../../../assets/images/26-02/26-02-04/tran.jpg';

// Custom hook for smooth time updates using requestAnimationFrame
const useSmoothTime = (updateInterval: number = 1000) => {
  const [time, setTime] = useState(new Date());
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      // Update based on interval to avoid excessive updates
      if (timestamp - lastUpdateRef.current >= updateInterval) {
        setTime(new Date());
        lastUpdateRef.current = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateInterval]);

  return time;
};

const CONFIG = {
  use24Hour: false,
};

// Interface for time formatting result
interface TimeFormat {
  hh: string;
  mm: string;
}

const DigitalClockTemplate: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Define font configurations for the Suspense-based loader
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'BorrowedDigital',
      fontUrl: digitalFontUrl,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);

  // This hook handles loading and suspends the component until fonts are ready.
  // The parent <ClockPage> provides the <Suspense> fallback UI.
  useSuspenseFontLoader(fontConfigs);

  // Use smooth time updates with requestAnimationFrame
  const time = useSmoothTime(1000); // Update every second

  // Time formatting - move before conditional return
  const { hh, mm }: TimeFormat = useMemo(() => {
    const hours24 = time.getHours();
    const hours = CONFIG.use24Hour ? hours24 : hours24 % 12 || 12;
    const pad = (n) => String(n).padStart(2, '0');
    return {
      hh: pad(hours),
      mm: pad(time.getMinutes()),
    };
  }, [time]);

  // Device detection
  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={styles.bgBase}
        style={{ backgroundImage: `url(${backgroundImage})`, zIndex: 1 }}
      />
      <div
        className={styles.bgBase}
        style={{
          backgroundImage: `url(${digitalBgImage})`,
          zIndex: 2,
          filter: 'brightness(100%) saturate(10%)',
        }}
      />

      <div className={`${styles.timeRow} ${isMobile ? styles.timeRowMobile : ''}`}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span className={`${styles.digit} ${isMobile ? styles.digitMobile : ''}`}>{hh[0]}</span>
          <span className={`${styles.digit} ${isMobile ? styles.digitMobile : ''}`}>{hh[1]}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span className={`${styles.digit} ${isMobile ? styles.digitMobile : ''}`}>{mm[0]}</span>
          <span className={`${styles.digit} ${isMobile ? styles.digitMobile : ''}`}>{mm[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalClockTemplate;
