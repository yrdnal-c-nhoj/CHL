import { useMillisecondClock } from '@/utils/hooks';
import React, { useEffect, useState } from 'react';

import nefertitiImage from '@/assets/images/26_images/26-07/26-07-23/Nefertiti.webp';

export const assets = [nefertitiImage];
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  clockFace: {
    position: 'relative',
    width: '55vh',
    height: '46vh',
    border: '0px solid rgba(228, 196, 119, 0.7)',
    borderRadius: '50%',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    filter: 'drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.8))',
  },
  hourHand: {
    width: '12px',
    height: '100px',
    backgroundColor: 'rgba(228, 196, 119, 0.9)',
    border: '1px solid rgba(0,0,0,0.2)',
    borderRadius: '4px 4px 0 0',
    transform: 'translateX(-50%)',
  },
  minuteHand: {
    width: '9px',
    height: '150px',
    backgroundColor: 'rgba(228, 196, 119, 0.9)',
    border: '1px solid rgba(0,0,0,0.2)',
    borderRadius: '3px 3px 0 0',
    transform: 'translateX(-50%)',
  },
  secondHand: {
    width: '2px',
    height: '150px',
    backgroundColor: '#10F6D7',
    transform: 'translateX(-50%)',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '14px',
    height: '14px',
    backgroundColor: '#4169E1',
    border: '2px solid rgba(228, 196, 119, 1)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  },
};

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const AnalogClock: React.FC = () => {
  const time = useMillisecondClock();
  const isMobile = useIsMobile();

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30;

  const responsiveContainerStyle: React.CSSProperties = {
    ...styles.container,
    backgroundImage: `url(${nefertitiImage})`,
    paddingTop: isMobile ? '10vh' : '2vh',
  };

  return (
    <main style={responsiveContainerStyle}>
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