import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useClockTime, formatTime as formatClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import videoFile from '@/assets/images/2025/25-10/25-10-22/bg.mp4';
import fallbackImg from '@/assets/images/2025/25-10/25-10-22/bg.webp';
import fundyFont from '@/assets/fonts/2025/25-10-22-fundy.ttf?url';

/**
 * Constants and Styles defined outside the component to prevent 
 * re-creation/re-parsing on every millisecond tick.
 */
const ANIMATION_NAME = 'colorCycle-25-10-22';
const FLOAT_NAME = 'float-25-10-22';

const GlobalStyles = () => (
  <style>{`
    @keyframes ${FLOAT_NAME} {
      0% { transform: translateY(0); }
      50% { transform: translateY(calc(-100dvh + 4rem + 40px)); }
      100% { transform: translateY(0); }
    }
    @keyframes ${ANIMATION_NAME} {
      0%, 100% {
        color: #df9268ff;
        text-shadow: -1px 0 0px #4b3424ff, 0 0 6px #98643fff, 0 0 4px #c88a5e, 1px 0 2px #d2c497ff;
      }
      23.08%, 76.92% {
        color: #7c947cff;
        text-shadow: -1px -1px #04140bff, 3px 2px 6px #e6ede9ff, -2px 0 4px #ebecebff, 1px 1px #e4ebe6ff;
      }
      50% {
        color: #f4ecccff;
        text-shadow: 1px 1px #e10e23ff, 0 0 6px #f8fdf7ff, 0 0 4px #5874a0ff, -1px 0 #0d131cff;
      }
    }
    .clock-digit {
      font-family: 'FundyFont', sans-serif;
      font-size: 4rem;
      width: 3.0rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      animation: ${ANIMATION_NAME} 26.3s linear infinite;
      will-change: color, text-shadow;
    }
  `}</style>
);

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100dvh',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
};

const mediaStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  pointerEvents: 'none',
};

const clockContainerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '20px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
  animation: `${FLOAT_NAME} 26.3s linear infinite`,
  willChange: 'transform',
};

const ClockWithVideo: React.FC = () => {
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const time = useClockTime('ms');
  const videoRef = useRef<HTMLVideoElement>(null);

  const fontConfigs = useMemo(() => [
    { fontFamily: 'FundyFont', fontUrl: fundyFont }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.play()?.catch((err) => {
      console.warn('Autoplay prevented:', err);
    });

    const checkReadiness = setTimeout(() => {
      if (v.readyState < 4) setVideoFailed(true);
    }, 3000);

    return () => clearTimeout(checkReadiness);
  }, []);

  const renderTimeDigits = () => {
    const { hours, minutes, seconds, milliseconds } = formatClockTime(time, '24h');
    // Combine into a single string for easier mapping
    const fullTimeStr = `${hours}${minutes}${seconds}${milliseconds || '00'}`;

    return (
      <time dateTime={`${hours}:${minutes}:${seconds}`}>
        {fullTimeStr.split('').map((char, idx) => (
          <span key={idx} className="clock-digit">
            {char}
          </span>
        ))}
      </time>
    );
  };

  return (
    <>
      <GlobalStyles />
      <main style={containerStyle}>
        <video
          ref={videoRef}
          style={{ ...mediaStyle, display: videoFailed ? 'none' : 'block' }}
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
        >
          <source src={videoFile} type="video/mp4" />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${fallbackImg})`,
              backgroundSize: 'cover',
            }}
          />
        </video>

        {videoFailed && (
          <div
            style={{
              ...mediaStyle,
              backgroundImage: `url(${fallbackImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div style={clockContainerStyle}>
          {renderTimeDigits()}
        </div>
      </main>
    </>
  );
};

export default ClockWithVideo;