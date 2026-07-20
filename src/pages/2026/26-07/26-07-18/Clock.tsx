import fontUrl from '@/assets/fonts/26fonts/26-07-18.ttf?url';
import akiraVideo from '@/assets/images/26_images/26-07/26-07-18/ak2.mp4';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// --- CONFIGURATION ---
const CONFIG = {
  themeColor: 'rgba(255, 255, 255, 0.65)',
  glowColor: 'rgba(255, 165, 0, 0.7)',
  bgColor: '#484F48', // Unified background control
  fontFamily: 'ClockFont_26-07-18',
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: CONFIG.bgColor,
    overflow: 'hidden',
  },
  clockStrip: {
    display: 'flex',
    width: '100%',
    backgroundColor: CONFIG.bgColor,
    zIndex: 2,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  bottomStrip: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    backgroundColor: CONFIG.bgColor,
    padding: '1vh',
    boxSizing: 'border-box',
    zIndex: 2,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  clock: {
    display: 'flex',
    fontFamily: `"${CONFIG.fontFamily}", "Courier New", Courier, monospace`,
    fontSize: 'clamp(1rem, 2vw, 2rem)',
    color: CONFIG.themeColor,
    letterSpacing: '10vw',
    textShadow: `0 0 20px ${CONFIG.glowColor}`,
  },
  analogClockContainer: {
    position: 'relative',
    width: '10vh',
    height: '10vh',
    borderRadius: '50%',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    backgroundColor: CONFIG.themeColor,
    boxShadow: `0 0 20px ${CONFIG.glowColor}`,
    borderRadius: '1px',
    transform: 'translateX(-50%)',
  },
};

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const AnalogClock: React.FC<{ time: Date }> = ({ time }) => {
  const { hourDegrees, minuteDegrees, secondDegrees } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds() + time.getMilliseconds() / 1000;

    const minuteValue = minutes + seconds / 60;
    const hourValue = (hours % 12) + minuteValue / 60;

    return {
      hourDegrees: hourValue * 30,
      minuteDegrees: minuteValue * 6,
      secondDegrees: seconds * 6,
    };
  }, [time]);

  return (
    <div style={styles.analogClockContainer} aria-label="Analog representation of current time">
      <div style={{ ...styles.hand, width: '0px', height: '25%', transform: `${styles.hand.transform} rotate(${hourDegrees}deg)` }} />
      <div style={{ ...styles.hand, width: '0px', height: '55%', transform: `${styles.hand.transform} rotate(${minuteDegrees}deg)` }} />
      <div style={{ ...styles.hand, width: '2px', height: '55%', transform: `${styles.hand.transform} rotate(${secondDegrees}deg)` }} />
    </div>
  );
};

const FONT_CONFIGS = [{ fontFamily: CONFIG.fontFamily, fontUrl }];

const Clock: React.FC = () => {
  const time = useMillisecondClock();
  
  // Load custom font asset via suspense hook
  useSuspenseFontLoader(FONT_CONFIGS);

  const timeString = `${formatTime(time.getHours())}${formatTime(time.getMinutes())}`;

  return (
    <div style={styles.container}>
      <div style={styles.clockStrip}>
        <time dateTime={time.toISOString()} style={styles.clock}>
          {timeString.split('').map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </time>
      </div>

      <div style={styles.imageContainer}>
        <video
          style={styles.video}
          src={akiraVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <div style={styles.bottomStrip}>
        <AnalogClock time={time} />
      </div>
    </div>
  );
};

export default Clock;