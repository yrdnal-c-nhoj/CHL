import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import styles from './Clock.module.css';

// --- Assets ---
import mazeImage from '../../../assets/images/26-02/26-02-16/puzzle.gif';
import loopVideo from '../../../assets/images/26-02/26-02-16/loop.mp4';
import mazeFont from '../../../assets/fonts/26-02-16-maze.ttf';

// Export assets for ClockPage preloader
export { mazeImage, loopVideo };

// --- Configuration ---
const CONFIG = {
  FONT_FAMILY: 'MazeFont',
  COLORS: {
    background: '#0a0005',
    glow: '#F2EFEF99',
    glowFaint: 'rgba(181, 12, 12, 0)',
    text: '#331A1A80',
  },
};

// --- Background Style Helper ---
const getBackgroundStyle = (isFlipped) => ({
  position: 'absolute',
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

// --- Sub-Components ---
const BackgroundLayers = React.memo(() => {
  const videoRef = React.useRef(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const handleVideoError = (e) => {
    console.error('Video loading error:', e);
    console.error('Video src:', loopVideo);
    setVideoError(true);
  };

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let played = false;
    const playVideo = async () => {
      if (played) return;
      played = true;
      try {
        await video.play();
        setVideoLoaded(true);
      } catch (err) {
        console.error('Video autoplay was prevented:', err);
        setVideoError(true);
      }
    };

    video.addEventListener('canplay', playVideo);

    // If video is already ready, play it.
    if (video.readyState >= 4) {
      // HAVE_ENOUGH_DATA
      playVideo();
    }

    return () => {
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

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
        className={videoLoaded ? styles.rotatingVideo : ''}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150vw',
          height: '150vh',
          objectFit: 'cover',
          opacity: videoError ? 0 : videoLoaded ? 0.7 : 0,
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

// Standardized font loading with font-display: swap to avoid FOUC
export const fontConfigs = [{
  fontFamily: CONFIG.FONT_FAMILY,
  fontUrl: mazeFont,
  options: {
    weight: 'normal',
    style: 'normal'
  }
}];

// --- Main Component ---
const DigitalClock: React.FC = () => {
  
  useSuspenseFontLoader(fontConfigs);

  // 2. Clock tick using standard hook
  const time = useSecondClock();

  // 3. Time Formatting
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
