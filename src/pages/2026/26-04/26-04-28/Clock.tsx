import React, { useEffect, useRef } from 'react';
import backgroundImg from '@/assets/images/2026/26-04/26-04-28/2021-07-06-0012.jpg';
import { useClockTime, calculateAngles } from '@/utils/clockUtils';

const Clock: React.FC = () => {
  // Use useClockTime with 'ms' precision for smooth analog hand movement
  const time = useClockTime('ms');

  const hourHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const secondHandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { hour, minute, second } = calculateAngles(time);

    if (hourHandRef.current) {
      hourHandRef.current.style.transform = `translateX(-50%) rotate(${hour}deg)`;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.style.transform = `translateX(-50%) rotate(${minute}deg)`;
    }
    if (secondHandRef.current) {
      secondHandRef.current.style.transform = `translateX(-50%) rotate(${second}deg)`;
    }

  }, [time]); // Dependency array includes 'time' to re-run on every time update

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${backgroundImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  return (
    <main style={containerStyle}>
      <style>{`
        .analog-clock-container {
          position: relative;
          width: 500px;
          height: 500px;
          border-radius: 50%;
        }

        .center-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background-color: #CE8C56;
          border-radius: 50%;
          z-index: 10;
        }

        .hand {
          position: absolute;
          bottom: 50%; /* Position base of hand at center */
          left: 50%;
          transform-origin: 50% 100%; /* Pivot from the bottom center of the hand div */
          background-color: #333333;
          border-radius: 5px;
          z-index: 5;
        }

        .hour-hand {
          width: 6px;
          height: 150px;
          background-color: #D36D39;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
        }

        .minute-hand {
          width: 4px;
          height: 200px;
          background-color: #C97F41;
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
        }

        .second-hand {
          width: 2px;
          height: 200px;
          background-color: #e74c3c;
          z-index: 6;
          box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      <div className="analog-clock-container">
        <div ref={hourHandRef} className="hand hour-hand"></div>
        <div ref={minuteHandRef} className="hand minute-hand"></div>
        <div ref={secondHandRef} className="hand second-hand"></div>
        <div className="center-dot"></div>
      </div>
    </main>
  );
};

export default Clock;