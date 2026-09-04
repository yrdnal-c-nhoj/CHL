import React, { useMemo } from 'react';
import { useClock } from '@/utils/hooks';
import peacockImage from '@/assets/images/26_images/26-09/26-09-03/peacock.webp';
import eyesImage from '@/assets/images/26_images/26-09/26-09-03/eyes.webp';
import bullImage from '@/assets/images/26_images/26-09/26-09-03/bull.webp';

export const assets: string[] = [eyesImage, bullImage, peacockImage];

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
    backgroundColor: '#f5f5f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${peacockImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 2,
    filter: 'contrast(100%) saturate(150%) brightness(90%)',
    opacity: 0.7,
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${eyesImage})`,
    backgroundSize: '90px 50px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    zIndex: 4,
    opacity: 0.9,
    pointerEvents: 'none',
  },
  cowOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bullImage})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  digitalDisplay: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace, sans-serif',
    fontSize: '12vmin',
    fontWeight: 'bold',
    zIndex: 9,
  },
  digitBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.7em',
    color: '#ffffff',
    textShadow: `
    -3px -3px 0 #000,
     3px -3px 0 #000,
    -3px  3px 0 #000,
     3px  3px 0 #000,
     0px -3px 0 #000,
     0px  3px 0 #000,
    -3px  0px 0 #000,
     3px  0px 0 #000
  `,
  },
  colonBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.3em',
    color: '#ffffff',
    transform: 'translateY(-0.05em)',
    textShadow: '0 0 12px rgba(255, 255, 255, 0.5)',
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