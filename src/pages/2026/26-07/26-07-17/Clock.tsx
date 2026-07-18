import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

const AnalogClock: React.FC = () => {
  const now = useSecondClock();

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    return {
      secondAngle: seconds * 6,
      minuteAngle: (minutes + seconds / 60) * 6,
      hourAngle: ((hours % 12) + minutes / 60) * 30,
    };
  }, [now]);

  return (
    <div style={styles.container}>
      <div style={styles.clockFace}>
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
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100dvh',
    backgroundColor: '#2d2d2d',
  },
  clockFace: {
    position: 'relative',
    width: 300,
    height: 300,
    border: '8px solid #f0f0f0',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow:
      '0 0 20px rgba(0,0,0,0.1), inset 0 0 15px rgba(0,0,0,0.2)',
  },
  hand: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '4px',
  },
  hourHand: {
    width: 8,
    height: '25%',
    backgroundColor: '#333',
    marginLeft: -4,
  },
  minuteHand: {
    width: 6,
    height: '35%',
    backgroundColor: '#555',
    marginLeft: -3,
  },
  secondHand: {
    width: 2,
    height: '40%',
    backgroundColor: '#e74c3c',
    marginLeft: -1,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 16,
    height: 16,
    backgroundColor: '#e74c3c',
    border: '3px solid #ffffff',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
  },
};

const ClockPage: React.FC = () => {
  return (
    <>
      <AnalogClock />
      <time dateTime={new Date().toISOString()} className="sr-only">
        {new Date().toLocaleTimeString()}
      </time>
    </>
  );
};

export default ClockPage;