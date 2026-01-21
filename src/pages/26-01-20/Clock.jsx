import React, { useEffect, useState } from 'react';
import bgImage from '../../assets/clocks/26-01-20/hairdo.webp';
import d250916font from '../../assets/fonts/26-01-20-hairdo.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768);

  const digitToLetter = {
    '0': 'B', '1': 'V', '2': 'A', '3': 'X', '4': 'D',
    '5': 'Q', '6': 'M', '7': 'G', '8': 'H', '9': 'T'
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'MyD250916font';
        src: url(${d250916font}) format('truetype');
        font-display: block;
      }
    `;
    document.head.appendChild(style);

    const fontPromise = document.fonts.ready;
    const img = new Image();
    img.src = bgImage;
    const imagePromise = new Promise((res) => {
      img.onload = res;
      img.onerror = res;
    });

    Promise.all([fontPromise, imagePromise]).then(() => setIsLoaded(true));
    return () => { if(document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hours = String(((time.getHours() + 11) % 12) + 1).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // --- STYLES ---

  const containerStyle = {
    position: 'relative',
    height: '100dvh',
    width: '100vw',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  };

  const backgroundLayerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'brightness(0.6) contrast(1.6) saturate(1.3)', 
    zIndex: 1
  };

  const gradientLayerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    // --- RESTRICT TO TOP THIRD ---
    height: '66dvh', 
    background: `linear-gradient(to bottom, rgba(73, 74, 6, 0.81), rgba(0, 0, 0, 0))`,
    zIndex: 1.5,
    pointerEvents: 'none'
  };

  const clockContentStyle = {
    position: 'relative',
    zIndex: 2,
    display: 'flex', 
    flexDirection: isLargeScreen ? 'row' : 'column',
    gap: isLargeScreen ? '1vw' : '15px', 
    alignItems: 'center',
    justifyContent: 'center'
  };

const digitBoxStyle = {
    fontFamily: "'MyD250916font', sans-serif",
    fontSize: isLargeScreen ? '30vh' : '20vh',
    color: '#B80A0A',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '0.8em',
    lineHeight: isLargeScreen ? '1.2' : '0.7',
    textAlign: 'center',
    // --- UPDATED SHADOW STRATEGY ---
    filter: 'drop-shadow(0px 0px 15px rgb(255, 255, 255))',
    // Optional: Keep a small text-shadow for a sharper core glow
    textShadow: '0 0 5px #FFFFFF' 
  };

  const renderUnit = (value) => (
    <div style={{ display: 'flex', gap: '2px', lineHeight: isLargeScreen ? '1.2' : '0.7' }}>
      {value.split('').map((digit, i) => (
        <div key={i} style={digitBoxStyle}>
          {digitToLetter[digit] || digit}
        </div>
      ))}
    </div>
  );

  if (!isLoaded) {
    return <div style={{...containerStyle, backgroundColor: '#f0f0f0'}}>Loading...</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={backgroundLayerStyle} />
      <div style={gradientLayerStyle} />
      <div style={clockContentStyle}>
        {renderUnit(hours)}
        {renderUnit(minutes)}
        {renderUnit(seconds)}
      </div>
    </div>
  );
};

export default Clock;