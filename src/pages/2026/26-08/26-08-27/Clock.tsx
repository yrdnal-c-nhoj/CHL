import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { memo, useEffect, useRef } from 'react';

import customFont from '@/assets/fonts/26fonts/26-08-27.ttf?url';
import tileImage from '@/assets/images/26_images/26-08/26-08-27/1.webp?url';
import seahorseVideo from '@/assets/images/26_images/26-08/26-08-27/2.webm';
import { useMillisecondClock } from '@/utils/hooks';

export const assets = [seahorseVideo, tileImage];

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: '#2a293c',
  contain: 'layout style paint',
  isolation: 'isolate',
};

const tileBackgroundStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `url(${tileImage})`,
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
  backgroundSize: '200px 100px',
  zIndex: -1,
};

const videoStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  zIndex: 0,
};

const faceStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  paddingTop: '10vh',
  color: '#F5F5F0CB',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  zIndex: 10,
  fontFamily: "'ClockFont', sans-serif",
  textShadow: '0 0 8px rgba(255,255,255,0.4), 0 0 15px rgba(255,255,255,0.2), 0 0 30px rgba(255,255,255,0.1)',
  filter: 'contrast(1.2) brightness(1.1)',
  opacity: 0.95,
};

const digitGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.05vmin',
  position: 'relative',
};

const digitBoxStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '8vh',
  height: '12vh',
  fontSize: '10vh',
  flexShrink: 0,
  textAlign: 'center',
  textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3)',
  filter: 'contrast(1.3) brightness(1.2)',
};

const CenteredVideoBackground = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = seahorseVideo;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.play().catch(() => {
      // ignore unhandled promise rejection
    });

    return () => {
      video.pause();
      video.src = '';
    };
  }, []);

  return (
    <video
      ref={videoRef}
      style={videoStyle}
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
});
CenteredVideoBackground.displayName = 'CenteredVideoBackground';

const FONT_CONFIGS: FontConfig[] = [
  {
    fontFamily: 'ClockFont',
    fontUrl: customFont,
  },
];

const DigitalClock = () => {
  const currentTime = useMillisecondClock(50);

  useSuspenseFontLoader(FONT_CONFIGS);

  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  return (
    <main style={containerStyle}>
      <div style={tileBackgroundStyle} aria-hidden="true" />
      <CenteredVideoBackground />

      <div style={faceStyle}>
        <time dateTime={currentTime.toISOString()} style={digitGroupStyle}>
          <span style={digitBoxStyle}>{hours[0]}</span>
          <span style={digitBoxStyle}>{hours[1]}</span>
          <span style={digitBoxStyle}>{minutes[0]}</span>
          <span style={digitBoxStyle}>{minutes[1]}</span>
          <span style={digitBoxStyle}>{seconds[0]}</span>
          <span style={digitBoxStyle}>{seconds[1]}</span>
        </time>
      </div>
    </main>
  );
};

const MemoizedClock = memo(DigitalClock);
MemoizedClock.displayName = 'Clock_26_08_27';
export default MemoizedClock;
