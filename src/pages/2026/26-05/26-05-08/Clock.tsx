import React from 'react';

import { useSecondClock } from '@/utils/hooks';

import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const time = useSecondClock();

  // Calculate grid dimensions based on viewport and tile size
  const tileWidth = 26; // 26vh (260px / 10)
  const tileHeight = 10; // 10vh (100px / 10)
  const viewportWidth = window.innerWidth / (window.innerHeight / 100); // Convert to vh
  const viewportHeight = 100; // 100vh
  const cols = Math.ceil(viewportWidth / tileWidth) + 2; // Extra for centering
  const rows = Math.ceil(viewportHeight / tileHeight) + 2; // Extra for centering

  // Generate clock positions
  const clocks = [];
  // Center the grid like the background
  const centerX = viewportWidth / 2;
  const centerY = viewportHeight / 2;
  const offsetX = -0.1; // Move left in vh
  const offsetY = 3.3; // Move down in vh

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      clocks.push({
        key: `${row}-${col}`,
        left: centerX + (col * tileWidth - (cols * tileWidth) / 2) + offsetX,
        top: centerY + (row * tileHeight - (rows * tileHeight) / 2) + offsetY,
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
          style={
            {
              '--left': `${left}vh`,
              '--top': `${top}vh`,
            } as React.CSSProperties
          }
        >
          {time.toLocaleTimeString()}
        </div>
      ))}
    </div>
  );
};

export default Clock;
