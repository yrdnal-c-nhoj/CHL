import { memo, useEffect, useState, useRef } from 'react';
import { useClock } from '@/utils/hooks';
import anglerfishIdle from '@/assets/images/25_images/25-07/25-07-21/anglerfish-gif_anglerfish_idle_swim.webp';
import anglerfishFuse from '@/assets/images/25_images/25-07/25-07-21/Deep-Sea-Anglerfish-Fuse.webp';
import patternOverlay from '@/assets/images/25_images/25-07/25-07-21/qsxwwd.webp';
import spinGif from '@/assets/images/25_images/25-07/25-07-21/spin.gif';
import styles from './Clock.module.css';

export const assets = [anglerfishIdle, anglerfishFuse, patternOverlay, spinGif];

const AnglerfishClock =  () => {
  const time = useClock();
  const timeText = time.toLocaleTimeString();

  return (
    <main className={styles.container} style={{
      height: '100dvh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom, #1C6179 0%, #3F1395 100%)',
    }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${anglerfishIdle})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '100% 100%',
        opacity: 0.4,
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${anglerfishFuse})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '100% 100%',
        opacity: 0.4,
        zIndex: 2,
      }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${patternOverlay})`,
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center center',
        backgroundSize: '33% 33%',
        opacity: 0.4,
        zIndex: 4,
      }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${spinGif})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',
        transform: 'scaleX(-1)',
        opacity: 0.3,
        zIndex: 5,
      }} />

      <div
        className={styles.animate}
        style={{
          fontFamily: "'Barriecito', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
          fontSize: '14rem',
          whiteSpace: 'nowrap',
          background: 'linear-gradient(90deg, #369b91, #0e8c68, #711579)',
          backgroundSize: '75%',
          backgroundRepeat: 'no-repeat',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: 0.6,
          zIndex: 9,
          position: 'relative',
        }}
      >
        {timeText}
      </div>
    </main>
  );
};

const MemoizedAnglerfishClock = memo(AnglerfishClock);
MemoizedAnglerfishClock.displayName = 'Clock_25_07_21';
export default MemoizedAnglerfishClock;
