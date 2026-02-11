import React, { useEffect, useState } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';

// --- Assets ---
import teeVeeLoungeFont from '../../../assets/fonts/26-02-10-tv.ttf?url';
import analogBgImage from '../../../assets/images/26-02-10/tv.jpg';

// --- Configuration ---
const CLOCK_CONFIG = {
  COLORS: {
    silverText: '#5B83F3',

  }
};

/**
 * Custom Hook: useClock
 * Updates every second for digital display
 */
const useClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second for digital clock
    return () => clearInterval(interval);
  }, []);

  return time;
};

const DigitalClock = () => {
  const now = useClock();
  const fontReady = useFontLoader('BorrowedAnalog', teeVeeLoungeFont);
  const [textReady, setTextReady] = useState(false);

  // Prevent flash by only showing text when font is loaded
  useEffect(() => {
    if (fontReady) {
      setTextReady(true);
    }
  }, [fontReady]);

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
      <div style={{ 
        ...styles.backgroundLayer, 
        backgroundImage: `url(${analogBgImage})` 
      }} />

      {/* DIGITAL CLOCK DISPLAY */}
      <div style={styles.digitalFace}>
        {textReady && (
          <div style={{
            ...styles.digitalDisplay,
            fontFamily: fontReady ? "'BorrowedAnalog', sans-serif" : 'sans-serif'
          }}>
            {timeString}
          </div>
        )}
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