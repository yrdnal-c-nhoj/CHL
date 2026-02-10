import React, { useState, useEffect, useMemo } from 'react';

// Explicit asset imports for Vite optimization
// Vite will fingerprint these files (e.g., custom-font.hash.woff2)
import clockFont from '../../../assets/fonts/pin.ttf';

/**
 * DigitalClock Component
 * Features: 24-hour format, detached digits, 100dvh layout.
 */
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10); // Update every 10ms for millisecond precision
    return () => clearInterval(interval);
  }, []);

  // Format time into individual digits
  const timeData = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(time.getMilliseconds() / 100)); // Single digit ms

    return {
      hours: h.split(''),
      minutes: m.split(''),
      seconds: s.split(''),
      ms: ms
    };
  }, [time]);

  // --- Inline Styles ---
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100dvh', // Dynamic Viewport Height
      backgroundColor: '#0a0a0a',
      color: '#00ff41', // Matrix Green
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: 'monospace', // Fallback
    },
    clockWrapper: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      fontSize: 'clamp(2rem, 10vw, 8rem)',
    },
    digitGroup: {
      display: 'flex',
      gap: '4px',
    },
    digit: {
      backgroundColor: '#1a1a1a',
      padding: '10px 15px',
      borderRadius: '4px',
      border: '1px solid #333',
      minWidth: '1ch',
      textAlign: 'center',
      boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)',
    },
    separator: {
      fontWeight: 'bold',
      opacity: 0.8,
    },
    msDigit: {
      fontSize: '0.6em',
      color: '#ff3e3e', // Red for milliseconds
      alignSelf: 'flex-end',
      marginBottom: '10px'
    }
  };

  const Digit = ({ value }) => (
    <div style={styles.digit}>{value}</div>
  );

  return (
    <div style={styles.container}>
      {/* Dynamic Font Injection (Vite Optimized) */}
      <style>
        {`@font-face { font-family: 'ClockFont'; src: url(${clockFont}); }`}
      </style>

      <div style={{ ...styles.clockWrapper, fontFamily: 'ClockFont, monospace' }}>
        {/* Hours */}
        <div style={styles.digitGroup}>
          <Digit value={timeData.hours[0]} />
          <Digit value={timeData.hours[1]} />
        </div>

        <span style={styles.separator}>:</span>

        {/* Minutes */}
        <div style={styles.digitGroup}>
          <Digit value={timeData.minutes[0]} />
          <Digit value={timeData.minutes[1]} />
        </div>

        <span style={styles.separator}>:</span>

        {/* Seconds */}
        <div style={styles.digitGroup}>
          <Digit value={timeData.seconds[0]} />
          <Digit value={timeData.seconds[1]} />
        </div>

        <span style={styles.separator}>.</span>

        {/* Milliseconds (Single Column) */}
        <div style={{ ...styles.digit, ...styles.msDigit }}>
          {timeData.ms}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;