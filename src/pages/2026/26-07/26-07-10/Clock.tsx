import fontUrl from '@/assets/fonts/26fonts/26-07-10.ttf?url';
import glassbreak from '@/assets/images/26_images/26-07/26-07-10/clouds.webp';
import cloud from '@/assets/images/26_images/26-07/26-07-10/sunrise.webp';
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
  '--h-width': '6px', 
  '--m-width': '4px',
  '--s-width': '2px',
  '--dot-size': '12px', 
} as CSSProperties;

interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

type StormState = 'calm' | 'rampUp' | 'downpour' | 'fade';

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

  // Rain Simulation Engine with Regulated Constraints
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

    // Initial state: starts calm on page load
    let currentState: StormState = 'calm';
    let stateStartTime = performance.now();
    
    // Exact 3/8 of a second delay for the very first interval
    let targetDuration = 375; 
    const MAX_RAIN_DENSITY = 350; 

    // Function to generate tightly governed randomized phase windows
    const getRandomDuration = (state: StormState): number => {
      switch (state) {
        case 'calm':      
          // Dry intervals between rain: never more than 2 seconds (500ms to 2000ms)
          return Math.floor(Math.random() * 1500) + 500;  
        case 'rampUp':    
          // Short buildup (500ms to 1000ms)
          return Math.floor(Math.random() * 500) + 500;  
        case 'downpour':  
          // Heavy state window (1000ms to 2000ms)
          return Math.floor(Math.random() * 1000) + 1000;  
        case 'fade':      
          // Falloff cleanup window (500ms to 1000ms)
          // Total combined rain cycle (ramp + downpour + fade) stays well under 4 seconds max limit
          return Math.floor(Math.random() * 500) + 500;  
        default:          
          return 1000;
      }
    };

    const tick = (now: number) => {
      let elapsed = now - stateStartTime;

      // Evaluate Phase Transits
      if (elapsed >= targetDuration) {
        stateStartTime = now;
        elapsed = 0;
        
        if (currentState === 'calm') currentState = 'rampUp';
        else if (currentState === 'rampUp') currentState = 'downpour';
        else if (currentState === 'downpour') currentState = 'fade';
        else if (currentState === 'fade') currentState = 'calm';

        targetDuration = getRandomDuration(currentState);
      }

      let targetDropsCount = 0;
      const progress = Math.min(elapsed / targetDuration, 1);

      if (currentState === 'calm') {
        targetDropsCount = 0;
      } else if (currentState === 'rampUp') {
        targetDropsCount = progress * MAX_RAIN_DENSITY;
      } else if (currentState === 'downpour') {
        targetDropsCount = MAX_RAIN_DENSITY;
      } else if (currentState === 'fade') {
        targetDropsCount = MAX_RAIN_DENSITY * (1 - progress);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (drops.length > targetDropsCount) {
        drops = drops.slice(0, Math.floor(targetDropsCount));
      }

      while (drops.length < targetDropsCount) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height,
          speed: Math.random() * 18 + 22,
          length: Math.random() * 25 + 15,
          opacity: Math.random() * 0.4 + 0.6,
        });
      }

      ctx.lineCap = 'round';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.globalAlpha = d.opacity;

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.lineWidth = 3.5; 
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(225, 245, 255, 0.95)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.stroke();

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
      <div style={styles.bgGlass} />
      <div style={styles.bgClouds} />

      <canvas ref={canvasRef} style={styles.rainCanvas} />

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

          <div
            style={{
              ...styles.hand,
              width: 'var(--h-width)',
              height: '28%',
              transform: `translate(-50%) rotate(${hourDegrees}deg)`,
            }}
          />
          
          <div
            style={{
              ...styles.hand,
              width: 'var(--m-width)',
              height: '38%',
              transform: `translate(-50%) rotate(${minuteDegrees}deg)`,
            }}
          />
          
          <div
            style={{
              ...styles.hand,
              width: 'var(--s-width)',
              height: '42%',
              transform: `translate(-50%) rotate(${secondDegrees}deg)`,
            }}
          />
          
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
    filter: 'contrast(1.2) brightness(0.9) saturate(7) hue-rotate(20deg)',
    zIndex: 3,
    pointerEvents: 'none',
  },
  rainCanvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  },
  clock: {
    position: 'relative',
    width: 'var(--clock-size)',
    height: 'var(--clock-size)',
    zIndex: 2,
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
    borderRadius: '4px 4px 1px 1px',
    willChange: 'transform',
    backgroundColor: '#B59263',
    border: '1px solid #1A0F05',
    boxShadow: `
      0.5px 0.5px 0px rgba(255, 255, 255, 0.9),
      -1px -1px 0px #000,
      1px -1px 0px #000,
      -1px 1px 0px #000,
      1px 1px 0px #000,
      2px 4px 5px rgba(0, 0, 0, 0.95),
      0px 0px 15px rgba(0, 0, 0, 0.6)
    `,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'var(--dot-size)',
    height: 'var(--dot-size)',
    borderRadius: '50%',
    backgroundColor: '#5C401B',
    backgroundImage: 'radial-gradient(circle at 35% 35%, #FFF 0%, #A38051 25%, #5C401B 75%, #000 100%)',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #000',
    boxShadow: '2px 3px 6px rgba(0,0,0,0.95), inset 1px 1px 1px rgba(255,255,255,0.8)',
    zIndex: 4,
  },
  numeral: {
    position: 'absolute',
    fontSize: 'var(--font-size)',
    fontFamily: "'Shrikhand', cursive",
    whiteSpace: 'nowrap',
    textRendering: 'geometricPrecision',
    lineHeight: 1,
    color: '#B59263',
    WebkitTextStroke: '1px #1A0F05',
    textShadow: `
      0.5px 0.5px 0px rgba(255, 255, 255, 0.9),
      -1px -1px 0px #000,
      1px -1px 0px #000,
      -1px 1px 0px #000,
      1px 1px 0px #000,
      2px 4px 5px rgba(0, 0, 0, 0.95),
      0px 0px 15px rgba(0, 0, 0, 0.6)
    `,
  },
};

export default AnalogClock;