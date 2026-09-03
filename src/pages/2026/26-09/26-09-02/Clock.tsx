import React, { useMemo } from 'react';
import { useClock } from '@/utils/hooks';
import lavaImage from '@/assets/images/26_images/26-09/26-09-02/lava.webp';
import eyesImage from '@/assets/images/26_images/26-09/26-09-02/eyes.webp';
import ioImage from '@/assets/images/26_images/26-09/26-09-02/io.webp';
import cowImage from '@/assets/images/26_images/26-09/26-09-02/cow.webp';

export const assets: string[] = [lavaImage, eyesImage, ioImage, cowImage];

const Clock_26_09_02 = () => {
  const time = useClock();

  const timeString = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }, [time]);

  return (
    <main style={styles.container}>
      <div style={styles.backgroundLayer} />
      <div style={styles.gridOverlay} />
      <div style={styles.ioOverlay} />
      <div style={styles.cowOverlay} />
      <div style={styles.digitalDisplay}>
        {timeString.split('').map((char, index) => (
          <span
            key={index}
            style={char === ':' ? styles.colonBox : styles.digitBox}
          >
            {char}
          </span>
        ))}
      </div>
      <time dateTime={time.toISOString()} style={styles.srOnly}>
        {timeString}
      </time>
    </main>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#0a0c14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${lavaImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 0,
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${eyesImage})`,
    backgroundSize: '60px 30px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  ioOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '150vmin',
    height: '150vmin',
    transform: 'translate(-50%, -50%) rotate(-90deg)',
    backgroundImage: `url(${ioImage})`,
    backgroundSize: '80px 80px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    zIndex: 2,
    pointerEvents: 'none',
  },
  cowOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${cowImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center',
    opacity: 0.5,
    zIndex: 3,
    pointerEvents: 'none',
  },
  digitalDisplay: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    fontFamily: 'monospace',
    fontSize: 'clamp(2rem, 12vw, 8rem)',
    color: '#ffffff80',
    textAlign: 'center',
    lineHeight: 1,
    zIndex: 3,
    textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)',
  },
  digitBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.65em',
    backgroundColor: 'transparent',
    border: 'none',
  },
  colonBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.25em',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
} as const;

Clock_26_09_02.displayName = 'Clock_26_09_02';

export default Clock_26_09_02;