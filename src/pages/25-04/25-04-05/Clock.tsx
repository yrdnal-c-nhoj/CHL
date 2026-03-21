import React, { useMemo, useCallback } from 'react';
import { useMillisecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';

import overlayImg from '../../../assets/images/25-04/25-04-05/gfccc.gif';
import hourHandSource from '../../../assets/images/25-04/25-04-05/gr4.gif';
import secondHandSource from '../../../assets/images/25-04/25-04-05/gr5.gif';
import minuteHandSource from '../../../assets/images/25-04/25-04-05/gr99.webp';

// Component Props interface
interface TallClockProps {
  // No props required for this component
}

// Clock rotation functions with proper types
const getHourRotation = (date: Date): number => {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  return hours * 30 + minutes * 0.5;
};

const getMinuteRotation = (date: Date): number => {
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return minutes * 6 + seconds * 0.1;
};

const getSecondRotation = (date: Date): number => {
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
  return seconds * 6;
};

const TallClock = () => {
  // Use the standardized hook for smooth millisecond clock updates
  const time = useMillisecondClock();

  // Font loading configuration (memoized) - no custom fonts needed
  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  const hourRotation = getHourRotation(time);
  const minuteRotation = getMinuteRotation(time);
  const secondRotation = getSecondRotation(time);

  // Set image URLs using the imported source variables
  const hourHandStyle = {
    backgroundImage: `url(${hourHandSource})`,
    transform: `translateX(-50%) rotate(${hourRotation}deg)`,
    filter: 'drop-shadow(2px 4px 6px rgba(24, 23, 23, 0.56))',
  };
  const minuteHandStyle = {
    backgroundImage: `url(${minuteHandSource})`,
    transform: `translateX(-50%) rotate(${minuteRotation}deg)`,
    filter: 'drop-shadow(2px 4px 6px rgba(12, 11, 11, 0.9))',
  };
  const secondHandStyle = {
    backgroundImage: `url(${secondHandSource})`,
    transform: `translateX(-50%) rotate(${secondRotation}deg)`,
    filter:
      'drop-shadow(2px 4px 6px rgba(23, 22, 22, 0.53)) contrast(1.7) saturate(1.7)  brightness(0.8)',
  };

  return (
    <div style={styles.container}>
      {/* Clock Content */}
      <div style={styles.clockContainer}>
        <div style={styles.clockFace}>
          {/* Hour Hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.hourHand,
              ...styles.imageHand,
              ...hourHandStyle,
            }}
          />

          {/* Minute Hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.minuteHand,
              ...styles.imageHand,
              ...minuteHandStyle,
            }}
          />

          {/* Second Hand */}
          <div
            style={{
              ...styles.hand,
              ...styles.secondHand,
              ...styles.imageHand,
              ...secondHandStyle,
            }}
          />

          <div style={styles.centerDot} />
        </div>
      </div>

      {/* Overlays */}
      <div style={{ ...styles.overlay, ...styles.overlay1 }} />
      <div style={{ ...styles.overlay, ...styles.overlay2 }} />
      <div style={{ ...styles.overlay, ...styles.overlay3 }} />
    </div>
  );
};

  // Style interfaces - simplified to avoid CSSProperties conflicts
type ContainerStyle = React.CSSProperties;
type ClockContainerStyle = React.CSSProperties;
type ClockFaceStyle = React.CSSProperties;
type HandStyle = React.CSSProperties;
type ImageHandStyle = React.CSSProperties;
type HourHandStyle = React.CSSProperties;
type MinuteHandStyle = React.CSSProperties;
type SecondHandStyle = React.CSSProperties;
type CenterDotStyle = React.CSSProperties;
type OverlayStyle = React.CSSProperties;
type Overlay1Style = React.CSSProperties;
type Overlay2Style = React.CSSProperties;
type Overlay3Style = React.CSSProperties;

// --- Styles (Unchanged, optimized for image background) ---
const styles: {
  container: ContainerStyle;
  clockContainer: ClockContainerStyle;
  clockFace: ClockFaceStyle;
  hand: HandStyle;
  imageHand: ImageHandStyle;
  hourHand: HourHandStyle;
  minuteHand: MinuteHandStyle;
  secondHand: SecondHandStyle;
  centerDot: CenterDotStyle;
  overlay: OverlayStyle;
  overlay1: Overlay1Style;
  overlay2: Overlay2Style;
  overlay3: Overlay3Style;
} = {
  container: {
    backgroundColor: '#805c0d',
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockContainer: {
    position: 'relative',
    zIndex: 9,
    width: '99vmin',
    height: '99vmin',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockFace: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative',
  },

  // General hand properties
  hand: {
    position: 'absolute',
    left: '50%',
    transformOrigin: 'bottom center',
  },

  // Properties for hands that use images
  imageHand: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center bottom',
    backgroundSize: '100% 100%',
    backgroundColor: 'transparent',
    borderRadius: 0,
  },

  // Hand Sizing
  hourHand: {
    width: '26%',
    height: '35%',
    top: '15%',
    zIndex: 8,
    transition: 'transform 0.12s cubic-bezier(0, 0, 0.58, 1)',
  },
  minuteHand: {
    width: '38%',
    height: '49%',
    top: '5%',
    zIndex: 9,
    transition: 'transform 0.12s cubic-bezier(0, 0, 0.58, 1)',
  },
  secondHand: {
    width: '20%',
    height: '50%',
    top: '0%',
    zIndex: 11,
    // no transition so it follows RAF updates smoothly without snapping
  },

  centerDot: {
    width: '10px',
    height: '10px',
    background: '#000',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 12,
  },

  // Overlay Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${overlayImg})`,
    backgroundRepeat: 'repeat',
    zIndex: 1,
    pointerEvents: 'none',
  },
  overlay1: {
    backgroundSize: '12vmin 12vmin',
    opacity: 0.8,
    zIndex: 5,
  },
  overlay2: {
    backgroundSize: '20vmin 20vmin',
    opacity: 0.5,
    zIndex: 6,
  },
  overlay3: {
    backgroundSize: 'auto',
    opacity: 0.3,
    zIndex: 7,
  },
};

export default TallClock;
