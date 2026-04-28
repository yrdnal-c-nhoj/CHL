import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useClockTime, formatTime as formatClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import videoFile from '@/assets/images/2025/25-10/25-10-22/bg.mp4';
import fallbackImg from '@/assets/images/2025/25-10/25-10-22/bg.webp';
import fundyFont from '@/assets/fonts/2025/25-10-22-fundy.ttf?url';
import styles from './Clock.module.css';

const ClockWithVideo: React.FC = () => {
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  // Using 'ms' precision for the high-frequency tick display
  const time = useClockTime('ms');
  const videoRef = useRef<HTMLVideoElement>(null);

  const fontConfigs = useMemo(() => [
    { fontFamily: 'FundyFont', fontUrl: fundyFont }
  ], []);

  // Use the standardized loader to avoid injecting <style> tags manually
  useSuspenseFontLoader(fontConfigs);

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

  // Helper function to insert separators into the time string for readability
  const renderTimeDigits = () => {
    const { hours, minutes, seconds, milliseconds } = formatClockTime(time, '24h');
    
    const Digit = ({ val, idx }: { val: string; idx: number }) => (
      <span key={idx} className={styles.digit}>{val}</span>
    );

    return (
      <>
        <Digit val={hours[0]} idx={0} />
        <Digit val={hours[1]} idx={1} />
        <span className={styles.separator}>:</span>
        <Digit val={minutes[0]} idx={2} />
        <Digit val={minutes[1]} idx={3} />
        <span className={styles.separator}>:</span>
        <Digit val={seconds[0]} idx={4} />
        <Digit val={seconds[1]} idx={5} />
        <span className={styles.separator}>.</span>
        <Digit val={milliseconds![0]} idx={6} />
        <Digit val={milliseconds![1]} idx={7} />
      </>
    );
  };

  return (
    <>
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
    </>
  );
}

export default ClockWithVideo;
