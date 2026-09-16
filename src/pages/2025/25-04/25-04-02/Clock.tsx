import React, { useEffect, useRef, useMemo, useCallback , memo } from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

import stars from '@/assets/images/25_images/25-04/25-04-02/stars.webp';
import backgroundGif from '@/assets/images/25_images/25-04/25-04-02/437cb739d14912acd84d65ee853b9067.gif';
import overlay1 from '@/assets/images/25_images/25-04/25-04-02/OzJtZ3Z.gif';
import overlay2 from '@/assets/images/25_images/25-04/25-04-02/2556744_d34a4.webp';
import pixelGif from '@/assets/images/25_images/25-04/25-04-02/sdswrf.gif';

export const assets = [stars, backgroundGif, overlay1, overlay2, pixelGif];

const images = { stars, backgroundGif, overlay1, overlay2, pixelGif };

type DigitMatrix = number[][];
interface DigitPatterns { [key: string]: DigitMatrix; }
interface DigitStyle extends React.CSSProperties {
  display: 'grid';
  gridTemplateColumns: string;
  gridTemplateRows: string;
  width: string;
  height: string;
}

const digits: DigitPatterns = {
  0: [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
  1: [[1,1,0],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  2: [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
  3: [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
  4: [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  5: [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
  6: [[1,0,0],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
  7: [[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
  8: [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
  9: [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
};

const DeepSpaceClock =  () => {
  const hour1Ref = useRef<HTMLDivElement>(null);
  const hour2Ref = useRef<HTMLDivElement>(null);
  const minute1Ref = useRef<HTMLDivElement>(null);
  const minute2Ref = useRef<HTMLDivElement>(null);
  const second1Ref = useRef<HTMLDivElement>(null);
  const second2Ref = useRef<HTMLDivElement>(null);

  const makeDigit = useCallback((target: React.RefObject<HTMLDivElement | null>, digitMatrix: DigitMatrix): void => {
    const container = target.current;
    if (!container) return;
    container.innerHTML = '';
    digitMatrix.forEach((row: number[], i: number) =>
      row.forEach((on: number, j: number) => {
        if (on) {
          const div = document.createElement('div');
          div.style.gridRow = `${i + 1}`;
          div.style.gridColumn = `${j + 1}`;
          div.style.height = '4vmin';
          div.style.width = '4vmin';
          div.style.backgroundImage = `url(${images.pixelGif})`;
          div.style.backgroundSize = '220% 250%';
          container.appendChild(div);
        }
      }),
    );
  }, []);

  const currentTime = useClock();
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    let shownHours = -1, shownMinutes = -1, shownSeconds = -1;
    const updateClock = (): void => {
      const [h, m, s] = [
        currentTime.getHours().toString().padStart(2, '0'),
        currentTime.getMinutes().toString().padStart(2, '0'),
        currentTime.getSeconds().toString().padStart(2, '0'),
      ];
      if (h !== shownHours.toString()) {
        makeDigit(hour1Ref, digits[h[0] as keyof DigitPatterns]!);
        makeDigit(hour2Ref, digits[h[1] as keyof DigitPatterns]!);
        shownHours = parseInt(h, 10);
      }
      if (m !== shownMinutes.toString()) {
        makeDigit(minute1Ref, digits[m[0] as keyof DigitPatterns]!);
        makeDigit(minute2Ref, digits[m[1] as keyof DigitPatterns]!);
        shownMinutes = parseInt(m, 10);
      }
      if (s !== shownSeconds.toString()) {
        makeDigit(second1Ref, digits[s[0] as keyof DigitPatterns]!);
        makeDigit(second2Ref, digits[s[1] as keyof DigitPatterns]!);
        shownSeconds = parseInt(s, 10);
      }
    };
    updateClock();
  }, [
    currentTime,
    makeDigit,
    hour1Ref,
    hour2Ref,
    minute1Ref,
    minute2Ref,
    second1Ref,
    second2Ref,
  ]);

  const digitStyle: DigitStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(5, 1fr)',
    width: '13vw',
    height: '44dvh',
  };

  return (
    <main className={styles.container} style={{
      backgroundImage: `url(${images.stars})`,
      backgroundSize: 'cover',
      overflow: 'hidden',
      height: '100dvh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor: '#333',
    }}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>

      <div style={{
        backgroundImage: `url(${images.backgroundGif})`,
        backgroundSize: 'cover',
        position: 'absolute',
        inset: 0,
        zIndex: 1,
      }} />
      <div style={{
        backgroundImage: `url(${images.overlay1})`,
        backgroundSize: 'cover',
        position: 'fixed',
        inset: 0,
        opacity: 0.35,
        zIndex: 6,
      }} />
      <div style={{
        backgroundImage: `url(${images.overlay2})`,
        backgroundSize: 'cover',
        position: 'fixed',
        inset: 0,
        opacity: 0.15,
        zIndex: 5,
      }} />
      <div className={styles.spinClock}>
        <div className="digit" ref={hour1Ref} style={digitStyle} />
        <div className="digit" ref={hour2Ref} style={digitStyle} />
        <div className="digit" ref={minute1Ref} style={digitStyle} />
        <div className="digit" ref={minute2Ref} style={digitStyle} />
        <div className="digit" ref={second1Ref} style={digitStyle} />
        <div className="digit" ref={second2Ref} style={digitStyle} />
      </div>
    </main>
  );
};

const MemoizedDeepSpaceClock = memo(DeepSpaceClock);
MemoizedDeepSpaceClock.displayName = 'Clock_25_04_02';
export default MemoizedDeepSpaceClock;
