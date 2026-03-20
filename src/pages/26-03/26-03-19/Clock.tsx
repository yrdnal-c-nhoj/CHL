import React, { useEffect, useRef, useState } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import snowFont from '../../../assets/fonts/26-03-19-snow.otf';

interface Flake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  opacity: number;
}

const SlowBuryBlizzard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clockRef = useRef<HTMLDivElement | null>(null);
  
  const fontsLoaded = useMultipleFontLoader([
    { fontFamily: 'SnowFont', fontUrl: snowFont, options: { weight: 'normal', style: 'normal' } }
  ]);
  
  const stateRef = useRef({
    flakes: [] as Flake[],
    snowHeight: 0,
    width: window.innerWidth, // Initialize with actual values
    height: window.innerHeight,
    lastTime: 0,
    phase: 'snowing' as 'snowing' | 'holding' | 'fading',
    canvasOpacity: 1,
    holdStartTime: 0,
    spawnTimer: 0 // Moved into ref to persist across frames
  });

  useEffect(() => {
    if (!fontsLoaded) return; // Only start logic if fonts are ready

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const state = stateRef.current;

    const handleResize = () => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const updateClock = () => {
      if (clockRef.current) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        
        clockRef.current.innerHTML = `${displayHours}:${displayMinutes} <span style="font-size: 0.8em; opacity: 0.9;">${ampm}</span>`;
      }
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    const createFlake = (): Flake => ({
      x: Math.random() * state.width,
      y: -20,
      size: Math.random() * 3 + 2,
      speed: Math.random() * 1 + 0.5,
      drift: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.3,
    });

    const animate = (time: number) => {
      const deltaTime = time - state.lastTime;
      state.lastTime = time;

      ctx.clearRect(0, 0, state.width, state.height);
      
      // Apply global opacity for the "fading" phase
      ctx.globalAlpha = state.canvasOpacity;

      if (state.phase === 'snowing') {
        state.spawnTimer += deltaTime;
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
          state.holdStartTime = time;
        }
      } 
      else if (state.phase === 'holding') {
        if (time - state.holdStartTime > 3000) state.phase = 'fading';
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

      // DRAW THE ACCUMULATED SNOW
      if (state.snowHeight > 0) {
        ctx.fillStyle = '#E4EDFC';
        ctx.fillRect(0, state.height - state.snowHeight, state.width, state.snowHeight);
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      clearInterval(clockInterval);
    };
  }, [fontsLoaded]); // Re-run when fonts are loaded

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'radial-gradient(ellipse at top, #5a6b8a 0%, #2E416C 20%, #1B2943 40%, #142542 70%, #0F2044 100%)', 
      overflow: 'hidden' 
    }}>
      {/* CLOCK: Increased z-index to 3 so it stays ABOVE the snow */}
      <div 
        ref={clockRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(5rem, 19vw, 10rem)',
          color: '#E3F2FD',
          fontFamily: fontsLoaded ? "'SnowFont', sans-serif" : 'sans-serif',
          zIndex: 3, 
          pointerEvents: 'none',
          textAlign: 'center'
        }}
      >
        {!fontsLoaded && "Loading..."}
      </div>

      {/* GRADIENT OVERLAY: Yellow to blue gradient with 0.4 opacity */}
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
          zIndex: 2 // Snow falls behind the clock but covers the gradient
        }} 
      />
    </div>
  );
};

export default SlowBuryBlizzard;