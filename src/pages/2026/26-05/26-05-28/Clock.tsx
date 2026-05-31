import bgImage from '@/assets/images/26_images/26-05/26-05-28/boom.webp';
import { useClockTime } from '@/utils/clockUtils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

import m1 from '@/assets/images/26_images/26-05/26-05-28/1.webp';
import m10 from '@/assets/images/26_images/26-05/26-05-28/10.webp';
import m11 from '@/assets/images/26_images/26-05/26-05-28/11.webp';
import m12 from '@/assets/images/26_images/26-05/26-05-28/12.webp';
import m13 from '@/assets/images/26_images/26-05/26-05-28/13.webp';
import m2 from '@/assets/images/26_images/26-05/26-05-28/2.webp';
import m3 from '@/assets/images/26_images/26-05/26-05-28/3.webp';
import m4 from '@/assets/images/26_images/26-05/26-05-28/4.webp';
import m5 from '@/assets/images/26_images/26-05/26-05-28/5.webp';
import m6 from '@/assets/images/26_images/26-05/26-05-28/6.webp';
import m7 from '@/assets/images/26_images/26-05/26-05-28/7.webp';
import m8 from '@/assets/images/26_images/26-05/26-05-28/8.webp';
import m9 from '@/assets/images/26_images/26-05/26-05-28/9.webp';

const allMatchImages = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13];

// Export assets for the preloading pipeline
export const assets = [bgImage, ...allMatchImages];

const imageSettings = [
  {
    size: '21%',
    opacity: 0.6,
    brightness: 10.5,
    saturation: 1.2,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '85%',
  },
  {
    size: '21%',
    opacity: 0.6,
    brightness: 1.0,
    saturation: 1.5,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '85%',
  },
  {
    size: '21%',
    opacity: 0.6,
    brightness: 1.2,
    saturation: 2.2,
    vignetteBlackStop: '100%',
    vignetteTransparentStop: '100%',
  },
  {
    size: '21%',
    opacity: 0.6,
    brightness: 1.2,
    saturation: 1.7,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '65%',
  },
  {
    size: '21%',
    opacity: 0.6,
    brightness: 1.0,
    saturation: 2.0,
    vignetteBlackStop: '100%',
    vignetteTransparentStop: '100%',
  },
  {
    size: '22%',
    opacity: 0.6,
    brightness: 1.4,
    saturation: 1.5,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '75%',
  },
  {
    size: '31%',
    opacity: 0.6,
    brightness: 0.9,
    saturation: 1.1,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '85%',
  },
  {
    size: '29%',
    opacity: 0.6,
    brightness: 1.3,
    saturation: 1.9,
    vignetteBlackStop: '100%',
    vignetteTransparentStop: '100%',
  },
  {
    size: '31%',
    opacity: 0.6,
    brightness: 1.3,
    saturation: 3.0,
    vignetteBlackStop: '20%',
    vignetteTransparentStop: '55%',
  },
  {
    size: '31%',
    opacity: 0.6,
    brightness: 1.3,
    saturation: 1.6,
    vignetteBlackStop: '100%',
    vignetteTransparentStop: '100%',
  },
  {
    size: '38%',
    opacity: 0.6,
    brightness: 0.9,
    saturation: 1.8,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '65%',
  },
  {
    size: '32%',
    opacity: 0.6,
    brightness: 1.3,
    saturation: 1.7,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '85%',
  },
  {
    size: '31%',
    opacity: 0.6,
    brightness: 1.4,
    saturation: 1.8,
    vignetteBlackStop: '40%',
    vignetteTransparentStop: '55%',
  },
];

interface HandProps {
  deg: number;
  width: string;
  height: string;
  z: number;
  isSec?: boolean;
  ms?: number;
  variant: 'hour' | 'minute' | 'second';
}

/**
 * Memoized Hand component to prevent re-renders on the 12 clock face images
 * when the high-frequency clock hands move.
 */
const Hand = React.memo(({ deg, width, height, z, isSec, ms, variant }: HandProps) => (
  <div
    className={`${styles.hand} ${styles[`hand_${variant}`]}`}
    style={{
      width,
      height,
      zIndex: z,
      transform: `translateX(-50%) rotate(${deg}deg)`,
      transition: isSec && ms !== undefined && ms >= 100 ? 'transform 0.1s linear' : 'none',
    }}
    aria-hidden="true"
  />
));

/**
 * Sub-component to isolate the 12 face images, ensuring they only 
 * re-render once per second rather than every frame.
 */
const ClockFace = React.memo(({ faceIndices }: { faceIndices: number[] }) => (
  <>
    {faceIndices.map((imgIdx, i) => {
      if (imgIdx === -1) return null;

      const angle = (i + 1) * 30 - 90;
      const rad = (angle * Math.PI) / 180;
      const x = 50 + 40 * Math.cos(rad);
      const y = 50 + 40 * Math.sin(rad);
      const config = imageSettings[imgIdx];

      return (
        <img
          key={`pos-${i}`}
          src={allMatchImages[imgIdx]}
          className={styles.faceImage}
          style={{
            width: config.size,
            height: config.size,
            left: `${x}%`,
            top: `${y}%`,
            opacity: config.opacity,
            filter: `brightness(${config.brightness}) saturate(${config.saturation})`,
            ['--vignette-black' as string]: config.vignetteBlackStop,
            ['--vignette-transparent' as string]: config.vignetteTransparentStop,
          }}
          alt=""
        />
      );
    })}
  </>
));

const Clock: React.FC = () => {
  const time = useClockTime();
  const [gameState, setGameState] = useState<{ face: number[]; spare: number }>({
    face: [],
    spare: -1,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const randomize = useCallback(() => {
    const indices = Array.from({ length: allMatchImages.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return { face: indices.slice(0, 12), spare: indices[12] };
  }, []);

  const lastProcessedSec = useRef<number>(-1);
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  useEffect(() => {
    if (seconds !== lastProcessedSec.current) {
      lastProcessedSec.current = seconds;
      setGameState((prev) => {
        if (prev.face.length === 0 || seconds % 12 === 0) {
          return randomize();
        }
        const activePos = (12 - (seconds % 12)) % 12;
        const newFace = [...prev.face];
        const outgoing = newFace[activePos];
        newFace[activePos] = prev.spare;
        return { face: newFace, spare: outgoing };
      });
    }
  }, [seconds, randomize]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const rotations = useMemo(() => {
    const s = seconds + milliseconds / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return { sec: s * 6, min: m * 6, hr: h * 30 };
  }, [seconds, milliseconds, time]);

  return (
    <div className={styles.container}>
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: isLoaded ? '40% 50%' : '30% 50%',
          transition: 'background-position 2s ease-out',
        }}
      />

      <div className={styles.clock}>
        <ClockFace faceIndices={gameState.face} />
        
        {/* Hands (CSS-based, no image assets) */}
        <Hand deg={rotations.hr} width="26%" height="30%" z={2} variant="hour" />
        <Hand deg={rotations.min} width="84%" height="60%" z={3} variant="minute" />
        <Hand
          deg={rotations.sec}
          width="72%"
          height="50%"
          z={4}
          isSec
          ms={milliseconds}
          variant="second"
        />
      </div>
    </div>
  );
};

export default Clock;
