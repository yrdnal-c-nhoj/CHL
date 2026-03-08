import React, { useEffect, useState } from 'react';
import rocketBg from '../../../assets/images/26-03/26-03-06/rocket.gif';

const Clock = () => {
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    const tileSize = 25; // Further reduced to 25px
    const cols = Math.ceil(window.innerWidth / tileSize) + 6; // Even more overflow
    const rows = Math.ceil(window.innerHeight / tileSize) + 6;
    
    const generatedTiles = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const isEven = (row + col) % 2 === 0;
        generatedTiles.push({
          id: `${row}-${col}`,
          x: col * tileSize,
          y: row * tileSize,
          rotation: isEven ? 90 : -90
        });
      }
    }
    setTiles(generatedTiles);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#fff',
      fontSize: '4rem',
      fontFamily: 'monospace',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Individual rocket tiles */}
      {tiles.map(tile => (
        <div
          key={tile.id}
          style={{
            position: 'absolute',
            top: tile.y,
            left: tile.x,
            width: '25px',
            height: '25px',
            backgroundImage: `url(${rocketBg})`,
            backgroundSize: 'cover', // Changed from 'contain' to 'cover'
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            transform: `rotate(${tile.rotation}deg)`,
            opacity: 1
          }}
        />
      ))}
      
      <div style={{
        position: 'relative',
        zIndex: 10
      }}>
        26-03-06
      </div>
    </div>
  );
};

export default Clock;
