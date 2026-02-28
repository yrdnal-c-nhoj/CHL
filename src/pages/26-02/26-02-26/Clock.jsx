import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [images, setImages] = useState([]);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageAssignments, setImageAssignments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Import images from the corresponding date folder (26-02-26)
  useEffect(() => {
    console.log('Clock component mounted');
    const loadImages = async () => {
      try {
        console.log('Starting to load images from 26-02-26 folder...');
        // Use Vite's glob import to get images from the specific date folder
        const imageModules = import.meta.glob('/src/assets/images/26-02/26-02-26/bg/*.{png,jpg,jpeg,gif,svg,webp}', { eager: true });
        console.log('Found image modules:', Object.keys(imageModules).length);
        
        const imageUrls = Object.values(imageModules).map(module => module.default);
        console.log('Loaded images:', imageUrls.length);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error loading images:', error);
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

  // Calculate grid size based on viewport to fill entire space
  useEffect(() => {
    let resizeTimeout;
    
    const calculateGridSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const squareSize = 100; // 100px squares
      
      // Calculate exact number of squares needed to fill the viewport
      const cols = Math.ceil(viewportWidth / squareSize);
      const rows = Math.ceil(viewportHeight / squareSize);
      
      console.log('Grid size calculated:', { rows, cols });
      setGridSize({ rows, cols });
    };

    // Debounced resize handler
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateGridSize, 100);
    };

    calculateGridSize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Create image assignments (each image used only once, then repeat if needed)
  useEffect(() => {
    if (images.length > 0 && gridSize.rows > 0 && gridSize.cols > 0) {
      const totalCells = gridSize.rows * gridSize.cols;
      const assignments = [];
      
      // Add each image once
      for (let i = 0; i < images.length && i < totalCells; i++) {
        assignments.push(images[i]);
      }
      
      // If we need more images than available, repeat the images
      if (totalCells > images.length) {
        const remainingCells = totalCells - images.length;
        for (let i = 0; i < remainingCells; i++) {
          assignments.push(images[i % images.length]);
        }
      }
      
      // Shuffle the assignments for random placement
      const shuffled = assignments.sort(() => Math.random() - 0.5);
      setImageAssignments(shuffled);
      console.log('Image assignments created:', shuffled.length);
    }
  }, [images, gridSize]);

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

  // Get assigned image for each grid cell (no random selection anymore)
  const getAssignedImage = (index) => {
    if (imageAssignments.length === 0) return null;
    return imageAssignments[index];
  };

  // Handle image load
  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  // Format time for 12-hour clock without leading zeros
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 should be 12
    
    // No leading zeros
    const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    return timeString;
  };

  if (gridSize.rows === 0 || gridSize.cols === 0) {
    return <div style={{ background: '#000', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'monospace', fontSize: '18px' }}>Calculating grid...</div>;
  }

  if (imageAssignments.length === 0) {
    return <div style={{ background: '#000', width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'monospace', fontSize: '18px' }}>Assigning images...</div>;
  }

  const totalCells = gridSize.rows * gridSize.cols;

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    background: '#000',
    position: 'relative',
    margin: 0,
    padding: 0
  };

  const gridStyle = {
    display: 'grid',
    width: '100%',
    height: '100%',
    gap: 0,
    margin: 0,
    padding: 0,
    gridTemplateColumns: `repeat(${gridSize.cols}, 100px)`,
    gridTemplateRows: `repeat(${gridSize.rows}, 100px)`,
    width: `${gridSize.cols * 100}px`,
    height: `${gridSize.rows * 100}px`
  };

  const cellStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: '#111',
    margin: 0,
    padding: 0
  };

  const imageStyle = (index) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease, filter 0.3s ease',
    display: 'block',
    margin: 0,
    padding: 0,
    opacity: loadedImages.has(index) ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out'
  });

  const clockStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#CEEACE',
    fontFamily: "'DateFont', 'Courier New', monospace",
    fontSize: '11vh',
    fontWeight: 'bold',
    zIndex: 10,
    letterSpacing: '-1vh',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  const cornerImageStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '30vh',
    height: '30vh',
    objectFit: 'cover',
    zIndex: 15,
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @font-face {
          font-family: 'DateFont';
          src: url('/src/assets/fonts/26-02-26-fu.ttf') format('truetype');
        }
      `}</style>
      <div style={gridStyle}>
        {Array.from({ length: totalCells }).map((_, index) => {
          const row = Math.floor(index / gridSize.cols);
          const col = index % gridSize.cols;
          const distance = getDistanceFromCenter(row, col);
          const delay = distance * 0.1; // Delay based on distance from center
          const imageUrl = getAssignedImage(index);
          
          return (
            <div
              key={index}
              style={{
                ...cellStyle,
                animationDelay: `${delay}s`,
                width: '100px',
                height: '100px'
              }}
            >
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={`Grid cell ${index}`}
                  style={imageStyle(index)}
                  onLoad={() => handleImageLoad(index)}
                />
              )}
            </div>
          );
        })}
      </div>
      <img 
        src="/src/assets/images/26-02/26-02-26/f.webp" 
        alt="Corner image" 
        style={cornerImageStyle}
      />
      <div style={clockStyle}>
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Clock;