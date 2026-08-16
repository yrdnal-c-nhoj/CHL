import type { CSSProperties } from 'react';
import React from 'react';

// 1. Asset Exports
import backgroundImage from '@/assets/images/26_images/26-08/26-08-18/crab.webm';
import moonImage from '@/assets/images/26_images/26-08/26-08-18/moon.webp';

export const assets = [backgroundImage, moonImage];

// --- Styles ---
const styles: { [key: string]: CSSProperties } = {
  container: {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    zIndex: 1,
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 2, // Keep it on top
    mixBlendMode: 'screen', // Make black parts transparent
  },
};

// 2. Main Component
const FullscreenVideoComponent: React.FC = () => {
  return (
    <main style={styles.container}>
      <video
        style={styles.video}
        src={backgroundImage}
        autoPlay
        loop
        muted
        playsInline
      />
      <img src={moonImage} alt="Moon" style={styles.overlayImage} />
    </main>
  );
};

// 3. Performance Wrapper
const MemoizedFullscreenVideo = React.memo(FullscreenVideoComponent);
MemoizedFullscreenVideo.displayName = 'FullscreenVideo';

export default MemoizedFullscreenVideo;