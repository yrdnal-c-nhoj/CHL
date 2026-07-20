import fontUrl from '@/assets/fonts/26fonts/26-07-11.ttf?url';
import cloud from '@/assets/images/26_images/26-07/26-07-10/clouds.webp';
import glassbreak from '@/assets/images/26_images/26-07/26-07-10/sunrise.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties, FC } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import styles from './Clock.module.css';

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

const AnalogClock: FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const { hourDegrees, minuteDegrees, secondDegrees } = useMemo(() => ({
    secondDegrees: (seconds / 60) * 360,
    minuteDegrees: (minutes / 60) * 360 + (seconds / 60) * 6,
    hourDegrees: (hours / 12) * 360 + (minutes / 60) * 30,
  }), [seconds, minutes, hours]);

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
    <main
      className={styles.mainContainer}
      role="img"
      aria-label={`An analog clock showing the time is ${time.toLocaleTimeString()}`}
    >
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.bgGlass} style={{ '--bg-glass-image': `url(${glassbreak})` } as CSSProperties} />
      <div className={styles.bgClouds} style={{ '--bg-cloud-image': `url(${cloud})` } as CSSProperties} />

      <canvas ref={canvasRef} className={styles.rainCanvas} />

      <div className={styles.clock} style={CLOCK_VARIABLES}>
        <div className={styles.face}>
          {ROMAN_NUMERALS.map((numeral, i) => {
            const angle = (i + 1) * 30;
            const rad = ((angle - 90) * Math.PI) / 180;
            
            return (
              <div
                key={numeral}
                className={styles.numeral}
                style={{
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
            className={styles.hand}
            style={{
              width: 'var(--h-width)',
              height: '28%',
              transform: `translate(-50%) rotate(${hourDegrees}deg)`,
            }}
          />
          
          <div
            className={styles.hand}
            style={{
              width: 'var(--m-width)',
              height: '38%',
              transform: `translate(-50%) rotate(${minuteDegrees}deg)`,
            }}
          />
          
          <div
            className={styles.hand}
            style={{
              width: 'var(--s-width)',
              height: '42%',
              transform: `translate(-50%) rotate(${secondDegrees}deg)`,
            }}
          />
          
          <div className={styles.centerDot} />
        </div>
      </div>
    </main>
  );
};

export default AnalogClock;