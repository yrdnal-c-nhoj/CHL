import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import styles from './Clock.module.css';

import mazeImage from '../../../assets/images/26-02/26-02-16/puzzle.gif';
import loopVideo from '../../../assets/images/26-02/26-02-16/loop.mp4';
import mazeFont from '../../../assets/fonts/26-02-16-maze.ttf';

export { mazeImage, loopVideo };

const CONFIG = {
  FONT_FAMILY: 'MazeFont',
  COLORS: {
    background: '#0a0005',
    glow: '#F2EFEF99',
    glowFaint: 'rgba(181, 12, 12, 0)',
    text: '#331A1A80',
  },
};

const getBackgroundStyle = (isFlipped) => ({
  position: 'absolute' as const,
  inset: 0,
  backgroundImage: `url(${mazeImage})`,
  backgroundSize: '200px auto',
  backgroundRepeat: 'repeat',
  backgroundPosition: 'center',
  filter: 'contrast(6.4) brightness(1.0)',
  opacity: isFlipped ? 0.4 : 0.7,
  transform: isFlipped ? 'scale(-1, -1)' : 'none',
  zIndex: isFlipped ? 2 : 1,
});

const BackgroundLayers = React.memo(() => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);

  const handleVideoError = (e) => {
    // Log to console in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Video loading error:', e);
      console.error('Video src:', loopVideo);
    }
    setVideoError(true);
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleUserInteraction = () => {
    setUserInteracted(true);
    // Try to play video after user interaction
    const video = videoRef.current;
    if (video && !videoLoaded && !videoError) {
      video.play().then(() => {
        setVideoLoaded(true);
      }).catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Video play failed after user interaction:', err);
        }
        setVideoError(true);
      });
    }
  };

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;
    
    const playVideo = async () => {
      try {
        await video.play();
        setVideoLoaded(true);
      } catch (err) {
        // Log to console in development only
        if (process.env.NODE_ENV === 'development') {
          console.error('Video autoplay was prevented:', err);
        }
        // Don't set error immediately - wait for user interaction
      }
    };

    // Add multiple event listeners for better reliability
    video.addEventListener('canplay', playVideo);
    video.addEventListener('loadeddata', handleVideoLoad);

    // If video is already ready, try to play it.
    if (video.readyState >= 4) {
      // HAVE_ENOUGH_DATA
      playVideo();
    }

    return () => {
      video.removeEventListener('canplay', playVideo);
      video.removeEventListener('loadeddata', handleVideoLoad);
    };
  }, [videoError]);

  // Add global click listener for user interaction
  React.useEffect(() => {
    if (userInteracted || videoLoaded) return;
    
    const handleGlobalClick = () => {
      handleUserInteraction();
    };
    
    document.addEventListener('click', handleGlobalClick, { once: true });
    document.addEventListener('touchstart', handleGlobalClick, { once: true });
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, [userInteracted, videoLoaded]);

  return (
    <>
      {/* Third layer - large scaled video that rotates */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        className={videoLoaded ? styles.rotatingVideo : ''}
        style={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          width: '150vw',
          height: '150vh',
          objectFit: 'cover',
          opacity: videoError ? 0 : videoLoaded ? 0.7 : 0.1,
          visibility: videoError ? 'hidden' : 'visible',
          zIndex: 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <source src={loopVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* First image - original background */}
      <div style={getBackgroundStyle(false)} />
      {/* Second image - flipped background */}
      <div style={getBackgroundStyle(true)} />
    </>
  );
});
BackgroundLayers.displayName = 'BackgroundLayers';

const Digit = React.memo(({ char }) => {
  const isColon = char === ':';
  return (
    <div className={styles.digitBox}>
      <span className={`${styles.digit} ${isColon ? styles.colon : ''}`}>
        {char}
      </span>
    </div>
  );
});
Digit.displayName = 'Digit';

export const fontConfigs = [{
  fontFamily: CONFIG.FONT_FAMILY,
  fontUrl: mazeFont,
  options: {
    weight: 'normal',
    style: 'normal'
  }
}];

const DigitalClock: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const timeParts = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`.split('');
  }, [time]);

  return (
    <main className={styles.container}>
      <BackgroundLayers />
      <div className={styles.digitalContainer}>
        <div className={styles.timeWrapper}>
          {timeParts.map((char, idx) => (
            <Digit key={`${idx}-${char}`} char={char} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default DigitalClock;
