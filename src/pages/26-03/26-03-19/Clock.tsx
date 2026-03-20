import React, { useEffect, useRef } from 'react';

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
  
  const stateRef = useRef({
    flakes: [] as Flake[],
    snowHeight: 0,
    width: 0,
    height: 0,
    lastTime: 0,
    phase: 'snowing' as 'snowing' | 'holding' | 'fading',
    canvasOpacity: 1,
    holdStartTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const clockElement = clockRef.current;

    const handleResize = () => {
      stateRef.current.width = window.innerWidth;
      stateRef.current.height = window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const updateClock = () => {
      if (clockElement) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        clockElement.textContent = `${displayHours}:${displayMinutes} ${ampm}`;
      }
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    const createFlake = (): Flake => ({
      x: Math.random() * stateRef.current.width,
      y: -20,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 1 + 0.5, // SLOWER fall (was 1.5 + 1.5)
      drift: Math.random() * 0.5 - 0.25,   // SLOWER drift (was 1 - 0.5)
      opacity: Math.random() * 0.4 + 0.4,
    });

    let spawnTimer = 0;

    const animate = (time: number) => {
      const state = stateRef.current;
      const { width, height } = state;
      const deltaTime = time - state.lastTime;
      state.lastTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = state.canvasOpacity;

      if (state.phase === 'snowing') {
        spawnTimer += deltaTime;
        // SLOWED DOWN: Spawning 4 flakes every 40ms
        if (spawnTimer > 40) { 
          for (let i = 0; i < 4; i++) state.flakes.push(createFlake());
          spawnTimer = 0;
        }

        state.flakes = state.flakes.filter((flake) => {
          flake.y += flake.speed;
          flake.x += flake.drift;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          ctx.fill();

          const groundLevel = height - state.snowHeight;
          if (flake.y > groundLevel) {
            // FASTER accumulation (was 0.05)
            state.snowHeight += 0.2; 
            return false;
          }
          return true;
        });

        if (state.snowHeight >= height) {
          state.snowHeight = height;
          state.phase = 'holding';
          state.holdStartTime = time;
        }
      } 
      
      else if (state.phase === 'holding') {
        if (time - state.holdStartTime > 2000) state.phase = 'fading'; // Hold longer
      } 
      
      else if (state.phase === 'fading') {
        state.canvasOpacity -= 0.01; // Slower fade
        if (state.canvasOpacity <= 0) {
          state.snowHeight = 0;
          state.flakes = [];
          state.canvasOpacity = 1;
          state.phase = 'snowing';
        }
      }

      // DRAW SNOW GROUND
      if (state.snowHeight > 0.1) {
        ctx.fillStyle = '#ffffff';
        // The +10 ensures that the "pile" looks solid as it moves up
        ctx.fillRect(0, height - state.snowHeight, width, state.snowHeight + 10);
      }

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'radial-gradient(ellipse at top, #4a5568 0%, #2d3748 20%, #1a202c 40%, #0f1419 70%, #000000 100%)', 
      overflow: 'hidden' 
    }}>
      {/* Custom Font Loading */}
      <style>
        {`
          @font-face {
            font-family: 'SnowFont';
            src: url('/src/assets/fonts/26-03-19-snow.otf') format('opentype');
          }
        `}
      </style>
      
      {/* 1. CLOCK (Layered behind the canvas) */}
      <div 
        ref={clockRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(3rem, 15vw, 8rem)',
          fontWeight: '300',
          color: 'rgba(255, 255, 255, 0.8)',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.2)',
          fontFamily: "'SnowFont', monospace",
          letterSpacing: '0.05em',
          zIndex: 1, // Lower Z-Index
          pointerEvents: 'none',
          textAlign: 'center'
        }}
      />

      {/* 2. CANVAS (Layered in front) */}
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'relative',
          display: 'block', 
          width: '100%', 
          height: '100%',
          zIndex: 2 // Higher Z-Index to cover the clock
        }} 
      />
      
      {/* Subtly textured overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.02,
        pointerEvents: 'none',
        zIndex: 3,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />
    </div>
  );
};

export default SlowBuryBlizzard;