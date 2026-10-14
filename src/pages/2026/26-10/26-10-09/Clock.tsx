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
import font from '@/assets/fonts/26fonts/26-10-09.ttf?url';

export const assets = [
  backgroundImage,
  windows2,
  windows3,
  windows4,
  windows5,
  windows6,
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
];

const pickRandomExcluding = (exclude: number): number => {
  const available = images.map((_, i) => i).filter((i) => i !== exclude);
  const index = Math.floor(Math.random() * available.length);
  return available[index] ?? exclude;
};

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

  // Precompute a long sequence of random image indices (different from previous)
  // and paired random tile sizes, so each cycle gets a different look.
  // Lazy state initializer is the idiomatic place for impure random generation.
  const [sequences] = useState(() => {
    const imgSeq: number[] = [];
    const sizeSeq: number[] = [];
    let prev = Math.floor(Math.random() * images.length);
    imgSeq.push(prev);
    // Tile size range: 12–24 vmin
    sizeSeq.push(12 + Math.random() * 12);
    for (let i = 0; i < 999; i++) {
      prev = pickRandomExcluding(prev);
      imgSeq.push(prev);
      sizeSeq.push(12 + Math.random() * 12);
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
  const currentSize = sequences.sizes[currentCycleIdx] ?? 18;
  const nextSize = sequences.sizes[nextCycleIdx] ?? 18;

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

  const containerStyle = {
    '--background-image': `url(${backgroundImage})`,
  } as CSSProperties;

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
    <main className={styles.container} style={containerStyle}>
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
