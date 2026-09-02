import { memo, useEffect, useRef, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import cloudyFont from '@/assets/fonts/25fonts/25-06-13-cloudy.ttf';
import cmoon from '@/assets/images/25_images/25-06/25-06-13/cmoon.webp';
import clouGif from '@/assets/images/25_images/25-06/25-06-13/clou.gif';
import clll from '@/assets/images/25_images/25-06/25-06-13/clll.webp';
import styles from './Clock.module.css';

export const assets = [cloudyFont, cmoon, clouGif, clll];

const fontConfigs = [
  {
    fontFamily: 'cloudy',
    fontUrl: cloudyFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const CloudyNightClock =  () => {
  const clockRef = useRef(null);
  const time = useClock();

  useSuspenseFontLoader(fontConfigs);

  const containerStyle = {
    margin: 0,
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #1d1d4f, #182c21)',
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const moonStyle = {
    position: 'absolute',
    left: '50%',
    top: '120dvh',
    width: '32dvh',
    height: '32dvh',
    backgroundImage: `url(${cmoon})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translateX(-50%)',
    zIndex: 5,
  };

  const clockStyle = {
    fontFamily: 'cloudy, sans-serif',
    fontSize: '3.5rem',
    color: '#f9f6c2',
    textShadow: `
      0.2rem 0.2rem 0 rgba(69, 73, 52, 0.9),
      0.1rem 0.1rem 0 rgba(207, 250, 16),
      -0.1rem 0 0.4rem rgb(150, 228, 215)
    `,
    lineHeight: 1,
    textAlign: 'center',
    transform: 'translateY(2%)',
  };

  const cloudStyle = {
    width: '120vw',
    height: '90dvh',
    backgroundImage: `url(${clouGif})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 10,
    filter:
      'brightness(40%) contrast(200%) sepia(1) hue-rotate(190deg) saturate(2)',
    opacity: 0.7,
  };

  const bgImageStyle = {
    position: 'fixed',
    top: '-19dvh',
    left: 0,
    height: '150dvh',
    backgroundImage: `url(${clll})`,
    backgroundRepeat: 'repeat',
    zIndex: 2,
    opacity: 0.3,
    filter: 'brightness(60%)',
  };

  const titleStyle = {
    color: '#7e7f84',
    textShadow: '#100f0f 0.1rem 0',
    position: 'absolute',
    top: '1dvh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98%',
    display: 'flex',
    zIndex: 6,
  };

  const chltitleStyle = {
    fontFamily: '"Roboto Slab", serif',
    fontSize: '2.1dvh',
    position: 'absolute',
    top: '0.5dvh',
    right: '1dvh',
    letterSpacing: '0.1dvh',
  };

  const bttitleStyle = {
    fontFamily: '"Oxanium", serif',
    fontSize: '2.7dvh',
    fontStyle: 'italic',
    letterSpacing: '-0.1dvh',
  };

  const dateContainerStyle = {
    color: '#ebf9fb',
    position: 'absolute',
    bottom: '0.5dvh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98%',
    display: 'flex',
    zIndex: 6,
  };

  const clocknameStyle = {
    fontFamily: '"Oxanium", serif',
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '4dvh',
    lineHeight: '4dvh',
  };

  const dateLeftStyle = {
    fontSize: '3dvh',
    fontFamily: '"Nanum Gothic Coding", monospace',
    position: 'relative',
    left: 0,
  };

  const dateRightStyle = {
    fontSize: '3dvh',
    fontFamily: '"Nanum Gothic Coding", monospace',
    position: 'absolute',
    right: 0,
  };

  return (
    <main className={styles.container} style={containerStyle}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <img
        decoding="async"
        loading="lazy"
        src={clll}
        alt="bg"
        style={bgImageStyle}
      />

      <div style={moonStyle} className={styles.moonRise}>
        <div style={clockRef ? clockStyle : {}} ref={clockRef}>
          12:00
        </div>
      </div>

      <div style={cloudStyle} className={styles.cloudSweep} />
    </main>
  );
}

const MemoizedCloudyNightClock = memo(CloudyNightClock);
MemoizedCloudyNightClock.displayName = 'Clock_25_06_13';
export default MemoizedCloudyNightClock;
