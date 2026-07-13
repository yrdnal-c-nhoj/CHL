import fontUrl from '@/assets/fonts/26fonts/26-07-10.ttf?url';
import cloud from '@/assets/images/26_images/26-07/26-07-10/clouds.webp';
import glassbreak from '@/assets/images/26_images/26-07/26-07-10/sunrise.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { useEffect, useRef } from 'react';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassbreak, cloud];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Shrikhand',
    fontUrl,
  },
];

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const CLOCK_VARIABLES = {
  '--clock-size': 'min(78vw, 72vh)',
  '--font-size': 'clamp(0.95rem, 8vw, 2.35rem)',
  '--radius': '45',
  '--h-width': '5px',
  '--m-width': '3px',
  '--s-width': '2px',
  '--dot-size': '10px',
} as CSSProperties;

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

const AnalogClock: React.FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;




// Rain Simulation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let drops: RainDrop[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const startTime = performance.now();
    let currentStormCycleStart = startTime;
    let randomDelay = Math.floor(Math.random() * 2000) + 2000; 

    // Increased max density for a much more prominent storm presence
    const MAX_RAIN_DENSITY = 350; 

    const tick = (now: number) => {
      const elapsed = now - currentStormCycleStart;
      let targetDropsCount = 0;

      // Phase 1: Initial Calm (0ms to 750ms)
      if (elapsed < 750) {
        targetDropsCount = 0;
      } 
      // Phase 2: Quickly ramps up (750ms to 2750ms)
      else if (elapsed >= 750 && elapsed < 2750) {
        const progress = (elapsed - 750) / 2000;
        targetDropsCount = progress * MAX_RAIN_DENSITY;
      } 
      // Phase 3: Heavy downpour sustained (2750ms to 3250ms)
      else if (elapsed >= 2750 && elapsed < 3250) {
        targetDropsCount = MAX_RAIN_DENSITY;
      } 
      // Phase 4: Lightens up quickly (3250ms to 3500ms)
      else if (elapsed >= 3250 && elapsed < 3500) {
        const progress = (elapsed - 3250) / 250;
        targetDropsCount = MAX_RAIN_DENSITY - (progress * (MAX_RAIN_DENSITY * 0.8));
      } 
      // Phase 5: Gradual fade out (3500ms to 4500ms)
      else if (elapsed >= 3500 && elapsed < 4500) {
        const progress = (elapsed - 3500) / 1000;
        const startingDensity = MAX_RAIN_DENSITY * 0.2;
        targetDropsCount = startingDensity - (progress * startingDensity);
      } 
      // Phase 6: Reset loop
      else {
        targetDropsCount = 0;
        const cycleTotalDuration = 4500 + randomDelay;
        if (elapsed >= cycleTotalDuration) {
          currentStormCycleStart = now;
          randomDelay = Math.floor(Math.random() * 2000) + 2000;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (drops.length > targetDropsCount) {
        drops = drops.slice(0, Math.floor(targetDropsCount));
      }

      while (drops.length < targetDropsCount) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          speed: Math.random() * 18 + 22,     // Faster fall speed for higher velocity impact
          length: Math.random() * 25 + 15,    // Longer drops
          opacity: Math.random() * 0.4 + 0.6, // Higher overall visibility opacity
        });
      }

      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        
        ctx.globalAlpha = d.opacity;

        // --- LAYER 1: The Dark Shadow Outline ---
        // Thick dark stroke cuts through the background contrast
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.lineWidth = 3.5; 
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.stroke();

        // --- LAYER 2: The Bright Core Highlight ---
        // Thinner bright stroke nested directly inside the dark outline
        ctx.strokeStyle = 'rgba(225, 245, 255, 0.95)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.stroke();

        // Update Position
        d.y += d.speed;
        d.x -= 2;

        if (d.y > canvas.height) {
          d.y = Math.random() * -20;
          d.x = Math.random() * canvas.width;
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);


  return (
    <main style={styles.mainContainer}>
      {/* Background layers */}
      <div style={styles.bgGlass} />
      <div style={styles.bgClouds} />

      {/* Atmospheric Rain Canvas Layer */}
      <canvas ref={canvasRef} style={styles.rainCanvas} />

      {/* Analog Clock Wrapper injecting layout variables dynamically */}
      <div style={{ ...styles.clock, ...CLOCK_VARIABLES }}>
        <div style={styles.face}>
          {ROMAN_NUMERALS.map((numeral, i) => {
            const angle = (i + 1) * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            
            return (
              <div
                key={numeral}
                style={{
                  ...styles.numeral,
                  left: `calc(50% + var(--radius) * ${Math.cos(rad)}%)`,
                  top: `calc(50% + var(--radius) * ${Math.sin(rad)}%)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                }}
              >
                {numeral}
              </div>
            );
          })}

          {/* Hands */}
          <div
            style={{
              ...styles.hand,
              width: 'var(--h-width)',
              height: '28%',
              transform: `translate(-50%) rotate(${hourDegrees}deg)`,
              backgroundColor: '#fff',
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: 'var(--m-width)',
              height: '38%',
              transform: `translate(-50%) rotate(${minuteDegrees}deg)`,
              backgroundColor: '#fff',
            }}
          />
          <div
            style={{
              ...styles.hand,
              width: 'var(--s-width)',
              height: '42%',
              transform: `translate(-50%) rotate(${secondDegrees}deg)`,
              backgroundColor: '#B4D0F1',
            }}
          />
          
          {/* Center Pin */}
          <div style={styles.centerDot} />
        </div>
      </div>
    </main>
  );
};

const styles: { [key: string]: CSSProperties } = {
  mainContainer: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgGlass: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${glassbreak})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'contrast(0.9) brightness(0.2) saturate(5) hue-rotate(-10deg)',
    zIndex: 0,
  },
  bgClouds: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${cloud})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    mixBlendMode: 'screen',
    filter: 'contrast(1.2) brightness(0.9)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  rainCanvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 2, // Layered cleanly on top of backgrounds, behind the clock numerals/hands
    pointerEvents: 'none',
  },
  clock: {
    position: 'relative',
    width: 'var(--clock-size)',
    height: 'var(--clock-size)',
    zIndex: 3, // Raised clock depth slightly above rain canvas
  },
  face: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: 2,
    willChange: 'transform',
    boxShadow: '1px 1px 1px #000',
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'var(--dot-size)',
    height: 'var(--dot-size)',
    borderRadius: '50%',
    backgroundColor: '#B4D0F1',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #fff',
    zIndex: 1,
  },
  numeral: {
    position: 'absolute',
    fontSize: 'var(--font-size)',
    color: 'rgb(255, 255, 255)',
    fontFamily: "'Shrikhand', cursive",
    whiteSpace: 'nowrap',
    textRendering: 'geometricPrecision',
    lineHeight: 1,
    textShadow: '1px 1px 1px #000',
  },
};

export default AnalogClock;