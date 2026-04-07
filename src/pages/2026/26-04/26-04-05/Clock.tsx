import React, { useLayoutEffect, useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import backgroundVideo from '@/assets/images/2026/26-04/26-04-05/meteor1.mp4';
import middleVideo from '@/assets/images/2026/26-04/26-04-05/meteor2.mp4';
import meteorFont from '@/assets/fonts/26-04-05-meteor.ttf';

const Clock: React.FC = () => {
  const time = useClockTime();

  // Load the meteor font
  useLayoutEffect(() => {
    const fontFace = new FontFace('Meteor', `url(${meteorFont})`);
    fontFace.load().then(() => {
      document.fonts.add(fontFace);
    });
    return () => {
      document.fonts.delete(fontFace);
    };
  }, []);

  // Split time into 6 individual digits: [H, H, M, M, S, S]
  const digits = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    return [...h, ...m, ...s];
  }, [time]);

  const styles: Record<string, React.CSSProperties> = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    videoLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
    },
    middleVideoLayer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100vh',
      objectFit: 'contain',
      transform: 'translate(-50%, -50%) scaleX(-1)',
      zIndex: 1,
        opacity: 0.8,
      pointerEvents: 'none',
    },
    clockWrapper: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      // gap: '12px',
      opacity: 0.5,
    },
    digitGroup: {
      display: 'flex',
      gap: '4px', // Minimal space between digits within a pair (HH MM SS)
    },
    digitBox: {
      fontSize: 'clamp(3rem, 16vw, 15rem)',
      color: '#FFFFFF',
      fontFamily: '"Meteor", monospace',
      textShadow: `
        0 0 2px rgba(255, 255, 255, 1),
        2px 2px 0px rgba(0, 0, 0, 1),
        -1px -1px 0px rgba(128, 128, 128, 0.8)
      `,
      width: '0.8em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      lineHeight: 1,
    },
  };

  return (
    <div style={styles.container}>
      <video style={styles.videoLayer} autoPlay loop muted playsInline src={backgroundVideo} />
      <video style={styles.middleVideoLayer} autoPlay loop muted playsInline src={middleVideo} />

      <style>{`
        @media (max-width: 768px) {
          .clock-wrapper {
            transform: translateX(-3vw);
          }
        }
      `}</style>

      <div style={styles.clockWrapper} className="clock-wrapper">
        {/* Hours */}
        <div style={styles.digitGroup}>
          <div style={styles.digitBox}>{digits[0]}</div>
          <div style={styles.digitBox}>{digits[1]}</div>
        </div>

        {/* Minutes */}
        <div style={styles.digitGroup}>
          <div style={styles.digitBox}>{digits[2]}</div>
          <div style={styles.digitBox}>{digits[3]}</div>
        </div>

        {/* Seconds */}
        <div style={styles.digitGroup}>
          <div style={styles.digitBox}>{digits[4]}</div>
          <div style={styles.digitBox}>{digits[5]}</div>
        </div>

        {/*
        // PLACEHOLDERS
        <div style={styles.digitGroup}>
          <div style={styles.digitBox}>0</div>
          <div style={styles.digitBox}>0</div>
        </div>
        <div style={styles.digitGroup}>
          <div style={styles.digitBox}>0</div>
          <div style={styles.digitBox}>0</div>
        </div>
        <div style={styles.digitGroup}>
          <div style={styles.digitBox}>0</div>
          <div style={styles.digitBox}>0</div>
        </div>
        */}
      </div>
    </div>
  );
};

export default Clock;