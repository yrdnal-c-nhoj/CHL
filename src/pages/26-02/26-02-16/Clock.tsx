import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';

// --- Assets ---
import mazeImage from '../../../assets/images/26-02/26-02-16/puzzle.gif';
import loopVideo from '../../../assets/images/26-02/26-02-16/loop.mp4';
import mazeFont from '../../../assets/fonts/26-02-16-maze.ttf';

// Export assets for ClockPage preloader
export const background = mazeImage;

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
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150vw',
          height: '150vh',
          objectFit: 'cover',
          opacity: videoError ? 0 : videoLoaded ? 0.7 : 0,
          zIndex: 0,
          animation: videoLoaded ? 'rotate-video 60s linear infinite' : 'none',
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
    <div style={styles.digitBox}>
      <span style={{ ...styles.digit, ...(isColon ? styles.colon : {}) }}>
        {char}
      </span>
    </div>
  );
});
Digit.displayName = 'Digit';

// --- Main Component ---
const DigitalClock: React.FC = () => {
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = useMemo(() => [{
      fontFamily: CONFIG.FONT_FAMILY,
      fontUrl: mazeFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
  }], []);
  
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
    <main style={styles.container}>
      <style>{animations}</style>
      <BackgroundLayers />
      <div style={styles.digitalContainer}>
        <div style={styles.timeWrapper}>
          {timeParts.map((char, idx) => (
            <Digit key={`${idx}-${char}`} char={char} />
          ))}
        </div>
      </div>
    </main>
  );
};

// --- Animations ---
const animations = `
  @keyframes pulse-glow {
    0%, 100% {
      opacity: 1;
      text-shadow:
        0 0 10px ${CONFIG.COLORS.glow},
        0 0 30px ${CONFIG.COLORS.glow},
        0 0 60px ${CONFIG.COLORS.glowFaint};
    }
    50% {
      opacity: 0.6;
      text-shadow: 0 0 5px ${CONFIG.COLORS.glow};
    }
  }

  @keyframes colon-blink {
    0%, 49% { opacity: 0.8; }
    50%, 100% { opacity: 0.2; }
  }

  @keyframes rotate-video {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

// --- Styles ---
const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: CONFIG.COLORS.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Respect safe areas (notches/home bars) from template
    padding:
      'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
    boxSizing: 'border-box',
  },
  digitalContainer: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  timeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.15em',
  },
  digitBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.1em',
    height: '1.2em',
  },
  digit: {
    fontFamily: `${CONFIG.FONT_FAMILY}, monospace`,
    fontSize: 'clamp(2rem, 15vw, 8rem)',
    lineHeight: 1,
    textAlign: 'center',
    color: CONFIG.COLORS.text,
    animation: 'pulse-glow 2s ease-in-out infinite',
    userSelect: 'none',
  },
  colon: {
    animation: 'colon-blink 1s step-end infinite',
  },
};

export default DigitalClock;
