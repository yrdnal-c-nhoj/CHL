import React, { useEffect, useRef, useState } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';

// Interface for Disc component props
interface DiscProps {
  size: string;
  rotationVar: string;
  color: string;
  label: string;
  weight: number;
}

const Disc260203Clock: React.FC = () => {
  const clockRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | undefined>();
  const [showContent, setShowContent] = useState(false);

  // Use Suspense-compatible font loading
  useSuspenseFontLoader([
    {
      fontFamily: 'Taviraj',
      fontUrl: 'https://fonts.googleapis.com/css2?family=Taviraj:wght@100;500;900&display=swap',
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ]);

  // Show content immediately with Suspense
  useEffect(() => {
    setShowContent(true);
  }, []);

  // Clock animation
  useEffect(() => {
    const animate = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours();

      const sDeg = (s + ms / 1000) * 6;
      const mDeg = (m + s / 60) * 6;
      const hDeg = ((h % 12) + m / 60) * 30;

      if (clockRef.current) {
        clockRef.current.style.setProperty('--s-rot', `${sDeg}deg`);
        clockRef.current.style.setProperty('--m-rot', `${mDeg}deg`);
        clockRef.current.style.setProperty('--h-rot', `${hDeg}deg`);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!showContent) {
    return null;
  }

  return (
    <div
      style={{
        ...styles.container,
        opacity: 1,
        visibility: 'visible',
        transition: 'opacity 0.3s ease',
      }}
      ref={clockRef}
    >
      <div style={styles.clockBase}>
        <div style={styles.centerPin} />

        {/* Seconds - Taviraj 100 */}
        <Disc
          size="85vmin"
          rotationVar="--s-rot"
          color="#E20606"
          label="s"
          weight={100}
        />

        {/* Minutes - Taviraj 500 */}
        <Disc
          size="60vmin"
          rotationVar="--m-rot"
          color="#0D74FB"
          label="m"
          weight={500}
        />

        {/* Hours - Taviraj 900 */}
        <Disc
          size="25vmin"
          rotationVar="--h-rot"
          color="#08B308"
          label="h"
          weight={900}
        />
      </div>
    </div>
  );
};

const Disc: React.FC<DiscProps> = ({ size, rotationVar, color, label, weight }) => (
  <div
    style={{
      ...styles.disc,
      width: size,
      height: size,
      transform: `rotate(var(${rotationVar}))`,
    }}
  >
    <span
      style={{
        ...styles.label,
        color,
        fontWeight: weight,
      }}
    >
      {label}
    </span>
  </div>
);

const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background:
      'radial-gradient(circle at center, #F5F3D0 0%, #F5E6A3 55%, #B5A25C 75%, #B79D4E 100%)',
    margin: 0,
    overflow: 'hidden',
  },
  clockBase: {
    position: 'relative',
    width: '95vmin',
    height: '95vmin',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disc: {
    position: 'absolute',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    willChange: 'transform',
    pointerEvents: 'none',
  },
  label: {
    position: 'absolute',
    top: '0',
    fontSize: 'clamp(5vw, 20vmin, 10vw)',
    transform: 'translateY(-50%)',
    lineHeight: 1,
    fontFamily: '"Taviraj", serif',
  },
  centerPin: {
    width: '2vw',
    height: '2vw',
    backgroundColor: '#F26AD7',
    borderRadius: '50%',
    zIndex: 10,
  },
};

export default Disc260203Clock;
