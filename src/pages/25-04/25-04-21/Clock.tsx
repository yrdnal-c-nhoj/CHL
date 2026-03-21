import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';

import hourHand from '../../../assets/images/25-04/25-04-21/hour.gif';
import minuteHand from '../../../assets/images/25-04/25-04-21/minute.gif';
import secondHand from '../../../assets/images/25-04/25-04-21/second.gif';
import bgImage from '../../../assets/images/25-04/25-04-21/pp.gif'; // spinning layer
import mainBackground from '../../../assets/images/25-04/25-04-21/p.jpg'; // static full-screen background
import overlayTopLeft from '../../../assets/images/25-04/25-04-21/Pea.gif'; // top-left overlay
import overlayBottomRight from '../../../assets/images/25-04/25-04-21/Pea2.gif'; // bottom-right overlay (different file)

// Clock refs interface
interface ClockRefs {
  hour: React.RefObject<HTMLImageElement | null>;
  minute: React.RefObject<HTMLImageElement | null>;
  second: React.RefObject<HTMLImageElement | null>;
}

// Component Props interface
interface AnalogImageClockProps {
  // No props required for this component
}

export default function AnalogImageClock() {
  const clockRefs: ClockRefs = {
    hour: useRef<HTMLImageElement>(null),
    minute: useRef<HTMLImageElement>(null),
    second: useRef<HTMLImageElement>(null),
  };
  const rafRef = useRef<number>(0);

  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Use the standardized hook for smooth millisecond clock updates
  const currentTime = useMillisecondClock();

  const update = useCallback((): void => {
    const ms = currentTime.getMilliseconds();
    const s = currentTime.getSeconds() + ms / 1000;
    const m = currentTime.getMinutes() + s / 60;
    const h = (currentTime.getHours() % 12) + m / 60;

    if (clockRefs.hour.current) {
      clockRefs.hour.current.style.transform = `translate(-50%, -85%) rotate(${h * 30}deg)`;
    }
    if (clockRefs.minute.current) {
      clockRefs.minute.current.style.transform = `translate(-50%, -85%) rotate(${m * 6}deg)`;
    }
    if (clockRefs.second.current) {
      clockRefs.second.current.style.transform = `translate(-50%, -85%) rotate(${s * 6}deg)`;
    }
  }, [currentTime]);

  useEffect(() => {
    update();
  }, [update]);

  return (
    <div className="analog-clock">
      <style>{`
        .analog-clock {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: url(${mainBackground}) center/cover no-repeat;
          opacity: 1;
        }
        .background {
          position: absolute;
          inset: -5%;
          background: url(${bgImage}) center/cover no-repeat;
          z-index: 0;
        }
        .background.clockwise {
          animation: spin-cw 290s linear infinite;
          opacity: 0.5;
        }
        .background.counter {
          animation: spin-ccw 290s linear infinite;
          opacity: 0.3;
        }
        @keyframes spin-cw {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(-360deg) scale(1.5); }
        }
        .clock-face {
          position: relative;
          width: 90vmin; /* Increased to prevent clipping */
          height: 90vmin; /* Increased to prevent clipping */
          z-index: 1;
        }
        .hand {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 50% 85%;
          will-change: transform;
          opacity: 0.8;
          filter: drop-shadow(0 0.3rem 0.5rem rgba(0,0,0,0.4));
          pointer-events: none;
          width: auto;
          max-height: 100%; /* Ensure hands scale within clock face */
        }
        .hour-hand { height: 11rem; z-index: 2; }
        .minute-hand { height: 13rem; z-index: 3; }
        .second-hand { height: 15rem; z-index: 4; }
        .overlay {
          position: absolute;
          z-index: 10;
          width: 70vw;
          height: auto;
          opacity: 0.3;
          pointer-events: none;
        }
        .overlay.top-left {
          top: 0vh;
          left: 0vw;
        }
        .overlay.bottom-right {
          bottom: 0vh;
          right: 0vw;
        }
      `}</style>

      {/* Background layers */}
      <div className="background clockwise" />
      <div className="background counter" />

      {/* Clock */}
      <div className="clock-face" aria-label="Analog clock">
        <img
          decoding="async"
          loading="lazy"
          ref={clockRefs.hour}
          src={hourHand}
          alt="hour hand"
          className="hand hour-hand"
        />
        <img
          decoding="async"
          loading="lazy"
          ref={clockRefs.minute}
          src={minuteHand}
          alt="minute hand"
          className="hand minute-hand"
        />
        <img
          decoding="async"
          loading="lazy"
          ref={clockRefs.second}
          src={secondHand}
          alt="second hand"
          className="hand second-hand"
        />
      </div>

      {/* Overlay images */}
      <img
        decoding="async"
        loading="lazy"
        src={overlayTopLeft}
        alt="top left overlay"
        className="top-left overlay"
      />
      <img
        decoding="async"
        loading="lazy"
        src={overlayBottomRight}
        alt="bottom right overlay"
        className="bottom-right overlay"
      />
    </div>
  );
}
