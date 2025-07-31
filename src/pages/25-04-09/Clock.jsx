import React, { useEffect, useRef } from 'react';
import roomImage from './images/room.jpg'; // Local image

const EmptyRoomClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

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

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <img
        src={roomImage}
        alt="Room background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <div style={{
        width: '45vh',
        height: '45vh',
        backgroundImage: `url(${roomImage})`,
        backgroundSize: 'cover',
        filter: 'brightness(0.92)',
        backgroundPosition: 'center',
        border: '2px solid #a19f63',
        borderRadius: '50%',
        position: 'absolute',
        top: '38vh',
        left: '14vw',
        boxShadow: `
          1px 1px rgba(191, 32, 32, 0.5),
          -1px 1px rgba(191, 32, 32, 0.5),
          -1px -1px rgba(191, 32, 32, 0.5),
          1px -1px rgba(191, 32, 32, 0.5),
          -10px 15px 30px rgba(0, 0, 0, 0.5)
        `,
        transform: 'rotateX(-9deg) rotateZ(3deg)',
        transformOrigin: 'bottom center',
      }}>
        <div ref={hourRef} style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '6px',
          height: '50px',
          background: '#333',
          borderRadius: '4px',
          transformOrigin: 'bottom center',
        }} />
        <div ref={minuteRef} style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '4px',
          height: '70px',
          background: '#666',
          borderRadius: '4px',
          transformOrigin: 'bottom center',
        }} />
        <div ref={secondRef} style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '2px',
          height: '90px',
          background: 'rgb(186, 41, 41)',
          borderRadius: '4px',
          transformOrigin: 'bottom center',
        }} />
        {/* Optional center dot */}
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: '50%',
          width: '10px',
          height: '10px',
          background: '#333',
          borderRadius: '50%',
          transform: 'translate(-50%, 50%)',
        }} />
        {/* Clock shadow */}
        <div style={{
          content: '',
          position: 'absolute',
          bottom: '-20px',
          left: '20px',
          width: '160px',
          height: '20px',
          background: 'rgba(0, 0, 0, 0.2)',
          filter: 'blur(10px)',
          borderRadius: '50%',
          zIndex: -1,
        }} />
      </div>
    </div>
  );
};

export default EmptyRoomClock;
