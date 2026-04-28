import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime, formatTime } from '@/utils/clockUtils';
import videoFile from '@/assets/images/2025/25-10/25-10-31/mids.mp4';
import fallbackImg from '@/assets/images/2025/25-10/25-10-31/midsun.webp';
import fontFile_2025_10_31 from '@/assets/fonts/2025/25-10-31-mi.otf?url';

export default function VideoClock() {
  const [ready, setReady] = useState<boolean>(false);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [showPlayButton, setShowPlayButton] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const time = useClockTime('ms');
  const { hours, minutes, seconds, milliseconds } = formatTime(time, '24h');
  const datetime = `${hours}:${minutes}:${seconds}`;
  const digits = (hours + minutes + seconds + milliseconds).split('');

  const fontConfigs = useMemo(() => [
    { fontFamily: 'CustomFont', fontUrl: fontFile_2025_10_31 }
  ], []);
  
  useSuspenseFontLoader(fontConfigs);

  // Preload assets: video, fallback image
  useEffect(() => {
    let imageLoaded = false;
    let videoLoaded = false;

    const checkReady = () => {
      if ((videoLoaded || videoFailed) && imageLoaded) {
        setTimeout(() => setReady(true), 100);
      }
    };

    // Load fallback image
    const img = new Image();
    img.src = fallbackImg;
    img.onload = () => {
      imageLoaded = true;
      checkReady();
    };
    img.onerror = () => {
      imageLoaded = true;
      checkReady();
    };

    // Handle video loading / failure
    const v = videoRef.current;
    if (v) {
      const onLoadedData: React.FC = () => {
        videoLoaded = true;
        checkReady();
      };
      const onError: React.FC = () => {
        setVideoFailed(true);
        setShowPlayButton(true);
        videoLoaded = false;
        checkReady();
      };
      v.addEventListener('loadeddata', onLoadedData);
      v.addEventListener('error', onError);
      v.addEventListener('stalled', onError);

      const playPromise = v.play?.();
      if (playPromise) {
        playPromise.catch(() => setShowPlayButton(true));
      }

      return () => {
        v.removeEventListener('loadeddata', onLoadedData);
        v.removeEventListener('error', onError);
        v.removeEventListener('stalled', onError);
      };
    }
  }, [videoFailed]); // fontLoaded removed as useSuspenseFontLoader handles it

  const handlePlayClick = () => {
    const v = videoRef.current;
    if (v) {
      v.play()
        .then(() => setShowPlayButton(false))
        .catch(() => console.error('Manual play failed'));
    }
  };

  // Inline styles
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.4s ease-in-out',
    opacity: ready ? 1 : 0,
  };

  const videoStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
    display: videoFailed ? 'none' : 'block',
    pointerEvents: 'none',
    filter: 'brightness(1.1) contrast(0.8) hue-rotate(15deg) saturate(1.2)',
  };

  const fallbackStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${fallbackImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: videoFailed ? 'block' : 'none',
    filter: 'brightness(1.3) contrast(1.4) hue-rotate(-10deg) saturate(1.2)',
  };

  const clockStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    width: '98vw',
    transform: 'rotate(180deg) translateY(3vh)',
    zIndex: 2,
    fontFamily: 'CustomFont, Arial, sans-serif',
    fontSize: '24vw',
    color: '#E6F2FF',
    userSelect: 'none',
    textAlign: 'center',
    textShadow: `
      1px 1px 0 #0A4FB8FF,
      -1px 0px 7px rgba(0, 50, 100, 0.8)
    `,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  const playButtonStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 3,
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 30, 60, 0.8)',
    color: '#e6f2ff',
    border: '1px solid rgba(100, 180, 255, 0.5)',
    borderRadius: '5px',
    textShadow: '0 0 4px rgba(100, 180, 255, 0.5)',
  };

  return (
    <main style={containerStyle}>
      <video
        ref={videoRef}
        style={videoStyle}
        loop
        muted
        playsInline
        autoPlay
        preload="auto"
      >
        <source src={videoFile} type="video/mp4" />
      </video>
      <div style={fallbackStyle} aria-hidden />
      {showPlayButton && ready && (
        <button style={playButtonStyle} onClick={handlePlayClick}>
          Play Video
        </button>
      )}
      {ready && (
        <time dateTime={datetime} style={clockStyle}>
          {digits.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </time>
      )}
    </main>
  );
}
