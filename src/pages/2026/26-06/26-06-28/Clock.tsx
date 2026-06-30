import fontUrl from '@/assets/fonts/26fonts/26-06-28.otf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

const CONFIG = {
  UPDATE_RATE_MS: 500,
  SPIRAL_TURNS: 9.5,
  COLOR: '#B22CA9',
  CRAWL_SPEED: 2.5,
  BASE_RADIUS: 10,
  EXPANSION_FACTOR: 0.085,
  REPETITIONS: 48,
  CHAR_SPACING_PX: 92,
} as const;

const fontConfigs: FontConfig[] = [{
  fontFamily: 'ClockFont_26_06_28',
  fontUrl,
}];

const get12HourTime = (): string => {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
};

export default function ContinuousSwirlClock() {
  const [timeText, setTimeText] = useState('');
  const textPathRef = useRef<SVGTextPathElement>(null);
  const offsetRef = useRef(0);
  
  // Use a mutable ref to track the current loop threshold without resetting the animation loop
  const thresholdRef = useRef(11 * CONFIG.CHAR_SPACING_PX);

  useSuspenseFontLoader(fontConfigs);

  // 1. Optimized Path Data: Cache length and reduce precision overhead
  const spiralPathData = useMemo(() => {
    const center = 1000;
    const points: string[] = [];
    const totalPoints = 1000; // Reduced from 1400 without sacrificing smoothness
    const maxTheta = CONFIG.SPIRAL_TURNS * 2 * Math.PI;

    for (let i = 0; i <= totalPoints; i++) {
      const theta = (i / totalPoints) * maxTheta;
      const r = CONFIG.BASE_RADIUS * Math.exp(CONFIG.EXPANSION_FACTOR * theta);
      const x = center + r * Math.cos(theta);
      const y = center + r * Math.sin(theta);

      // Single-decimal precision matches high-res viewboxes perfectly
      points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join('');
  }, []);

  // 2. Time stream update + synchronous threshold tracking
  useEffect(() => {
    const updateTime = () => {
      const current = get12HourTime();
      setTimeText(Array(CONFIG.REPETITIONS).fill(current).join(' • '));
      
      // Update threshold smoothly in-place
      const segmentLength = current.length + 3; // " • " length is 3
      thresholdRef.current = segmentLength * CONFIG.CHAR_SPACING_PX;
    };

    updateTime();
    const interval = setInterval(updateTime, CONFIG.UPDATE_RATE_MS);
    return () => clearInterval(interval);
  }, []);

  // 3. Independent Animation Loop (Zero dependency array)
  useEffect(() => {
    let lastFrame = performance.now();
    let animationFrameId: number;

    const animate = (now: number) => {
      // Normalize delta around 60fps (16.67ms) to protect against massive frame drops
      const delta = Math.min(now - lastFrame, 33); 
      lastFrame = now;

      offsetRef.current += CONFIG.CRAWL_SPEED * (delta / 16.666);

      const currentLoopThreshold = thresholdRef.current;
      if (offsetRef.current >= currentLoopThreshold) {
        offsetRef.current %= currentLoopThreshold;
      }

      if (textPathRef.current) {
        textPathRef.current.setAttribute('startOffset', `${offsetRef.current.toFixed(1)}px`);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []); // Run once on mount. Never teardown and restart mid-flight.

  return (
    <div style={styles.viewport}>
      <div style={styles.perspectiveWrapper}>
        <svg
          viewBox="0 0 2000 2000"
          style={styles.svgCoilCanvas}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <path id="masterCoilPath" d={spiralPathData} fill="none" />
          </defs>

          <text style={styles.textContainer}>
            <textPath
              ref={textPathRef}
              href="#masterCoilPath"
              startOffset="0px"
              style={styles.textTrack}
              lengthAdjust="spacing"
              textLength={timeText.length * CONFIG.CHAR_SPACING_PX}
            >
              {timeText}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}

// 4. Styles Optimized for GPU Acceleration
const styles: Record<string, CSSProperties> = {
  viewport: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#90B08F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'ClockFont_26_06_28, monospace',
    perspective: '1200px',
  },
  perspectiveWrapper: {
    transform: 'rotateX(55deg) rotateZ(15deg)',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    backfaceVisibility: 'hidden', // Prevents jagged aliasing in 3D perspective
  },
  svgCoilCanvas: {
    width: '120vmin',
    height: '120vmin',
    overflow: 'visible',
  },
  textContainer: {
    fill: '#fff',
    overflow: 'visible',
  },
  textTrack: {
    fontSize: '18vh',
    fill: CONFIG.COLOR,
    fontWeight: 400,
    // Note: Heavy text-shadows on large SVG text tracks can impact rendering performance.
    textShadow: '0 0 10px #060455, 0 0 20px rgb(199, 18, 231)',
    textRendering: 'geometricPrecision', // Swapped for smoother vector calculation during rotation
    fontVariantNumeric: 'tabular-nums', 
  }
};