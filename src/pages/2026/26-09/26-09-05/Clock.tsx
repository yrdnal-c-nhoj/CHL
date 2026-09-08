import React, { useState, useEffect } from 'react';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import limesImage from '@/assets/images/26_images/26-09/26-09-05/limm.webp';
import limeImage from '@/assets/images/26_images/26-09/26-09-05/lime2.webp';
import limeslImage from '@/assets/images/26_images/26-09/26-09-05/lime3.webp';
import font from '@/assets/fonts/26fonts/26-09-05.ttf?url';

export const assets = [limesImage, limeImage, limeslImage, font];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_05',
  fontUrl: font,
};

const rotateCCW_26_09_05 = `
@keyframes rotateCCW_26_09_05 {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(-360deg); }
}
`;

const Clock_26_09_05: React.FC = () => {
  useSuspenseFontLoader([fontConfig]);

  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());

    let intervalId: ReturnType<typeof setInterval>;

    const updateTime = () => {
      setTime(new Date());
    };

    // Sync updates to exact second boundaries
    const delay = 1000 - (Date.now() % 1000);

    const timeoutId = setTimeout(() => {
      updateTime();
      intervalId = setInterval(updateTime, 1000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (!time) {
    return <main style={styles.container} />;
  }

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const fullTimeString = `${hours}:${minutes}:${seconds}`;

  return (
    <main style={styles.container}>
      <style>{rotateCCW_26_09_05}</style>

      {/* SVG filter definitions */}
      <svg style={styles.filterSvg} aria-hidden="true">
        <defs>
          <filter id="removeRed">
            <feColorMatrix
              type="matrix"
              values="
                                0 0 0 0 0
                                0 1 0 0 0
                                0 0 1 0 0
                                0 0 0 1 0
                            "
            />
          </filter>
        </defs>
      </svg>

      {/* Primary lime image */}
      <img
        src={limesImage}
        alt=""
        aria-hidden="true"
        style={styles.backgroundImagePrimary}
      />

      {/* Secondary lime overlay */}
      <div
        aria-hidden="true"
        style={{
          ...styles.backgroundImageSecondary,
          backgroundImage: `url(${limeImage})`,
        }}
      />

      {/* Tertiary lime slice overlay */}
      <div
        aria-hidden="true"
        style={{
          ...styles.backgroundImageTertiary,
          backgroundImage: `url(${limeslImage})`,
        }}
      />

      {/* Clock */}
      <time
        dateTime={time.toISOString()}
        aria-label={`Current time is ${fullTimeString}`}
        style={styles.clockOverlay}
      >
        <span style={styles.digitBox}>
          <span style={styles.timeUnit}>{hours}</span>
        </span>

        <span style={styles.colon} aria-hidden="true">
          :
        </span>

        <span style={styles.digitBox}>
          <span style={styles.timeUnit}>{minutes}</span>
        </span>

        <span style={styles.colon} aria-hidden="true">
          :
        </span>

        <span style={styles.digitBox}>
          <span style={styles.seconds}>{seconds}</span>
        </span>
      </time>
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'visible',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /*
   * Hidden SVG containing the red-removal filter.
   */
  filterSvg: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
  },

  /*
   * Primary image:
   *
   * 1. url(#removeRed)
   *    Completely removes the red channel.
   *
   * 2. hue-rotate()
   *    Shifts the remaining colors.
   *
   * 3. saturate()
   *    Makes the remaining colors considerably stronger.
   */
  backgroundImagePrimary: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,

    // filter:
    //     'url(#removeRed) hue-rotate(25deg) saturate(2.2)',
  },

  /*
   * Secondary image:
   * Same red removal and color treatment as the primary image.
   */
  backgroundImageSecondary: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 2,
    opacity: 0.5,
    pointerEvents: 'none',

    // filter:
    //     'url(#removeRed) hue-rotate(25deg) saturate(2.2)',
  },

  /*
   * Tertiary image overlay:
   * Rendered on top of the secondary image with a slight blend.
   */
  backgroundImageTertiary: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '150%',
    height: '150%',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 3,
    opacity: 0.6,
    pointerEvents: 'none',

    filter: 'saturate(2.2)',

    transformOrigin: 'center',
    animation: 'rotateCCW_26_09_05 60s linear infinite',
  },

  clockOverlay: {
    position: 'relative',
    zIndex: 4,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    fontFamily: 'ClockFont_26_09_05, monospace, system-ui, sans-serif',
    fontVariantNumeric: 'tabular-nums',

    color: '#a3e635',

    textShadow: '0 0.25rem 1.25rem rgba(0, 0, 0, 0.8)',

    userSelect: 'none',
  },

  digitBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'clamp(4rem, 12vw, 10rem)',
    height: 'clamp(4rem, 12vw, 10rem)',
    flexShrink: 0,
  },

  timeUnit: {
    fontSize: 'clamp(4rem, 12vw, 10rem)',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
  },

  colon: {
    fontSize: 'clamp(4rem, 12vw, 10rem)',
    margin: '0 0.05em',
    opacity: 0.8,
    position: 'relative',
    top: '-0.05em',
  },

  seconds: {
    fontSize: 'clamp(4rem, 12vw, 10rem)',
    fontWeight: '300',
    color: '#a3e635',
    marginLeft: '0.3em',
  },
};

Clock_26_09_05.displayName = 'Clock_26_09_05';

export default Clock_26_09_05;
