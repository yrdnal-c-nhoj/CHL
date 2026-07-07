import customFont from '@/assets/fonts/26fonts/26-07-05.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState, type FC } from 'react';
import styles from './Clock.module.css';

// Properly import assets so Vite can resolve and hash them
import penImage from '@/assets/images/26_images/26-07/26-07-05/pen.webp';
import penguinsVideo from '@/assets/images/26_images/26-07/26-07-05/penguins.mp4';

// Export assets for the useClockPage hook to preload
export const assets = [penImage, penguinsVideo];

const fontConfigs: { fontFamily: string; fontUrl: string; options: { weight: string; style: string } }[] = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const TiledPenLayer: FC = () => {
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  const tileSize = 100;

  useEffect(() => {
    const calculateGrid = () => {
      const cols = Math.ceil(window.innerWidth / tileSize) + 1;
      const rows = Math.ceil(window.innerHeight / tileSize) + 1;
      setGrid({ cols, rows });
    };

    calculateGrid();
    window.addEventListener('resize', calculateGrid);
    return () => window.removeEventListener('resize', calculateGrid);
  }, []);

  const tiles = useMemo(() => {
    return Array.from({ length: grid.rows * grid.cols }).map((_, i) => {
      const row = Math.floor(i / grid.cols);
      const col = i % grid.cols;
      const isFlipped = (row + col) % 2 === 1;
      return <div key={i} className={styles.penTile} data-flipped={isFlipped} />;
    });
  }, [grid.cols, grid.rows]);

  return (
    <div
      className={styles.penGrid}
      style={{ '--tile-size': `${tileSize}px` } as React.CSSProperties}
    >
      {tiles}
    </div>
  );
};

const BackgroundLayers: FC = () => (
  <div className={styles.backgroundLayersContainer}>
    <div className={styles.twoUp}>
      <div className={styles.half}>
        <video
          className={styles.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={penguinsVideo} type="video/mp4" />
        </video>
      </div>
      <div className={styles.half}>
        <video
          className={styles.backgroundVideoMirror}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={penguinsVideo} type="video/mp4" />
        </video>
      </div>
    </div>
    <TiledPenLayer />
  </div>
);

const formatDigits = (num: number): string => num.toString().padStart(2, '0');

const DigitalClock: FC = () => {
  const time = useSecondClock();

  const { hours, minutes, isoTime } = useMemo(() => {
    const h = formatDigits(time.getHours());
    const m = formatDigits(time.getMinutes());
    return {
      hours: h,
      minutes: m,
      isoTime: time.toISOString(),
    };
  }, [time]);

  return (
    <time className={styles.timeDisplay} dateTime={isoTime}>
      <div className={styles.digitGroup}>
        <div className={styles.digitBox}>{hours[0]}</div>
        <div className={styles.digitBox}>{hours[1]}</div>
      </div>
      <div className={styles.separator}>:</div>
      <div className={styles.digitGroup}>
        <div className={styles.digitBox}>{minutes[0]}</div>
        <div className={styles.digitBox}>{minutes[1]}</div>
      </div>
    </time>
  );
};

const AmbientDisplayClock: FC = () => {
  useSuspenseFontLoader(fontConfigs);

  return (
    <div className={styles.container}>
      <BackgroundLayers />
      <DigitalClock />
    </div>
  );
};
export default AmbientDisplayClock;
