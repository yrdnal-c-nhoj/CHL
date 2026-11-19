import d25090116font from '@/assets/fonts/26fonts/26-01-10-bit.ttf?url';
import bgImage from '@/assets/images/26_images/26-01/26-01-10/moo.gif';
import { useClock } from '@/utils/hooks';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import styles from './Clock.module.css';

// Asset exports
export const assets = [bgImage, d25090116font];

const digitToLetter: Record<string, string> = {
  '0': ' ',
  '1': 'd',
  '2': 'a',
  '3': 'M',
  '4': 'x',
  '5': 'k',
  '6': 'm',
  '7': 'n',
  '8': 'o',
  '9': 't',
};

const ClockComponent = () => {
  const time = useClock();
  const [fontLoaded, setFontLoaded] = useState(false);
  const fontFaceRef = useRef<FontFace | null>(null);
  const startTimeRef = useRef<number>(time.getTime());

  // Load font with timeout fallback using clock time (no setTimeout)
  useEffect(() => {
    const fontFace = new FontFace('MyD25090116font', `url(${d25090116font})`, {
      display: 'block',
    });
    fontFaceRef.current = fontFace;

    fontFace.load().then(
      (loaded) => {
        document.fonts.add(loaded);
        setFontLoaded(true);
      },
      (err) => {
        console.warn('[26-01-10] Font load failed:', err);
        setFontLoaded(true);
      },
    );

    return () => {
      if (fontFaceRef.current) {
        document.fonts.delete(fontFaceRef.current);
      }
    };
  }, []);

  // Check for timeout using clock time (3 seconds)
  useEffect(() => {
    if (fontLoaded) return;
    const elapsed = time.getTime() - startTimeRef.current;
    if (elapsed >= 3000) {
      console.warn('[26-01-10] Font load timeout, using fallback');
      setFontLoaded(true);
    }
  }, [time, fontLoaded]);

  // Flatten all 6 digits for grid layout: H1, H2, M1, M2, S1, S2
  const digits = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    return [...h, ...m, ...s];
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.semanticTime}>
        {time.toLocaleTimeString()}
      </time>

      {/* Mirrored animated background */}
      <div className={styles.background}>
        <div
          className={styles.leftBackground}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div
          className={styles.rightBackground}
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </div>

      {/* Clock digits - 6 digits in grid */}
      <div className={styles.layout}>
        {digits.map((digit, index) => (
          <div key={index} className={styles.digitBox}>
            {digitToLetter[digit] ?? digit}
          </div>
        ))}
      </div>

      {!fontLoaded && <div className={styles.loadingFallback}>Loading...</div>}
    </main>
  );
};

ClockComponent.displayName = 'Clock_26_01_10';

export default ClockComponent;
