import React, { useEffect, useRef } from 'react';

const Clock = () => {
  const cubeRef = useRef(null);

  useEffect(() => {
    const cube = cubeRef.current;

    const cubeWidth = 15; // in vw
    const cubeHeight = 15; // in vh

    let posX = 50; // in vw
    let posY = 50; // in vh

    let velX = 0.3 + Math.random() * 0.3; // in vw/frame
    let velY = 0.3 + Math.random() * 0.3; // in vh/frame

    const updatePosition = () => {
      posX += velX;
      posY += velY;

      // Bounce horizontally
      if (posX + cubeWidth > 100) {
        posX = 100 - cubeWidth;
        velX *= -1;
      } else if (posX < 0) {
        posX = 0;
        velX *= -1;
      }

      // Bounce vertically
      if (posY + cubeHeight > 100) {
        posY = 100 - cubeHeight;
        velY *= -1;
      } else if (posY < 0) {
        posY = 0;
        velY *= -1;
      }

      cube.style.left = `${posX}vw`;
      cube.style.top = `${posY}vh`;
    };

    const updateClock = (el) => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      el.innerHTML = `${hours}<br>${minutes}`;
    };

    const updateClocks = () => {
      cube.querySelectorAll('.face').forEach(updateClock);
    };

    const animate = () => {
      updatePosition();
      requestAnimationFrame(animate);
    };

    animate();
    updateClocks();
    const interval = setInterval(updateClocks, 1000);

    return () => clearInterval(interval);
  }, []);

  const faceStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '4vh',
    lineHeight: '3.5vh',
    fontFamily: '"Azeret Mono", monospace',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundColor: '#160584',
      width: '100vw',
      height: '100vh',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        perspective: '1000px',
      }}>
        <div
          ref={cubeRef}
          style={{
            width: '15vw',
            height: '15vh',
            position: 'absolute',
            transformStyle: 'preserve-3d',
            animation: 'spin 20s linear infinite',
            transform: 'rotateX(45deg) rotateY(45deg)',
          }}
        >
          <div className="face" style={{ ...faceStyle, transform: 'translateZ(7.5vw)', backgroundColor: 'rgba(255,0,0,0.6)' }} />
          <div className="face" style={{ ...faceStyle, transform: 'rotateY(180deg) translateZ(7.5vw)', backgroundColor: 'rgba(0,255,0,0.6)' }} />
          <div className="face" style={{ ...faceStyle, transform: 'rotateY(-90deg) translateZ(7.5vw)', backgroundColor: 'rgba(0,0,255,0.6)' }} />
          <div className="face" style={{ ...faceStyle, transform: 'rotateY(90deg) translateZ(7.5vw)', backgroundColor: 'rgba(255,255,0,0.6)' }} />
          <div className="face" style={{ ...faceStyle, transform: 'rotateX(90deg) translateZ(7.5vw)', backgroundColor: 'rgba(255,0,255,0.6)' }} />
          <div className="face" style={{ ...faceStyle, transform: 'rotateX(-90deg) translateZ(7.5vw)', backgroundColor: 'rgba(0,255,255,0.6)' }} />
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0%   { transform: rotateX(0deg) rotateY(0deg); }
            100% { transform: rotateX(360deg) rotateY(360deg); }
          }
        `}
      </style>
    </div> 
  );
};

export default Clock;
