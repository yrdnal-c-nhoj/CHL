import React, { useState, useEffect, useMemo } from 'react';
import atomicWebp from '../../../assets/images/26-02/26-02-28/atomic.webp';
import atomicFont from '../../../assets/fonts/26-02-28-atomic.ttf';

const TILE_SIZE = 300;

// Isolated Clock Component to prevent Grid re-renders
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let frameId;
    const update = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${h}${m}${s}${ms}`;
  };

  return (
    <div style={styles.clockContainer}>
      <div style={styles.clockText}>{formatTime(time)}</div>
    </div>
  );
};

const ImageGrid = () => {
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

  const tileCoords = useMemo(() => {
    const coords = [];
    const cols = Math.ceil(dimensions.width / TILE_SIZE);
    const rows = Math.ceil(dimensions.height / TILE_SIZE);
    
    // Calculate center point
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Calculate offset to center the grid
    const offsetX = (cols * TILE_SIZE - dimensions.width) / 2;
    const offsetY = (rows * TILE_SIZE - dimensions.height) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        coords.push({
          x: col * TILE_SIZE - offsetX,
          y: row * TILE_SIZE - offsetY,
          id: `${row}-${col}`
        });
      }
    }
    return coords;
  }, [dimensions]);

  return (
    <div style={styles.container}>
      <style>{`
        @font-face {
          font-family: 'AtomicFont';
          src: url('${atomicFont}') format('truetype');
        }
      `}</style>
      
      {/* Background Grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {tileCoords.map((tile) => (
          <img 
            key={tile.id} 
            src={atomicWebp} 
            style={{ ...styles.tileImage, left: tile.x, top: tile.y }} 
            alt="" 
          />
        ))}
      </div>
      
      <DigitalClock />
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  tileImage: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    objectFit: 'cover',
    display: 'block',
  },
  clockContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  clockText: {
    color: '#9EF817',
    fontFamily: "'AtomicFont', monospace",
    fontSize: '10vw',
    textShadow: '-2px -2px 0px #E01439, 2px 2px 0px #E01439',
    // background: 'radial-gradient(circle, #C3BCBC 0%, #ECCDCD 100%)',
    letterSpacing: '0.05em',
    
    // Centering Logic
    display: 'flex',
    alignItems: 'center',       // Vertical centering
    justifyContent: 'center',    // Horizontal centering
    lineHeight: 1.5,             // Adjust this to change the height of the strip
    padding: '10px 0',           // Exact padding above and below
    width: '100%',
    textAlign: 'center',
  }
};

export default ImageGrid;