import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import videoFile from '../../../assets/images/25-10/25-10-22/bg.mp4';
import fallbackImg from '../../../assets/images/25-10/25-10-22/bg.webp';
import fontFile_2025_10_22 from '../../../assets/fonts/25-10-22-fundy.ttf?url';
import styles from './Clock.module.css';

const ClockWithVideo: React.FC = () => {
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef<HTMLVideoElement>(null);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'MyCustomFont', fontUrl: fontFile_2025_10_22 }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // Time update (Standardized to rAF)
  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Video Autoplay and Error Handling (MODIFIED)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onStalled = () => {
      // Optional: handle stalled video
    };

    v.addEventListener('stalled', onStalled);

    // Initial play attempt relies on <video autoPlay muted playsInline> for best chance.
    // We add an explicit play attempt for edge cases, but aggressively ignore the error.
    const playPromise = v.play?.();
    if (playPromise) {
      playPromise.catch((err) => {
        console.warn(
          'Autoplay failed (Policy issue). Proceeding silently.',
          err,
        );
      });
    }

    // Set a timeout to check for asset failure (enhances fallback reliability)
    const checkReadiness = setTimeout(() => {
      if (v.readyState < 4 && !v.paused) {
        console.warn('Video failed to load completely. Switching to fallback.');
        setVideoFailed(true);
      }
    }, 3000); // 3-second grace period

    return () => {
      clearTimeout(checkReadiness);
      v.removeEventListener('stalled', onStalled);
    };
  }, []);

  const formatTime = () => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    // Milliseconds slice for the 2-digit "tick" at the end
    const ms = String(time.getMilliseconds()).padStart(3, '0');
    return `${h}${m}${s}${ms.slice(0, 2)}`;
  };

  // Helper function to insert separators into the time string for readability
  const renderTimeDigits = () => {
    // Current format is HHMMSSms(2)
    const formattedTime = formatTime();
    const elements = [];

    // Use an iterator to track the digit index
    let charIndex = 0;

    // HH
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[0]}
      </span>,
    );
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[1]}
      </span>,
    );
    elements.push(
      <span key="sep1" className={styles.separator}>
        :
      </span>,
    ); // Separator 1

    // MM
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[2]}
      </span>,
    );
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[3]}
      </span>,
    );
    elements.push(
      <span key="sep2" className={styles.separator}>
        :
      </span>,
    ); // Separator 2

    // SS
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[4]}
      </span>,
    );
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[5]}
      </span>,
    );
    elements.push(
      <span key="sep3" className={styles.separator}>
        .
      </span>,
    ); // Separator 3

    // MS (2 digits)
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[6]}
      </span>,
    );
    elements.push(
      <span key={charIndex++} className={styles.digit}>
        {formattedTime[7]}
      </span>,
    );

    return elements;
  };

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        className={styles.media}
        style={{ display: videoFailed ? 'none' : 'block' }}
        loop
        muted
        playsInline
        autoPlay
        preload="metadata"
      >
        <source src={videoFile} type="video/mp4" />
        {/* It is a good practice to include a WebM source for better cross-browser support */}
        <source src="./bg.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div 
        className={styles.fallback} 
        style={{ 
          display: videoFailed ? 'block' : 'none',
          backgroundImage: `url(${fallbackImg})` 
        }} 
        aria-hidden 
      />

      {/* 🛑 The 'Play Video' button rendering block is intentionally REMOVED here */}

      <div className={styles.clock}>
        {/* Rendering the time with explicit separators for clear readability */}
        {renderTimeDigits()}
      </div>
    </div>
  );
}

export default ClockWithVideo;
