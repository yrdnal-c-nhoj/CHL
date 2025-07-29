import React, { useEffect, useRef } from 'react';

const AnalogClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = now.getHours() % 12 + min / 60;

      const secondDeg = (sec / 60) * 360;
      const minuteDeg = (min / 60) * 360;
      const hourDeg = (hr / 12) * 360;

      secondRef.current.style.transform = `rotate(${secondDeg}deg)`;
      minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      hourRef.current.style.transform = `rotate(${hourDeg}deg)`;

      animationFrameId = requestAnimationFrame(updateClock);
    };

    updateClock();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const clockStyle = {
    position: 'relative',
    width: '30vw',
    height: '30vw',
    borderRadius: '50%',
    border: '0.5vw solid #000',
    margin: 'auto',
    top: '10vh',
    background: 'radial-gradient(circle, #fff 70%, #ddd)',
  };

  const handStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    transform: 'rotate(0deg)',
  };

  return (
    <div style={clockStyle}>
      <div
        ref={hourRef}
        style={{
          ...handStyle,
          height: '25%',
          width: '1vw',
          backgroundColor: '#333',
          zIndex: 3,
        }}
      />
      <div
        ref={minuteRef}
        style={{
          ...handStyle,
          height: '35%',
          width: '0.6vw',
          backgroundColor: '#666',
          zIndex: 2,
        }}
      />
      <div
        ref={secondRef}
        style={{
          ...handStyle,
          height: '45%',
          width: '0.3vw',
          backgroundColor: 'red',
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default AnalogClock;
