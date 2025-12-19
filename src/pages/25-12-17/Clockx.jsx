import { useState, useEffect } from 'react';
import background from './swagr.webp';
import fontDate20251219 from './fa.ttf';

export default function App() {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Create @font-face with the imported blob URL
    const font = new FontFace('CustomFont', `url(${fontDate20251219})`);

    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
      })
      .catch((error) => {
        console.error('Font failed to load:', error);
      });

    // Cleanup (optional, but good practice)
    return () => {
      document.fonts.delete(font);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const isLargeScreen = window.innerWidth > 768;

  useEffect(() => {
    const handleResize = () => setTime(new Date());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay filter */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust as needed
        }}
      />

      {/* Clock content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100dvh',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isLargeScreen ? 'row' : 'column',
            alignItems: 'center',
            gap: isLargeScreen ? '2vw' : '4vh',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontSize: isLargeScreen ? '15vw' : '20vw',
            fontWeight: 'normal',
            letterSpacing: '0.5vw',
            fontFamily: fontLoaded ? 'CustomFont, sans-serif' : 'sans-serif',
            opacity: fontLoaded ? 1 : 0.8, // Slight visual feedback while loading
            transition: 'opacity 0.3s ease',
          }}
        >
          <div style={{ display: 'flex' }}>
            <span>{hours[0]}</span>
            <span>{hours[1]}</span>
          </div>
          {!isLargeScreen && <div style={{ height: '2vh' }}></div>}
          <div style={{ display: 'flex' }}>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
          </div>
          {!isLargeScreen && <div style={{ height: '2vh' }}></div>}
          <div style={{ display: 'flex' }}>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}