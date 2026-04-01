import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import customFont from '@/assets/fonts/2025/25-07-28-gol.ttf?url';
import backgroundImage from '@/assets/images/2025/25-07/25-07-28/go.gif';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'CustomFont',
      fontUrl: customFont,
      options: {
        weight: 'normal',
        style: 'normal',
      },
    },
  ], []);

  useSuspenseFontLoader(fontConfigs);

  const [time, setTime] = useState(() => new Date());

  // Standardized rAF loop for time
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const getFormattedTime = () => {
    let h = time.getHours() % 12;
    if (h === 0) h = 12;
    const m = time.getMinutes();
    return `${h}${m.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div
        className={styles.time}
      >
        {getFormattedTime()}
      </div>
    </div>
  );
};

export default Clock;
