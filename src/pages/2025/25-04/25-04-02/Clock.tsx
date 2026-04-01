import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import stars from '@/assets/images/2025/25-04/25-04-02/stars.webp';
import backgroundGif from '@/assets/images/2025/25-04/25-04-02/437cb739d14912acd84d65ee853b9067.gif';
import overlay1 from '@/assets/images/2025/25-04/25-04-02/OzJtZ3Z.gif';
import overlay2 from '@/assets/images/2025/25-04/25-04-02/2556744_d34a4.webp';
import pixelGif from '@/assets/images/2025/25-04/25-04-02/sdswrf.gif';

// Image imports from src/assets
interface Images {
  stars: string;
  backgroundGif: string;
  overlay1: string;
  overlay2: string;
  pixelGif: string;
}

const images: Images = {
  stars,
  backgroundGif,
  overlay1,
  overlay2,
  pixelGif,
};

// Digit matrix type definition
type DigitMatrix = number[][];

// Digit patterns interface
interface DigitPatterns {
  [key: string]: DigitMatrix;
}

const digits: DigitPatterns = {
  0: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  1: [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  2: [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  3: [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  4: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  5: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  6: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  7: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  8: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  9: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
};

// Component Props interface
interface DeepSpaceClockProps {
  // No props required for this component
}

// Ref interface for digit elements
interface DigitRefs {
  hour1: React.RefObject<HTMLDivElement | null>;
  hour2: React.RefObject<HTMLDivElement | null>;
  minute1: React.RefObject<HTMLDivElement | null>;
  minute2: React.RefObject<HTMLDivElement | null>;
  second1: React.RefObject<HTMLDivElement | null>;
  second2: React.RefObject<HTMLDivElement | null>;
}

// Digit style interface
interface DigitStyle extends React.CSSProperties {
  display: 'grid';
  gridTemplateColumns: string;
  gridTemplateRows: string;
  width: string;
  height: string;
}

const DeepSpaceClock: React.FC = () => {
  const digitRefs: DigitRefs = {
    hour1: useRef<HTMLDivElement>(null),
    hour2: useRef<HTMLDivElement>(null),
    minute1: useRef<HTMLDivElement>(null),
    minute2: useRef<HTMLDivElement>(null),
    second1: useRef<HTMLDivElement>(null),
    second2: useRef<HTMLDivElement>(null),
  };

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

  const currentTime = useSecondClock();

  // Font loading configuration (memoized)
  const fontConfigs = useMemo<FontConfig[]>(() => {
    // Since this clock doesn't use custom fonts, return empty array
    return [];
  }, []);

  // Load fonts if needed (will be no-op for empty array)
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    let shownHours = -1,
      shownMinutes = -1,
      shownSeconds = -1;

    const updateClock = (): void => {
      const [h, m, s] = [
        currentTime.getHours().toString().padStart(2, '0'),
        currentTime.getMinutes().toString().padStart(2, '0'),
        currentTime.getSeconds().toString().padStart(2, '0'),
      ];

      if (h !== shownHours.toString()) {
        makeDigit(digitRefs.hour1, digits[h[0] as keyof DigitPatterns]!);
        makeDigit(digitRefs.hour2, digits[h[1] as keyof DigitPatterns]!);
        shownHours = parseInt(h);
      }
      if (m !== shownMinutes.toString()) {
        makeDigit(digitRefs.minute1, digits[m[0] as keyof DigitPatterns]!);
        makeDigit(digitRefs.minute2, digits[m[1] as keyof DigitPatterns]!);
        shownMinutes = parseInt(m);
      }
      if (s !== shownSeconds.toString()) {
        makeDigit(digitRefs.second1, digits[s[0] as keyof DigitPatterns]!);
        makeDigit(digitRefs.second2, digits[s[1] as keyof DigitPatterns]!);
        shownSeconds = parseInt(s);
      }
    };

    updateClock();
  }, [currentTime, makeDigit, digitRefs, digits]);

  return (
    <div
      style={{
        backgroundImage: `url(${images.stars})`,
        backgroundSize: 'cover',
        overflow: 'hidden',
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#333', // Fallback background color
      }}
    >
      <div
        style={{
          backgroundImage: `url(${images.backgroundGif})`,
          backgroundSize: 'cover',
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      />
      <div
        style={{
          backgroundImage: `url(${images.overlay1})`,
          backgroundSize: 'cover',
          position: 'fixed',
          inset: 0,
          opacity: 0.35,
          zIndex: 6,
        }}
      />
      <div
        style={{
          backgroundImage: `url(${images.overlay2})`,
          backgroundSize: 'cover',
          position: 'fixed',
          inset: 0,
          opacity: 0.15,
          zIndex: 5,
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '3vw',
          animation: 'spinClock 20s linear infinite',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <style>
          {`
            @keyframes spinClock {
              0% {
                transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
              }
              100% {
                transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
              }
            }
          `}
        </style>
        <div className="digit" ref={digitRefs.hour1} style={digitStyle}></div>
        <div className="digit" ref={digitRefs.hour2} style={digitStyle}></div>
        <div className="digit" ref={digitRefs.minute1} style={digitStyle}></div>
        <div className="digit" ref={digitRefs.minute2} style={digitStyle}></div>
        <div className="digit" ref={digitRefs.second1} style={digitStyle}></div>
        <div className="digit" ref={digitRefs.second2} style={digitStyle}></div>
      </div>
    </div>
  );
}

const digitStyle: DigitStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gridTemplateRows: 'repeat(5, 1fr)',
  width: '13vw',
  height: '44vh',
};

export default DeepSpaceClock;
