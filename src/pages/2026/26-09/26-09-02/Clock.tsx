import React, { useMemo } from 'react';
import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import lavaImage from '@/assets/images/26_images/26-09/26-09-02/lava.webp';
import eyesImage from '@/assets/images/26_images/26-09/26-09-02/eyes.webp';
import ioImage from '@/assets/images/26_images/26-09/26-09-02/io.webp';
import cowImage from '@/assets/images/26_images/26-09/26-09-02/cow.webm';
import peacockImage from '@/assets/images/26_images/26-09/26-09-02/peacock.webp';
import fontUrl from '@/assets/fonts/26fonts/26-09-02.otf?url';

export const assets: string[] = [lavaImage, eyesImage, ioImage, cowImage, peacockImage, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_09_02',
    fontUrl,
  },
];

const Clock_26_09_02 = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useClock();

  const timeString = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }, [time]);

  return (
    <main style={styles.container}>
      <div style={styles.backgroundLayer} />
      <div style={styles.gridOverlay} />
      <div style={styles.ioOverlay} />
      <video
        src={cowImage}
        autoPlay
        loop
        muted
        playsInline
        style={styles.cowOverlay as React.CSSProperties}
      />
      <div style={styles.digitalDisplay}>
        {timeString.split('').map((char, index) => (
          <span
            key={index}
            style={char === ':' ? styles.colonBox : styles.digitBox}
          >
            {char}
          </span>
        ))}
        <time dateTime={time.toISOString()} style={styles.srOnly}>
          {timeString}
        </time>
      </div>
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
    zIndex: 4,
    pointerEvents: 'none',
  },
  cowOverlay: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top center',
    opacity: 0.4,
    zIndex: 2,
    filter: 'contrast(400%) saturate(150%) brightness(60%)',
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
    zIndex: 6,
    pointerEvents: 'none',
  },
  digitalDisplay: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    fontFamily: '"ClockFont_26_09_02", monospace',
    fontSize: '16vh',
    color: '#ffffff80',
    textAlign: 'center',
    lineHeight: 1,
    zIndex: 9,
    textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)',
  },
  digitBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.65em',
    backgroundColor: 'transparent',
    border: 'none',
    backgroundImage: `url(${peacockImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: 'none',
  },
  colonBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.25em',
    transform: 'translateY(-0.1em)',
    backgroundImage: `url(${peacockImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: 'none',
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