import { useClock, useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import type { CSSProperties } from 'react';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useEffect, useState } from 'react';
import styles from './Clock.module.css';
import backgroundImage from '@/assets/images/26_images/26-10/26-10-09/windows.webp';
import windows2 from '@/assets/images/26_images/26-10/26-10-09/windows2.webp';
import windows3 from '@/assets/images/26_images/26-10/26-10-09/windows3.webp';
import windows4 from '@/assets/images/26_images/26-10/26-10-09/windows4.webp';
import windows5 from '@/assets/images/26_images/26-10/26-10-09/windows5.webp';
import windows6 from '@/assets/images/26_images/26-10/26-10-09/windows6.webp';
import windows7 from '@/assets/images/26_images/26-10/26-10-09/windows7.webp';
import windows8 from '@/assets/images/26_images/26-10/26-10-09/windows8.webp';
import windows9 from '@/assets/images/26_images/26-10/26-10-09/windows9.webp';
import windows10 from '@/assets/images/26_images/26-10/26-10-09/windows10.webp';
import windows11 from '@/assets/images/26_images/26-10/26-10-09/windows11.webp';
import font from '@/assets/fonts/26fonts/26-10-09.ttf?url';

export const assets = [
  backgroundImage,
  windows2,
  windows3,
  windows4,
  windows5,
  windows6,
  windows7,
  windows8,
  windows9,
  windows10,
  windows11,
  font,
];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_09',
  fontUrl: font,
};

const images = [
  backgroundImage,
  windows2,
  windows3,
  windows4,
  windows5,
  windows6,
  windows7,
  windows8,
  windows9,
  windows10,
  windows11,
];

const pickRandomExcluding = (exclude: number): number => {
  const available = images.map((_, i) => i).filter((i) => i !== exclude);
  const index = Math.floor(Math.random() * available.length);
  return available[index] ?? exclude;
};

const randomTileSize = (): number =>
  Math.random() < 0.2 ? 42 + Math.random() * 18 : 16 + Math.random() * 26;

const Clock_26_10_09 = () => {
  useSuspenseFontLoader([fontConfig]);
  const time = useClock();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const smoothTime = useSmoothClock(prefersReducedMotion ? 1000 : 50);

  // Capture the mount time so cycles always start in the "hold" phase.
  const [startTime] = useState(() => smoothTime.getTime() / 1000);

  // Precompute random images and tile sizes, avoiding immediate image repeats.
  const [sequences] = useState(() => {
    const imgSeq: number[] = [];
    const sizeSeq: number[] = [];
    let prev = Math.floor(Math.random() * images.length);
    imgSeq.push(prev);
    sizeSeq.push(randomTileSize());
    for (let i = 0; i < 999; i++) {
      prev = pickRandomExcluding(prev);
      imgSeq.push(prev);
      sizeSeq.push(randomTileSize());
    }
    return { images: imgSeq, sizes: sizeSeq };
  });

  const elapsedSeconds = smoothTime.getTime() / 1000 - startTime;
  const cycleNumber = Math.floor(elapsedSeconds / 2);
  const cyclePosition = elapsedSeconds % 2;
  const isFading = cyclePosition >= 1;
  const progress = isFading ? cyclePosition - 1 : 0;

  const seqLength = sequences.images.length;
  const currentCycleIdx = cycleNumber % seqLength;
  const nextCycleIdx = (cycleNumber + 1) % seqLength;

  const currentImgIdx = sequences.images[currentCycleIdx] ?? 0;
  const nextImgIdx = sequences.images[nextCycleIdx] ?? 0;
  const currentSize = sequences.sizes[currentCycleIdx] ?? 26;
  const nextSize = sequences.sizes[nextCycleIdx] ?? 26;

  const currentBgImage = images[currentImgIdx] ?? backgroundImage;
  const nextBgImage = images[nextImgIdx] ?? backgroundImage;

  const currentOpacity = isFading
    ? prefersReducedMotion
      ? 0
      : 1 - progress
    : 1;
  const nextOpacity = isFading ? (prefersReducedMotion ? 1 : progress) : 0;

  const formatDigits = (value: number): string =>
    value.toString().padStart(2, '0');

  const hours = formatDigits(time.getHours());
  const minutes = formatDigits(time.getMinutes());

  const display = `${hours}:${minutes}`;

  const currentLayerStyle = {
    '--bg-image': `url(${currentBgImage})`,
    '--bg-size': `${currentSize}vmin`,
    opacity: currentOpacity,
  } as CSSProperties;

  const nextLayerStyle = {
    '--bg-image': `url(${nextBgImage})`,
    '--bg-size': `${nextSize}vmin`,
    opacity: nextOpacity,
  } as CSSProperties;

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div
        className={styles.bgLayer}
        style={currentLayerStyle}
        aria-hidden="true"
      />
      <div
        className={styles.bgLayer}
        style={nextLayerStyle}
        aria-hidden="true"
      />
      <div className={styles.digitalDisplay} aria-hidden="true">
        {display.split('').map((char, index) => (
          <span
            key={index}
            className={char === ':' ? styles.colon : styles.digit}
          >
            {char}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_26_10_09.displayName = 'Clock_26_10_09';

export default Clock_26_10_09;
