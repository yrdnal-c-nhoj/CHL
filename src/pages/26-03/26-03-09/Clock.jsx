import { useState, useEffect, useCallback } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';
import font_2024_12_05 from '../../../assets/fonts/25-12-03-dog.ttf?url';

const PuppyClockComponent = () => {
  const [currentImage, setCurrentImage] = useState('');
  const [time, setTime] = useState(new Date());
  
  const fontReady = useFontLoader('CustomFont', font_2024_12_05, {
    timeout: 5000,
    fallback: true
  });

  // Wrapped in useCallback to prevent re-creation on every render
  const getRandomPuppyImage = useCallback(async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      if (data.status === 'success') {
        setCurrentImage(data.message);
      }
    } catch (error) {
      console.error('Error fetching puppy image:', error);
    }
  }, []);

  useEffect(() => {
    getRandomPuppyImage();

    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    const imageInterval = setInterval(getRandomPuppyImage, 3000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(imageInterval);
    };
  }, [getRandomPuppyImage]);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12 || 12; // Shortened "hours ? hours : 12" logic
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${hours}${formattedMinutes} ${ampm}`.split('').join(' ');
  };

  // Styles remain mostly the same, but we add an opacity transition
  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: currentImage ? `url(${currentImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'background-image 0.5s ease-in-out', // Smoother image swaps
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333'
  };

  const clockStyle = {
    fontFamily: 'CustomFont, sans-serif',
    fontSize: '6vh',
    color: '#F9EBE5FF',
    textShadow: '0.3vh 0.3vh 0.6vh rgba(0,0,0,0.9)',
    userSelect: 'none',
    transform: 'translateY(10vh)',
    // Hide text until font is ready to prevent layout shift
    opacity: fontReady ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={clockStyle}>
        {formatTime(time)}
      </div>
    </div>
  );
};

export default PuppyClockComponent;