import shapesFont from '@/assets/fonts/26fonts/26-07-13.ttf?url';
import clockVideo from '@/assets/images/26_images/26-07/26-07-13/click.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

export const assets = [clockVideo, shapesFont];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: shapesFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

// This mapping converts numeric digits to the corresponding characters in the "ShapesFont".
// Defined outside the component to prevent re-declaration on every render.
const DIGIT_TO_SHAPE_MAP: Record<string, string> = {
  '0': 'A',
  '1': 'R',
  '2': 'j',
  '3': '8',
  '4': 'm',
  '5': 'l',
  '6': '6',
  '7': 'o',
  '8': 'K',
  '9': '3',
};

const styles: Record<string, React.CSSProperties> = {
  clockWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#191B1B',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(1) contrast(1.2) saturate(6)',
  },
clockContainer: {
  fontFamily: 'ShapesFont, monospace',
  position: 'relative',
  zIndex: 2,
  display: 'grid',
  color: '#FBA433',
  justifyItems: 'center',
  alignItems: 'center',
  // Standard Web CSS Text Shadow syntax: "h-offset v-offset blur-radius color"
  textShadow: '2px 2px 0px #C5B0F0, -2px 2px 0px #22045F',
},
  digit: {
    lineHeight: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums',
  },
};

const Clock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const timeString = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds());
  }, [time]);

  const digits = timeString.split('');

  const displayed = useMemo(() =>
    digits.map((d) => DIGIT_TO_SHAPE_MAP[d] ?? d),
    [digits]);

  return (
    <div style={styles.clockWrapper}>
      {/* Injected responsive layout styles */}
      <style>{`
        /* Laptop / Desktop (Default): All 6 digits in 1 row */
        .responsive-clock-grid {
          grid-template-columns: repeat(6, 1fr);
          gap: 4vw;
        }
        .responsive-digit {
          font-size: clamp(3rem, 15vw, 12rem);
        }

        /* Phone: 2 columns, 3 rows */
        @media (max-width: 768px) {
          .responsive-clock-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 3vh 15vw;
          }
          .responsive-digit {
            font-size: clamp(4rem, 33vh, 8rem);
          }
        }
      `}</style>

      <div style={styles.background}>
        <video
          style={styles.backgroundVideo}
          src={clockVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <time
        dateTime={time.toISOString()}
        aria-label="A digital clock displaying the time using abstract shapes."
        style={styles.clockContainer}
        className="responsive-clock-grid"
      >
        {displayed.map((letter, index) => (
          <div key={index} style={styles.digit} className="responsive-digit">
            {letter}
          </div>
        ))}
      </time>
    </div>
  );
};

export default Clock;