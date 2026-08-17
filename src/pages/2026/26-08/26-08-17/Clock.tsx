import * as d3 from 'd3';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './Clock.module.css';

const PARTICLE_COUNT = 400;

const ClockComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  const time = new Date(); // Using a static time for now, can be replaced with a time hook
  const { isoTime, displayTime } = useMemo(() => {
    return {
      isoTime: time.toISOString(),
      displayTime: time.toLocaleTimeString(),
    };
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Initialize sites and speed arrays[cite: 2]
    const sites: [number, number][] = Array.from({ length: PARTICLE_COUNT }, () => [
      Math.random() * width,
      Math.random() * height,
    ]);

    const speedFactor = 0.2;
    const speed = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * 2 * Math.PI;
      const velocity = (Math.random() * 0.5 + 0.2) * speedFactor;
      return { x: Math.cos(angle) * velocity, y: Math.sin(angle) * velocity };
    });

    // Handle canvas resizing[cite: 2]
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Scale particle positions instead of resetting
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      const scaleX = width / oldWidth;
      const scaleY = height / oldHeight;
      sites.forEach(site => {
        site[0] *= scaleX;
        site[1] *= scaleY;
      });
    };

    window.addEventListener('resize', handleResize);

    // Boundary bounce physics[cite: 2]
    const rebondOnScreen = () => {
      for (let i = 0; i < sites.length; i++) {
        if (sites[i][0] < 0 || sites[i][0] > width) {
          speed[i].x *= -1;
        }
        if (sites[i][1] < 0 || sites[i][1] > height) {
          speed[i].y *= -1;
        }

        sites[i][0] += speed[i].x;
        sites[i][1] += speed[i].y;
      }
    };

    // Draw individual Voronoi cell paths[cite: 2]
    const drawCell = (cell: d3.VoronoiPolygon<[number, number]>) => {
      if (!cell) return false;
      context.moveTo(cell[0][0], cell[0][1]);
      for (let j = 1, m = cell.length; j < m; ++j) {
        context.lineTo(cell[j][0], cell[j][1]);
      }
      context.closePath();
      return true;
    };

    // Render loop[cite: 2]
    const redraw = () => {
      const delaunay = d3.Delaunay.from(sites);
      const voronoi = delaunay.voronoi([0, 0, width, height]);

      context.clearRect(0, 0, width, height);
      context.beginPath();

      // Create gradient stroke[cite: 2]
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop('0', '#e72150');
      gradient.addColorStop('1', '#46bfee');

      for (const cell of voronoi.cellPolygons()) {
        drawCell(cell);
      }

      context.lineWidth = 2;
      context.strokeStyle = gradient;
      context.stroke();
    };

    const animate = () => {
      rebondOnScreen();
      redraw();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main className={styles.container}>
      <time dateTime={isoTime} className={styles.srOnly}>
        {displayTime}
      </time>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.quoteOverlay}>
        <div>
          <p className={styles.quoteText}>
            δὶς ἐς τὸν αὐτὸν ποταμὸν οὐκ ἂν ἐμβαίης.
          </p>
          <p className={styles.quoteAuthor}>-Heraclitus</p>
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_17';

export default MemoizedClock;