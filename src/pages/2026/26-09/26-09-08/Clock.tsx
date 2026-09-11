import React from 'react';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-08/beachnite.webm?url';

export const assets = [backgroundVideo];

const Clock_26_09_02: React.FC = () => {
  return (
    <main style={styles.container}>
      <video
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        style={styles.backgroundVideo}
      />
    </main>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#02060d',
  },

  backgroundVideo: {
    position: 'absolute',
    inset: 0,

    width: '100%',
    height: '100%',

    objectFit: 'fill',

    filter: 'saturate(1.35) contrast(0.9) brightness(1.55)',
  },
};

Clock_26_09_02.displayName = 'Clock_26_09_02';

export default Clock_26_09_02;