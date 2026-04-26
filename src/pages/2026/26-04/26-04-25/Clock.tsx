import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

/**
 * LAB / SCRATCHPAD CLOCK
 * Use this file for rapid prototyping.
 * Add '/src/pages/lab/' to your .gitignore to keep this local-only.
 */
const LabClock: React.FC = () => {
  const time = useClockTime();

  // Centralized time logic for easy manipulation
  const display = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    const ms = time.getMilliseconds().toString().padStart(3, '0');
    
    return { h, m, s, ms, raw: time.getTime() };
  }, [time]);

  // Example of a derived experimental style
  const experimentalStyle = {
    transform: `rotate(${display.raw % 360}deg)`,
    color: `hsl(${(display.raw / 50) % 360}, 70%, 60%)`
  };

  return (
    <div className={styles.container}>
      <div className={styles.playground}>
        <header className={styles.header}>LAB_DRAFT</header>
        
        <main className={styles.clockBody}>
          <div className={styles.timeRow}>
            <span className={styles.digit}>{display.h}</span>
            <span className={styles.separator}>:</span>
            <span className={styles.digit}>{display.m}</span>
            <span className={styles.separator}>:</span>
            <span className={styles.digit}>{display.s}</span>
          </div>
          
          <div className={styles.msBar} style={{ width: `${(time.getMilliseconds() / 1000) * 100}%` }} />
        </main>

        <footer className={styles.footer} style={experimentalStyle}>EXPERIMENTAL_MODE</footer>
      </div>
    </div>
  );
};

export default LabClock;