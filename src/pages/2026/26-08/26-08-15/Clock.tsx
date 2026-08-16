import React, { useEffect, useMemo, useState } from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'ClockFont_26_08_13, sans-serif',
    backgroundColor: '#117771',
  },
  srOnly: {
    position: 'absolute',
    width: '1vw',
    height: '1vh',
    padding: 0,
    margin: '-1vh',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
  clockContainer: {
    position: 'relative',
    width: '100vmin',
    height: '100vmin',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(172, 75, 75, 0.65)',
    borderRadius: '50%',
    border: '0.2vmin solid rgba(214, 210, 210, 0.2)',
    boxShadow: '0 0.8vmin 3.2vmin rgba(0, 0, 0, 0.5)',
  },
  centerLine: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: '0.5vmin',
    height: '60vh',
    backgroundColor: 'rgba(255, 71, 87, 0.5)',
    transform: 'translateX(-50%)',
    zIndex: 4,
    pointerEvents: 'none',
  },
  ring: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.05s linear',
  },
  number: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'center center',
    fontWeight: 'bold',
    userSelect: 'none',
  },
  centerDot: {
    position: 'absolute',
    width: '1.2vmin',
    height: '1.2vmin',
    backgroundColor: '#ff4757',
    borderRadius: '50%',
    zIndex: 5,
  },
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);
const SECONDS = Array.from({ length: 60 }, (_, i) => i + 1);

const ClockComponent: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 16);

    return () => clearInterval(intervalId);
  }, []);

  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    const smoothSecond = seconds + milliseconds / 1000;
    const smoothMinute = minutes + smoothSecond / 60;
    const smoothHour = (hours % 12) + smoothMinute / 60;

    return {
      hourAngle: -smoothHour * 30,
      minuteAngle: -smoothMinute * 6,
      secondAngle: -smoothSecond * 6,
    };
  }, [time]);

  return (
    <main style={styles.container}>
      {/* Semantic <time> element for accessibility */}
      <time dateTime={time.toISOString()} style={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div style={styles.clockContainer}>
      
        {/* Center Reference Line */}
        <div style={styles.centerLine} />

        {/* 1. Innermost Circle: Hours */}
        <div
          style={{
            ...styles.ring,
            width: '28vmin',
            height: '28vmin',
            transform: `rotate(${hourAngle}deg)`,
          }}
        >
          {HOURS.map((num, i) => {
            const angle = (i + 1) * 30;
            return (
              <span
                key={`h-${num}`}
                style={{
                  ...styles.number,
                  fontSize: '2vmin',
                  color: '#ffffff',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-10vmin)`,
                }}
              >
                {num}
              </span>
            );
          })}
        </div>

        {/* 2. Middle Circle: Minutes */}
        <div
          style={{
            ...styles.ring,
            width: '52vmin',
            height: '52vmin',
            transform: `rotate(${minuteAngle}deg)`,
          }}
        >
          {MINUTES.map((num, i) => {
            const angle = (i + 1) * 30;
            return (
              <span
                key={`m-${num}`}
                style={{
                  ...styles.number,
                  fontSize: '1.8vmin',
                  color: '#a4b0be',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-21vmin)`,
                }}
              >
                {num}
              </span>
            );
          })}
        </div>

        {/* 3. Outermost Circle: Seconds (Maximized Radius) */}
        <div
          style={{
            ...styles.ring,
            width: '99vmin',
            height: '99vmin',
            transform: `rotate(${secondAngle}deg)`,
          }}
        >
          {SECONDS.map((num) => {
            const angle = num * 6;
            return (
              <span
                key={`s-${num}`}
                style={{
                  ...styles.number,
                  fontSize: '3.3vmin',
                  color: '#ff4757',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-49vmin)`,
                }}
              >
                {num}
              </span>
            );
          })}
        </div>

    
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'PortableClock';

export default MemoizedClock;