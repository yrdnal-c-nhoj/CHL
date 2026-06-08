import tireFont from '@/assets/fonts/26fonts/26-05-27-tire.otf';
import tire from '@/assets/images/26_images/26-05/26-05-27/tire.webp';
import tireImage from '@/assets/images/26_images/26-05/26-05-27/tire2.webp';
import tireFlipImage from '@/assets/images/26_images/26-05/26-05-27/tireflip.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import { useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

// BTS: Export assets for the preloading pipeline
export const assets = [tire, tireImage, tireFlipImage, tireFont];

export default function TireTilingClock() {
  const time = useClockTime();
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  const LAYER_CONFIGS = useMemo(() => [
    { image: tireImage, size: 180, filter: 'brightness(1.2) contrast(1.7) saturation(5.0)' },
    { image: tireFlipImage, size: 100, filter: 'brightness(1.2) contrast(1.7) saturation(5.0)' },
    { image: tire, size: 37, filter: 'contrast(22.5)' },
  ], []);

  // Horizontal stripe configuration based on the requested layout
  const STRIPES = useMemo(() => [
    LAYER_CONFIGS[1], // Top 2: Small
    LAYER_CONFIGS[0], // Top 2: Small
    LAYER_CONFIGS[2], // Middle: Different (Medium)
    LAYER_CONFIGS[0], // Bottom 2: One image (Large)
    LAYER_CONFIGS[1], // Bottom 2: One image (Large)
  ], [LAYER_CONFIGS]);

  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: 'TireTrackFont',
        fontUrl: tireFont
      }
    ],
    []
  );

  useSuspenseFontLoader(fontConfigs);

  // Memoize ISO time for the semantic <time> element as per technical standards
  const isoTime = useMemo(() => time.toISOString(), [time]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className={styles.container}>
      {/* Animated Background Grids */}
      {STRIPES.map((layer, idx) => {
        const stripeHeight = windowSize.height / 5;
        const cols = Math.ceil(windowSize.width / layer.size) + 2;
        const rows = Math.ceil(stripeHeight / layer.size) + 2;

        return (
          <div
            key={idx}
            className={styles.stripe}
            style={{
              '--stripe-top': `${idx * 20}%`,
              '--grid-cols': cols,
              '--grid-size': `${layer.size}px`,
            } as React.CSSProperties}
          >
            {Array.from({ length: cols * rows }).map((_, i) => {
              const row = Math.floor(i / cols);
              const col = i % cols;
              const isFlipped = (row + col) % 2 !== 0;

              return (
                <div
                  key={i}
                  className={styles.tile}
                  style={{
                    '--tile-size': `${layer.size}px`,
                    '--tile-img': `url(${layer.image})`,
                    '--tile-filter': layer.filter,
                    '--tile-transform': isFlipped ? 'scaleX(-1)' : 'none',
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        );
      })}

      {/* Digital Readout */}
      <time dateTime={isoTime} className={styles.timeDisplay}>
        {time
          .toLocaleTimeString('en-GB', { hour12: false })
          .split('')
          .map((char, i) => (
            <div key={i} className={styles.digit}>
              {char}
            </div>
          ))}
      </time>
    </main>
  );
}