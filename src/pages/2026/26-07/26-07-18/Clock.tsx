import React, { useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-18.ttf?url';
import akiraVideo from '@/assets/images/26_images/26-07/26-07-18/ak2.mp4';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';

// --- COLOR CONFIGURATION ---
const CONFIG = {
  themeColor: 'rgba(255, 255, 255, 0.65)',      // Main color for text, clock hands, and outline boundary
  glowColor: 'rgba(255, 165, 0, 0.7)',         // Color for text shadows and analog clock glow
};

const FONT_FAMILY = 'ClockFont_26-07-18';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    display: 'flex', 
    flexDirection: 'column', 
    backgroundColor: '#484F48',
    overflow: 'hidden',
  },
  clockStrip: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    width: '100%',
    backgroundColor: '#484F48', 
    padding: '0rem 0',
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
    backgroundColor: '#484F48', 
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
    fontFamily: `"${FONT_FAMILY}", "Courier New", Courier, monospace`,
    fontSize: 'clamp(1rem, 2vw, 2rem)', 
    color: CONFIG.themeColor, // <-- Uses config color
    letterSpacing: '10vw',
    textShadow: `0 0 20px ${CONFIG.glowColor}`, // <-- Uses config color (Uncommented and tied to theme)
  },
  analogClockContainer: {
    position: 'relative', 
    width: '10vh',
    height: '10vh',
    borderRadius: '50%', 
    // border: `1px solid ${CONFIG.themeColor}`, // <-- Uses config color for the outline boundary
    // boxShadow: `0 0 70px ${CONFIG.glowColor}`, // <-- Uses config color
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    backgroundColor: CONFIG.themeColor, // <-- Uses config color
    boxShadow: `0 0 20px ${CONFIG.glowColor}`, // <-- Uses config color
    borderRadius: '1px',
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
    <div style={styles.analogClockContainer}>
      <div
        style={{ ...styles.hand, width: '0px', height: '25%', transform: `translateX(-50%) rotate(${hourDegrees}deg)` }}
      />
      <div
        style={{ ...styles.hand, width: '0px', height: '55%', transform: `translateX(-50%) rotate(${minuteDegrees}deg)` }}
      />
      <div
        style={{ ...styles.hand, width: '2px', height: '55%', transform: `translateX(-50%) rotate(${secondDegrees}deg)` }}
      />
    </div>
  );
};

const Clock: React.FC = () => {
  const time = useMillisecondClock();

  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: FONT_FAMILY,
        fontUrl,
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes } = useMemo(() => {
    const h = formatTime(time.getHours());
    const m = formatTime(time.getMinutes());
    return { hours: h, minutes: m };
  }, [time]);

  return (
    <div style={styles.container}>
      <div style={styles.clockStrip}>
        <time dateTime={time.toISOString()} style={styles.clock}>
          <span>{hours[0]}</span>
          <span>{hours[1]}</span>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
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