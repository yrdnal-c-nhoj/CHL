import React, { useEffect, useRef } from 'react';

const CubeClock = () => {
  const cubeRef = useRef(null);

  useEffect(() => {
    const cube = cubeRef.current;
    const cubeSizeVw = 15;
    let posX = 50;
    let posY = 50;
    let velX = (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.2);
    let velY = (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.2);

    const updatePosition = () => {
      posX += velX;
      posY += velY;

      if (posX <= 0) {
        posX = 0;
        velX = Math.abs(velX);
      } else if (posX + cubeSizeVw >= 100) {
        posX = 100 - cubeSizeVw;
        velX = -Math.abs(velX);
      }

      if (posY <= 0) {
        posY = 0;
        velY = Math.abs(velY);
      } else if (posY + cubeSizeVw >= 100) {
        posY = 100 - cubeSizeVw;
        velY = -Math.abs(velY);
      }

      if (cube) {
        cube.style.left = `${posX}vw`;
        cube.style.top = `${posY}vh`;
      }
    };

    const updateClock = (el) => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      el.innerHTML = `${h}<br>${m}`;
    };

    const updateAllClocks = () => {
      const faces = cube?.querySelectorAll('div');
      faces?.forEach(face => updateClock(face));
    };

    const animate = () => {
      updatePosition();
      updateAllClocks();
      requestAnimationFrame(animate);
    };

    animate();
    const clockInterval = setInterval(updateAllClocks, 1000);
    updateAllClocks();

    return () => clearInterval(clockInterval);
  }, []);

  return (
    <div style={styles.body}>
      <div style={styles.scene}>
        <div ref={cubeRef} style={styles.cube}>
          <div style={{ ...styles.face, ...styles.front }}></div>
          <div style={{ ...styles.face, ...styles.back }}></div>
          <div style={{ ...styles.face, ...styles.left }}></div>
          <div style={{ ...styles.face, ...styles.right }}></div>
          <div style={{ ...styles.face, ...styles.top }}></div>
          <div style={{ ...styles.face, ...styles.bottom }}></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    overflow: 'hidden',
    backgroundColor: '#160584',
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scene: {
    width: '100vw',
    height: '100vh',
    perspective: '1000px',
    position: 'absolute',
  },
  cube: {
    width: '15vw',
    height: '15vw',
    position: 'absolute',
    transformStyle: 'preserve-3d',
    transform: 'rotateX(45deg) rotateY(45deg)',
    animation: 'rotate 20s linear infinite',
  },
  face: {
    fontFamily: 'monospace',
    fontWeight: 800,
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '5vh',
    lineHeight: '4vh',
    color: 'rgb(70, 61, 61)',
    backfaceVisibility: 'hidden',
  },
  front: {
    transform: 'translateZ(7.5vw)',
    backgroundColor: 'rgba(235, 108, 108, 0.7)',
  },
  back: {
    transform: 'rotateY(180deg) translateZ(7.5vw)',
    backgroundColor: 'rgba(163, 231, 163, 0.7)',
  },
  left: {
    transform: 'rotateY(-90deg) translateZ(7.5vw)',
    backgroundColor: 'rgba(184, 236, 219, 0.7)',
  },
  right: {
    transform: 'rotateY(90deg) translateZ(7.5vw)',
    backgroundColor: 'rgba(232, 192, 123, 0.7)',
  },
  top: {
    transform: 'rotateX(90deg) translateZ(7.5vw)',
    backgroundColor: 'rgba(224, 158, 224, 0.7)',
  },
  bottom: {
    transform: 'rotateX(-90deg) translateZ(7.5vw)',
    backgroundColor: 'rgba(236, 9, 70, 0.7)',
  },
};

// Global keyframes
const globalStyle = document.createElement("style");
globalStyle.textContent = `
@keyframes rotate {
  0% { transform: rotateX(0deg) rotateY(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}`;
document.head.appendChild(globalStyle);

export default CubeClock;
