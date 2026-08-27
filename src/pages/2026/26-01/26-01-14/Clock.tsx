import { memo, useEffect, useState, useMemo } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgVideo from '@/assets/images/26_images/26-01/26-01-14/kuro.mp4';
import fallbackImg from '@/assets/images/26_images/26-01/26-01-14/kuro.webp';
import romanFont from '@/assets/fonts/26fonts/26-01-14-kuro.otf?url';
import styles from './Clock.module.css';

export const assets = [bgVideo, fallbackImg, romanFont];

const FONT_NAME = 'RomanClockFont';
const CLOCK_GRADIENT = 'linear-gradient(180deg, #DCCFE1, #AFB1B3)';

const fontConfigs: FontConfig[] = [
  { fontFamily: FONT_NAME, fontUrl: romanFont },
];

const KurosawaClock = () => {
  const clockTime = useSecondClock();
  useSuspenseFontLoader(fontConfigs);
  const [videoError, setVideoError] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    const done = () => setMediaReady(true);
    img.onload = done;
    img.onerror = done;
    img.src = fallbackImg;
    const timeout = setTimeout(done, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const wrapperStyle = {
    height: '100dvh',
    width: '100vw',
    overflow: 'hidden',
    position: 'relative',
    background: '#000',
    boxSizing: 'border-box',
  };

  const mediaStyle = {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  };

  const containerStyle = {
    display: 'flex',
    gap: '0',
    pointerEvents: 'none',
  };

  const digitStyle = {
    width: 'calc(100vw / 18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: `${FONT_NAME}, sans-serif`,
    fontSize: 'min(12dvh, 8vw)',
    background: CLOCK_GRADIENT,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
  };

  const clocksWrapper = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    position: 'absolute',
    top: -10,
    left: 0,
    zIndex: 10,
    gap: '0',
  };

  const Clock = ({ time }) => {
    const clockDigits = useMemo(() => {
      const timeString = time.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return timeString.replace(/:/g, '').split('');
    }, [time]);

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={containerStyle} aria-hidden="true">
          {clockDigits.map((digit, index) => (
            <div key={`${index}-${digit}`} style={digitStyle}>
              {digit}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const leftTime = new Date(clockTime.getTime() - 3600000);
  const rightTime = new Date(clockTime.getTime() + 3600000);

  const ready = mediaReady || videoError;

  return (
    <main className={styles.container} style={{ ...wrapperStyle, opacity: ready ? 1 : 0, visibility: ready ? 'visible' : 'hidden', transition: 'opacity 0.35s ease' }}>
      <time dateTime={clockTime.toISOString()} className={styles.srOnly}>{clockTime.toLocaleTimeString()}</time>

      {!videoError ? (
        <video src={bgVideo} muted autoPlay loop playsInline onError={() => setVideoError(true)} style={mediaStyle} />
      ) : (
        <img src={fallbackImg} alt="" style={mediaStyle} />
      )}

      <div style={clocksWrapper}>
        <Clock time={leftTime} />
        <Clock time={clockTime} />
        <Clock time={rightTime} />
      </div>
    </main>
  );
}

const MemoizedKurosawaClock = memo(KurosawaClock);
MemoizedKurosawaClock.displayName = 'Clock_26_01_14';
export default MemoizedKurosawaClock;

