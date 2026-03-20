import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';

// Vite-optimized font loading with better error handling
const fontImports = import.meta.glob(
  '../../../assets/fonts/26-03-10/*.{ttf,otf}',
  { eager: true, query: '?url' }
);

// Memoized font names to prevent recalculation
const fontNames: string[] = useMemo(() => 
  Object.keys(fontImports).map((path) => {
    const fontName = path.split('/').pop()?.split('.')[0] || 'fallback';
    return fontName;
  }), []
);

// Interface for type safety
interface KittyImages {
  current: string;
  next: string;
}

const KittyClockComponent: React.FC = () => {
  const [images, setImages] = useState<KittyImages>({ current: '', next: '' });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [time, setTime] = useState<Date>(new Date());
  const [currentFont, setCurrentFont] = useState<string>(fontNames[0] || 'monospace');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fontReady = useFontLoader(fontNames, undefined, {
    timeout: 5000,
    fallback: true,
  });

  // Memoized time formatting
  const formatTime = useCallback((date: Date): string => {
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
      .split('')
      .join(' ');
  }, []);

  // Optimized kitty fetching with better error handling
  const getNewKitty = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://api.thecatapi.com/v1/images/search',
        { 
          signal: AbortSignal.timeout(5000) // Vite supports AbortSignal.timeout
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data && data[0]?.url) {
        const nextUrl = data[0].url;

        // Preload image for smooth transition
        const img = new Image();
        img.src = nextUrl;
        img.onload = () => {
          setImages((prev) => ({ ...prev, next: nextUrl }));
          setIsTransitioning(true);
          setIsLoading(false);

          setTimeout(() => {
            setImages({ current: nextUrl, next: '' });
            setIsTransitioning(false);
          }, 600);
        };
        
        img.onerror = () => {
          console.error('Failed to load image:', nextUrl);
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error('Error fetching kitty:', error);
      setIsLoading(false);
    }
  }, []);

  // Optimized useEffect with proper dependencies
  useEffect(() => {
    getNewKitty();
    
    const clockInterval = setInterval(() => {
      setTime(new Date());
      if (fontNames.length > 0) {
        const randomFont = fontNames[Math.floor(Math.random() * fontNames.length)];
        setCurrentFont(randomFont);
      }
    }, 1000);
    
    const imageInterval = setInterval(getNewKitty, 5000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(imageInterval);
    };
  }, [getNewKitty, fontNames]);

  // Memoized styles for performance
  const containerStyle = useMemo<React.CSSProperties>(() => ({
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }), []);

  const layerStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 0.6s ease-in-out',
  }), []);

  const clockStyle = useMemo<React.CSSProperties>(() => ({
    position: 'relative',
    zIndex: 10,
    fontFamily: currentFont,
    fontSize: '7vh',
    color: '#F9EBE5',
    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
    opacity: fontReady ? 1 : 0,
    transition: 'opacity 0.5s ease, font-family 0.5s ease',
    transform: 'translateY(12vh)',
    pointerEvents: 'none',
  }), [currentFont, fontReady]);

  return (
    <div style={containerStyle}>
      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#F9EBE5',
          fontSize: '14px',
          zIndex: 20,
        }}>
          Loading cat...
        </div>
      )}
      
      <div
        style={{
          ...layerStyle,
          backgroundImage: `url(${images.current})`,
          zIndex: 1,
        }}
      />
      <div
        style={{
          ...layerStyle,
          backgroundImage: `url(${images.next})`,
          opacity: isTransitioning ? 1 : 0,
          zIndex: 2,
        }}
      />
      <div style={clockStyle}>{formatTime(time)}</div>
    </div>
  );
};

export default KittyClockComponent;
