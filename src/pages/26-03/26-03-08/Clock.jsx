import React, { useState, useEffect } from 'react';
import hand1Img from '/src/assets/images/26-03/26-03-08/hand2.png';
import hand2Img from '/src/assets/images/26-03/26-03-08/hand1.webp';
import handImg from '/src/assets/images/26-03/26-03-08/hand.webp';
import dragonFont from '/src/assets/fonts/26-03-08-dragon.ttf';
import dragonVideo from '/src/assets/images/26-03/26-03-08/dragon1.mp4';

// Add font-face CSS
const fontFace = `
  @font-face {
    font-family: 'Dragon';
    src: url(${dragonFont}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Inject font-face CSS
    const style = document.createElement('style');
    style.textContent = fontFace;
    document.head.appendChild(style);
    
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
      document.head.removeChild(style);
    };
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculation for smooth movement or standard stepping
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = (minutes * 6) + (seconds * 0.1);
  const secondAngle = seconds * 6;

  // Generate numbers 1-12 using dragon font
  const clockNumbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30) - 90;
    const radian = (angle * Math.PI) / 180;
    const x = 50 + 40 * Math.cos(radian);
    const y = 50 + 40 * Math.sin(radian);
    
    clockNumbers.push(
      <div key={i} style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
        fontFamily: `'Dragon', serif`,
        fontSize: '5rem',
        color: '#83EF907F',
        // textShadow: '0 0 12px rgba(131,239,144,0.7)',
        userSelect: 'none',
        // fontWeight: 'bold'
      }}>{i}</div>
    );
  }

  // Helper for Hand Styles (Vertical Orientation)
  const getHandStyle = (angle, width, height, zIndex, shadow) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${height}px`,
    // pivot from the bottom center because image points up
    transformOrigin: 'bottom center',
    // translate -50% (X) to center width, -100% (Y) to put bottom on center pin
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    filter: `drop-shadow(${shadow}) saturate(0.2)`,
    zIndex,
    transition: seconds === 0 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
  });

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
    }}>
      {/* Background Video */}
      <video autoPlay loop muted playsInline style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        objectFit: 'fill', zIndex: 0,
        transform: 'scaleX(-1)',
        filter: 'hue-rotate(-30deg) saturate(1.5) contrast(1.4) brightness(1.2)',
      }}>
        <source src={dragonVideo} type="video/mp4" />
      </video>

      {/* Clock Face Container */}
      <div style={{
        position: 'relative',
        width: '520px',
        height: '520px',
        zIndex: 1,
        opacity: 0.9,
      }}>
        

        {/* Numbers */}
        {clockNumbers}

        {/* Hands - Adjust height to prevent clipping container edges */}
        <img 
          src={hand2Img} 
          alt="Hour" 
          style={getHandStyle(hourAngle, 70, 160, 5, '0 0 8px rgba(200,180,100,0.8)')} 
        />
        <img 
          src={hand1Img} 
          alt="Minute" 
          style={getHandStyle(minuteAngle, 60, 190, 4, '0 0 6px rgba(180,200,255,0.7)')} 
        />
        <img 
          src={handImg} 
          alt="Second" 
          style={getHandStyle(secondAngle, 50, 200, 3, '0 0 5px rgba(255,50,50,0.9)')} 
        />
      </div>
    </div>
  );
};

export default Clock;