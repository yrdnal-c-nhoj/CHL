import React, { useState, useEffect, useRef } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import bgVideo from '../../../../assets/images/2025/25-09/25-09-25/unix-optimized.mp4'; // Optimized video for mobile compatibility
import fallbackImage from '../../../../assets/images/2025/25-09/25-09-25/unix.webp';
import FontOne_2025_09_25 from '../../../../assets/fonts/25-09-25-unix.otf?url';
import FontTwo_2025_09_25 from '../../../../assets/fonts/25-09-25-unix2.otf?url';
import FontThree_2025_09_25 from '../../../../assets/fonts/25-09-25-un.otf?url';
import FontFour_2025_09_25 from '../../../../assets/fonts/25-09-25-uunix.ttf?url';

// Export assets for preloading
export { bgVideo, fallbackImage };

const fontOneName = `FontOne-25-09-25`;
const fontTwoName = `FontTwo-25-09-25`;
const fontThreeName = `FontThree-25-09-25`;
const fontFourName = `FontFour-25-09-25`;

export const fontConfigs = [
  { fontFamily: fontOneName, fontUrl: FontOne_2025_09_25 },
  { fontFamily: fontTwoName, fontUrl: FontTwo_2025_09_25 },
  { fontFamily: fontThreeName, fontUrl: FontThree_2025_09_25 },
  { fontFamily: fontFourName, fontUrl: FontFour_2025_09_25 },
];

const UnixEpochClock: React.FC = () => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [videoFailed, setVideoFailed] = useState<boolean>(false);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTimestamp(Math.floor(Date.now() / 1000).toString());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const currentYear = (
    (Date.now() - new Date('1970-01-01T00:00:00Z').getTime()) /
    (1000 * 60 * 60 * 24 * 365.25)
  ).toFixed(1);

  return (
    <div
      style={{
        width: '100vw',
        height: `${windowHeight}px`,
        fontFamily: fontOneName,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0.2rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @font-face { font-family: '${fontOneName}'; src: url(${FontOne_2025_09_25}); font-display: swap; }
        @font-face { font-family: '${fontTwoName}'; src: url(${FontTwo_2025_09_25}); font-display: swap; }
        @font-face { font-family: '${fontThreeName}'; src: url(${FontThree_2025_09_25}); font-display: swap; }
        @font-face { font-family: '${fontFourName}'; src: url(${FontFour_2025_09_25}); font-display: swap; }
      `}</style>
      {!videoFailed ? (
        <video
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${windowHeight}px`,
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
          }}
          autoPlay
          loop
          muted
          playsInline
          src={bgVideo}
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <img
          decoding="async"
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${windowHeight}px`,
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
          }}
          src={fallbackImage}
          alt="Background fallback"
        />
      )}

      <div
        style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '0.8rem',
            color: '#7E7979FF',
            maxWidth: '20rem',
            marginBottom: '0.5rem',
            lineHeight: '0.9',
          }}
        >
          On January 1st, 1970, at precisely 00:00:00 UTC, the digital universe
          began counting at zero seconds. That moment became the foundation of
          time itself in computing. The UNIX Epoch was underway.
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.3rem',
            zIndex: 10,
          }}
        >
          {timestamp.split('').map((digit, idx) => (
            <div
              key={idx}
              style={{
                width: '1.1rem',
                height: '3rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: fontTwoName,
                fontSize: '2rem',
                color: '#FF6F00',
                textShadow: `2px 2px 0 #FFD54F, 4px 4px 0 #321F05FF, 6px 6px 0 #EB5122FF`,
              }}
            >
              {digit}
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: '1.3rem',
            fontFamily: fontFourName,
            color: '#61A0FFFF',
            background:
              'linear-gradient(90deg, #0572EFFF, #BF9A07FF, #720524FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.1rem',
            marginTop: '0.01rem',
            display: 'inline-block',
          }}
        >
          seconds since the dawn of digital time
        </div>
      </div>

      <div
        style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: fontThreeName,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          padding: '0.2rem 0.2rem',
          borderRadius: '0.5rem',
          letterSpacing: '0.05rem',
          marginBottom: '0.5rem',
        }}
      >
        <div style={{ fontSize: '2.3rem', color: '#560367FF' }}>
          Celebrating {currentYear} Years!
        </div>
      </div>
    </div>
  );
};

export default UnixEpochClock;
