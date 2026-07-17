import hourImg from '@/assets/images/26_images/26-07/26-07-15/hour.webp';
import chandelierBg from '@/assets/images/26_images/26-07/26-07-15/lav.mp4';
import minImg from '@/assets/images/26_images/26-07/26-07-15/min.webp';
import secImg from '@/assets/images/26_images/26-07/26-07-15/sec.webp';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export const assets = [chandelierBg];

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
        preload="auto"
        // Added brightness(0.8) and contrast(1.2) to the video
        style={{ ...styles.backgroundVideo, filter: 'brightness(0.8) saturate(1.2) contrast(1.2)' }}
      >
        <source src={chandelierBg} type="video/mp4" />
      </video>
    </div>
  );
};

const AnalogClock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    return {
      secondAngle: seconds * 6, // 360deg / 60s
      minuteAngle: (minutes + seconds / 60) * 6, // 360deg / 60m
      // 360deg / 12h = 30deg per hour
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
            // brightness(0.9), contrast(1.1), and lavender drop-shadow
            transform: `rotate(${hourAngle}deg)`,
            filter: `brightness(1.3) saturate(2.5) contrast(0.7) ${dropShadow}`,
          }}
        />

        <img
          alt="Minute hand"
          src={minImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.minuteHand,
            // brightness(1.1), contrast(0.9), and lavender drop-shadow
            transform: `rotate(${minuteAngle}deg)`,
            filter: `brightness(1.1) saturate(2.5) contrast(0.9) ${dropShadow}`,
          }}
        />

        <img
          alt="Second hand"
          src={secImg}
          style={{
            ...clockStyles.handImgBase,
            ...clockStyles.secondHand,
            // brightness(1.2), contrast(1.3), and lavender drop-shadow
            transform: `rotate(${secondAngle}deg)`,
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
  },
  face: {
    width: 260,
    height: 260,
    borderRadius: '50%',
    position: 'relative',
  },
  handImgBase: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: '50% 100%',
    borderRadius: 999,
    userSelect: 'none',
  },
 hourHand: {
    width: 118,
    height: 170,
    marginLeft: -69, // Half of 138px width
  },
  minuteHand: {
    width: 216,
    height: 292,
    marginLeft: -108, // Half of 216px width
  },
  secondHand: {
    width: 212,
    height: 300,
    marginLeft: -106, // Half of 212px width
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
    objectFit: 'fill',
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