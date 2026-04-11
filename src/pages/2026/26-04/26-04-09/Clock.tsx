import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-09/water.mp4';
export { backgroundVideo }; // Export for preloading pipeline

import waterFontUrl from '@/assets/fonts/26-04-09-water.ttf?url';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const [digitTransforms, setDigitTransforms] = useState([
    { y: 0, rotate: 0, scale: 1 },
    { y: 0, rotate: 0, scale: 1 },
    { y: 0, rotate: 0, scale: 1 },
    { y: 0, rotate: 0, scale: 1 },
  ]);
  const timeRef = useRef(0);
  const animationRef = useRef<number | undefined>(undefined);
  const time = useClockTime();

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Water', fontUrl: waterFontUrl }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // Independent motion animation for each digit - choppy water chaos
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.018; // Moderate time increment
      const t = timeRef.current;

      // Chaotic choppy wave motion - bigger, faster, more random
      const newTransforms = [
        // Digit 0 (first hour digit) - big choppy waves
        {
          y: Math.sin(t * 1.5) * 18 + Math.cos(t * 2.3) * 12 + Math.sin(t * 3.7) * 6,
          rotate: Math.sin(t * 1.2) * 25 + Math.cos(t * 1.8) * 15 + Math.sin(t * 4.2) * 8,
          scale: 1 + Math.sin(t * 0.9) * 0.08 + Math.cos(t * 2.1) * 0.04,
        },
        // Digit 1 (second hour digit) - erratic chop
        {
          y: Math.cos(t * 1.7) * 22 + Math.sin(t * 2.9) * 10 + Math.cos(t * 4.5) * 7,
          rotate: Math.cos(t * 1.4) * 30 + Math.sin(t * 2.1) * 12 + Math.cos(t * 3.8) * 9,
          scale: 1 + Math.cos(t * 1.1) * 0.09 + Math.sin(t * 2.7) * 0.05,
        },
        // Digit 2 (first minute digit) - rapid turbulent
        {
          y: Math.sin(t * 2.0) * 20 + Math.sin(t * 3.4) * 14 + Math.cos(t * 5.2) * 5,
          rotate: Math.sin(t * 1.6) * 28 + Math.cos(t * 2.5) * 14 + Math.sin(t * 4.8) * 10,
          scale: 1 + Math.sin(t * 1.3) * 0.07 + Math.cos(t * 3.3) * 0.06,
        },
        // Digit 3 (second minute digit) - wild surge
        {
          y: Math.cos(t * 1.8) * 24 + Math.cos(t * 3.1) * 11 + Math.sin(t * 4.9) * 8,
          rotate: Math.cos(t * 1.3) * 32 + Math.sin(t * 2.7) * 16 + Math.cos(t * 4.1) * 11,
          scale: 1 + Math.cos(t * 1.0) * 0.1 + Math.sin(t * 2.9) * 0.05,
        },
      ];

      setDigitTransforms(newTransforms);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // 24-hour format with leading zeros, no seconds
  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const digits = [h[0], h[1], m[0], m[1]];

  const getDigitStyle = (index: number): React.CSSProperties => {
    const t = digitTransforms[index]!;
    return {
      fontFamily: 'Water, monospace',
      '--digit-y': `${t.y}px`,
      '--digit-rotate': `${t.rotate}deg`,
      '--digit-scale': t.scale,
    } as React.CSSProperties;
  };

  return (
    <div className={styles.container}>
      <video className={styles.video} autoPlay muted loop playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className={styles.clockWrapper}>
        <div className={styles.digitsContainer}>
          <span className={styles.digitBox} style={getDigitStyle(0)}>{digits[0]}</span>
          <span className={styles.digitBox} style={getDigitStyle(1)}>{digits[1]}</span>
          <span className={styles.space}></span>
          <span className={styles.digitBox} style={getDigitStyle(2)}>{digits[2]}</span>
          <span className={styles.digitBox} style={getDigitStyle(3)}>{digits[3]}</span>
        </div>
      </div>
    </div>
  );
};

export default Clock;
