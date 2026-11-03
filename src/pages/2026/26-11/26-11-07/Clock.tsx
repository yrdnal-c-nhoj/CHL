import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useEffect, useRef, useState } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

import font from '@/assets/fonts/26fonts/26-11-02.ttf?url';

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
  const timeString = `${hours}:${minutes}`;
  const chars = timeString.split('');

  const gridRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new ResizeObserver(() => {
      const cell = grid.querySelector<HTMLDivElement>('.cell');
      const char = charRefs.current[0];
      if (!cell || !char) return;

      const cellRect = cell.getBoundingClientRect();
      const charRect = char.getBoundingClientRect();
      if (charRect.width === 0 || charRect.height === 0) return;

      setScaleX(cellRect.width / charRect.width);
      setScaleY(cellRect.height / charRect.height);
    });

    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <div ref={gridRef} className={styles.grid} aria-hidden="true">
        {Array.from({ length: 3 }, (_, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {chars.map((char, colIndex) => {
              const index = rowIndex * chars.length + colIndex;
              return (
                <div key={colIndex} className={styles.cell}>
                  <span
                    ref={(el) => {
                      charRefs.current[index] = el;
                    }}
                    style={{
                      transform: `scale(${scaleX}, ${scaleY})`,
                      transformOrigin: 'center center',
                      display: 'inline-block',
                    }}
                  >
                    {char}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Clock;
Clock.displayName = 'Clock_26_11_02';
