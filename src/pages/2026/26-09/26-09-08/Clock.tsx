import React from 'react';
import rainVideo from '@/assets/images/26_images/26-09/26-09-02/rain.webm';

export const assets: string[] = [rainVideo];

const Clock_26_09_02 = () => {
  return (
    <main style={styles.container}>
      <video
        src={rainVideo}
        autoPlay
        loop
        muted
        playsInline
        style={styles.video}
      />
    </main>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  },
} as const;

Clock_26_09_02.displayName = 'Clock_26_09_02';

export default Clock_26_09_02;
