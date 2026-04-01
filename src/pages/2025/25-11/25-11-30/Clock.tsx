// DigitalClock.jsx (Optimized for FOUT Prevention)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import font251130 from '../../../../assets/fonts/2025/25-11-30-nono.ttf?url';
import backgroundImg from '../../../../assets/images/2025/25-11/25-11-30/crax.jpg';
import styles from './Clock.module.css';

export default function DigitalClock() {
  const [now, setNow] = useState(() => new Date());
  
  const fontConfigs = useMemo<FontConfig[]>(() => [
    {
      fontFamily: 'ClockFont2025_12_01',
      fontUrl: font251130,
      options: {
        weight: 'normal',
        style: 'normal',
      }
    }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // --- 2. Clock Update (Unchanged) ---
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // --- 3. Time Calculations and Leetspeak (Unchanged) ---
  const digitMap = {
    0: '1',
    1: 'T',
    2: 'm',
    3: 'E',
    4: 'F',
    5: 'r',
    6: 'L',
    7: '2',
    8: 'q',
    9: 'C',
  };

  const sub = useCallback(
    (str) =>
      str
        .split('')
        .map((d) => digitMap[d] || d)
        .join(''),
    [],
  );

  const HH = sub(String(now.getHours()).padStart(2, '0'));
  const MM = sub(String(now.getMinutes()).padStart(2, '0'));
  const SS = sub(String(now.getSeconds()).padStart(2, '0'));

  const isPhone = window.innerWidth < 600;

  const baseFontSize = isPhone ? '32vw' : '18vw';
  const boxWidth = isPhone ? '26vw' : '14vw';
  const boxHeight = isPhone ? '24vw' : '16vw';

  const renderPair = (digits: string) => (
    <div style={{ display: 'flex', gap: isPhone ? '2vw' : '1vw' }}>
      <div className={styles.digitBox} style={{ width: boxWidth, height: boxHeight, fontSize: baseFontSize }}>
        {digits[0]}
      </div>
      <div className={styles.digitBox} style={{ width: boxWidth, height: boxHeight, fontSize: baseFontSize }}>
        {digits[1]}
      </div>
    </div>
  );

  return (
    <div 
      className={`${styles.container} ${isPhone ? styles.containerMobile : ''}`}
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {isPhone ? (
        <div className={styles.column}>
          {renderPair(HH)}
          {renderPair(MM)}
          {renderPair(SS)}
        </div>
      ) : (
        <div className={styles.row}>
          {renderPair(HH)}
          {renderPair(MM)}
          {renderPair(SS)}
        </div>
      )}
    </div>
  );
}
