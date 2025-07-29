import React, { useEffect, useRef } from 'react';

const AnalogClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    let animationId;

    const update = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = now.getHours() % 12 + min / 60;

      const secDeg = (sec / 60) * 360;
      const minDeg = (min / 60) * 360;
      const hrDeg = (hr / 12) * 360;

      secondRef.current.style.transform = `rotate(${secDeg}deg)`;
      minuteRef.current.style.transform = `rotate(${minDeg}deg)`;
      hourRef.current.style.transform = `rotate(${hrDeg}deg)`;

      animationId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Styles
  const outerContainer = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f0f0',
  };

  const clockStyle = {
    position: 'relative',
    width: '30vw',
    height: '30vw',
    borderRadius: '50%',
    border: '0.5vw solid #000',
    background: 'radial-gradient(circle, #fff 70%, #ddd)',
  };

  const handBase = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: 'top center',
  };

  return (
    <div style={outerContainer}>
      <div style={clockStyle}>
        {/* Hour hand */}
        <div
          ref={hourRef}
          style={{
            ...handBase,
            height: '7vw',
            width: '0.6vw',
            backgroundColor: '#222',
            marginLeft: '-0.3vw',
            marginTop: '-7vw',
            borderRadius: '0.3vw',
            zIndex: 3,
          }}
        />
        {/* Minute hand */}
        <div
          ref={minuteRef}
          style={{
            ...handBase,
            height: '10vw',
            width: '0.4vw',
            backgroundColor: '#555',
            marginLeft: '-0.2vw',
            marginTop: '-10vw',
            borderRadius: '0.2vw',
            zIndex: 2,
          }}
        />
        {/* Second hand */}
        <div
          ref={secondRef}
          style={{
            ...handBase,
            height: '12vw',
            width: '0.2vw',
            backgroundColor: 'red',
            marginLeft: '-0.1vw',
            marginTop: '-12vw',
            borderRadius: '0.1vw',
            zIndex: 1,
          }}
        />
        {/* Center pin */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1vw',
            height: '1vw',
            backgroundColor: '#000',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
};

export default AnalogClock;

