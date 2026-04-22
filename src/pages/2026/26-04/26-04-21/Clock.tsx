import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

interface Circle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  movement: 'float' | 'jiggle' | 'in' | 'out';
}

const COLORS = ['#F60C52', '#F1E211', '#C608EC', '#37A9CC', '#0DEC41'];

const Clock: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circlesRef = useRef<Circle[]>([]);
  const timeRef = useRef<string>('');
  const animationRef = useRef<number>(0);
  const textPixelsRef = useRef<{ x: number; y: number }[]>([]);
  const time = useClockTime();
  const [slowdownActive, setSlowdownActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'Caveat', fontUrl: 'https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2Q7azYYMg8.woff2' }
  ], []);

  useSuspenseFontLoader(fontConfigs);

  // Trigger a "reload" of the particle system every 5 seconds
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let slowdownTimeoutId: NodeJS.Timeout;

    const scheduleCycle = () => {
      // Start slowdown 2 seconds before the reset
      slowdownTimeoutId = setTimeout(() => {
        setSlowdownActive(true);
      }, 3000); // 3 seconds into the 5-second cycle

      // Trigger reset and restart the cycle after 5 seconds
      intervalId = setTimeout(() => {
        setSlowdownActive(false);
        setResetKey((prev) => prev + 1);
        scheduleCycle(); // Schedule the next cycle
      }, 5000);
    };
    scheduleCycle(); // Initiate the first cycle
    return () => { clearTimeout(intervalId); clearTimeout(slowdownTimeoutId); };
  }, []);

  // 1. Corrected Pixel Extraction
  const createTextPixels = useCallback((text: string): { x: number; y: number }[] => {
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d', { willReadFrequently: true })!;
    
    const cw = 800; // Slightly wider for full time string
    const ch = 200;
    textCanvas.width = cw;
    textCanvas.height = ch;
    
    textCtx.fillStyle = '#000';
    textCtx.fillRect(0, 0, cw, ch);
    textCtx.font = `900 120px 'Caveat', cursive`;
    textCtx.fillStyle = '#fff';
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';
    textCtx.fillText(text, cw / 2, ch / 2);
    
    const imageData = textCtx.getImageData(0, 0, cw, ch).data;
    const pixels: { x: number; y: number }[] = [];
    
    // Step by 6 or 8 for performance/density
    const step = 7; 
    for (let y = 0; y < ch; y += step) {
      for (let x = 0; x < cw; x += step) {
        // Calculate index for the Red channel of the pixel at (x, y)
        const index = (y * cw + x) * 4;
        if (imageData[index]! > 128) {
          pixels.push({ x, y });
        }
      }
    }
    return pixels;
  }, []);

  // Initialize particles once
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const circles: Circle[] = [];
    for (let i = 0; i < 800; i++) { // Increased count for better legibility
      circles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: 0,
        originY: 0,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: COLORS[i % COLORS.length]!,
        radius: 4 + Math.random() * 3,
        alpha: 0.2 + Math.random() * 0.5,
        movement: 'float',
      });
    }
    circlesRef.current = circles;
    // Clear timeRef to force immediate re-calculation of targets for new particles
    timeRef.current = '';
  }, [resetKey]);

  // Update targets when time changes
  useEffect(() => {
    const formatTime = (num: number): string => num.toString().padStart(2, '0');
    const timeStr = `${formatTime(time.getHours())}:${formatTime(time.getMinutes())}`;
    
    if (timeStr !== timeRef.current) {
      timeRef.current = timeStr;
      const pixels = createTextPixels(timeStr);
      const offsetX = (window.innerWidth - 800) / 2;
      const offsetY = (window.innerHeight - 200) / 2;

      circlesRef.current.forEach((circle, idx) => {
        if (idx < pixels.length) {
          circle.originX = offsetX + pixels[idx]!.x;
          circle.originY = offsetY + pixels[idx]!.y;
          circle.movement = 'in';
        } else {
          circle.movement = 'out';
        }
      });
    }
  }, [time, createTextPixels, resetKey]);

  // Main Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap delta to prevent huge jumps
      lastTime = currentTime;

      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      circlesRef.current.forEach((circle) => {
        if (slowdownActive) {
          // Shake with decreasing intensity during slowdown
          const shakeIntensity = 20; // High intensity shake
          circle.vx += (Math.random() - 0.5) * shakeIntensity;
          circle.vy += (Math.random() - 0.5) * shakeIntensity;
          circle.vx *= 0.7; // Gradual slowdown
          circle.vy *= 0.7;
        } else if (circle.movement === 'in' || circle.movement === 'jiggle') {
          const dx = circle.originX - circle.x;
          const dy = circle.originY - circle.y;
          
          // Spring physics
          circle.vx += dx * 50 * delta;
          circle.vy += dy * 50 * delta;
          circle.vx *= 0.85;
          circle.vy *= 0.85;

          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) circle.movement = 'jiggle';
          
          if (circle.movement === 'jiggle') {
            circle.vx += (Math.random() - 0.5) * 2;
            circle.vy += (Math.random() - 0.5) * 2;
          }
        } else {
          // Floating behavior
          circle.vx += (Math.random() - 0.5) * 5 * delta;
          circle.vy += (Math.random() - 0.5) * 5 * delta;
          circle.vx *= 0.99;
          circle.vy *= 0.99;
        }

        circle.x += circle.vx;
        circle.y += circle.vy;

        ctx.globalAlpha = circle.alpha;
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [slowdownActive]);

  return <canvas ref={canvasRef} style={{ display: 'block', background: '#71896F' }} />;
};

export default Clock;