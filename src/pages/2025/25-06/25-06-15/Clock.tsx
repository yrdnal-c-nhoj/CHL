import React, { useEffect } from 'react';
import { useMultiAssetLoader } from '@/utils/assetLoader';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import fontUrl from '@/assets/fonts/25fonts/25-06-15-ZombieStitch.ttf';
import bgImageUrl from '@/assets/images/25_images/25-06/25-06-15/stin.webp';
import overlayImageUrl from '@/assets/images/25_images/25-06/25-06-15/stit.jpeg';
import { useClock } from '@/utils/hooks';
export const assets = [fontUrl, bgImageUrl, overlayImageUrl];

const StitchesClock =  () => {
  // useEffect for updateClock removed - time is reactive via useClock

  return (
    <div style={styles.body}>
      <div
        style={{ ...styles.bgImage, backgroundImage: `url(${bgImageUrl})` }}
      />
      <img
        decoding="async"
        loading="lazy"
        src={overlayImageUrl}
        alt="stitched overlay"
        style={styles.bgOverlay}
      />
      <div id="clockRow" style={styles.clockRow} />
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    background: '#d7d2d2',
    overflow: 'hidden',
    height: '100dvh',
    width: '100vw',
    position: 'relative',
    fontFamily: 'ZombieStitch_2025_10_29, sans-serif',
  },
  bgImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    zIndex: 0,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    opacity: 0.3,
  },
  bgOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    zIndex: 1,
    objectFit: 'cover',
    filter: 'brightness(120%) hue-rotate(18deg) saturate(20%)',
    opacity: 0.5,
  },
  clockRow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    zIndex: 2,
  },
  digit: {
    fontFamily: 'ZombieStitch_2025_10_29, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26dvh',
    color: '#1f1d52',
    textShadow:
      'rgba(236, 15, 15, 0.85) 0.1rem -0.1rem 0.5rem, rgba(236, 15, 15, 0.85) -0.1rem 0.1rem 0.5rem, rgba(255,255,255,0.75) 0.05rem -0.05rem 0rem',
  },
} as const;

export default StitchesClock;
