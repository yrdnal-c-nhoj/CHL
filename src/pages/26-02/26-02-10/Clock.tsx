import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';

// --- Assets ---
import teeVeeLoungeFont from '../../../assets/fonts/26-02-10-tv.ttf?url';
import analogBgImage from '../../../assets/images/26-02/26-02-10/tv.jpg';

// Export assets for ClockPage preloader
export const background = analogBgImage;

// --- Configuration ---
const CLOCK_CONFIG = {
  COLORS: {
    silverText: '#58D5C0',
  },
};

const DigitalClock: React.FC = () => {
  // Smooth animation using requestAnimationFrame
  const now = useSecondClock();
  
  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = useMemo(() => [{
      fontFamily: 'TeeVeeFont',
      fontUrl: teeVeeLoungeFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
  }], []);
  
  useSuspenseFontLoader(fontConfigs);

  // 12-hour format with no leading zeros
  const hours = now.getHours();
  const twelveHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Format with leading zeros on minutes only, all on one line
  const timeString = `${twelveHour}:${minutes.toString().padStart(2, '0')}${ampm}`;

  return (
    <div style={styles.container}>
      {/* FILTERED BACKGROUND LAYER */}
      <div
        style={{
          ...styles.backgroundLayer,
          backgroundImage: `url(${analogBgImage})`,
        }}
      />

      {/* DIGITAL CLOCK DISPLAY */}
      <div style={styles.digitalFace}>
        <div
          style={{
            ...styles.digitalDisplay,
            fontFamily: "'TeeVeeFont', sans-serif",
          }}
        >
          {timeString}
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#050505',
  },
  backgroundLayer: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: '72% center',
    filter: 'saturate(120%) hue-rotate(-20deg) ',
    zIndex: 1,
  },
  digitalFace: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  },
  digitalDisplay: {
    fontSize: 'clamp(3rem, 12vw, 6rem)',
    color: CLOCK_CONFIG.COLORS.silverText,
    textAlign: 'center',
    letterSpacing: '0.05em',
    lineHeight: 1,
  },
};

export default DigitalClock;
