import React, { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

const PARTICLE_COUNT = 150;
const CONNECTION_DIST = 120;

const ClockComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let sites = Array.from({ length: PARTICLE_COUNT }, () => [
      Math.random() * width,
      Math.random() * height,
    ]);
    const speeds = sites.map(() => ({
      x: (Math.random() - 0.5) * 1.5,
      y: (Math.random() - 0.5) * 1.5,
    }));

    let animationFrameId: number;

    const redraw = () => {
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop('0', '#e72150');
      gradient.addColorStop('1', '#46bfee');

      context.lineWidth = 1;
      for (let i = 0; i < sites.length; i++) {
        for (let j = i + 1; j < sites.length; j++) {
          const dx = sites[i][0] - sites[j][0];
          const dy = sites[i][1] - sites[j][1];
          const distSq = dx * dx + dy * dy;
          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            context.beginPath();
            context.moveTo(sites[i][0], sites[i][1]);
            context.lineTo(sites[j][0], sites[j][1]);
            const alpha = 0.4 * (1 - Math.sqrt(distSq) / CONNECTION_DIST);
            context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            context.stroke();
          }
        }
      }

      for (let i = 0; i < sites.length; i++) {
        context.beginPath();
        context.arc(sites[i][0], sites[i][1], 2, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fill();
      }
    };

    const animate = () => {
      for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        const speed = speeds[i];

        if (site[0] < 0 || site[0] > width) speed.x *= -1;
        if (site[1] < 0 || site[1] > height) speed.y *= -1;

        site[0] += speed.x;
        site[1] += speed.y;
      }

      redraw();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      sites = Array.from({ length: PARTICLE_COUNT }, () => [
        Math.random() * width,
        Math.random() * height,
      ]);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_17';

export default MemoizedClock;
