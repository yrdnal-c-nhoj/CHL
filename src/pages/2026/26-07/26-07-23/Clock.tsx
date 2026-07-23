import { useMillisecondClock } from '@/utils/hooks';
import React from 'react';

import nefertitiImage from '@/assets/images/26_images/26-07/26-07-23/Nefertiti.webp';

export const assets = [nefertitiImage];
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  clockFace: {
    position: 'relative',
    width: '300px',
    height: '300px',
    border: '4px solid rgba(228, 196, 119, 0.7)',
    borderRadius: '50%',
    boxShadow: '0 0 25px rgba(228, 196, 119, 0.3), inset 0 0 15px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(5px)',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
  },
  hourHand: {
    width: '6px',
    height: '70px',
    backgroundColor: 'rgba(228, 196, 119, 0.9)',
    borderRadius: '3px',
    transform: 'translateX(-50%)',
  },
  minuteHand: {
    width: '4px',
    height: '100px',
    backgroundColor: 'rgba(228, 196, 119, 0.9)',
    borderRadius: '2px',
    transform: 'translateX(-50%)',
  },
  secondHand: {
    width: '2px',
    height: '110px',
    backgroundColor: '#E4C477',
    transform: 'translateX(-50%)',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    backgroundColor: '#E4C477',
    border: '2px solid rgba(228, 196, 119, 0.9)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  },
};

const AnalogClock: React.FC = () => {
  const time = useMillisecondClock();

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30;

  return (
    <main style={{ ...styles.container, backgroundImage: `url(${nefertitiImage})` }}>
      <div style={styles.clockFace}>
        <div style={{ ...styles.hand, ...styles.hourHand, transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
        <div style={{ ...styles.hand, ...styles.minuteHand, transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
        <div style={{ ...styles.hand, ...styles.secondHand, transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
        <div style={styles.centerDot} />
      </div>
      <time dateTime={time.toISOString()} className="sr-only">{time.toLocaleTimeString()}</time>
    </main>
  );
};

export default AnalogClock;