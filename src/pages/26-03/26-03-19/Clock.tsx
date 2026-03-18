import { useState, useEffect, useCallback } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';

// Import all the fonts from the directory
const fontImports = import.meta.glob(
  '../../../assets/fonts/26-03-10/*.{ttf,otf}',
);

const fontNames = Object.keys(fontImports).map((path) => {
  const font = new FontFace(
    path.split('/').pop().split('.')[0],
    `url(${path})`,
  );
  font.load();
  return font.family;
});

const KittyClockComponent: React.FC = () => {
  const [images, setImages] = useState<any>({ current: '', next: '' });
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [time, setTime] = useState(new Date());
  const [currentFont, setCurrentFont] = useState<any>(fontNames[0]);

  const fontReady = useFontLoader(fontNames, undefined, {
    timeout: 5000,
    fallback: true,
  });

  const getNewKitty = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.thecatapi.com/v1/images/search',
      );
      const data = await response.json();

      if (data && data[0]?.url) {
        const nextUrl = data[0].url;

        const img = new Image();
        img.src = nextUrl;
        img.onload = () => {
          setImages((prev) => ({ ...prev, next: nextUrl }));
          setIsTransitioning(true);

          setTimeout(() => {
            setImages({ current: nextUrl, next: '' });
            setIsTransitioning(false);
          }, 600);
        };
      }
    } catch (error) {
      console.error('Error fetching kitty:', error);
    }
  }, []);

  useEffect(() => {
    getNewKitty();
    const clockInterval = setInterval(() => {
      setTime(new Date());
      setCurrentFont(fontNames[Math.floor(Math.random() * fontNames.length)]);
    }, 1000);
    const imageInterval = setInterval(getNewKitty, 5000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(imageInterval);
    };
  }, [getNewKitty]);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`
      .split('')
      .join(' ');
  };

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const layerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'opacity 0.6s ease-in-out',
  };

  const clockStyle = {
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
  };

  return (
    <div style={containerStyle}>
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
