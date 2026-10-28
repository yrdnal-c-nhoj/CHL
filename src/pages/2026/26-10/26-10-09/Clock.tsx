import { useState, useEffect } from 'react';
import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import font from '@/assets/fonts/26fonts/26-10-09.woff2?url';

import img1 from '@/assets/images/26_images/26-10/26-10-09/windows.webp';
import img2 from '@/assets/images/26_images/26-10/26-10-09/windows2.webp';
import img3 from '@/assets/images/26_images/26-10/26-10-09/windows3.webp';
import img4 from '@/assets/images/26_images/26-10/26-10-09/windows4.webp';
import img5 from '@/assets/images/26_images/26-10/26-10-09/windows5.webp';
import img6 from '@/assets/images/26_images/26-10/26-10-09/windows6.webp';
import img7 from '@/assets/images/26_images/26-10/26-10-09/windows7.webp';
import img8 from '@/assets/images/26_images/26-10/26-10-09/windows8.webp';
import img9 from '@/assets/images/26_images/26-10/26-10-09/windows9.webp';
import img10 from '@/assets/images/26_images/26-10/26-10-09/windows10.webp';
import img11 from '@/assets/images/26_images/26-10/26-10-09/windows11.webp';

import styles from './Clock.module.css';

const backgroundImages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
];

const numImages = backgroundImages.length;
const MIN_TILES = 1;
const MAX_TILES = 5;

export const assets = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  font,
];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_09',
  fontUrl: font,
};

const pad = (value: number): string => value.toString().padStart(2, '0');

interface BgState {
  imageIdx: number;
  tiles: number;
}

const getRandomBg = (): BgState => ({
  imageIdx: Math.floor(Math.random() * numImages),
  tiles: Math.floor(Math.random() * MAX_TILES) + MIN_TILES,
});

const computeBgSize = (tiles: number): string => `${100 / tiles}vw auto`;

interface BgPair {
  activeLayer: 'A' | 'B';
  a: BgState;
  b: BgState;
}

const Clock_26_10_09 = () => {
  useSuspenseFontLoader([fontConfig]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const time = useClock();

  // 24-hour clock, leading zeros, no AM/PM, no colons — HHMM only
  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());

  // Two-layer background system for cross-fade.
  // The inactive layer silently receives the new random image+tile count,
  // then the active flag swaps so the CSS opacity transition cross-fades.
  const [bgPair, setBgPair] = useState<BgPair>(() => ({
    activeLayer: 'A',
    a: getRandomBg(),
    b: getRandomBg(),
  }));

  // Update background every 2 seconds
  const tick = Math.floor(time.getSeconds() / 2);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBgPair((prev) => {
      const newBg = getRandomBg();
      if (prev.activeLayer === 'A') {
        return { activeLayer: 'B', a: prev.a, b: newBg };
      }
      return { activeLayer: 'A', a: newBg, b: prev.b };
    });
  }, [tick, prefersReducedMotion]);

  const activeIsA = bgPair.activeLayer === 'A';

  return (
    <main className={styles.container}>
      {/* Background layers with cross-fade */}
      <div className={styles.backgroundWrapper}>
        <div
          className={
            activeIsA
              ? `${styles.backgroundLayer} ${styles.backgroundLayerActive}`
              : styles.backgroundLayer
          }
          style={
            {
              backgroundImage: `url(${backgroundImages[bgPair.a.imageIdx]})`,
              backgroundSize: computeBgSize(bgPair.a.tiles),
            } as React.CSSProperties
          }
        />
        <div
          className={
            !activeIsA
              ? `${styles.backgroundLayer} ${styles.backgroundLayerActive}`
              : styles.backgroundLayer
          }
          style={
            {
              backgroundImage: `url(${backgroundImages[bgPair.b.imageIdx]})`,
              backgroundSize: computeBgSize(bgPair.b.tiles),
            } as React.CSSProperties
          }
        />
      </div>

      {/* Digital clock display (24-hour, leading zeros, no AM/PM, no colons) */}
      <div className={styles.digitalDisplay} aria-hidden="true">
        <span className={styles.digitGroup}>
          {hours.split('').map((d, i) => (
            <span key={`h${i}`} className={styles.digitBox}>
              {d}
            </span>
          ))}
        </span>
        <span className={styles.digitGroup}>
          {minutes.split('').map((d, i) => (
            <span key={`m${i}`} className={styles.digitBox}>
              {d}
            </span>
          ))}
        </span>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_10_09.displayName = 'Clock_26_10_09';

export default Clock_26_10_09;
