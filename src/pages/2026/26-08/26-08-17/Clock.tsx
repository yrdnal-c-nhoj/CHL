import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import * as d3 from 'd3';
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './Clock.module.css';

// Import the font file so it's included in the build
import fontUrl from '@/assets/fonts/26fonts/26-08-17.ttf?url';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets: string[] = [fontUrl];

// =========================
// FONT CONFIGURATION (defined outside the component to be stable)
// =========================
const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_17',
    fontUrl,
  },
];

const PARTICLE_COUNT = 200;

const ClockComponent: React.FC = () => {
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

  const digitalTime = useMemo(() => {
    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    return `${hours}:${minutes} ${ampm}`;
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
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (sites[i][0] < 0 || sites[i][0] > width)
          speed[i].x *= -1;
        if (sites[i][1] < 0 || sites[i][1] > height)
          speed[i].y *= -1;

        sites[i][0] += speed[i].x;
        sites[i][1] += speed[i].y;
      }
    };

    const drawCell = (cell: d3.VoronoiPolygon<[number, number]>) => {
      if (!cell) return false;
      context.moveTo(cell[0][0], cell[0][1]);
      for (let j = 1, m = cell.length; j < m; ++j) {
        context.lineTo(cell[j][0], cell[j][1]);
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
      gradient.addColorStop('0', '#0B8080');
      gradient.addColorStop('1', '#296909');

      for (const cell of voronoi.cellPolygons()) {
        drawCell(cell);
      }

      context.lineWidth = 0.5;
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
            You can't step in the same river twice.*
          </p>
          <p className={styles.author}>-Heraclitus</p>
        </div>
      </div>
      <div className={styles.digitalClock}>
       * {digitalTime}
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_17';

export default MemoizedClock;