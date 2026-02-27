import React, { useState, useEffect } from 'react';
import cocteauVideo from '../../../assets/images/26-02/26-02-25/cocteau.mp4';
import starWebp from '../../../assets/images/26-02/26-02-25/star.webp';

const CocteauClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  // Cocteau-esque styles
  const handStyle = (length, width, color, angle, isSecond = false) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: width,
    height: length,
    backgroundColor: color,
    // Slightly tapered/organic look
    borderRadius: '50% 50% 2px 2px',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    transformOrigin: '50% 100%',
    filter: 'url(#cocteau-line)', // Applies the "hand-drawn" wobble
    transition: isSecond ? 'none' : 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
    zIndex: isSecond ? 15 : 12,
  });

  return (
    <div style={{
      width: '100vw', height: '100dvh', position: 'relative',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    //   backgroundColor: '#f4f1ea' // Parchment background
    }}>
      {/* Background Video */}
      <video
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.9, zIndex: 1
        }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={cocteauVideo} type="video/mp4" />
      </video>

      {/* SVG Filters (The Secret Sauce) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="cocteau-line">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>

      {/* Clock Face */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: 'min(75vw, 75vh)', height: 'min(75vw, 75vh)',
        borderRadius: '52% 48% 51% 49% / 49% 52% 48% 51%', // Organic circle
        // border: '5px solid #E4E9E4',
              filter: 'url(#cocteau-line)',
        opacity: 0.7,
      }}>
        
        {/* The Cocteau Star (12 o'clock) */}
        <div style={{
          position: 'absolute', top: '15px', left: '50%',
          transform: 'translateX(-50%)', width: '40px', height: '40px',
          backgroundImage: `url(${starWebp})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }} />


      

        {/* Hands */}
        <div style={handStyle('26%', '8px', '#F7F6F6', hourAngle)} />
        <div style={handStyle('42%', '7px', '#F1EFEF', minuteAngle)} />
        <div style={handStyle('46%', '5px', '#E6DE3F', secondAngle, true)} />
      </div>

   
    </div>
  );
};

export default CocteauClock;