import React, { useState, useEffect } from 'react';
import backgroundImage from './bg.webp';

const ROTATION_DURATION = 60; // seconds for a full rotation
const ZOOM_MULTIPLIER = 1.5;

const RotatingBackground = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [sideLength, setSideLength] = useState(0);
  const [time, setTime] = useState(new Date());

  // Preload the background image and compute sizes
  useEffect(() => {
    let isMounted = true;
    
    const loadImage = () => {
      const img = new Image();
      img.src = backgroundImage;
      
      img.onload = () => {
        if (isMounted) {
          const computeSize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            const diagonal = Math.sqrt(w * w + h * h) * ZOOM_MULTIPLIER;
            setSideLength(diagonal);
          };
          
          computeSize();
          window.addEventListener('resize', computeSize);
          setIsLoading(false);
          
          return () => window.removeEventListener('resize', computeSize);
        }
      };
      
      img.onerror = () => {
        if (isMounted) {
          console.error('Failed to load background image');
          setIsLoading(false);
        }
      };
    };
    
    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth rotation of background
  useEffect(() => {
    let startTime = null;

    const rotate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000; // seconds
      const angle = (-360 * (elapsed / ROTATION_DURATION)) % 360;
      setRotationAngle(angle);
      requestAnimationFrame(rotate);
    };

    const frameId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Smooth time updates (for second hand)
  useEffect(() => {
    let animationFrameId;

    const update = () => {
      setTime(new Date());
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const viewportContainerStyle = {
    height: '100dvh',
    width: '100vw',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    position: 'relative',
  };

  const rotatingImageStyle = {
    width: sideLength,
    height: sideLength,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${rotationAngle}deg)`,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const clockRadius = 150;
  const tickLength = 10;
  const tickWidth = 2;

  const clockStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${clockRadius * 5}px`,
    height: `${clockRadius * 5}px`,
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    mixBlendMode: 'difference',
    filter: 'saturate(2) brightness(1.5)',
  };

  const handStyle = (length, width, color, angle) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    borderRadius: '2px',
    boxShadow: `0 0 8px ${color}`,
  });

  const hour = time.getHours() % 12;
  const minute = time.getMinutes();
  const second = time.getSeconds() + time.getMilliseconds() / 1000; // smooth seconds

  const hourAngle = (hour + minute / 60) * 30;
  const minuteAngle = (minute + second / 60) * 6;
  const secondAngle = second * 6;

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        {/* Optional: Add a loading spinner or text here if desired */}
      </div>
    );
  }

  return (
    <div style={viewportContainerStyle}>
      <div style={rotatingImageStyle} />
      <div style={clockStyle}>
        {/* Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = i * 6;
          const tickStyle = {
            position: 'absolute',
            width: `${tickWidth}px`,
            height: `${tickLength}px`,
            backgroundColor: 'white',
            top: '50%',
            left: '50%',
            transform: `rotate(${angle}deg) translateY(-${clockRadius}px)`,
            transformOrigin: 'center bottom',
            boxShadow: '0 0 4px white',
          };
          return <div key={i} style={tickStyle} />;
        })}

        {/* Hour hand */}
        <div style={handStyle(clockRadius * 0.5, 6, 'white', hourAngle)} />

        {/* Minute hand */}
        <div style={handStyle(clockRadius * 0.7, 4, 'white', minuteAngle)} />

        {/* Smooth Second hand */}
        <div style={handStyle(clockRadius * 0.9, 2, 'white', secondAngle)} />
      </div>
    </div>
  );
};

export default RotatingBackground;
