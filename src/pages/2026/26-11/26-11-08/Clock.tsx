import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import { useEffect, useState } from 'react';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-08/uniqueforms.mp4';
import tileImage from '@/assets/images/26_images/26-11/26-11-08/forms.webp';
import font from '@/assets/fonts/26fonts/26-11-06.otf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, tileImage, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_08',
  fontUrl: font,
};

const Clock_26_11_08 = () => {
  const time = useSmoothClock(16);
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();

  const hourAngle = (hours + minutes / 60 + seconds / 3600) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  // Tile configuration - change tileSize to control tile dimensions
  const tileSize = 200;

  // Dynamically calculate rings needed to cover viewport
  const [maxRings, setMaxRings] = useState(7);

  useEffect(() => {
    const calculateRings = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Need rings to cover half the diagonal from center
      const radius = Math.sqrt(vw * vw + vh * vh) / 2;
      const rings = Math.ceil(radius / tileSize) + 1; // +1 for safety margin
      // Cap at reasonable maximum for browser performance
      setMaxRings(Math.min(rings, 15));
    };
    calculateRings();
    window.addEventListener('resize', calculateRings);
    return () => window.removeEventListener('resize', calculateRings);
  }, [tileSize]);

  // Generate tiles in expanding rings from center
  const tiles = [];
  let tileIndex = 0;

  // Center tile (ring 0)
  tiles.push(
    <video
      key={`tile-${tileIndex++}`}
      src={backgroundVideo}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      className={styles.videoTile}
      style={
        {
          width: `${tileSize}px`,
          height: `${tileSize}px`,
          transform: `translate(-50%, -50%)`,
        } as React.CSSProperties
      }
    />,
  );

  // Expanding rings
  for (let ring = 1; ring <= maxRings; ring++) {
    const offset = ring * tileSize;

    // Top and bottom rows of this ring
    for (let i = -ring; i <= ring; i++) {
      const x = i * tileSize;
      // Top
      tiles.push(
        <video
          key={`tile-${tileIndex++}`}
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className={styles.videoTile}
          style={
            {
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${-offset}px))`,
            } as React.CSSProperties
          }
        />,
      );
      // Bottom - include all positions (corners not placed in top row)
      tiles.push(
        <video
          key={`tile-${tileIndex++}`}
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className={styles.videoTile}
          style={
            {
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${offset}px))`,
            } as React.CSSProperties
          }
        />,
      );
    }

    // Left and right columns of this ring (excluding corners)
    for (let i = -ring + 1; i <= ring - 1; i++) {
      const y = i * tileSize;
      // Left
      tiles.push(
        <video
          key={`tile-${tileIndex++}`}
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className={styles.videoTile}
          style={
            {
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              transform: `translate(calc(-50% + ${-offset}px), calc(-50% + ${y}px))`,
            } as React.CSSProperties
          }
        />,
      );
      // Right
      tiles.push(
        <video
          key={`tile-${tileIndex++}`}
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className={styles.videoTile}
          style={
            {
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              transform: `translate(calc(-50% + ${offset}px), calc(-50% + ${y}px))`,
            } as React.CSSProperties
          }
        />,
      );
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.videoGrid} aria-hidden="true">
        {tiles}
      </div>

      <img
        src={tileImage}
        alt=""
        aria-hidden="true"
        className={styles.centerImage}
      />

      <div className={styles.clockFace} aria-hidden="true">
        <div
          className={styles.hand}
          style={{ '--angle': `${hourAngle}deg` } as Record<string, string>}
        />
        <div
          className={styles.minuteHand}
          style={{ '--angle': `${minuteAngle}deg` } as Record<string, string>}
        />
        <div
          className={styles.secondHand}
          style={{ '--angle': `${secondAngle}deg` } as Record<string, string>}
        />
        <div className={styles.centerDot} />
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_11_08.displayName = 'Clock_26_11_08';
export default Clock_26_11_08;
