import React, { useState, useEffect, useMemo } from 'react';
import westVideo from '../../../assets/images/26-03/26-03-01/west.mp4';
import cloudGif from '../../../assets/images/26-03/26-03-01/cloud.webp';

const TILE_SIZE = 200;

/**
 * AnalogClock Component
 * Cleaned up using a more declarative approach for the hands.
 */
const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const angles = {
    hr: (time.getHours() % 12) * 30 + time.getMinutes() * 0.5,
    min: time.getMinutes() * 6 + time.getSeconds() * 0.1,
    sec: time.getSeconds() * 6,
  };

  const getHandStyle = (width, height, angle, zIndex) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: '#9EAEF6',
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    boxShadow: '0 0 10px rgba(158, 174, 246, 0.5)',
    zIndex,
    transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)', // Add a little "tick" bounce
  });

  return (
    <div style={{ width: '45vw', height: '45vw', position: 'relative' }}>
      <div style={getHandStyle('6px', '25%', angles.hr, 3)} />
      <div style={getHandStyle('4px', '35%', angles.min, 4)} />
      <div style={getHandStyle('2px', '40%', angles.sec, 5)} />
    </div>
  );
};

/**
 * Main Clock Component
 */
const Clock = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize grid coordinates to prevent recalculation on every clock tick
  const tiles = useMemo(() => {
    const cols = Math.ceil(dimensions.width / TILE_SIZE);
    const rows = Math.ceil(dimensions.height / TILE_SIZE);
    const cutoff = dimensions.height * (2 / 3);
    
    const grid = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const y = row * TILE_SIZE;
        // Calculate opacity once during memoization
        const opacity = y >= cutoff ? 0 : 0.4 * (1 - y / cutoff);
        
        if (opacity > 0) {
          grid.push({ x: col * TILE_SIZE, y, opacity, id: `${row}-${col}` });
        }
      }
    }
    return grid;
  }, [dimensions]);

  return (
    <main style={styles.container}>
      {/* Background Video */}
      <video autoPlay loop muted playsInline style={styles.video}>
        <source src={westVideo} type="video/mp4" />
      </video>

      {/* Tiled GIF Overlay */}
      <div style={styles.overlayWrapper}>
        {tiles.map((tile) => (
          <img
            key={tile.id}
            src={cloudGif}
            alt=""
            style={{
              ...styles.tile,
              left: tile.x,
              top: tile.y,
              opacity: tile.opacity,
            }}
          />
        ))}
      </div>

      {/* Clock UI Layer */}
      <section style={{ zIndex: 10 }}>
        <AnalogClock />
      </section>
    </main>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    position: 'relative',
    backgroundColor: '#000',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
    filter: 'hue-rotate(-20deg) saturate(1.3) brightness(1.3) contrast(0.7)',
  },
  overlayWrapper: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    pointerEvents: 'none',
    mask: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
    WebkitMask: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    transform: 'scaleX(-1)',
  },
};

export default Clock;