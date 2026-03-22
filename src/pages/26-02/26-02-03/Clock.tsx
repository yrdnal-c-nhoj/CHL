import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import type { FontConfig } from '../../../types/clock';

// Interface for Disc component props
interface DiscProps {
  size: string;
  rotationVar: string;
  color: string;
  label: string;
  weight: number;
}

// Styles defined before usage to ensure type safety and cleaner structure
const styles: Record<string, React.CSSProperties> = {
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
    // Fallback font until local asset is added
    fontFamily: '"Taviraj", "Times New Roman", serif',
  },
  centerPin: {
    width: '2vw',
    height: '2vw',
    backgroundColor: '#F26AD7',
    borderRadius: '50%',
    zIndex: 10,
  },
};

const Clock: React.FC = () => {
  const clockRef = useRef<HTMLDivElement>(null);

  const fontConfigs = useMemo<FontConfig[]>(() => [], []);

  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();
  const s = time.getSeconds();
  const m = time.getMinutes() + s / 60;
  const h = (time.getHours() % 12) + m / 60;

  useEffect(() => {
    if (clockRef.current) {
      clockRef.current.style.setProperty('--s-rot', `${s * 6}deg`);
      clockRef.current.style.setProperty('--m-rot', `${m * 6}deg`);
      clockRef.current.style.setProperty('--h-rot', `${h * 30}deg`);
    }
  }, [s, m, h]);

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

export default Clock;
