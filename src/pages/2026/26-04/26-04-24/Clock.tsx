import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import fontUrl from '@/assets/fonts/2026/26-04-24-lissa.ttf';

const CONFIG = {
  a: 3,
  b: 2,
  delta: Math.PI / 2,
  animationLength: 45,

  clockCount: 10,
  fontSize: '8.8vmin',
  charGap: 0.02,
  clockGap: 0.08,

  fontColor: '#5A1F04',
  background: 'linear-gradient(-185deg, #7FAEEF 0%, #7FAEEF 44%, #D8A4EB 80%, #F7E1AE 100%)',
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

  const containerStyle: React.CSSProperties = {
    width: '90vw',
    height: '90vh',
    margin: 'auto',
    position: 'relative',
  };

  const charStyleBase: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'inline-block',
    color: CONFIG.fontColor,
    fontFamily: 'LissaFont, system-ui, sans-serif',
    fontSize: CONFIG.fontSize,
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    whiteSpace: 'pre',
    offsetPath: `path("${path}")`,
    offsetRotate: 'auto',
    animation: `movePath ${CONFIG.animationLength}s linear infinite`,
    willChange: 'offset-distance',
    pointerEvents: 'none',
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: CONFIG.background,
      }}
    >
      <style>{`
        @keyframes movePath {
          from { offset-distance: 0%; }
          to { offset-distance: 100%; }
        }
      `}</style>

      <div ref={containerRef} style={containerStyle}>
        {path &&
          Array.from({ length: CONFIG.clockCount }).map((_, clockIdx) => (
            <React.Fragment key={`clock-${clockIdx}`}>
              {characters.map((char, charIdx) => (
                <span
                  key={`${clockIdx}-${charIdx}`}
                  style={{
                    ...charStyleBase,
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
