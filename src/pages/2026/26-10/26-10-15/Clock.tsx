import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useState, useMemo, useEffect, useReducer } from 'react';
import image1 from '@/assets/images/26_images/26-10/26-10-15/1.webp';
import image2 from '@/assets/images/26_images/26-10/26-10-15/2.webp';
import image4 from '@/assets/images/26_images/26-10/26-10-15/4.webp';
import image5 from '@/assets/images/26_images/26-10/26-10-15/5.webp';
import image6 from '@/assets/images/26_images/26-10/26-10-15/6.webp';
import image7 from '@/assets/images/26_images/26-10/26-10-15/7.webp';
import image8 from '@/assets/images/26_images/26-10/26-10-15/8.webp';
import image9 from '@/assets/images/26_images/26-10/26-10-15/9.webp';
import image10 from '@/assets/images/26_images/26-10/26-10-15/10.webp';
import image11 from '@/assets/images/26_images/26-10/26-10-15/11.webp';
import font from '@/assets/fonts/26fonts/26-10-15.otf?url';

export const assets = [
  image1,
  image2,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
  font,
];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_10_15',
  fontUrl: font,
};

const allImages = [
  image1,
  image2,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
];

const DISPLAYED_IMAGE_COUNT = 18;

interface DisplayedImage {
  id: number;
  src: string;
  size: number;
  opacity: number;
  x: number;
  y: number;
}

interface GalleryState {
  images: DisplayedImage[];
  cycleCount: number;
}

type GalleryAction = { type: 'swap'; cycleOrder: number[] };

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const shuffle = (array: number[]): number[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    if (temp !== undefined && result[j] !== undefined) {
      result[i] = result[j];
      result[j] = temp;
    }
  }
  return result;
};

const createImage = (idx: number, id: number): DisplayedImage => {
  const src = allImages[idx];
  if (!src) throw new Error(`Image at index ${idx} not found`);
  return {
    id,
    src,
    size: randomBetween(15, 40),
    opacity: randomBetween(0.2, 0.8),
    x: randomBetween(5, 90),
    y: randomBetween(5, 90),
  };
};

const galleryReducer = (
  state: GalleryState,
  action: GalleryAction,
): GalleryState => {
  if (action.type === 'swap' && state.images.length > 0) {
    const [, ...rest] = state.images;
    const nextIdx =
      action.cycleOrder[
        (DISPLAYED_IMAGE_COUNT + state.cycleCount) % allImages.length
      ];
    if (nextIdx !== undefined) {
      return {
        images: [
          ...rest,
          createImage(nextIdx, DISPLAYED_IMAGE_COUNT + state.cycleCount),
        ],
        cycleCount: state.cycleCount + 1,
      };
    }
  }

  return state;
};

const Clock_26_10_15 = () => {
  useSuspenseFontLoader([fontConfig]);

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

  const time = useSmoothClock(prefersReducedMotion ? 1000 : 16);
  const currentSecond = Math.floor(time.getSeconds());

  const cycleOrder = useMemo(() => shuffle([...allImages.keys()]), []);
  const [state, dispatch] = useReducer(galleryReducer, null, () => {
    const initial: DisplayedImage[] = [];
    for (let i = 0; i < DISPLAYED_IMAGE_COUNT; i++) {
      const idx = cycleOrder[i % cycleOrder.length];
      if (idx !== undefined) {
        initial.push(createImage(idx, i));
      }
    }
    return { images: initial, cycleCount: 0 };
  });

  useEffect(() => {
    dispatch({ type: 'swap', cycleOrder });
  }, [currentSecond, cycleOrder]);

  return (
    <main className={styles.container}>
      <SRTime time={time} />

      <div className={styles.gallery}>
        {state.images.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt=""
            className={styles.galleryImage}
            style={{
              width: `${img.size}dvh`,
              height: `${img.size}dvh`,
              opacity: img.opacity,
              left: `${img.x}%`,
              top: `${img.y}%`,
            }}
            draggable={false}
          />
        ))}
      </div>

      <div className={styles.digitalClock}>
        {time
          .toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
          .replace(/:/g, '')
          .split('')
          .map((char, index) => (
            <span key={index} className={styles.digit}>
              {char}
            </span>
          ))}
      </div>
    </main>
  );
};

Clock_26_10_15.displayName = 'Clock_26_10_15';

export default Clock_26_10_15;
