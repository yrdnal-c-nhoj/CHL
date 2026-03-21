import React, { useState, useEffect, useMemo } from 'react';
import React, { useState, useEffect } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import fontUrl from '../../../assets/fonts/26-03-15-shadow.otf?url';
import styles from './Clock.module.css';

const MS_PER_ROTATION = 30000;

export const fontConfigs: FontConfig[] = [
  { fontFamily: '26-03-15-shadow', fontUrl, options: { weight: 'normal', style: 'normal' } },
];

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [rotation, setRotation] = useState(0);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: '26-03-15-shadow', fontUrl, options: { weight: 'normal', style: 'normal' } },
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      const now = new Date();
      setTime(now);
      // Continuous rotation calculation
      setRotation(-((now.getTime() / MS_PER_ROTATION) * 360) % 360);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => { 
      cancelAnimationFrame(frameId); 
    };
  }, []);

  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const digits = [h[0], h[1], m[0], m[1]];

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {digits.map((digit, i) => (
          <div key={i} className={styles.digitBox}>
            <div 
              className={styles.digit}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {digit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clock;