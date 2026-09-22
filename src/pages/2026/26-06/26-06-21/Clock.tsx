import clockFont from '@/assets/fonts/26fonts/26-06-21.ttf?url';
import backgroundImage from '@/assets/images/26_images/26-06/26-06-21/birdhaus.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useMemo, useState, memo } from 'react';
import styles from './Clock.module.css';

export const assets = [backgroundImage, clockFont];

const TILE_SIZE = 50;

const NUMBERS = ['N', 'm', '1', 'R', 't', 'F', '8', 'Q', 'E', 'v'] as const;

const FONT_CONFIGS = [{ fontFamily: 'ClockFont_26_06_21', fontUrl: clockFont }];

const Clock =  () => {
  const time = useClock();
  const [dimensions, setDimensions] = useState({ cols: 1, rows: 1 });

  useEffect(() => {
    const update = () =>
      setDimensions({
        cols: Math.ceil(window.innerWidth / TILE_SIZE) + 1,
        rows: Math.ceil(window.innerHeight / TILE_SIZE) + 1,
      });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useSuspenseFontLoader(FONT_CONFIGS);

  const digits = useMemo(() => {
    const d = new Date(Math.floor(time.getTime() / 1000) * 1000);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    const ss = d.getSeconds().toString().padStart(2, '0');
    return (hh + mm + ss).split('').map((ch) => NUMBERS[parseInt(ch, 10)]);
  }, [time]);

  const backgroundTiles = useMemo(() => {
    const total = dimensions.cols * dimensions.rows;
    return Array.from({ length: total }, (_, i) => {
      const row = Math.floor(i / dimensions.cols);
      const col = i % dimensions.cols;
      return (
        <div
          key={i}
          className={styles.tile}
          style={{
            '--tile-img': `url("${backgroundImage}")`,
            '--sx': col % 2 === 1 ? '-1' : '1',
            '--sy': row % 2 === 1 ? '-1' : '1',
          } as CSSProperties}
        />
      );
    });
  }, [dimensions]);

  return (
    <main
      className={styles.container}
      style={{
        '--tile-size': `${TILE_SIZE}px`,
        '--grid-cols': String(dimensions.cols),
        '--grid-rows': String(dimensions.rows),
      } as CSSProperties}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div className={styles.backgroundGrid}>{backgroundTiles}</div>

      <time
        dateTime={time.toISOString()}
        className={styles.digitalGrid}
      >
        {digits.map((digit, i) => (
          <div key={i} className={styles.cell} aria-hidden="true">
            {digit}
          </div>
        ))}
      </time>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_06_21';
export default MemoizedClock;
