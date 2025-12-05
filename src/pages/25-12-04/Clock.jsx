import { useState, useEffect } from 'react';

// Import font with today's date variable name
import font_2024_12_05 from './dog.ttf';

const PuppyClockComponent = () => {
  const [currentImage, setCurrentImage] = useState('');
  const [time, setTime] = useState(new Date());

  const getRandomPuppyImage = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      if (data.status === 'success') {
        setCurrentImage(data.message);
      }
    } catch (error) {
      console.error('Error fetching puppy image:', error);
    }
  };

  useEffect(() => {
    getRandomPuppyImage();

    const clockInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const imageInterval = setInterval(() => {
      getRandomPuppyImage();
    }, 3000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(imageInterval);
    };
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const timeString = `${hours}${formattedMinutes} ${ampm}`;

    // Insert spaces between all characters
    return timeString.split('').join(' ');
  };

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: currentImage ? `url(${currentImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    overflow: 'hidden',
    backgroundColor: '#333'
  };

  const clockStyle = {
    fontFamily: 'CustomFont, sans-serif',
    fontSize: '6vh',
    color: '#F9EBE5FF',
    textShadow: '0.3vh 0.3vh 0.6vh rgba(0,0,0,0.9)',
    fontWeight: 'bold',
    userSelect: 'none',
    transform: 'translateY(10vh)' // Slightly below center
  };

  const fontFaceStyle = `
    @font-face {
      font-family: 'CustomFont';
      src: url(${font_2024_12_05}) format('woff2');
      font-weight: normal;
      font-style: normal;
    }
  `;

  return (
    <>
      <style>{fontFaceStyle}</style>
      <div style={containerStyle}>
        <div style={clockStyle}>
          {formatTime(time)}
        </div>
      </div>
    </>
  );
};

export default PuppyClockComponent;
