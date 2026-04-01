import React, { useState, useEffect, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import { useMillisecondClock } from '../../../../utils/useSmoothClock';
import atomicWebp from '../../../../assets/images/2026/26-02/26-02-28/atomic.webp';
import atomicFont from '../../../../assets/fonts/26-02-28-atomic.ttf';

const TILE_SIZE = 140;

interface Dimensions {
  width: number;
  height: number;
}

const DigitalClock: React.FC = () => {
  const time = useMillisecondClock();

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

const ImageGrid: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showContent, setShowContent] = useState(false);

  const fontConfigs = useMemo(() => [
    {
      fontFamily: 'AtomicFont',
      fontUrl: atomicFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ], []);
  
  useSuspenseFontLoader(fontConfigs);
  useEffect(() => {
    setShowContent(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tileCoords = useMemo(() => {
    const coords = [];
    const cols = Math.ceil(dimensions.width / TILE_SIZE) + 1;
    const rows = Math.ceil(dimensions.height / TILE_SIZE) + 1;

    const centerX = (dimensions.width % TILE_SIZE) / 2 - TILE_SIZE / 2;
    const centerY = (dimensions.height % TILE_SIZE) / 2 - TILE_SIZE / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        coords.push({
          x: col * TILE_SIZE + centerX,
          y: row * TILE_SIZE + centerY,
          id: `${row}-${col}`,
        });
      }
    }
    return coords;
  }, [dimensions]);

  return (
    <div style={styles.container}>
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
    height: '100dvh',
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
    filter: 'hue-rotate(30deg) saturate(1.8) brightness(1.1)',
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
    color: '#D1EF57',
    fontFamily: "'AtomicFont', monospace",
    fontSize: '14vw',
    textShadow: ' 1px 1px 0px #181616',
    letterSpacing: '0.02em',

    display: 'flex',
    alignItems: 'center', // Vertical centering
    justifyContent: 'center', // Horizontal centering
    lineHeight: 1.5, // Adjust this to change the height of the strip
    padding: '10px 0', // Exact padding above and below
    width: '100%',
    textAlign: 'center',
  },
};

export default ImageGrid;
