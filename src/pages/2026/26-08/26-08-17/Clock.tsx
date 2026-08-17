import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';
import styles from './Clock.module.css';

const ClockComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Exit if canvas is not yet available

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const nbParticles = 400;

    // Create particles and their speeds
    let sites = d3
      .range(nbParticles)
      .map(() => [Math.random() * width, Math.random() * height]);
    const speeds = sites.map((_, i) => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    }));

    // Main animation loop
    let animationFrameId: number;

    const redraw = () => {
      const voronoi = d3.voronoi().extent([
        [-1, -1],
        [width + 1, height + 1],
      ]);

      const diagram = voronoi(sites);
      const polygons = diagram.polygons();

      context.clearRect(0, 0, width, height);
      context.beginPath();

      // Create a gradient for the strokes
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop('0', '#e72150');
      gradient.addColorStop('1', '#46bfee');

      // Draw each Voronoi cell
      for (let i = 0; i < polygons.length; i++) {
        const cell = polygons[i];
        if (!cell) continue;
        context.moveTo(cell[0][0], cell[0][1]);
        for (let j = 1; j < cell.length; j++) {
          context.lineTo(cell[j][0], cell[j][1]);
        }
        context.closePath();
      }

      context.lineWidth = 2;
      context.strokeStyle = gradient;
      context.stroke();
    };

    const animate = () => {
      // Update particle positions
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

    // Handle window resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-initialize sites on resize to prevent them from being off-screen
      sites = d3
        .range(nbParticles)
        .map(() => [Math.random() * width, Math.random() * height]);
    };

    window.addEventListener('resize', handleResize);

    // Start the animation
    animate();

    // Cleanup function to stop the animation and remove the listener
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