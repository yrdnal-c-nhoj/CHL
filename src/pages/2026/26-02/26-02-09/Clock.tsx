import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import customFont from '@/assets/fonts/2026/26-02-09-spin.otf?url';
import type { FontConfig } from '@/types/clock';

interface Glyph {
  type: 'hour' | 'minute' | 'period';
  z: number;
  x: number;
  baseY: number;
  speed: number;
  spin: number;
  spinSpeed: number;
  wobbleAmp: number;
  wobbleFreq: number;
  wobblePhase: number;
  drift: number;
}

const COLORS = {
  hour: '#FFFFFF',
  minute: '#FFFFFF',
  period: '#FFFFFF',
};

const CONFIG = {
  SPAWN_INTERVAL_MS: 1800,
  CENTER_LIGHT_RADIUS: 12000,
  SHADOW_LENGTH: 2000,
  MIN_Z: 0.4,
  MAX_Z: 1.5,
  BASE_FONT_SIZE_FACTOR: 0.12,
  MIN_FONT_SIZE: 70,
};

export default function CenteredLightClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glyphsRef = useRef<Glyph[]>([]);
  const [ariaTime, setAriaTime] = useState('');

  const canvasStyle = useMemo<React.CSSProperties>(
    () => ({
      width: '100vw',
      height: '100dvh',
      display: 'block',
      backgroundColor: '#4F5B6D',
      overflow: 'hidden',
      margin: 0,
    }),
    [],
  );

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { 
      fontFamily: 'CustomOswald', 
      fontUrl: customFont, 
      options: { weight: '600', style: 'normal' } 
    }
  ], []);
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const updateAria = () => {
      setAriaTime(
        new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      );
    };
    updateAria();
    const interval = setInterval(updateAria, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let lastTime = performance.now();
    let spawnAccumulator = 0;
    let logicalWidth = window.innerWidth;
    let logicalHeight = window.innerHeight;

    const glyphs = glyphsRef.current;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;

      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const getTimeParts = (): Record<Glyph['type'], string> => {
      const now = new Date();
      let h = now.getHours();
      const period = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      return {
        hour: h.toString(),
        minute: now.getMinutes().toString().padStart(2, '0'),
        period,
      };
    };

    const createGlyph = (
      type: Glyph['type'],
      forcedX: number | null = null,
    ): Glyph => {
      const z = CONFIG.MIN_Z + Math.random() * (CONFIG.MAX_Z - CONFIG.MIN_Z);

      return {
        type,
        z,
        x: forcedX ?? logicalWidth + 200,
        baseY: logicalHeight * (0.1 + Math.random() * 0.8),
        speed: (0.04 + Math.random() * 0.05) * z,
        spin: Math.random() * Math.PI * 2,
        spinSpeed:
          (0.001 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
        wobbleAmp: (8 + Math.random() * 15) * z,
        wobbleFreq: 0.0008 + Math.random() * 0.001,
        wobblePhase: Math.random() * Math.PI * 2,
        drift: (Math.random() * 0.03 - 0.015) * z,
      };
    };

    const spawnGlyph = (type: Glyph['type'], forcedX: number | null = null) => {
      glyphs.push(createGlyph(type, forcedX));
    };

    const drawProjectedShadow = (
      x: number,
      y: number,
      fontSize: number,
      rotation: number,
      lightX: number,
      lightY: number,
      z: number,
    ) => {
      const halfW = fontSize * 0.3;
      const halfH = fontSize * 0.25;

      const localCorners = [
        { x: -halfW, y: -halfH },
        { x: +halfW, y: -halfH },
        { x: +halfW, y: +halfH },
        { x: -halfW, y: +halfH },
      ];

      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      const rotatedCorners = localCorners.map(({ x: lx, y: ly }) => {
        const rx = lx * cosR - ly * sinR;
        const ry = lx * sinR + ly * cosR;
        return { x: x + rx, y: y + ry };
      });

      const lightAngle = Math.atan2(lightY - y, lightX - x);
      const shadowAlpha = (0.2 + (z - CONFIG.MIN_Z) * 0.5).toFixed(2);

      ctx.fillStyle = `rgba(255,255,255,${shadowAlpha})`;

      const shadowDx = Math.sin(-lightAngle - Math.PI / 2) * CONFIG.SHADOW_LENGTH;
      const shadowDy = Math.cos(-lightAngle - Math.PI / 2) * CONFIG.SHADOW_LENGTH;

      for (let i = 0; i < 4; i++) {
        const a = rotatedCorners[i];
        const b = rotatedCorners[(i + 1) % 4];

        const aEnd = { x: a.x + shadowDx, y: a.y + shadowDy };
        const bEnd = { x: b.x + shadowDx, y: b.y + shadowDy };

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(bEnd.x, bEnd.y);
        ctx.lineTo(aEnd.x, aEnd.y);
        ctx.closePath();
        ctx.fill();
      }
    };

    const drawScene = (timestamp) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      spawnAccumulator += dt;

      // Steady spawning
      while (spawnAccumulator >= CONFIG.SPAWN_INTERVAL_MS) {
        spawnAccumulator -= CONFIG.SPAWN_INTERVAL_MS;
        const types = ['hour', 'minute', 'period'] as const;
        const randomType = types[Math.floor(Math.random() * types.length)];
        spawnGlyph(randomType);
      }

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const cx = logicalWidth / 2;
      const cy = logicalHeight / 2;

      // Background gradient
      const grad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        CONFIG.CENTER_LIGHT_RADIUS,
      );
      grad.addColorStop(0, '#828A99');
      grad.addColorStop(1, '#4A628E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      const timeParts = getTimeParts();
      const baseFontSize = Math.max(
        CONFIG.MIN_FONT_SIZE,
        Math.min(logicalWidth, logicalHeight) * CONFIG.BASE_FONT_SIZE_FACTOR,
      );

      // Sort by depth (far → near)
      glyphs.sort((a, b) => a.z - b.z);

      for (let i = glyphs.length - 1; i >= 0; i--) {
        const g = glyphs[i];

        g.x -= g.speed * dt;
        g.spin += g.spinSpeed * dt;

        const wobble =
          Math.sin(timestamp * g.wobbleFreq + g.wobblePhase) * g.wobbleAmp;
        const y = g.baseY + wobble + g.drift * timestamp * 0.05;

        const fontSize =
          (g.type === 'hour'
            ? baseFontSize
            : g.type === 'minute'
            ? baseFontSize * 0.8
            : baseFontSize * 0.6) * g.z;

        // Shadow
        drawProjectedShadow(g.x, y, fontSize, g.spin, cx, cy, g.z);

        // Glyph itself
        ctx.save();
        ctx.translate(g.x, y);
        ctx.rotate(g.spin);

        ctx.font = `600 ${fontSize}px "CustomOswald", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = COLORS[g.type];
        ctx.fillText(timeParts[g.type], 0, 0);

        ctx.restore();

        // Remove if completely off-screen left
        if (g.x < -logicalWidth * 0.5) {
          glyphs.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(drawScene);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (glyphs.length === 0) {
      const types = ['hour', 'minute', 'period'] as const;
      for (let i = 0; i < 15; i++) {
        spawnGlyph(types[i % 3], Math.random() * logicalWidth * 1.3);
      }
    }

    animationFrameId = requestAnimationFrame(drawScene);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
        }}
      >
        {ariaTime}
      </div>
      <canvas ref={canvasRef} style={canvasStyle} aria-hidden="true" />
    </>
  );
}