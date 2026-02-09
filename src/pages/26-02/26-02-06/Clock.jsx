import React, { useState, useEffect, useRef } from 'react';
import busterImg from '../../../assets/clocks/26-02-05/buster.webp';
import hand1Img from '../../../assets/clocks/26-02-05/hand1.webp';
import hand2Img from '../../../assets/clocks/26-02-05/hand2.webp';

const Analog260205Clock = () => {
  const [time, setTime] = useState(new Date());
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    // Preload images to prevent FOUC
    const preloadImages = async () => {
      try {
        await Promise.all([
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = busterImg;
            img.onload = resolve;
            img.onerror = reject;
          }),
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = hand1Img;
            img.onload = resolve;
            img.onerror = reject;
          }),
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = hand2Img;
            img.onload = resolve;
            img.onerror = reject;
          })
        ]);
        setImagesLoaded(true);
      } catch (error) {
        console.warn('Some images failed to load:', error);
        setImagesLoaded(true); // Show content even if images fail
      }
    };

    preloadImages();
  }, []);

  const animate = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ms = time.getMilliseconds();
  
  const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
  const hourAngle = ((hours + minutes / 60) / 12) * 360;

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    backgroundImage: `url(${busterImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    margin: 0,
    overflow: 'hidden',
    opacity: imagesLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in',
    visibility: imagesLoaded ? 'visible' : 'hidden', // Prevent FOUC for images
  };

  const clockFaceStyle = {
    position: 'relative',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
  };
const handStyle = (height, width, image, angle) => {
  // Define how much of the hand should hang over the center point (in pixels)
  const overlap = 5; 
  
  // Calculate skew based on angle - more skew when pointing up (taller/narrower)
  const skewAmount = Math.sin((angle * Math.PI) / 180) * 15; // Max 15px skew
  
  return {
    position: 'absolute',
    bottom: '50%', 
    left: '50%',
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: `url(${image})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    filter: 'saturate(1.2) contrast(1.8) brightness(1.2) drop-shadow(2px 2px 8px rgba(20, 35, 80, 0.87))',
    marginLeft: `-${width / 2}px`,
    
    /* 1. Change origin to account for the overlap 
       2. Rotate first, then translate downward 
       3. Add skew transformation for perspective effect
    */
    transformOrigin: `center ${height - overlap}px`,
    transform: `rotate(${angle}deg) translateY(${overlap}px) skewY(${skewAmount}deg)`,
  };
};


  return (
    <div style={containerStyle}>
      <div style={clockFaceStyle}>
     
        <div style={handStyle(110, 40, hand1Img, hourAngle, 5)} />
        <div style={handStyle(200, 50, hand2Img, minuteAngle, 8)} />
  
        
   
      </div>
    </div>
  );
};

export default Analog260205Clock;