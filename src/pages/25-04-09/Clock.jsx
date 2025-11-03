import React, { useEffect, useRef, useState } from 'react';
import roomImage from './images/room.webp';

const EmptyRoomClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hour = now.getHours() % 12;
      const minute = now.getMinutes();
      const second = now.getSeconds();

      const hourDeg = (hour + minute / 60) * 30;
      const minuteDeg = (minute + second / 60) * 6;
      const secondDeg = second * 6;

      if (hourRef.current) hourRef.current.style.transform = `translate(-50%) rotate(${hourDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `translate(-50%) rotate(${minuteDeg}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `translate(-50%) rotate(${secondDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const clockSize = Math.min(windowSize.width, windowSize.height) * 0.4;

  // Distance from bottom of viewport
  const clockBottom = windowSize.height * 0.2; // 10% from bottom
  const clockLeft = windowSize.width * 0.6; // center horizontally

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <img
        src={roomImage}
        alt="Room background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: clockSize,
          height: clockSize,
          backgroundImage: `url(${roomImage})`,
          backgroundSize: 'cover',
          filter: 'brightness(0.92)',
          backgroundPosition: 'center',
          border: '2px solid #a19f63',
          borderRadius: '50%',
          position: 'absolute',
          bottom: clockBottom,
          left: clockLeft,
          transform: 'translateX(-50%) rotateX(-9deg) rotateZ(3deg)',
          transformOrigin: 'bottom center',
          boxShadow: `
            1px 1px rgba(191, 32, 32, 0.5),
            -1px 1px rgba(191, 32, 32, 0.5),
            -1px -1px rgba(191, 32, 32, 0.5),
            1px -1px rgba(191, 32, 32, 0.5),
            -10px 15px 30px rgba(0, 0, 0, 0.5)
          `,
          zIndex: 1,
          transition: 'width 0.3s ease, height 0.3s ease, bottom 0.3s ease, left 0.3s ease',
        }}
      >
        <div
          ref={hourRef}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * 0.023,
            height: clockSize * 0.21,
            background: '#333',
            borderRadius: '4px',
            transformOrigin: 'bottom center',
          }}
        />
        <div
          ref={minuteRef}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * 0.019,
            height: clockSize * 0.356,
            background: '#666',
            borderRadius: '4px',
            transformOrigin: 'bottom center',
          }}
        />
        <div
          ref={secondRef}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * 0.0044,
            height: clockSize * 0.5,
            background: 'rgb(186, 41, 41)',
            borderRadius: '4px',
            transformOrigin: 'bottom center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '50%',
            width: clockSize * 0.022,
            height: clockSize * 0.022,
            background: '#333',
            borderRadius: '50%',
            transform: 'translate(-50%, 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -(clockSize * 0.045),
            left: clockSize * 0.044,
            width: clockSize * 0.35,
            height: clockSize * 0.045,
            background: 'rgba(0, 0, 0, 0.2)',
            filter: 'blur(10px)',
            borderRadius: '50%',
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};

export default EmptyRoomClock;
