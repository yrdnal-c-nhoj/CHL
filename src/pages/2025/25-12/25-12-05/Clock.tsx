import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import font_2025_12_06 from '../../../../assets/fonts/2025/25-12-05-magic.ttf?url';
import bgImage from '../../../../assets/images/2025/25-12/25-12-05/magic.webp';
import styles from './Clock.module.css';

export default function BoxedDigitalClock() {
  const [time, setTime] = useState(new Date());
  const [visible, setVisible] = useState<boolean>(false); // Clock visibility for glitch
  const [randomOpacity, setRandomOpacity] = useState<number>(0.2); // Random opacity for glitches

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'CustomFont_2025_12_06', fontUrl: font_2025_12_06 }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // -------------------------------
  // Update clock every second
  // -------------------------------
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // -------------------------------
  // Random glitch in/out
  // -------------------------------
  useEffect(() => {
    // Start after 1 second
    const startTimeout = setTimeout(() => {
      const glitchLoop = () => {
        // Random delay ~0-500ms for next glitch
        const delay = 500 + Math.random() * 500;

        // Set random opacity for this glitch
        setRandomOpacity(Math.random() * 0.8);

        // Show clock briefly (~1/16 second)
        setVisible(true);
        setTimeout(() => setVisible(false), 62); // 1/16 second

        // Schedule next glitch
        setTimeout(glitchLoop, delay);
      };
      glitchLoop();
    }, 1000);

    return () => clearTimeout(startTimeout);
  }, []);

  // Convert to 12-hour format without leading zeros
  const hours12 = time.getHours() % 12 || 12; // Convert 0 to 12 for midnight
  const hours = hours12.toString().split('');
  const minutes = time.getMinutes().toString().padStart(2, '0').split('');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div 
      className={styles.container}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay} />

      <div 
        className={styles.clock}
        style={{
          display: visible ? 'flex' : 'none',
          opacity: randomOpacity,
          transform: visible ? `translateX(${Math.random() * 4 - 2}px)` : 'translateX(0)',
          filter: visible ? `blur(${Math.random() * 1.5}px) brightness(${1 + Math.random() * 0.5})` : 'none',
        }}
      >
        {hours.map((digit, i) => (
          <div key={`h${i}`} className={styles.digitBox}>
            {digit}
          </div>
        ))}

        <div className={styles.separator}>
          :
        </div>

        {minutes.map((digit, i) => (
          <div key={`m${i}`} className={styles.digitBox}>
            {digit}
          </div>
        ))}

        <div className={`${styles.separator} ${styles.ampm}`}>
          {ampm}
        </div>
      </div>
    </div>
  );
}
