import React, { useEffect, useRef, useMemo } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';

const CubeClock = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  
  // Use refs for physics to prevent "glitching" on re-renders
  const position = useRef({ x: 50, y: 50 });
  const velocity = useRef({ 
    x: (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.2), 
    y: (Math.random() > 0.5 ? 1 : -1) * (0.2 + Math.random() * 0.2) 
  });

  const fontConfigs = useMemo<FontConfig[]>(() => [], []);
  useSuspenseFontLoader(fontConfigs);
  const currentTime = useSecondClock();

  // Update clock faces whenever currentTime changes
  useEffect(() => {
    if (!cubeRef.current) return;
    const h = String(currentTime.getHours()).padStart(2, '0');
    const m = String(currentTime.getMinutes()).padStart(2, '0');
    const faces = cubeRef.current.querySelectorAll('div');
    faces.forEach((face) => {
      face.innerHTML = `${h}<br>${m}`;
    });
  }, [currentTime]);

  // Animation loop (Runs once on mount)
  useEffect(() => {
    const cubeSizeVw = 15;
    let animationFrame: number;

    const animate = () => {
      const cube = cubeRef.current;
      if (!cube) return;

      // Update positions
      position.current.x += velocity.current.x;
      position.current.y += velocity.current.y;

      // Bounce Logic (X)
      if (position.current.x <= 0) {
        position.current.x = 0;
        velocity.current.x = Math.abs(velocity.current.x);
      } else if (position.current.x + cubeSizeVw >= 100) {
        position.current.x = 100 - cubeSizeVw;
        velocity.current.x = -Math.abs(velocity.current.x);
      }

      // Bounce Logic (Y) - using vh for height boundary
      if (position.current.y <= 0) {
        position.current.y = 0;
        velocity.current.y = Math.abs(velocity.current.y);
      } else if (position.current.y + (cubeSizeVw * (window.innerWidth/window.innerHeight)) >= 100) {
        // Corrected for aspect ratio since cube height is 15vw
        const cubeHeightVh = (cubeSizeVw * window.innerWidth) / window.innerHeight;
        position.current.y = 100 - cubeHeightVh;
        velocity.current.y = -Math.abs(velocity.current.y);
      }

      cube.style.left = `${position.current.x}vw`;
      cube.style.top = `${position.current.y}vh`;

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []); // Empty array ensures the loop never restarts

  return (
    <div style={styles.body as any}>
      <div style={styles.scene as any}>
        <div ref={cubeRef} style={styles.cube as any}>
          <div style={{ ...styles.face, ...styles.front } as any}></div>
          <div style={{ ...styles.face, ...styles.back } as any}></div>
          <div style={{ ...styles.face, ...styles.left } as any}></div>
          <div style={{ ...styles.face, ...styles.right } as any}></div>
          <div style={{ ...styles.face, ...styles.top } as any}></div>
          <div style={{ ...styles.face, ...styles.bottom } as any}></div>
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
    position: 'relative'
  },
  scene: {
    width: '100vw',
    height: '100vh',
    perspective: '1000px',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cube: {
    width: '15vw',
    height: '15vw',
    position: 'absolute',
    transformStyle: 'preserve-3d',
    // The CSS animation handles the spinning automatically
    animation: 'rotate 10s linear infinite', 
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
    fontSize: '5vw', // Changed to vw for better scaling with the cube
    textAlign: 'center',
    color: 'rgb(70, 61, 61)',
    backfaceVisibility: 'visible',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  front: { transform: 'translateZ(7.5vw)', backgroundColor: 'rgba(235, 108, 108, 0.8)' },
  back: { transform: 'rotateY(180deg) translateZ(7.5vw)', backgroundColor: 'rgba(163, 231, 163, 0.8)' },
  left: { transform: 'rotateY(-90deg) translateZ(7.5vw)', backgroundColor: 'rgba(184, 236, 219, 0.8)' },
  right: { transform: 'rotateY(90deg) translateZ(7.5vw)', backgroundColor: 'rgba(232, 192, 123, 0.8)' },
  top: { transform: 'rotateX(90deg) translateZ(7.5vw)', backgroundColor: 'rgba(224, 158, 224, 0.8)' },
  bottom: { transform: 'rotateX(-90deg) translateZ(7.5vw)', backgroundColor: 'rgba(236, 9, 70, 0.8)' },
};

// Injection of keyframes remains the same
if (typeof document !== 'undefined') {
  const globalStyle = document.createElement('style');
  globalStyle.textContent = `
    @keyframes rotate {
      0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
      100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(360deg); }
    }
  `;
  document.head.appendChild(globalStyle);
}

export default CubeClock;