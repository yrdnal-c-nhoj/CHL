import hourImg from '@/assets/images/26_images/26-07/26-07-12/hour.webp';
import chandelierBg from '@/assets/images/26_images/26-07/26-07-12/lav.mp4';
import minImg from '@/assets/images/26_images/26-07/26-07-12/min.webp';
import secImg from '@/assets/images/26_images/26-07/26-07-12/sec.webp';
import { useSmoothClock } from '@/utils/hooks/useSmoothClock';
import React, { useEffect, useMemo, useRef } from 'react';

export const assets = [chandelierBg, hourImg, minImg, secImg];

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch((error) =>
        console.error('Video play failed:', error)
      );
    }
  }, []);

  return (
    <div style={styles.videoContainer}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto" // Changed to 'cover' to prevent distortion
        // Added brightness(0.8) and contrast(1.2) to the video
        style={{ ...styles.backgroundVideo, filter: 'brightness(0.8) saturate(1.2) contrast(1.2)' }}
      >
        <source src={chandelierBg} type="video/mp4" />
      </video>
    </div>
  );
};
const AnalogClock: React.FC = () => {
  // Use a standardized hook for smooth time updates for consistency.
  const now = useSmoothClock();

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const ms = now.getMilliseconds();
    const seconds = now.getSeconds() + ms / 1000; // Includes fractional seconds for a smooth sweep
    const minutes = now.getMinutes();
    const hours = now.getHours();

    return {
      secondAngle: seconds * 6, // 360deg / 60s
      minuteAngle: (minutes + seconds / 60) * 6, // 360deg / 60m
      hourAngle: ((hours % 12) + minutes / 60 + seconds / 3600) * 30,
    };
  }, [now]);

  // Common drop-shadow for all hands
  const dropShadow = 'drop-shadow(0px 0px 8px lavender)';

  return (
    <div style={clockStyles.wrapper} aria-label="Analog clock">
      <div style={clockStyles.face}>
        <img
          alt="Hour hand"
          src={hourImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.hourHand,
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
            filter: `brightness(1.3) saturate(2.5) contrast(0.7) ${dropShadow}`,
          }}
        />

        <img
          alt="Minute hand"
          src={minImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.minuteHand,
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
            filter: `brightness(1.1) saturate(2.5) contrast(0.9) ${dropShadow}`,
          }}
        />

        <img
          alt="Second hand"
          src={secImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.secondHand,
            transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
            filter: `brightness(1.2) contrast(1.3) ${dropShadow}`,
          }}
        />

        <div style={clockStyles.centerDot} />
      </div>
    </div>
  );
};

const clockStyles: {
  wrapper: React.CSSProperties;
  face: React.CSSProperties;
  handImgBase: React.CSSProperties;
  hourHand: React.CSSProperties;
  minuteHand: React.CSSProperties;
  secondHand: React.CSSProperties;
  centerDot: React.CSSProperties;
} = {
  wrapper: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
    // Use a variable for the clock size to make it responsive
    '--clock-size': 'clamp(200px, 30vmin, 400px)',
  },
  face: {
    width: 'var(--clock-size)',
    height: 'var(--clock-size)',
    borderRadius: '50%',
    position: 'relative',
  },
  handImgBase: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: '50% 100%',
    borderRadius: 999,
    userSelect: 'none',
  },
 hourHand: {
    width: 'calc(var(--clock-size) * 0.45)', // Responsive sizing
    height: 'calc(var(--clock-size) * 0.65)',
  },
  minuteHand: {
    width: 'calc(var(--clock-size) * 0.83)', // Responsive sizing
    height: 'calc(var(--clock-size) * 1.12)',
  },
  secondHand: {
    width: 'calc(var(--clock-size) * 0.81)', // Responsive sizing
    height: 'calc(var(--clock-size) * 1.15)',
  },
};

const styles: { [key: string]: React.CSSProperties } = {
  videoContainer: {
    width: '100%',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'fixed',
    inset: 0,
    zIndex: 0,
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
};

const ClockPage: React.FC = () => {
  return (
    <>
      <VideoBackground />
      <AnalogClock />
    </>
  );
};

export default ClockPage;