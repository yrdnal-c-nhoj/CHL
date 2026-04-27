import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';
import fontUrl from '@/assets/fonts/2026/26-04-24-lissa.ttf';

const CONFIG = {
  a: 3,
  b: 2,
  delta: Math.PI / 2,
  animationLength: 45,
  clockCount: 10,
  charGap: 0.02,
  clockGap: 0.08,
} as const;

const formatTime = (num: number) => num.toString().padStart(2, '0');

const generateLissajousPath = (width: number, height: number): string => {
  const { a, b, delta } = CONFIG;
  const numPoints = 150;
  const pad = Math.min(width, height) * 0.15;
  const scaleX = (width - pad) / 2;
  const scaleY = (height - pad) / 2;
  const cx = width / 2;
  const cy = height / 2;

  let d = '';

  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;
    const x = cx + scaleX * Math.sin(a * t + delta);
    const y = cy + scaleY * Math.sin(b * t);
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }

  return `${d.trim()} Z`;
};

function useLissajousPath(ref: React.RefObject<HTMLDivElement>) {
  const [path, setPath] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setPath(generateLissajousPath(width, height));
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return path;
}

const LissajousClock: React.FC = () => {
  const time = useClockTime();
  const containerRef = useRef<HTMLDivElement>(null);
  const path = useLissajousPath(containerRef);

  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'LissaFont', fontUrl }],
    []
  );

  useSuspenseFontLoader(fontConfigs);

  const characters = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    const s = formatTime(time.getSeconds());
    return `${h}:${m}:${s}`.split('');
  }, [time]);

  const totalCharacters = CONFIG.clockCount * characters.length;
  const step = 1 / totalCharacters;

  const getDelay = (clockIdx: number, charIdx: number) => {
    const index = clockIdx * characters.length + charIdx;
    return index * step * CONFIG.animationLength;
  };

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.clockContainer}>
        {path &&
          Array.from({ length: CONFIG.clockCount }).map((_, clockIdx) => (
            <React.Fragment key={`clock-${clockIdx}`}>
              {characters.map((char, charIdx) => (
                <span
                  key={`${clockIdx}-${charIdx}`}
                  className={styles.character}
                  style={{
                    offsetPath: `path("${path}")`,
                    animationDelay: `-${getDelay(clockIdx, charIdx)}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default LissajousClock;
