import React, { useState, useEffect, useRef } from 'react';
import busterImg from '../../../assets/clocks/26-02-05/buster.webp';
import hand1Img from '../../../assets/clocks/26-02-05/hand1.webp';
import hand2Img from '../../../assets/clocks/26-02-05/hand2.webp';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

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
  };

  const clockFaceStyle = {
    position: 'relative',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
  };

  // Helper for centering and rotating hands
  const handStyle = (height, width, image, angle) => ({
    position: 'absolute',
    bottom: '50%', // Starts at center
    left: '50%',
    width: `${width}px`,
    height: `${height}px`,
    backgroundImage: `url(${image})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
filter: 'saturate(1.2) contrast(1.8) brightness(1.2)  drop-shadow(2px 2px 8px rgba(20, 35, 80, 0.87))',
    marginLeft: `-${width / 2}px`, // Horizontally centers hand
    transformOrigin: 'bottom center',
    transform: `rotate(${angle}deg)`,
    // Removed transition for second hand to keep animation smooth via RAF
  });


  return (
    <div style={containerStyle}>
      <div style={clockFaceStyle}>
     
        <div style={handStyle(110, 40, hand1Img, hourAngle)} />
        <div style={handStyle(200, 50, hand2Img, minuteAngle)} />
  
        
   
      </div>
    </div>
  );
};

export default AnalogClock;