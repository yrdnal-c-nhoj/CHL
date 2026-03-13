import React, { useState, useEffect } from 'react';
import abuVideo from '../../../assets/images/26-02/26-02-27/abu.mp4';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  // Hieratic Numerals (Unicode 108E1 - 108EA)
  const hieraticNumbers = {
    1: '𐣡', 2: '𐣢', 3: '𐣣', 4: '𐣤', 5: '𐣥', 
    6: '𐣦', 7: '𐣧', 8: '𐣨', 9: '𐣩', 10: '𐣪', 
    11: '𐣪𐣡', 12: '𐣪𐣢'
  };

  const getEgyptianNumber = (num) => hieraticNumbers[num] || num.toString();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  const handStyle = (length, width, color, angle, type) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: width,
    height: length,
    backgroundColor: color,
    transform: `translateX(-50%) rotate(${angle}deg)`,
    transformOrigin: 'bottom center',
    zIndex: 12,
    transition: type === 'second' ? 'none' : 'transform 0.5s cubic-bezier(0.4, 2.1, 0.5, 0.5)',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    clipPath: type === 'second' 
      ? 'polygon(50% 0%, 100% 100%, 0% 100%)' 
      : 'polygon(15% 100%, 85% 100%, 100% 20%, 50% 0%, 0% 20%)',
  });

  return (
    <div style={{
      width: '100vw', 
      height: '100dvh', 
      position: 'relative',
      overflow: 'hidden', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#000'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Egyptian+Hieroglyphs&display=swap');
      `}} />
      
      <video
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 1.0, zIndex: 1
        }}
        autoPlay loop muted playsInline
      >
        <source src={abuVideo} type="video/mp4" />
      </video>
  
      {/* Main Clock Container: Maximized to 92% of the viewport to prevent clipping */}
      <div style={{
        position: 'relative', 
        zIndex: 10,
        width: 'min(100vw, 100vh)', 
        height: 'min(100vw, 100vh)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

        {/* --- NUMERALS --- */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const rotation = i * 30;
          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                // Using a percentage of the container size keeps them inside the circle
                height: '100%', 
                width: '60vw',
                textAlign: 'center',
                transform: `rotate(${rotation}deg)`,
                fontFamily: "'Noto Sans Egyptian Hieroglyphs', 'Peralta', sans-serif",
                color: '#E2C264',
                fontSize: 'clamp(2rem, 6vw, 4rem)', // Responsive font size
                opacity: 0.6,
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                pointerEvents: 'none'
              }}
            >
              <div style={{ transform: `rotate(-${rotation}deg)` }}>
                {getEgyptianNumber(num)}
              </div>
            </div>
          );
        })}
        
        {/* --- CLOCK HANDS (Reverted to 0.2 opacity) --- */}

        {/* Hour Hand */}
        <div style={{...handStyle('28%', '16px', '#E2C264', hourAngle, 'hour'), opacity: 0.2}}>
            <div style={{
                position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                width: '24px', height: '24px', border: '4px solid #E2C264', borderRadius: '50%'
            }} />
        </div>

        {/* Minute Hand */}
        <div style={{...handStyle('42%', '10px', '#E2C264', minuteAngle, 'minute'), opacity: 0.2}} />

        {/* Second Hand */}
        <div style={{...handStyle('48%', '3px', '#E2C264', secondAngle, 'second'), opacity: 0.2}} />

        {/* Center Pin */}
        <div style={{
          position: 'absolute',
          width: '28px', height: '28px',
          background: 'radial-gradient(circle, #F3F2EB 0%, #E2C264 40%, #86641A 100%)',
          borderRadius: '50%',
          zIndex: 25,
          border: '1px solid rgba(0,0,0,0.5)',
          boxShadow: '0 0 15px rgba(226, 194, 100, 0.6)'
        }} />

     

      </div>
    </div>
  );
};

export default Clock;