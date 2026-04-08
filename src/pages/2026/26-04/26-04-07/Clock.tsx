import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useMultipleFontLoader } from '@/utils/fontLoader';
import bgImage from '@/assets/images/2026/26-04/26-04-07/6.jpg';
import wallFont from '@/assets/fonts/26-04-07-wall.ttf';

const formatDigit = (num: number) => num.toString().padStart(2, '0');

const DigitBox: React.FC<{ value: string }> = ({ value }) => (
  <span style={styles.digitBox}>{value}</span>
);

const Clock: React.FC = () => {
  useMultipleFontLoader([{
    fontFamily: 'Wall_26-04-07',
    fontUrl: wallFont,
    options: { weight: 'normal', style: 'normal' }
  }]);

  const time = useClockTime();

  // Current time digits
  const digits = useMemo(() => {
    const h = formatDigit(time.getHours());
    const m = formatDigit(time.getMinutes());
    return [...h, ...m];
  }, [time]);

  // We create a "Set" of clocks (e.g., 4 clocks in a row)
  // Then we duplicate that set to create the seamless loop.
  const clockCountInSet = 4;
  const clockSet = Array.from({ length: clockCountInSet });

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes panBackground {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Background Layer */}
      <div style={styles.backgroundWrapper}>
        <img src={bgImage} style={styles.bgImage} alt="" />
        <img src={bgImage} style={styles.bgImage} alt="" aria-hidden="true" />
      </div>

      {/* The Scrolling Ribbon */}
      <div style={styles.marqueeContainer}>
        <div style={styles.marqueeTrack}>
          {/* We render the set twice to make it seamless */}
          {[...clockSet, ...clockSet].map((_, index) => (
            <div key={index} style={styles.clockInstance}>
              {digits.map((d, i) => (
                <DigitBox key={i} value={d} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  backgroundWrapper: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
    animation: 'panBackground 30s linear infinite',
  },
  bgImage: {
    height: '100%',
    width: 'auto',
  },
  marqueeContainer: {
    position: 'absolute',
    top: '10%',
    left: 0,
    width: '100%',
    // transform: 'translateY(-170%)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  marqueeTrack: {
    display: 'flex',
    width: 'fit-content', // Important: shrinks to fit all clocks in a line
    animation: 'marquee 60s linear infinite',
  },
  clockInstance: {
    display: 'flex',
    fontFamily: 'Wall_26-04-07, monospace',
    fontSize: 'clamp(3rem, 12vw, 7rem)',
    color: '#fff',
    paddingRight: '5vw', // This creates the "spacing" between clocks
  },
  digitBox: {
    display: 'inline-block',
    width: '0.5ch',
    textAlign: 'center',
    padding: '0.15em 0.25em',
    margin: '0 0.08em',
    // backgroundColor: '#d4c5a9',
    // border: '2px solid #8b7355',
    // borderRadius: '2px',
    color: '#3d2914',
    // textShadow: '1px 1px 0 rgba(139, 115, 85, 0.4)',
    // boxShadow: 'inset 0 0 8px rgba(139, 115, 85, 0.3), 2px 2px 4px rgba(0,0,0,0.2)',
    opacity: 0.85,
    filter: 'sepia(0.3) contrast(0.95)',
  }
};

export default Clock;