import type { FontConfig } from '@/types/clock';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const m1 = new URL('../../../../assets/images/26_images/26-07/26-07-07/3.webp', import.meta.url).href;
const tile = new URL('../../../../assets/images/26_images/26-07/26-07-07/1.webp', import.meta.url).href;
const m3 = new URL('../../../../assets/images/26_images/26-07/26-07-07/2.webp', import.meta.url).href;
const m4 = new URL('../../../../assets/images/26_images/26-07/26-07-07/4.webp', import.meta.url).href;

const fontUrl = new URL('../../../../assets/fonts/26fonts/26-07-07.ttf', import.meta.url).href;

const IMAGE_CONFIG = [
  { src: m1, maxCount: 6 },
  { src: tile, maxCount: 3 },
  { src: m3, maxCount: 3 },
  { src: m4, maxCount: 3 },
];

const ASSET_POOL = IMAGE_CONFIG.flatMap((config) =>
  Array.from({ length: config.maxCount }, () => config.src)
);

export const assets = [m1, m3, m4, tile];

interface ImageData {
  id: number;
  src: string;
  style: React.CSSProperties;
}

const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont_26_07_07', fontUrl }];

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

// Standalone function to generate randomized image properties safely
const createRandomImageData = (src: string, id: number): ImageData => {
  const size = Math.random() * 25 + 15;
  const rotation = Math.random() * 360;
  const flip = id % 2 === 0 ? 'scaleX(-1)' : '';

  return {
    id,
    src,
    style: {
      left: `${Math.random() * 85 - 5}%`,
      top: `${Math.random() * 85 - 5}%`,
      width: `${size}vmin`,
      transform: `rotate(\({rotation}deg)\){flip}`,
      zIndex: id,
    },
  };
};

const VTEC = () => {
  const time = useSmoothClock();
  const idCounter = useRef(0);
  const isMobile = useIsMobile();

  // Initialize state using standalone helper to avoid TDZ issues
  const [visibleImages, setVisibleImages] = useState(() =>
    ASSET_POOL.map((src) => createRandomImageData(src, idCounter.current++))
  );

  useSuspenseFontLoader(fontConfigs);

  // Clock Hand Rotations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360;
  const hourDegrees = (hours / 12) * 360;

  const cycleImage = useCallback(() => {
    setVisibleImages((prev) => {
      if (prev.length === 0) return prev;

      const next = [...prev];
      const replaceIndex = Math.floor(Math.random() * next.length);
      const randomSrc = ASSET_POOL[Math.floor(Math.random() * ASSET_POOL.length)];

      next[replaceIndex] = createRandomImageData(randomSrc, idCounter.current++);
      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(cycleImage, 1000);
    return () => clearInterval(interval);
  }, [cycleImage]);

  return (