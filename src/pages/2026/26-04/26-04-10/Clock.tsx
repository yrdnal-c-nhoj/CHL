import React from 'react';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import hourHand from '@/assets/images/2026/26-04/26-04-10/hour.webp';
import minuteHand from '@/assets/images/2026/26-04/26-04-10/minute.webp';
import secondHand from '@/assets/images/2026/26-04/26-04-10/second.webp';
import backgroundImage from '@/assets/images/2026/26-04/26-04-10/sand.jpg';

const Clock: React.FC = () => {
  const now = useMillisecondClock();

  const ms = now.getMilliseconds();
  const s = now.getSeconds() + ms / 1000;
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    margin: 0,
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'saturate(170%) contrast(1.2) brightness(100%)',
    zIndex: 0,
  };

  const faceStyle: React.CSSProperties = {
    width: 'min(95vw, 95vh)',
    height: 'min(95vw, 95vh)',
    borderRadius: '50%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // Hand size configuration (percentage of clock face)
  const HOUR_HAND_WIDTH = 20;    // % of clock face
  const HOUR_HAND_HEIGHT = 29;  // % of clock face radius
  const MINUTE_HAND_WIDTH = 22;
  const MINUTE_HAND_HEIGHT = 49;
  const SECOND_HAND_WIDTH = 23;
  const SECOND_HAND_HEIGHT = 50;

  const handStyle = (rotate: number, width: number, height: number, filter?: string): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}%`,
    height: `${height}%`,
    transformOrigin: '50% 100%',
    transform: `translateX(-50%) rotate(${rotate}deg)`,
    willChange: 'transform',
    pointerEvents: 'none',
    filter,
  });

  const clockWrapperStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <img src={backgroundImage} style={backgroundStyle} alt="background" />
      <div style={clockWrapperStyle}>
        <div style={faceStyle}>
          <img src={hourHand} style={handStyle(h * 30, HOUR_HAND_WIDTH, HOUR_HAND_HEIGHT, 'saturate(100%) contrast(200%) brightness(100%)')} alt="hour hand" />
          <img src={minuteHand} style={handStyle(m * 6, MINUTE_HAND_WIDTH, MINUTE_HAND_HEIGHT, 'saturate(100%) brightness(100%)')} alt="minute hand" />
          <img src={secondHand} style={handStyle(s * 6, SECOND_HAND_WIDTH, SECOND_HAND_HEIGHT, 'saturate(100%) brightness(100%)')} alt="second hand" />
        </div>
      </div>
    </div>
  );
};

export default Clock;
