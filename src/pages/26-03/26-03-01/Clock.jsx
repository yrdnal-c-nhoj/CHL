import React, { useState, useEffect, useMemo } from 'react';
import westVideo from '../../../assets/images/26-03/26-03-01/west.mp4';
import cloudGif from '../../../assets/images/26-03/26-03-01/cloud.webp';
import westtImage from '../../../assets/images/26-03/26-03-01/westt.webp';

const TILE_SIZE = 100;

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 50ms is perfect for "sweep" movement (~20fps)
    const timer = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(timer);
  }, []);

  // Calculate rotation degrees
  const ms = time.getMilliseconds();
  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours();

  const angles = {
    // Smoothly interpolate between seconds using milliseconds
    sec: (s + ms / 1000) * 6,
    // Smoothly interpolate between minutes using seconds
    min: (m + s / 60) * 6,
    // Smoothly interpolate between hours using minutes
    hr: ((h % 12) + m / 60) * 30,
  };

  const getHandStyle = (width, height, angle, zIndex) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    backgroundColor: '#0933EE',
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    // We remove the CSS 'transition' here to prevent the 360 -> 0 snap-back
    transform: `translateX(-50%) rotate(${angle}deg)`,
    boxShadow: '0 0 10px rgba(158, 174, 246, 0.5)',
    zIndex,
    // opacity: 0.8,
    willChange: 'transform', // Optimization for high-frequency updates
  });

  return (
    <div style={{ width: '45vw', height: '45vw', position: 'relative' }}>
      {/* Hour Hand */}
      <div style={getHandStyle('3px', '30%', angles.hr, 3)} />
      {/* Minute Hand */}
      <div style={getHandStyle('2px', '50%', angles.min, 4)} />
      {/* Second Hand */}
      <div style={getHandStyle('1px', '50%', angles.sec, 5)} />
      
    
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
    
    // Calculate center offset to start tiling from middle
    const centerX = (dimensions.width % TILE_SIZE) / 2;
    const centerY = (dimensions.height % TILE_SIZE) / 2;
    
    const grid = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * TILE_SIZE + centerX;
        const y = row * TILE_SIZE + centerY;
        // Calculate opacity once during memoization
        const opacity = y >= cutoff ? 0 : 0.4 * (1 - y / cutoff);
        
        if (opacity > 0) {
          grid.push({ x, y, opacity, id: `${row}-${col}` });
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

      {/* Westt Image Layer */}
      <img src={westtImage} alt="" style={styles.westtImage} />

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
    objectFit: 'fill',
    zIndex: 1,
    filter: 'hue-rotate(180deg) saturate(1.5) brightness(1.8) contrast(1.2)',
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
  westtImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    zIndex: 5,
    pointerEvents: 'none',
    opacity: 0.3,
    filter: 'saturate(1.8) hue-rotate(180deg)',
  },
};

export default Clock;