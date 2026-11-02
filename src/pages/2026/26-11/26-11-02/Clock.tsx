import SRTime from '@/components/SRTime';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import { useEffect, useRef } from 'react';

import font from '@/assets/fonts/26fonts/26-11-02.ttf?url';

import styles from './Clock.module.css';

export const assets = [font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_02',
  fontUrl: font,
};

const Clock = () => {
  const time = useClock();
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  const chars = `${hours}${minutes}${seconds}`.split('');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate font size: container width / 6 chars (capped by height)
    const setFontSize = () => {
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width / 5, rect.height);
      // For fixed font size, replace above with: const size = 120; // your pixel value
      container.style.setProperty('--font-size', `${size}px`);
    };

    setFontSize();
    const observer = new ResizeObserver(setFontSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.container} ref={containerRef}>
      <SRTime time={time} />
      <div
        className={styles.grid}
        aria-hidden="true"
        role="img"
        aria-label={timeString}
      >
        {chars.map((char, index) => (
          <div key={index} className={styles.cell}>
            <span className={styles.char}>{char}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_02';
