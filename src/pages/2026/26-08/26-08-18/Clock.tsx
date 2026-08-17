import React, { useEffect, useMemo, useState } from 'react';

// 1. Asset Exports (for preloading)
// NOTE: Please replace these placeholder paths with your actual assets.
import backgroundImage from '@/assets/images/26_images/26-08/26-08-18/eclipse.webm';

// In a portable component, asset handling is simplified.
// The original preloading export is removed.
// export const assets = [backgroundImage, fontUrl];

// 2. Inline Styles
// All styles from the original `Clock.module.css` are now defined as JS objects.
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'ClockFont_26_08_13, sans-serif',
    position: 'relative', // Needed for video positioning
    overflow: 'hidden', // Hide video overflow
  },
  backgroundVideo: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    fontFamily: 'ClockFont_26_08_13, sans-serif',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  clockContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '1rem',
  },
  analogClock: {
    position: 'relative',
    width: '200px',
    height: '200px',
    border: '4px solid white',
    borderRadius: '50%',
  },
  hand: {
    position: 'absolute',
    width: '50%',
    height: '6px',
    top: '50%',
    left: '0',
    transformOrigin: '100%',
    backgroundColor: 'white',
    borderRadius: '3px',
  },
  hourHand: { height: '6px', width: '35%', left: '15%', backgroundColor: 'white' },
  minuteHand: { height: '4px', width: '45%', left: '5%', backgroundColor: 'white' },
  secondHand: { height: '2px', width: '50%', backgroundColor: 'red' },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: 'red',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
  },
  digitalClock: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '2.5rem',
    color: 'white',
    letterSpacing: '0.1em',
  },
  digit: {
    minWidth: '2ch',
    textAlign: 'center',
  },
  separator: {
    margin: '0 0.25rem',
  },
};

// 3. Main Component
const ClockComponent: React.FC = () => {
  // Inlined time hook logic using standard React hooks for portability.
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Use setInterval for a simple, portable ticker.
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 16); // ~60fps update rate

    return () => clearInterval(intervalId);
  }, []);

  // Memoize expensive calculations for both digital and analog clocks
  const { digital, hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    // Digital part
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    // Analog part (inlined from useClockAngles)
    // Add milliseconds for smoother sweep
    const smoothSecond = seconds + milliseconds / 1000;
    const smoothMinute = minutes + smoothSecond / 60;
    const smoothHour = (hours % 12) + smoothMinute / 60;

    const secondAngle = smoothSecond * 6;
    const minuteAngle = smoothMinute * 6;
    const hourAngle = smoothHour * 30;

    return {
      digital: { hours: h, minutes: m, seconds: s },
      hourAngle,
      minuteAngle,
      secondAngle,
    };
  }, [time]);

  return (
    <main style={styles.container}>
      {/* Semantic <time> element for accessibility (Required) */}
      <time dateTime={time.toISOString()} style={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <video
        style={styles.backgroundVideo}
        src={backgroundImage}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      {/* --- Clock UI --- */}
      <div style={styles.clockContainer}>
        {/* Analog Clock */}
        <div style={styles.analogClock}>
          <div
            style={{
              ...styles.hand,
              ...styles.hourHand,
              transform: `rotate(${hourAngle}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              ...styles.minuteHand,
              transform: `rotate(${minuteAngle}deg)`,
            }}
          />
          <div
            style={{
              ...styles.hand,
              ...styles.secondHand,
              transform: `rotate(${secondAngle}deg)`,
            }}
          />
          <div style={styles.centerDot} />
        </div>

        {/* Digital Clock */}
        <div style={styles.digitalClock}>
          <span style={styles.digit}>{digital.hours}</span>
          <span style={styles.separator}>:</span>
          <span style={styles.digit}>{digital.minutes}</span>
          <span style={styles.separator}>:</span>
          <span style={styles.digit}>{digital.seconds}</span>
        </div>
      </div>
    </main>
  );
};

// 4. Performance: Wrap in React.memo + set displayName (Required)
const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'PortableClock';

export default MemoizedClock;