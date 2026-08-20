import { memo, useEffect, useRef, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import videoFile from '@/assets/images/25_images/25-12/25-12-28/coaster.mp4';
import fallbackImg from '@/assets/images/25_images/25-12/25-12-28/coaster.webp';
import fontUrl_20251128 from '@/assets/fonts/25fonts/25-12-28-coaster.ttf?url';
import { useSecondClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets = [videoFile, fallbackImg, fontUrl_20251128];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'CustomFont_20251128',
    fontUrl: fontUrl_20251128,
  },
];

const Clock =  () => {
  const time = useSecondClock();
  const [timeText, setTimeText] = useState<any>('');
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [shake, setShake] = useState<any>({ x: 0, y: 0, rotate: 0 });
  const videoRef = useRef(null);
  const animationFrameId = useRef<number | null>(null);

  useSuspenseFontLoader(fontConfigs);

  const updateTime =  () => {
    const now = new Date();
    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    let hour12 = hours24 % 12;
    if (hour12 === 0) hour12 = 12;

    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hour12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    setTimeText(formattedTime);
  };

  useEffect(() => {
    updateTime();
  }, [time]);

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
    transform: `
      translate3d(${shake.x * 0.4}px, ${shake.y * 0.4}px, 0)
      rotateX(${Math.sin(Date.now() * 0.0025) * 5}deg)
      rotateY(${Math.cos(Date.now() * 0.002) * 5}deg)
      perspective(1000px)
    `,
    transition: 'transform 0.08s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
  };

  const videoStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
    transform: `
      scale(1.08)
      translate3d(${shake.x * 0.25}px, ${shake.y * 0.25}px, 0)
      rotate(${shake.rotate * 0.3}deg)
      perspective(800px)
    `,
    transition: 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform',
  };

  const fallbackStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: videoFailed ? 'block' : 'none',
    zIndex: 5,
  };

  const timeContainerStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: `
      translate(-50%, -50%)
      translate3d(${shake.x * 0.7}px, ${shake.y * 0.7}px, 0)
      rotate(${shake.rotate * 0.5}deg)
      perspective(500px)
      rotateX(${Math.sin(Date.now() * 0.002) * 2}deg)
      rotateY(${Math.cos(Date.now() * 0.0015) * 2}deg)
    `,
    zIndex: 10,
    color: '#ABA193',
    fontSize: '7vw',
    textAlign: 'center',
    letterSpacing: '0.05em',
    textShadow: '1px 0 0 white',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'visible',
    fontFamily: `"CustomFont_20251128", sans-serif`,
    opacity: 0.7,
    transition: 'transform 0.1s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  };

  const digitStyle = (index) => ({
    display: 'inline-block',
    animation: 'jossel 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1) ' + (index * 0.03) + 's',
    transformOrigin: 'center center',
    willChange: 'transform',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  });

  return (
    <main className={styles.container} style={containerStyle} role="region" aria-label="Background video and time">
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div style={timeContainerStyle} aria-live="polite">
        {timeText.split('').map((char, index) => (
          <span key={index} style={digitStyle(index)}>
            {char}
          </span>
        ))}
      </div>
      <video
        ref={videoRef}
        style={videoStyle}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
      </video>
      <div style={fallbackStyle} aria-hidden={!videoFailed}>
        {videoFailed && (
          <span style={{ display: 'none' }}>Fallback background image</span>
        )}
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_25_12_28';
export default MemoizedClock;
