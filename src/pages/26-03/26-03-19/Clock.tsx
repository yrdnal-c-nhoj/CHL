import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import type { FontConfig } from '../../../types/clock';
import snowFont from '../../../assets/fonts/26-03-19-snow.otf?url';

interface Flake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
}

interface ClockState {
  flakes: Flake[];
  snowHeight: number;
  width: number;
  height: number;
  lastTime: number;
  phase: 'snowing' | 'holding' | 'fading';
  canvasOpacity: number;
  holdStartTime: number;
  spawnTimer: number;
}

const Clock = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentTime = useSecondClock();
  
  const fontConfigs = useMemo<FontConfig[]>(() => [
    { 
      fontFamily: 'SnowFont', 
      fontUrl: snowFont, 
      options: { weight: 'normal', style: 'normal' } 
    }
  ], []);
  
  useSuspenseFontLoader(fontConfigs);

  const stateRef = useRef<ClockState>({
    flakes: [],
    snowHeight: 0,
    width: 0,
    height: 0,
    lastTime: 0,
    phase: 'snowing',
    canvasOpacity: 1,
    holdStartTime: 0,
    spawnTimer: 0
  });

  const createFlake = useCallback((): Flake => ({
    x: Math.random() * stateRef.current.width,
    y: -20,
    size: Math.random() * 3 + 2,
    speed: Math.random() * 1 + 0.5,
    drift: Math.random() * 0.5 - 0.25,
    opacity: Math.random() * 0.5 + 0.3,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const state = stateRef.current;

    const handleResize = () => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationId: number;

    const animate = (timestamp: number) => {
      if (!state.lastTime) state.lastTime = timestamp;
      const deltaTime = timestamp - state.lastTime;
      state.lastTime = timestamp;

      ctx.clearRect(0, 0, state.width, state.height);
      ctx.globalAlpha = state.canvasOpacity;

      if (state.phase === 'snowing') {
        state.spawnTimer += deltaTime;
        if (state.spawnTimer > 200) state.spawnTimer = 200;

        if (state.spawnTimer > 60) { 
          for (let i = 0; i < 3; i++) state.flakes.push(createFlake());
          state.spawnTimer = 0;
        }

        state.flakes = state.flakes.filter((flake) => {
          flake.y += flake.speed;
          flake.x += flake.drift;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          ctx.fill();

          const groundLevel = state.height - state.snowHeight;
          if (flake.y > groundLevel) {
            state.snowHeight += 0.4; 
            return false;
          }
          return true;
        });

        if (state.snowHeight >= state.height) {
          state.phase = 'holding';
          state.holdStartTime = timestamp;
        }
      } 
      else if (state.phase === 'holding') {
        if (timestamp - state.holdStartTime > 3000) state.phase = 'fading';
      } 
      else if (state.phase === 'fading') {
        state.canvasOpacity -= 0.005; 
        if (state.canvasOpacity <= 0) {
          state.snowHeight = 0;
          state.flakes = [];
          state.canvasOpacity = 1;
          state.phase = 'snowing';
        }
      }

      if (state.snowHeight > 0) {
        ctx.fillStyle = '#E4EDFC';
        ctx.fillRect(0, state.height - state.snowHeight, state.width, state.snowHeight);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [createFlake]);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'radial-gradient(ellipse at top, #5a6b8a 0%, #2E416C 20%, #1B2943 40%, #142542 70%, #0F2044 100%)', 
      overflow: 'hidden' 
    }}>
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(5rem, 19vw, 10rem)',
          color: '#E3F2FD',
          fontFamily: "'SnowFont', sans-serif",
          zIndex: 3, 
          pointerEvents: 'none',
          textAlign: 'center'
        }}
      >
        {displayHours}:{displayMinutes} <span style={{ fontSize: '0.8em', opacity: 0.9 }}>{ampm}</span>
      </div>

      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, #3E4304 0%, #052882D1 100%)',
          opacity: 0.4,
          zIndex: 1
        }}
      />

      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%',
          zIndex: 2
        }} 
      />
    </div>
  );
};

export default Clock;