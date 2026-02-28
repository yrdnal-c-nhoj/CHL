import React, { useState, useEffect, useRef } from 'react';
import './ImageGrid.css';

const ImageGrid = () => {
  const [images, setImages] = useState([]);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [error, setError] = useState(null);
  const gridRef = useRef(null);

  // Import all images from the assets/images folder
  useEffect(() => {
    console.log('ImageGrid component mounted');
    const loadImages = async () => {
      try {
        console.log('Starting to load images...');
        // Use Vite's glob import to get all images
        const imageModules = import.meta.glob('/src/assets/images/**/*.{png,jpg,jpeg,gif,svg,webp}', { eager: true });
        console.log('Found image modules:', Object.keys(imageModules).length);
        
        const imageUrls = Object.values(imageModules).map(module => module.default);
        console.log('Loaded images:', imageUrls.length);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error loading images:', error);
        setError(error.message);
        // Fallback to some known images
        const fallbackImages = [
          '/src/assets/images/i.png',
          '/src/assets/images/fbook.png', 
          '/src/assets/images/insta.png',
          '/src/assets/images/x.png'
        ];
        setImages(fallbackImages);
      }
    };

    loadImages();
  }, []);

  // Calculate grid size based on viewport
  useEffect(() => {
    const calculateGridSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const squareSize = 100; // 100px squares
      const cols = Math.ceil(viewportWidth / squareSize);
      const rows = Math.ceil(viewportHeight / squareSize);
      console.log('Grid size calculated:', { rows, cols });
      setGridSize({ rows, cols });
    };

    calculateGridSize();
    window.addEventListener('resize', calculateGridSize);
    return () => window.removeEventListener('resize', calculateGridSize);
  }, []);

  // Get center position of the grid
  const getCenterPosition = () => {
    return {
      row: Math.floor(gridSize.rows / 2),
      col: Math.floor(gridSize.cols / 2)
    };
  };

  // Calculate distance from center for animation delay
  const getDistanceFromCenter = (row, col) => {
    const center = getCenterPosition();
    return Math.sqrt(Math.pow(row - center.row, 2) + Math.pow(col - center.col, 2));
  };

  // Get random image for each grid cell
  const getRandomImage = () => {
    if (images.length === 0) return null;
    return images[Math.floor(Math.random() * images.length)];
  };

  // Handle image load
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  // Generate grid cells in spiral order from center
  const generateSpiralOrder = () => {
    const cells = [];
    const center = getCenterPosition();
    const maxRadius = Math.max(gridSize.rows, gridSize.cols);
    
    for (let radius = 0; radius <= maxRadius; radius++) {
      for (let angle = 0; angle < 360; angle += 45) {
        const row = Math.round(center.row + radius * Math.sin(angle * Math.PI / 180));
        const col = Math.round(center.col + radius * Math.cos(angle * Math.PI / 180));
        
        if (row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols) {
          cells.push({ row, col, distance: radius });
        }
      }
    }
    
    // Sort by distance and remove duplicates
    const uniqueCells = cells.filter((cell, index, self) =>
      index === self.findIndex((c) => c.row === cell.row && c.col === cell.col)
    );
    
    return uniqueCells.sort((a, b) => a.distance - b.distance);
  };

  if (gridSize.rows === 0 || gridSize.cols === 0) {
    return <div className="image-grid-loading">Calculating grid...</div>;
  }

  if (error) {
    return <div className="image-grid-error">Error: {error}</div>;
  }

  if (images.length === 0) {
    return <div className="image-grid-loading">Loading images...</div>;
  }

  const spiralOrder = generateSpiralOrder();
  const totalCells = gridSize.rows * gridSize.cols;

  return (
    <div className="image-grid-container" ref={gridRef}>
      <div 
        className="image-grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, 100px)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 100px)`
        }}
      >
        {Array.from({ length: totalCells }).map((_, index) => {
          const row = Math.floor(index / gridSize.cols);
          const col = index % gridSize.cols;
          const distance = getDistanceFromCenter(row, col);
          const delay = distance * 0.1; // Delay based on distance from center
          const imageUrl = getRandomImage();
          
          return (
            <div
              key={index}
              className="grid-cell"
              style={{
                animationDelay: `${delay}s`,
                width: '100px',
                height: '100px'
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={`Grid cell ${index}`}
                  className="grid-image"
                  onLoad={() => handleImageLoad(index)}
                  style={{
                    opacity: loadedImages.has(index) ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="grid-info">
        <p>Grid: {gridSize.cols} × {gridSize.rows}</p>
        <p>Images: {images.length}</p>
        <p>Loaded: {loadedImages.size}/{totalCells}</p>
      </div>
    </div>
  );
};

export default ImageGrid;
