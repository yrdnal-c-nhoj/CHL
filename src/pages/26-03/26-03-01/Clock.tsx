import React, { useState, useEffect, useMemo, useRef } from 'react';
import westVideo from '../../../assets/images/26-03/26-03-01/west.mp4';
import cloudGif from '../../../assets/images/26-03/26-03-01/cloud.webp';
import westtImage from '../../../assets/images/26-03/26-03-01/westt.webp';
import styles from './Clock.module.css';

const TILE_SIZE = 100;

/**
 * Sub-component: The "Sweep" Analog Clock
 * Uses requestAnimationFrame for ~60fps smooth movement
 */
const AnalogClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let frameId;
    const update: React.FC = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const angles = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();

    return {
      // 6 degrees per second + fractional milliseconds
      sec: (s + ms / 1000) * 6,
      // 6 degrees per minute + fractional seconds
      min: (m + s / 60 + ms / 60000) * 6,
      // 30 degrees per hour + fractional minutes
      hr: ((h % 12) + m / 60 + s / 3600) * 30,
    };
  }, [time]);

  const getHandStyle = (width, height, angle, zIndex) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: '#0933EE',
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    boxShadow: '0 0 12px rgba(9, 51, 238, 0.6)',
    zIndex,
    willChange: 'transform',
  });

  return (
    <div style={{ width: '45vw', height: '45vw', position: 'relative' }}>
      {/* Hour Hand */}
      <div style={getHandStyle('5px', '28%', angles.hr, 3)} />
      {/* Minute Hand */}
      <div style={getHandStyle('3.5px', '42%', angles.min, 4)} />
      {/* Second Hand */}
      <div style={getHandStyle('1.5px', '48%', angles.sec, 5)} />

      {/* Center Pin / Hub */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '12px',
          height: '12px',
          backgroundColor: '#0933EE',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          boxShadow: '0 0 10px rgba(158, 174, 246, 0.8)',
        }}
      />
    </div>
  );
};

/**
 * Main Clock Screen Component
 */
const Clock: React.FC = () => {
  const [dimensions, setDimensions] = useState<any>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize: React.FC = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized grid avoids expensive layout math on every clock tick
  const tiles = useMemo(() => {
    const cols = Math.ceil(dimensions.width / TILE_SIZE);
    const rows = Math.ceil(dimensions.height / TILE_SIZE);
    const cutoff = dimensions.height * (2 / 3);

    const centerX = (dimensions.width % TILE_SIZE) / 2;
    const centerY = (dimensions.height % TILE_SIZE) / 2;

    const grid = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * TILE_SIZE + centerX;
        const y = row * TILE_SIZE + centerY;
        const opacity = y >= cutoff ? 0 : 0.4 * (1 - y / cutoff);

        if (opacity > 0) {
          grid.push({ x, y, opacity, id: `${row}-${col}` });
        }
      }
    }
    return grid;
  }, [dimensions]);

  return (
    <main className={styles.container}>
      {/* Layer 1: Filtered Video Background */}
      <video autoPlay loop muted playsInline className={styles.video}>
        <source src={westVideo} type="video/mp4" />
      </video>

      {/* Layer 2: Offset Cloud Layer */}
      <div className={styles.backgroundCloudWrapper}>
        {tiles.map((tile) => (
          <img
            key={`bg-${tile.id}`}
            src={cloudGif}
            alt=""
            className={styles.backgroundTile}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              left: tile.x + 25,
              top: tile.y + 25,
              opacity: tile.opacity * 0.8,
            }}
          />
        ))}
      </div>

      {/* Layer 3: Mirrored Overlay Wrapper */}
      <div className={styles.overlayWrapper}>
        {tiles.map((tile) => (
          <img
            key={tile.id}
            src={cloudGif}
            alt=""
            className={styles.tile}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              left: tile.x,
              top: tile.y,
              opacity: tile.opacity,
            }}
          />
        ))}
      </div>

      {/* Layer 4: Static Overlay Image */}
      <img src={westtImage} alt="" className={styles.westtImage} />

      {/* Layer 5: Analog Clock UI */}
      <section className={styles.analogClockSection}>
        <AnalogClock />
      </section>
    </main>
  );
};

export default Clock;
