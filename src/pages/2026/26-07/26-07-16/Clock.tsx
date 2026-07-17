import chandelierBg from '@/assets/images/26_images/26-07/26-07-15/lav.mp4';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export const assets = [chandelierBg];

const AnalogClock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { minuteAngle, secondAngle } = useMemo(() => {
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    return {
      secondAngle: seconds * 6, // 360deg / 60s
      // Minute hand moves gradually with seconds
      minuteAngle: (minutes + seconds / 60) * 6, // 360deg / 60m
    };
  }, [now]);

  return (
    <div style={clockStyles.wrapper} aria-label="Analog clock">
      <div style={clockStyles.face}>
        {/* Minute hand */}
        <div
          style={{
            ...clockStyles.handBase,
            ...clockStyles.minuteHand,
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
          }}
        />

        {/* Second hand */}
        <div
          style={{
            ...clockStyles.handBase,
            ...clockStyles.secondHand,
            transform: `translateX(-50%) rotate(${secondAngle}deg)`,
          }}
        />

        {/* Center dot */}
        <div style={clockStyles.centerDot} />
      </div>
    </div>
  );
};

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
    <div style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={styles.backgroundVideo}
      >
        <source src={chandelierBg} type="video/mp4" />
      </video>

      {/* Clock overlay */}
      <div style={styles.clockLayer}>
        <AnalogClock />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'fixed', // pin the whole background layer, not just the video
    inset: 0,
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'fill', // stretch to fill, no crop, no black bars
    display: 'block', // removes the tiny inline-baseline gap <video> has by default
    zIndex: 0,
  },
  clockLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
};


const clockStyles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    width: 'min(70vmin, 420px)',
    height: 'min(70vmin, 420px)',
    position: 'relative',
  },
  face: {
    width: '100%',
    height: '100%',
    borderRadius: '9999px',
    border: '2px solid rgba(255,255,255,0.65)',
    background: 'rgba(0,0,0,0.08)',
    position: 'absolute',
    inset: 0,
    display: 'block',
  },
  handBase: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transformOrigin: '50% 100%',
    borderRadius: 9999,
  },
  minuteHand: {
    width: 6,
    height: '30%',
    background: 'rgba(255,255,255,0.85)',
    // move hand center from top-left to center dot alignment
    // (translateX handles centering in the rotate transform)
    zIndex: 2,
  },
  secondHand: {
    width: 3,
    height: '42%',
    background: 'rgba(255,80,80,0.95)',
    zIndex: 3,
  },
  centerDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 9999,
    background: 'rgba(255,255,255,0.95)',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 4,
    boxShadow: '0 0 0 3px rgba(0,0,0,0.15)',
  },
};

export default VideoBackground;

