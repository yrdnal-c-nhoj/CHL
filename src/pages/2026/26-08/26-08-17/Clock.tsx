import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import * as d3 from 'd3';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './Clock.module.css';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets: string[] = [];

// =========================
// FONT CONFIGURATION (defined outside the component to be stable)
// =========================
const fontConfigs: FontConfig[] = [];

const PARTICLE_COUNT = 100;

const ClockComponent =  () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use refs to persist particle state across re-renders without triggering them.
  const sitesRef = useRef<[number, number][] | null>(null);
  const speedRef = useRef<{ x: number; y: number }[] | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const time = useMillisecondClock(50); // Use canonical hook for smooth animation
  useSuspenseFontLoader(fontConfigs); // Use canonical font loader

  const { isoTime, displayTime } = useMemo(() => {
    return {
      isoTime: time.toISOString(),
      displayTime: time.toLocaleTimeString(),
    };
  }, [time]);

  const { hoursMinutes, ampm } = useMemo(() => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const ampmString = hours >= 12 ? 'PM' : 'AM.';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    return {
      hoursMinutes: `${hours}:${minutes}`,
      ampm: ampmString,
    };
  }, [time]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Initialize particles only once
    if (!sitesRef.current) {
      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      canvas.width = dimensionsRef.current.width;
      canvas.height = dimensionsRef.current.height;

      sitesRef.current = Array.from({ length: PARTICLE_COUNT }, () => [
        Math.random() * dimensionsRef.current.width,
        Math.random() * dimensionsRef.current.height,
      ]);

      const speedFactor = 0.5; // Restored to a visible speed
      speedRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const angle = Math.random() * 2 * Math.PI;
        const velocity = (Math.random() * 0.5 + 0.2) * speedFactor;
        return { x: Math.cos(angle) * velocity, y: Math.sin(angle) * velocity };
      });
    }

    const sites = sitesRef.current;
    const speed = speedRef.current;

    // Handle canvas resizing
    const handleResize = () => {
      const oldWidth = dimensionsRef.current.width;
      const oldHeight = dimensionsRef.current.height;

      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      canvas.width = dimensionsRef.current.width;
      canvas.height = dimensionsRef.current.height;

      // Scale particle positions instead of resetting
      const scaleX = dimensionsRef.current.width / oldWidth;
      const scaleY = dimensionsRef.current.height / oldHeight;
      sites?.forEach(site => {
        site[0] *= scaleX;
        site[1] *= scaleY;
      });
    };

    // Boundary bounce physics
    const rebondOnScreen = () => {
      if (!sites || !speed) return;
      const { width, height } = dimensionsRef.current;
      sites.forEach((site, i) => {
        const particleSpeed = speed[i];
        if (!site || !particleSpeed) return;

        if (site[0] < 0 || site[0] > width) {
          particleSpeed.x *= -1;
        }
        if (site[1] < 0 || site[1] > height) {
          particleSpeed.y *= -1;
        }
        site[0] += particleSpeed.x;
        site[1] += particleSpeed.y;
      });
    };

    const drawCell = (cell: d3.VoronoiPolygon<[number, number]>) => {
      if (!cell || cell.length === 0) return false;
      const startPoint = cell[0];
      if (!startPoint) return false;

      context.moveTo(startPoint[0], startPoint[1]);
      for (let j = 1, m = cell.length; j < m; ++j) {
        const point = cell[j];
        if (point) {
          context.lineTo(point[0], point[1]);
        }
      }
      context.closePath();
      return true;
    };

    const redraw = () => {
      if (!sites) return;
      const { width, height } = dimensionsRef.current;
      const delaunay = d3.Delaunay.from(sites);
      const voronoi = delaunay.voronoi([0, 0, width, height]); // Use current dimensions

      context.clearRect(0, 0, width, height);
      context.beginPath();

      // Create gradient stroke
      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop('0', '#A349E4');
      gradient.addColorStop('1', '#49DDE2');

      for (const cell of voronoi.cellPolygons()) {
        drawCell(cell);
      }

      context.lineWidth = 1;
      context.strokeStyle = gradient;
      context.stroke();
    };

    window.addEventListener('resize', handleResize);

    // The animation is now driven by the useEffect dependency on `time`
    rebondOnScreen();
    redraw();

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // The `time` dependency from the canonical hook now drives the animation.
    // The other variables are stable and don't need to be in the dependency array.
  }, [time]);

  return (
    <main className={styles.container}>
      <time dateTime={isoTime} className={styles.srOnly}>
        {displayTime}
      </time>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.quoteOverlay}>
        <div className={styles.quoteBlock}>
          <p className={styles.quoteOriginal}>
            δὶς ἐς τὸν αὐτὸν ποταμὸν οὐκ ἂν ἐμβαίης.*
          </p>
          <p className={styles.quoteTranslation}>
            You can't step in<wbr /> the same river twice.*
          </p>
          <p className={styles.author}>-Heraclitus</p>
        </div>
      </div>
      <div className={styles.digitalClock}>
        *{hoursMinutes} <span className={styles.ampm}>{ampm}</span>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_17';

export default MemoizedClock;