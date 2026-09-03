import React, { useMemo } from 'react';
import { useClock } from '@/utils/hooks';
import lavaImage from '@/assets/images/26_images/26-09/26-09-02/lava.webp';
import eyesImage from '@/assets/images/26_images/26-09/26-09-02/eyes.webp';
import ioImage from '@/assets/images/26_images/26-09/26-09-02/io.webp';

export const assets: string[] = [lavaImage, eyesImage, ioImage];

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
      <div style={styles.digitalDisplay}>
        {timeString}
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
        // opacity: 0.4,
        zIndex: 0,
    },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${eyesImage})`,
    backgroundSize: '60px 60px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    opacity: 0.6,
    zIndex: 1,
    pointerEvents: 'none',
  },
  ioOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${ioImage})`,
    backgroundSize: '80px 80px',
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center',
    opacity: 0.5,
    zIndex: 2,
    pointerEvents: 'none',
  },
  digitalDisplay: {
        position: 'relative',
        zIndex: 1,
        fontFamily: 'system-ui, monospace',
        fontSize: 'clamp(3rem, 15vw, 10rem)',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: '0.05em',
        lineHeight: 1,
        textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)',
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
