import { useEffect, useRef } from 'react';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';

import backgroundVideo from '@/assets/images/26_images/26-11/26-11-14/collapse.webm';
import clockFont from '@/assets/fonts/26fonts/26-11-14-subset.ttf?url';

import styles from './Clock.module.css';

export const assets = [backgroundVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_14',
  fontUrl: clockFont,
};

const TILE_WIDTH = 200;
const TILE_HEIGHT = 300;
// Grid extends 3x viewport in each direction (9x total area)
const GRID_SCALE = 3;

const Clock_26_11_14 = () => {
  const time = useSmoothClock(16);

  useSuspenseFontLoader([fontConfig]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const tilePositionsRef = useRef<Array<{ x: number; y: number }>>([]);
  const viewportSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });

    if (!ctx) return;

    let animationFrame = 0;
    let active = false;
    let visibleTileCount = 0;
    const TILES_PER_FRAME = 3;

    // Generate tile positions in a spiral from center of the EXTENDED grid
    const generateTilePositions = (gridWidth: number, gridHeight: number) => {
      const tileCols = Math.ceil(gridWidth / TILE_WIDTH);
      const tileRows = Math.ceil(gridHeight / TILE_HEIGHT);
      const totalTiles = tileCols * tileRows;

      // Center of the EXTENDED grid (not viewport)
      const centerCol = (gridWidth - TILE_WIDTH) / 2 / TILE_WIDTH;
      const centerRow = (gridHeight - TILE_HEIGHT) / 2 / TILE_HEIGHT;
      const centerColInt = Math.floor(centerCol);
      const centerRowInt = Math.floor(centerRow);

      const positions: Array<{ x: number; y: number }> = [];
      const visited = new Set<string>();

      // Spiral outward from center of extended grid
      let row = centerRowInt;
      let col = centerColInt;
      let step = 1;
      let direction = 0; // 0=right, 1=down, 2=left, 3=up

      const addPosition = (r: number, c: number) => {
        const key = `${r},${c}`;
        if (
          !visited.has(key) &&
          r >= 0 &&
          r < tileRows &&
          c >= 0 &&
          c < tileCols
        ) {
          visited.add(key);
          positions.push({ x: c * TILE_WIDTH, y: r * TILE_HEIGHT });
        }
      };

      addPosition(row, col);

      while (positions.length < totalTiles) {
        for (let i = 0; i < 2; i++) {
          for (let s = 0; s < step; s++) {
            switch (direction) {
              case 0:
                col++;
                break;
              case 1:
                row++;
                break;
              case 2:
                col--;
                break;
              case 3:
                row--;
                break;
            }
            addPosition(row, col);
            if (positions.length >= totalTiles) break;
          }
          if (positions.length >= totalTiles) break;
          direction = (direction + 1) % 4;
        }
        step++;
      }

      return positions;
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Viewport size
      const viewportWidth = rect.width;
      const viewportHeight = rect.height;
      viewportSizeRef.current = {
        width: viewportWidth,
        height: viewportHeight,
      };

      // Grid extends GRID_SCALE x viewport in each dimension
      const gridWidth = viewportWidth * GRID_SCALE;
      const gridHeight = viewportHeight * GRID_SCALE;

      // Canvas is sized to the extended grid
      canvas.width = Math.round(gridWidth * dpr);
      canvas.height = Math.round(gridHeight * dpr);
      ctx.scale(dpr, dpr);
      canvasSizeRef.current = { width: gridWidth, height: gridHeight };

      // Position canvas so its center aligns with viewport center
      // This makes the grid extend equally beyond all four edges
      canvas.style.width = `${gridWidth}px`;
      canvas.style.height = `${gridHeight}px`;
      canvas.style.position = 'absolute';
      canvas.style.left = `${(viewportWidth - gridWidth) / 2}px`;
      canvas.style.top = `${(viewportHeight - gridHeight) / 2}px`;

      // Regenerate tile positions for the extended grid
      tilePositionsRef.current = generateTilePositions(gridWidth, gridHeight);
    };

    // Match object-fit: cover for each individual tile.
    const draw = () => {
      if (!active) return;

      const { width: gridWidth, height: gridHeight } = canvasSizeRef.current;

      if (video.readyState >= 2 && gridWidth > 0 && gridHeight > 0) {
        const videoAspect = video.videoWidth / video.videoHeight;
        const tileAspect = TILE_WIDTH / TILE_HEIGHT;

        let sx = 0;
        let sy = 0;
        let sw = video.videoWidth;
        let sh = video.videoHeight;

        if (videoAspect > tileAspect) {
          sw = video.videoHeight * tileAspect;
          sx = (video.videoWidth - sw) / 2;
        } else {
          sh = video.videoWidth / tileAspect;
          sy = (video.videoHeight - sh) / 2;
        }

        ctx.clearRect(0, 0, gridWidth, gridHeight);

        // Progressive reveal: increase visible tile count
        visibleTileCount = Math.min(
          visibleTileCount + TILES_PER_FRAME,
          tilePositionsRef.current.length,
        );

        // Draw only visible tiles (spiral order from center of extended grid)
        for (let i = 0; i < visibleTileCount; i++) {
          const pos = tilePositionsRef.current[i];
          if (!pos) continue;
          ctx.drawImage(
            video,
            sx,
            sy,
            sw,
            sh,
            pos.x,
            pos.y,
            TILE_WIDTH,
            TILE_HEIGHT,
          );
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    const start = () => {
      if (motionPreference.matches || active) return;

      active = true;
      visibleTileCount = 0;

      // Ensure video plays even when hidden
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          active = false;
        });
      }

      animationFrame = requestAnimationFrame(draw);
    };

    const stop = () => {
      active = false;
      cancelAnimationFrame(animationFrame);
      video.pause();
    };

    const handleMotionChange = () => {
      if (motionPreference.matches) {
        stop();
      } else {
        start();
      }
    };

    motionPreference.addEventListener('change', handleMotionChange);

    // Initial resize and observer
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    if (video.readyState >= 1) {
      start();
    } else {
      video.addEventListener('loadedmetadata', start, { once: true });
    }

    return () => {
      stop();
      video.removeEventListener('loadedmetadata', start);
      motionPreference.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();
    };
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const milliseconds = time.getMilliseconds().toString().padStart(3, '0');

  return (
    <main className={styles.container}>
      <video
        ref={videoRef}
        className={styles.backgroundVideo}
        src={backgroundVideo}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          opacity: 0,
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      <canvas ref={canvasRef} className={styles.tileLayer} aria-hidden="true" />

      <SRTime time={time} />

      <div className={styles.content} aria-hidden="true">
        {hours}
        {minutes}
        {seconds}
        {milliseconds}
      </div>
    </main>
  );
};

Clock_26_11_14.displayName = 'Clock_26_11_14';

export default Clock_26_11_14;
