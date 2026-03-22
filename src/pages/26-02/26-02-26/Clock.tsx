import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';
import { useSecondClock } from '../../../utils/useSmoothClock';
import backgroundImage from '../../../assets/images/26-02/26-02-26/26-02-26-f.webp';
import fuFont from '../../../assets/fonts/26-02-26-fu.ttf';

interface ViteModule {
  default: string;
}

interface WindowSize {
  width: number;
  height: number;
}

interface TimeDigits {
  hours: string;
  minutes: string;
  isPM: boolean;
}

interface GridSize {
  rows: number;
  cols: number;
}

export const background = backgroundImage;


const ImageGridClock: React.FC = () => {
  const fontConfigs = useMemo(() => [{
      fontFamily: 'DateFont',
      fontUrl: fuFont,
      options: {
        weight: 'normal',
        style: 'normal'
      }
  }], []);
  
  useSuspenseFontLoader(fontConfigs);

  const [images, setImages] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState<GridSize>({ rows: 0, cols: 0 });
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageAssignments, setImageAssignments] = useState<number[]>([]);
  const currentTime = useSecondClock();
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  const changeRandomCells = () => {
    if (imageAssignments.length > 0 && images.length > 1) {
      setCurrentImageIndex((prev) => {
        const newIndex = { ...prev };
        const totalCells = imageAssignments.length;

        for (let i = 0; i < 3; i++) {
          const randomCell = Math.floor(Math.random() * totalCells);
          const currentIdx = newIndex[randomCell] || 0;
          newIndex[randomCell] = (currentIdx + 1) % images.length;
        }

        return newIndex;
      });
    }
  };

  useEffect(() => {
    changeRandomCells();
  }, [currentTime.getSeconds()]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageModules = import.meta.glob(
          '../../../assets/images/26-02/26-02-26/bg/*.{png,jpg,jpeg,gif,svg,webp}',
          { eager: true },
        );
        const imageUrls = Object.values(imageModules).map(
          (module: ViteModule) => module.default,
        );
        setImages(imageUrls.length > 0 ? imageUrls : []);
      } catch (error) {
        console.error('Error loading images:', error);
        setImages([
          '../../../assets/images/i.png',
          '../../../assets/images/fbook.png',
          '../../../assets/images/insta.png',
          '../../../assets/images/x.png',
        ]);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const calculateGridSize = () => {
      const squareSize = 100;
      const cols = Math.ceil(window.innerWidth / squareSize);
      const rows = Math.ceil(window.innerHeight / squareSize);
      setGridSize({ rows, cols });
    };

    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateGridSize, 150);
    };

    calculateGridSize();
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    if (images.length > 0 && gridSize.rows > 0) {
      const totalCells = gridSize.rows * gridSize.cols;

      const initialAssignments = [];
      const initialIndex = {};

      for (let i = 0; i < totalCells; i++) {
        const randomImageIndex = Math.floor(Math.random() * images.length);
        initialAssignments[i] = images[randomImageIndex];
        initialIndex[i] = randomImageIndex;
      }

      setImageAssignments(initialAssignments);
      setCurrentImageIndex(initialIndex);
    }
  }, [images, gridSize]);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'P‌M' : 'A‌M';

    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}\u2009${ampm}`;
  };

  // Styles
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    background: 'fuchsia',
    position: 'relative',
  };

  const gridStyle = {
    display: 'grid',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    gridTemplateColumns: `repeat(${gridSize.cols}, 100px)`,
    gridTemplateRows: `repeat(${gridSize.rows}, 100px)`,
    width: `${gridSize.cols * 100}px`,
    height: `${gridSize.rows * 100}px`,
  };

  const clockStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#557F25',
    fontFamily: "'DateFont', monospace",
    fontSize: '11vh',
    fontWeight: 'bold',
    zIndex: 10,
    letterSpacing: '-1vh',
    whiteSpace: 'nowrap',
    pointerEvents: 'none' as const,
    textShadow:
      '-6px 0 rgb(244, 240, 240), 6px 0 rgb(28, 3, 3),  0 0 20px rgb(244, 240, 240)',
  };

  if (imageAssignments.length === 0)
    return <div style={{ background: '#000', height: '100vh' }} />;

  return (
    <div style={containerStyle}>
      <style>{`
        .grid-img { transition: opacity 0.5s ease-in-out; object-fit: cover; width: 100%; height: 100%; }
      `}</style>

      <div style={gridStyle}>
        {imageAssignments.map((src, i) => {
          const imageIndexToShow = currentImageIndex[i] || 0;
          const imageToShow = images[imageIndexToShow];

          return (
            <div key={i} style={{ background: 'fuchsia', overflow: 'hidden' }}>
              <img
                src={imageToShow}
                className="grid-img"
                style={{
                  opacity: loadedImages.has(i) ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                }}
                onLoad={() => setLoadedImages((prev) => new Set(prev).add(i))}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <img
        src={backgroundImage}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '30vh',
          height: '30vh',
          zIndex: 11,
          filter:
            'drop-shadow(-11px 0 rgb(244, 240, 240)) drop-shadow(11px 0 rgb(28, 3, 3))',
        }}
        alt="corner"
      />

      <div style={clockStyle}>{formatTime(currentTime)}</div>
    </div>
  );
};

export default ImageGridClock;
