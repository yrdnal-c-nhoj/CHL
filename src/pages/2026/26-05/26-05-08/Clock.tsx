import React, { useEffect } from 'react';

import { useClockTime } from '@/utils/hooks/useClockTime';

import styles from './Clock.module.css';

const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';

const Clock: React.FC = () => {
  const time = useClockTime();
  
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  // Calculate grid dimensions based on viewport and tile size
  const tileWidth = 260;
  const tileHeight = 100;
  const cols = Math.ceil(window.innerWidth / tileWidth) + 2; // Extra for centering
  const rows = Math.ceil(window.innerHeight / tileHeight) + 2; // Extra for centering
  
  // Generate clock positions
  const clocks = [];
  // Center the grid like the background
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = -1; // Move left
  const offsetY = 33;  // Move down
  
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      clocks.push({
        key: `${row}-${col}`,
        left: centerX + (col * tileWidth - (cols * tileWidth) / 2) + offsetX,
        top: centerY + (row * tileHeight - (rows * tileHeight) / 2) + offsetY
      });
    }
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.background} />
      {clocks.map(({ key, left, top }) => (
        <div
          key={key}
          className={styles.clockTile}
          style={{
            '--left': `${left}px`,
            '--top': `${top}px`
          } as React.CSSProperties}
        >
          {time.toLocaleTimeString()}
        </div>
      ))}
    </div>
  );
};

export default Clock;
