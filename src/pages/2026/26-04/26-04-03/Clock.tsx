import React from 'react';
import { useClockTime } from '@/utils/clockUtils';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-03/clox.mp4';
import fontUrl from '@/assets/fonts/clox.ttf?url';
import styles from './Clock.module.css';

const formatTimeParts = (date: Date): string[] => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return [...hours, ':', ...minutes, ':', ...seconds];
};

const Clock: React.FC = () => {
  const time = useClockTime();
  const timeParts = formatTimeParts(time);
  const rows = ['t5', 't4', 't3', 't2', 't1', 'mid', 'b1', 'b2', 'b3', 'b4', 'b5'];

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'Clox';
          src: url('${fontUrl}') format('truetype');
          font-display: block;
        }
      `}</style>
      
      <div className={styles.container}>
        <video 
          className={styles.backgroundVideo}
          autoPlay 
          loop 
          muted 
          playsInline 
          src={backgroundVideo} 
        />

        <div className={styles.contentWrapper}>
          {rows.map((rowId) => (
            <div key={rowId} className={styles.clockRow}>
              {timeParts.map((char, index) => (
                <span 
                  key={`${rowId}-${index}`} 
                  className={`${styles.clockChar} ${char === ':' ? styles.colon : styles.digit}`}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Clock;