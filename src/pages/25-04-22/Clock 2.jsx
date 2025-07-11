import React, { useEffect, useRef } from 'react';

const Clock = () => {
  const cubeRef = useRef(null);

  useEffect(() => {
    const cube = cubeRef.current;
    const cubeSizeVw = 15;
    let positionX = 50;
    let positionY = 50;
    let velocityX = 0.3 + Math.random() * 0.3;
    let velocityY = 0.3 + Math.random() * 0.3;

    const updatePosition = () => {
      positionX += velocityX;
      positionY += velocityY;

      if (positionX + cubeSizeVw > 100 || positionX < 0) {
        velocityX = (Math.random() - 0.5);
      }

      if (positionY + cubeSizeVw > 100 || positionY < 0) {
        velocityY = (Math.random() - 0.5);
      }

      if (positionX + cubeSizeVw > 100) positionX = 100 - cubeSizeVw;
      if (positionX < 0) positionX = 0;
      if (positionY + cubeSizeVw > 100) positionY = 100 - cubeSizeVw;
      if (positionY < 0) positionY = 0;

      cube.style.left = `${positionX}vw`;
      cube.style.top = `${positionY}vh`;
    };

    const updateClock = (clockElement) => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      clockElement.innerHTML = `${hours}<br>${minutes}`;
    };

    const updateClocks = () => {
      cube.querySelectorAll('div').forEach((face) => updateClock(face));
    };

    const animate = () => {
      updatePosition();
      updateClocks();
      requestAnimationFrame(animate);
    };

    animate();
    const interval = setInterval(updateClocks, 1000);

    return () => clearInterval(interval);
  }, []);

  const baseFaceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '5vh',
    lineHeight: '4vh',
    fontFamily: '"Azeret Mono", monospace',
    fontWeight: 800,
    color: 'rgb(70, 61, 61)',
    textAlign: 'center',
  };

  return (
    <div style={{
      margin: 0,
      overflow: 'hidden',
      backgroundColor: '#160584',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      <div style={{
        width: '100vw',
        height: '100vh',
        perspective: '1000px',
        position: 'absolute'
      }}>
        <div
          ref={cubeRef}
          style={{
            width: '15vw',
            height: '15vw',
            position: 'absolute',
            transformStyle: 'preserve-3d',
            animation: 'spin 20s linear infinite',
            transform: 'rotateX(45deg) rotateY(45deg)'
          }}
        >
          <div style={{ ...baseFaceStyle, transform: 'translateZ(7.5vw)', backgroundColor: 'rgba(235, 108, 108, 0.7)' }}></div>
          <div style={{ ...baseFaceStyle, transform: 'rotateY(180deg) translateZ(7.5vw)', backgroundColor: 'rgba(163, 231, 163, 0.7)' }}></div>
          <div style={{ ...baseFaceStyle, transform: 'rotateY(-90deg) translateZ(7.5vw)', backgroundColor: 'rgba(184, 236, 219, 0.7)' }}></div>
          <div style={{ ...baseFaceStyle, transform: 'rotateY(90deg) translateZ(7.5vw)', backgroundColor: 'rgba(232, 192, 123, 0.7)' }}></div>
          <div style={{ ...baseFaceStyle, transform: 'rotateX(90deg) translateZ(7.5vw)', backgroundColor: 'rgba(224, 158, 224, 0.7)' }}></div>
          <div style={{ ...baseFaceStyle, transform: 'rotateX(-90deg) translateZ(7.5vw)', backgroundColor: 'rgba(236, 9, 70, 0.7)' }}></div>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotateX(0deg) rotateY(0deg);
            }
            100% {
              transform: rotateX(360deg) rotateY(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Clock;
