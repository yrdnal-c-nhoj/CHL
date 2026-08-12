import { useEffect, useRef } from 'react';

interface Seed {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseAngle: number;
  radius: number;
  hue: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  value: number;
}

export default function VoronoiDreamMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seedsRef = useRef<Seed[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const initSeeds = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const seeds: Seed[] = [];

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = Math.min(w, h) * 0.28;

        seeds.push({
          x: w / 2 + Math.cos(angle) * radius,
          y: h / 2 + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
          baseAngle: angle,
          radius: radius * (0.85 + Math.random() * 0.3),
          hue: (i * 30 + 200) % 360,
        });
      }

      seedsRef.current = seeds;
    };

    initSeeds();

    const getVoronoiCell = (px: number, py: number, seeds: Seed[]): number => {
      let minDist = Infinity;
      let closest = 0;

      for (let i = 0; i < seeds.length; i++) {
        const dx = px - seeds[i].x;
        const dy = py - seeds[i].y;
        const dist = dx * dx + dy * dy;

        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }

      return closest;
    };

    const layoutTreemap = (
      rect: Rect,
      values: number[],
      depth: number
    ): Rect[] => {
      if (values.length === 0 || rect.w < 4 || rect.h < 4) return [];

      const total = values.reduce((a, b) => a + b, 0);
      if (total <= 0) return [];

      const result: Rect[] = [];
      const remaining = [...values];
      let x = rect.x;
      let y = rect.y;
      let w = rect.w;
      let h = rect.h;

      while (remaining.length > 0) {
        const isHorizontal = w >= h;
        const side = isHorizontal ? h : w;

        let rowSum = 0;
        let count = 0;

        for (let i = 0; i < remaining.length; i++) {
          rowSum += remaining[i];
          count++;

          const aspect =
            ((rowSum / total) * (isHorizontal ? w : h)) / side;

          if (aspect > 1.2 && count > 1) {
            rowSum -= remaining[i];
            count--;
            break;
          }
        }

        const rowValues = remaining.splice(0, count);
        const rowTotal = rowValues.reduce((a, b) => a + b, 0);
        const rowSize = (rowTotal / total) * (isHorizontal ? w : h);

        let offset = 0;
        for (const v of rowValues) {
          const size = (v / rowTotal) * side;

          if (isHorizontal) {
            result.push({
              x,
              y: y + offset,
              w: rowSize,
              h: size,
              depth,
              value: v,
            });
          } else {
            result.push({
              x: x + offset,
              y,
              w: size,
              h: rowSize,
              depth,
              value: v,
            });
          }

          offset += size;
        }

        if (isHorizontal) {
          x += rowSize;
          w -= rowSize;
        } else {
          y += rowSize;
          h -= rowSize;
        }
      }

      return result;
    };

    const drawMonochromeClockLayer = (
      centerX: number,
      centerY: number,
      hours: number,
      minutes: number,
      seconds: number,
      minDimension: number
    ) => {
      const clockRadius = minDimension * 0.38;

      // Calculate hand angles
      const hourAngle =
        ((hours % 12) / 12) * Math.PI * 2 +
        (minutes / 60) * (Math.PI / 6) -
        Math.PI / 2;
      const minuteAngle =
        (minutes / 60) * Math.PI * 2 +
        (seconds / 60) * (Math.PI / 30) -
        Math.PI / 2;
      const secondAngle = (seconds / 60) * Math.PI * 2 - Math.PI / 2;

      // 4 Key Points Coordinates
      const centerPt = { x: centerX, y: centerY };
      const hourPt = {
        x: centerX + Math.cos(hourAngle) * (clockRadius * 0.5),
        y: centerY + Math.sin(hourAngle) * (clockRadius * 0.5),
      };
      const minutePt = {
        x: centerX + Math.cos(minuteAngle) * (clockRadius * 0.75),
        y: centerY + Math.sin(minuteAngle) * (clockRadius * 0.75),
      };
      const secondPt = {
        x: centerX + Math.cos(secondAngle) * (clockRadius * 0.9),
        y: centerY + Math.sin(secondAngle) * (clockRadius * 0.9),
      };

      const hands = [
        { pt: hourPt, strokeWidth: 8, nodeRadius: 11 },
        { pt: minutePt, strokeWidth: 5, nodeRadius: 9 },
        { pt: secondPt, strokeWidth: 3, nodeRadius: 7 },
      ];

      // Draw Connecting Lines (High-Contrast Black Outer, Solid White Inner)
      hands.forEach(({ pt, strokeWidth }) => {
        // Outer Black Outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = strokeWidth + 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerPt.x, centerPt.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        // Inner White Line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(centerPt.x, centerPt.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      });

      // Helper function to draw prominent B&W target nodes
      const drawNode = (
        x: number,
        y: number,
        radius: number,
        isCenter = false
      ) => {
        // Black Background Ring
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.fill();

        // White Main Fill
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Black Inner Ring
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // White Center Pin
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, isCenter ? radius * 0.3 : radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw 4 Prominent Points
      drawNode(centerPt.x, centerPt.y, 15, true); // Point 1: Center
      drawNode(hourPt.x, hourPt.y, 11);          // Point 2: Hour Hand End
      drawNode(minutePt.x, minutePt.y, 9);         // Point 3: Minute Hand End
      drawNode(secondPt.x, secondPt.y, 7);         // Point 4: Second Hand End
    };

    const draw = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const t = seconds;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.fillStyle = `hsl(${220 + (hours % 12) * 2}, 25%, 8%)`;
      ctx.fillRect(0, 0, w, h);

      const seeds = seedsRef.current;
      const centerX = w / 2;
      const centerY = h / 2;

      seeds.forEach((seed, i) => {
        const drift = t * 0.015 + i * 0.4;
        const orbitRadius =
          seed.radius * (0.9 + Math.sin(t * 0.05 + i) * 0.08);

        seed.x = centerX + Math.cos(seed.baseAngle + drift) * orbitRadius;
        seed.y = centerY + Math.sin(seed.baseAngle + drift) * orbitRadius;
      });

      const cellSize = 6;

      for (let y = 0; y < h; y += cellSize) {
        for (let x = 0; x < w; x += cellSize) {
          const cellIdx = getVoronoiCell(
            x + cellSize / 2,
            y + cellSize / 2,
            seeds
          );
          const seed = seeds[cellIdx];

          const baseHue = (seed.hue + (hours % 12) * 8 + minutes * 0.5) % 360;
          ctx.fillStyle = `hsla(${baseHue}, 55%, 28%, 0.7)`;
          ctx.fillRect(x, y, cellSize + 1, cellSize + 1);
        }
      }

      seeds.forEach((seed, i) => {
        const size = Math.min(w, h) * 0.22;
        const rect: Rect = {
          x: seed.x - size / 2,
          y: seed.y - size / 2,
          w: size,
          h: size,
          depth: 0,
          value: 1,
        };

        const values: number[] = [];
        const base = 8 + (minutes % 7);

        for (let k = 0; k < base; k++) {
          values.push(
            3 + Math.sin(k + minutes * 0.1 + i) * 2 + Math.random()
          );
        }

        const tiles = layoutTreemap(rect, values, 0);

        tiles.forEach((tile, ti) => {
          const hue = (seed.hue + ti * 12 + seconds * 2) % 360;
          const light =
            35 + (tile.depth + 1) * 8 + Math.sin(t + ti) * 5;

          ctx.fillStyle = `hsla(${hue}, 60%, ${light}%, 0.55)`;
          ctx.fillRect(tile.x, tile.y, tile.w - 1.5, tile.h - 1.5);

          ctx.strokeStyle = `hsla(${hue}, 40%, 70%, 0.25)`;
          ctx.lineWidth = 0.8;
          ctx.strokeRect(tile.x, tile.y, tile.w - 1.5, tile.h - 1.5);
        });
      });

      seeds.forEach((seed) => {
        const gradient = ctx.createRadialGradient(
          seed.x,
          seed.y,
          0,
          seed.x,
          seed.y,
          28
        );
        gradient.addColorStop(0, `hsla(${seed.hue}, 80%, 70%, 0.35)`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(seed.x, seed.y, 28, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Top Monochrome 4-Point Overlay
      drawMonochromeClockLayer(
        centerX,
        centerY,
        hours,
        minutes,
        seconds,
        Math.min(w, h)
      );

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: '#0a0c12',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}