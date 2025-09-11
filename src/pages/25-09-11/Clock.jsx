import React, { useState, useEffect } from 'react';
import medievalFont from './ren.ttf';
import backgroundImage from './ren.jpg';
import MedievalSVG from './MedievalSVG';

const MedievalBanner = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = (date.getHours() % 12 || 12).toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return { hours, minutes };
  };

  const { hours, minutes } = formatTime(time);

  const fontFaceStyle = `
    @font-face {
      font-family: 'ClockFont';
      src: url(${medievalFont}) format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: fontFaceStyle }} />

      {/* Background */}


{/* Background */}
<div
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1,
    // Add filters and horizontal flip
    filter: 'brightness(1.7) saturate(0.1)',
    transform: 'scaleX(-1)', // flips image horizontally
  }}
/>




      {/* Medieval SVG */}
      <div style={{ position: 'absolute', top: -60, left: 0, width: '100vw', height: '125dvh', zIndex: 2 }}>
        <MedievalSVG />
      </div>







{/* Centered Clock */}
<div
  style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'ClockFont, monospace',
    fontSize: '12dvh',
    color: 'gold',
    background: 'linear-gradient(45deg, #FFD700, #FFA500, #FFF8DC)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.1em',
    textShadow: `
      0 0 5px #fff8dc,
      0 0 10px #FFD700,
      0 0 15px #FFA500,
      0 0 20px #FFD700
    `,
    animation: 'sparkle 1.5s infinite alternate',
  }}
>
  {hours}{minutes}
</div>

{/* Add sparkle keyframes */}
<style>
  {`
    @keyframes sparkle {
      0% { text-shadow: 0 0 5px #fff8dc, 0 0 10px #FFD700, 0 0 15px #FFA500, 0 0 20px #FFD700; }
      50% { text-shadow: 0 0 10px #fff8dc, 0 0 20px #FFD700, 0 0 30px #FFA500, 0 0 40px #FFD700; }
      100% { text-shadow: 0 0 5px #fff8dc, 0 0 10px #FFD700, 0 0 15px #FFA500, 0 0 20px #FFD700; }
    }
  `}
</style>





    </div>
  );
};

export default MedievalBanner;
