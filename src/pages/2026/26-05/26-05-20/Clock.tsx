import clockFont from '@/assets/fonts/26fonts/26-05-20.otf';
import backgroundImage from '@/assets/images/26_images/26-05/26-05-20/background.jpg';
import type { FontConfig } from '@/types/clock';
import { ClockLoadingFallback, useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets: string[] = [clockFont, backgroundImage];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont', fontUrl: clockFont }
];

const ClockInner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  
  // Standardized hook for time management
  const now = useClockTime();
  
  // Load fonts via Suspense
  useSuspenseFontLoader(fontConfigs);

  const { formattedTime, isoTime } = useMemo(() => {
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');
    return { formattedTime: `${h}:${m}:${s}`, isoTime: now.toISOString() };
  }, [now]);

  // Door animation cycle
  useEffect(() => {
    const openDoors = () => {
      setIsOpen(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, 2800); // slightly shorter than animation duration for snappier feel
    };

    openDoors();
    const intervalId = window.setInterval(openDoors, 6200);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // Explicitly manage body background and cleanup
  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      {/* SVG Filter */}
      <svg width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="brushedMetalEffect" x="0" y="0">
            <feComponentTransfer in="SourceGraphic" result="metal">
              <feFuncR type="gamma" amplitude="1.21" exponent="0.53" />
              <feFuncG type="gamma" amplitude="1.21" exponent="0.53" />
              <feFuncB type="gamma" amplitude="1.21" exponent="0.5" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="metal" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <main 
        className={styles.container} 
        style={{ '--bg-image': `url(${backgroundImage})` } as React.CSSProperties}
      >
        <section className={`${styles.frame} ${isOpen ? styles.isOpen : ''}`}>
          <div className={styles.doors}>
            <div className={`${styles.door} ${styles.leftDoor}`} />
            <div className={`${styles.door} ${styles.rightDoor}`} />
          </div>

          <div className={styles.inside}>
            <time className={styles.digitalClock} dateTime={isoTime}>
              {formattedTime}
            </time>
          </div>
        </section>
      </main>
    </>
  );
};

const Clock: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

export default Clock;
