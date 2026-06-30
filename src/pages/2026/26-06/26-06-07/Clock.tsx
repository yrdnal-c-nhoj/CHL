import fontUrl from '@/assets/fonts/26fonts/26-06-07.ttf?url';
import backgroundVideo from '@/assets/images/26_images/26-06/26-06-07/spacewalk.mp4';
import type { FontConfig } from '@/types/clock';
import {
  ClockLoadingFallback,
  useSuspenseFontLoader,
} from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { Suspense } from 'react';
import styles from './Clock.module.css';

export const assets = [backgroundVideo, fontUrl];

export const fontConfigs: FontConfig[] = [
  { fontFamily: 'Clock26-06-07', fontUrl },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');
const formatMs = (num: number): string => num.toString().padStart(3, '0');

const stylesObj: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    height: '100dvh',
    width: '100vw',
    margin: 0,
    padding: '2rem 0 0 0',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#ff0000',
  },
  video: {
    position: 'absolute',
    inset: 0,
    width: '100vw',
    height: '100dvh',
    objectFit: 'cover',
    zIndex: 0,
    pointerEvents: 'none',
  },
  digitsContainer: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  digitBox: {
    display: 'inline-block',
    width: '1ch',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
  },
};

const ClockInner: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useMillisecondClock();

  const h = formatTime(time.getHours());
  const m = formatTime(time.getMinutes());
  const s = formatTime(time.getSeconds());

  // Show only 2 digits for milliseconds
  const ms = formatMs(time.getMilliseconds());
  const ms2 = ms.slice(0, 2);
  const allDigits = (h + m + s + ms2).split('');

  return (
    <div className={styles.container} style={stylesObj.container}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={stylesObj.video}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <main className={styles.digitsContainer} style={stylesObj.digitsContainer}>
        {allDigits.map((digit, index) => (
          <span key={index} className={styles.digitBox} style={stylesObj.digitBox}>
            {digit}
          </span>
        ))}
      </main>
    </div>
  );
};

const Clock: React.FC = () => (
  <Suspense fallback={<ClockLoadingFallback />}>
    <ClockInner />
  </Suspense>
);

export default Clock;
