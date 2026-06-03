import bgImage from '@/assets/images/26_images/26-06/26-06-02/boom.webp';
import vtecImage from '@/assets/images/26_images/26-06/26-06-02/vtec.webp';
import { useClockTime } from '@/utils/clockUtils';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

import m1 from '@/assets/images/26_images/26-06/26-06-02/1.webp';
import m10 from '@/assets/images/26_images/26-06/26-06-02/10.webp';
import m11 from '@/assets/images/26_images/26-06/26-06-02/11.webp';
import m12 from '@/assets/images/26_images/26-06/26-06-02/12.webp';
import m13 from '@/assets/images/26_images/26-06/26-06-02/13.webp';
import m2 from '@/assets/images/26_images/26-06/26-06-02/2.webp';
import m3 from '@/assets/images/26_images/26-06/26-06-02/3.webp';
import m4 from '@/assets/images/26_images/26-06/26-06-02/4.webp';
import m5 from '@/assets/images/26_images/26-06/26-06-02/5.webp';
import m6 from '@/assets/images/26_images/26-06/26-06-02/6.webp';
import m7 from '@/assets/images/26_images/26-06/26-06-02/7.webp';
import m8 from '@/assets/images/26_images/26-06/26-06-02/8.webp';
import m9 from '@/assets/images/26_images/26-06/26-06-02/9.webp';

const allMatchImages = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13];

// Export assets for the preloading pipeline
export const assets = [bgImage, vtecImage, ...allMatchImages];

interface ImageSetting {
  size: string;
  opacity: number;
  brightness: number;
  saturation: number;
  vignetteBlackStop: string;
  vignetteTransparentStop: string;
}

const imageSettings: ImageSetting[] = [
  { size: '21%', opacity: 0.6, brightness: 1.2, saturation: 1.2, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '21%', opacity: 0.6, brightness: 1.0, saturation: 1.5, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '21%', opacity: 0.6, brightness: 1.2, saturation: 2.2, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '21%', opacity: 0.6, brightness: 1.2, saturation: 1.7, vignetteBlackStop: '40%', vignetteTransparentStop: '65%' },
  { size: '21%', opacity: 0.6, brightness: 1.0, saturation: 2.0, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '22%', opacity: 0.6, brightness: 1.4, saturation: 1.5, vignetteBlackStop: '40%', vignetteTransparentStop: '75%' },
  { size: '31%', opacity: 0.6, brightness: 0.9, saturation: 1.1, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '29%', opacity: 0.6, brightness: 1.3, saturation: 1.9, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '31%', opacity: 0.6, brightness: 1.3, saturation: 3.0, vignetteBlackStop: '20%', vignetteTransparentStop: '55%' },
  { size: '31%', opacity: 0.6, brightness: 1.3, saturation: 1.6, vignetteBlackStop: '100%', vignetteTransparentStop: '100%' },
  { size: '38%', opacity: 0.6, brightness: 0.9, saturation: 1.8, vignetteBlackStop: '40%', vignetteTransparentStop: '65%' },
  { size: '32%', opacity: 0.6, brightness: 1.3, saturation: 1.7, vignetteBlackStop: '40%', vignetteTransparentStop: '85%' },
  { size: '31%', opacity: 0.6, brightness: 1.4, saturation: 1.8, vignetteBlackStop: '40%', vignetteTransparentStop: '55%' },
];

interface HandProps {
  deg: number;
  width: string;
  height: string;
  z: number;
  variant: 'hour' | 'minute' | 'second';
}

const Hand = React.memo(({ deg, width, height, z, variant }: HandProps) => (
  <div
    className={`${styles.hand} ${styles[`hand_${variant}`]}`}
    style={{
      width,
      height,
      zIndex: z,
      transform: `translateX(-50%) rotate(${deg}deg)`,
      transition: 'none',
    } as React.CSSProperties}
    aria-hidden="true"
  />
));
Hand.displayName = 'Hand';

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
            '--vignette-black': config.vignetteBlackStop,
            '--vignette-transparent': config.vignetteTransparentStop,
          } as React.CSSProperties}
          alt=""
        />
      );
    })}
  </>
));
ClockFace.displayName = 'ClockFace';

const Clock: React.FC = () => {
  const time = useClockTime();
  const [gameState, setGameState] = useState<{ face: number[]; spare: number }>({
    face: [],
    spare: -1,
  });

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

  const rotations = useMemo(() => {
    const s = seconds + milliseconds / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return { sec: s * 6, min: m * 6, hr: h * 30 };
  }, [seconds, milliseconds, time]);

  return (
    <div className={styles.container} role="timer" aria-label="Clock for June 02">
      <div
        className={styles.backgroundLayer}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: '50% 50%',
        }}
      />

      {/* VTEC Image overlay from your previous CSS */}
      <img 
        src={vtecImage} 
        className={styles.vtecImage} 
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '30%', zIndex: 2 }} 
        alt="" 
      />

      <div 
        style={{ 
          position: 'absolute', 
          top: '5%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.9rem',
          letterSpacing: '0.3em',
          zIndex: 5
        }}
      >
        JUNE 02
      </div>

      <div className={styles.clock}>
        <ClockFace faceIndices={gameState.face} />
        <Hand deg={rotations.hr} width="12%" height="28%" z={3} variant="hour" />
        <Hand deg={rotations.min} width="8%" height="42%" z={4} variant="minute" />
        <Hand deg={rotations.sec} width="4%" height="46%" z={5} variant="second" />
      </div>
    </div>
  );
};

export default Clock;