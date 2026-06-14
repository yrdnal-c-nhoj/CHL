import officeImg from '@/assets/images/26_images/26-06/26-06-10/office.webp';
import phoneImg from '@/assets/images/26_images/26-06/26-06-10/phone.webp';
import { useSecondClock } from '@/utils/hooks/useSmoothClock';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

export const assets = [phoneImg, officeImg];

export default function DigitalClock() {
  const time = useSecondClock();
  const tileSize = 100; // Matches the CSS 100px size
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const updateGrid = () => {
      setDimensions({
        cols: Math.ceil(window.innerWidth / tileSize) + 2,
        rows: Math.ceil(window.innerHeight / tileSize) + 1,
      });
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const timeParts = [hours[0], hours[1], minutes[0], minutes[1], ampm];

  const backgroundGrid = useMemo(() => {
    if (dimensions.cols === 0) return null;

    const rows = [];
    for (let r = 0; r < dimensions.rows; r++) {
      const isOdd = r % 2 !== 0;
      const tiles = [];
      for (let c = 0; c < dimensions.cols; c++) {
        tiles.push(
          <div
            key={c}
            className={styles.tile}
            style={{ '--tile-img': `url(${officeImg})` } as React.CSSProperties}
          />
        );
      }
      rows.push(
        <div
          key={r}
          className={styles.stripe}
          data-flipped={isOdd}
          style={{ '--tile-size': `${tileSize}px` } as React.CSSProperties}
        >
          {tiles}
        </div>
      );
    }
    return rows;
  }, [dimensions, officeImg]);

  return (
    <main className={styles.container}>
      <div className={styles.backgroundGrid}>{backgroundGrid}</div>

      <div className={styles.phoneContainer}>
        <img src={phoneImg} alt="Retro Phone" className={styles.phoneImage} />
      </div>

      <time className={styles.timeRow} dateTime={time.toLocaleTimeString()}>
        {timeParts.map((part, i) => (
          <div key={i} className={styles.digit}>
            {part}
          </div>
        ))}
      </time>
    </main>
  );
}
