import { useState, useEffect, useCallback, useRef } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import font_2024_12_05 from '../../../assets/fonts/25-12-03-dog.ttf?url';

const PuppyClockComponent = () => {
  const [images, setImages] = useState({ current: '', next: '' });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [time, setTime] = useState(new Date());

  const fontReady = useFontLoader('CustomFont', font_2024_12_05, {
    timeout: 5000,
    fallback: true,
  });

  const getNewPuppy = useCallback(async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();

      if (data.status === 'success') {
        const nextUrl = data.message;

        // PRELOADER: Create an off-screen image to "warm" the cache
        const img = new Image();
        img.src = nextUrl;
        img.onload = () => {
          // 1. Set the 'next' image behind the current one
          setImages((prev) => ({ ...prev, next: nextUrl }));

          // 2. Trigger the fade transition
          setIsTransitioning(true);

          // 3. After CSS transition finishes (500ms), swap them permanently
          setTimeout(() => {
            setImages({ current: nextUrl, next: '' });
            setIsTransitioning(false);
          }, 600);
        };
      }
    } catch (error) {
      console.error('Error fetching puppy:', error);
    }
  }, []);

  useEffect(() => {
    getNewPuppy();
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    const imageInterval = setInterval(getNewPuppy, 5000); // Increased to 5s for better UX

    return () => {
      clearInterval(clockInterval);
      clearInterval(imageInterval);
    };
  }, [getNewPuppy]);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    return `${hours}${minutes.toString().padStart(2, '0')} ${ampm}`
      .split('')
      .join(' ');
  };

  // --- STYLES ---

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
    position: 'relative', // Ensure it sits above the background layers
    zIndex: 10,
    fontFamily: 'CustomFont, sans-serif',
    fontSize: '7vh',
    color: '#F9EBE5',
    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
    opacity: fontReady ? 1 : 0,
    transition: 'opacity 0.5s ease',
    transform: 'translateY(12vh)',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      {/* BACKGROUND LAYER 1: The "Old" or Static Image */}
      <div
        style={{
          ...layerStyle,
          backgroundImage: `url(${images.current})`,
          zIndex: 1,
        }}
      />

      {/* BACKGROUND LAYER 2: The "New" incoming Image */}
      <div
        style={{
          ...layerStyle,
          backgroundImage: `url(${images.next})`,
          opacity: isTransitioning ? 1 : 0,
          zIndex: 2,
        }}
      />

      {/* TIME OVERLAY */}
      <div style={clockStyle}>{formatTime(time)}</div>
    </div>
  );
};

export default PuppyClockComponent;
