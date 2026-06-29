import type { CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

const CONFIG = {
  UPDATE_RATE_MS: 150,        
  SPIRAL_TURNS: 8,            // Reduced turns for logarithmic spiral to prevent inner overlapping
  GLOW_COLOR: '#FF6E92',
  CRAWL_SPEED: 4,             
  BASE_RADIUS: 15,            // Starting radius at the exact center
  EXPANSION_FACTOR: 0.11,     // Controls how fast the spiral distance expands outwards
};

const get12HourTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${hours}:${pad(minutes)}:${pad(seconds)} ${ampm}   `;
};

export default function ContinuousSwirlClock() {
  const [timeStream, setTimeStream] = useState(''); 
  const [offset, setOffset] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // 1. Generate a LOGARITHMIC spiral (grows exponentially outwards)
  const spiralPathData = useMemo(() => {
    const center = 1000;
    const points: string[] = [];
    const totalPoints = 2000;
    const maxTheta = CONFIG.SPIRAL_TURNS * 2 * Math.PI;

    // Loop backwards to keep path direction flowing from outside to center
    for (let i = totalPoints; i >= 0; i--) {
      const theta = (i / totalPoints) * maxTheta;
      
      // Logarithmic Spiral formula: r = a * e^(b * theta)
      const r = CONFIG.BASE_RADIUS * Math.exp(CONFIG.EXPANSION_FACTOR * theta);
      
      const x = center + r * Math.cos(theta);
      const y = center + r * Math.sin(theta);

      if (i === totalPoints) points.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`);
      else points.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return points.join(' ');
  }, []);

  // 2. Track path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      setOffset(length); 
    }
  }, [spiralPathData]);

  // 3. Stream timestamps
  useEffect(() => {
    if (pathLength === 0) return;

    const startTimer = setTimeout(() => {
      setTimeStream(get12HourTime());

      const interval = setInterval(() => {
        setTimeStream((prev) => prev + get12HourTime());
      }, CONFIG.UPDATE_RATE_MS);

      return () => clearInterval(interval);
    }, 600);

    return () => clearTimeout(startTimer);
  }, [pathLength]);

  // 4. Smooth animation loop
  useEffect(() => {
    if (pathLength === 0) return;

    let rafId: number;
    const animate = () => {
      setOffset((prev) => prev - CONFIG.CRAWL_SPEED);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [pathLength]);

  return (
    <div style={styles.viewport}>
      <div style={styles.nebulaBackground} />

      {/* 3D Perspective Context to natively scale outer items larger */}
      <div style={styles.perspectiveWrapper}>
        <svg
          viewBox="0 0 2000 2000"
          style={styles.svgCoilCanvas}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path 
              ref={pathRef}
              id="masterCoilPath" 
              d={spiralPathData} 
              fill="none" 
            />
            <filter id="neonGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {pathLength > 0 && (
            <text style={styles.textContainer} filter="url(#neonGlow)">
              <textPath
                href="#masterCoilPath"
                startOffset={offset}
                style={styles.textTrack}
              >
                {timeStream}
              </textPath>
            </text>
          )}
        </svg>
      </div>

      <div style={styles.centerCore} />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  viewport: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#0a0014',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'monospace',
    perspective: '1200px', // Creates the spatial 3D depth field
  },
  perspectiveWrapper: {
    transform: 'rotateX(55deg) translateZ(0px)', // Tilts canvas so foreground loops expand beautifully
    transformStyle: 'preserve-3d',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nebulaBackground: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at center, rgba(90, 99, 27, 0.45) 0%, #37065821 80%)',
    zIndex: 1,
  },
  svgCoilCanvas: {
    width: '180vmin',
    height: '180vmin',
    zIndex: 2,
    overflow: 'visible',
  },
  textContainer: {
    fill: '#ffffff',
  },
  textTrack: {
    fontSize: '9vh',
    letterSpacing: '8vh',
    fill: CONFIG.GLOW_COLOR,
  },
  centerCore: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: '#ffffff',
    boxShadow: `0 0 30px 15px #ffffff, 0 0 70px 30px ${CONFIG.GLOW_COLOR}`,
    zIndex: 3,
    pointerEvents: 'none',
  },
};