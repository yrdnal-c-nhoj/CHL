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

  const egyptianNumbers = {
    1: '𓏺', 2: '𓏻', 3: '𓏼', 4: '𓏽', 5: '𓏾', 6: '𓏿', 7: '𓐀', 8: '𓐁', 9: '𓐂', 10: '𓎆', 11: '𓎆𓏺', 12: '𓎆𓏻'
  };

  const getEgyptianNumber = (num) => egyptianNumbers[num] || num.toString();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  /**
   * Enhanced Egyptian Hand Styling
   * - Uses clip-path for "Spear/Scepter" shapes
   * - Adds a "heavy" transition for a mechanical feel
   */
  const handStyle = (length, width, color, angle, type) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: width,
    height: length,
    backgroundColor: color,
    transform: `translateX(-50%) rotate(${angle}deg)`,
    transformOrigin: 'bottom center',
    filter: 'url(#cocteau-line)',
    zIndex: 12,
    transition: type === 'second' ? 'none' : 'transform 0.5s cubic-bezier(0.4, 2.1, 0.5, 0.5)',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    // Shape logic: Tapered for minutes, looped for hours
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
        @font-face {
          font-family: 'Peralta';
          src: url('/src/assets/fonts/Peralta-Regular.ttf') format('truetype');
        }
      `}} />
      
      {/* Background Video (Untouched) */}
      <video
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 1.0, zIndex: 1
        }}
        autoPlay loop muted playsInline
      >
        <source src={abuVideo} type="video/mp4" />
      </video>
      
      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="cocteau-line">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>
      
      <div style={{
        position: 'relative', 
        zIndex: 10,
        width: 'min(75vw, 75vh)', 
        height: 'min(75vw, 75vh)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        


        {/* Egyptian Numerals */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const rotation = i * 30;
          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                height: '130%', 
                width: '30px',
                textAlign: 'center',
                transform: `rotate(${rotation}deg)`,
                fontFamily: "'Peralta', sans-serif",
                color: '#E2C264', // Golden hue
                fontSize: '5vh',
                opacity: 0.8,
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
        
        {/* --- CLOCK HANDS --- */}

        {/* Hour Hand: The "Was-Scepter" Inspired (Egyptian Blue/Turquoise) */}
        <div style={{...handStyle('28%', '16px', '#E2C264', hourAngle, 'hour'), opacity: 0.2}}>
            {/* Symbolic "Ankh" loop for the hour hand tip */}
            <div style={{
                position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                width: '24px', height: '24px', border: '4px solid #E2C264', borderRadius: '50%'
            }} />
        </div>

        {/* Minute Hand: The "Spear" (Burnished Gold) */}
        <div style={{...handStyle('42%', '10px', '#E2C264', minuteAngle, 'minute'), opacity: 0.2}} />

        {/* Second Hand: The "Needle" (Limestone White) */}
        <div style={{...handStyle('48%', '3px', '#E2C264', secondAngle, 'second'), opacity: 0.2}} />

        {/* Center Pin: The Sun Disc of Ra */}
        <div style={{
          position: 'absolute',
          width: '28px', height: '28px',
          background: 'radial-gradient(circle, #F3F2EB 0%, #E2C264 40%, #86641A 100%)',
          borderRadius: '50%',
          zIndex: 25,
          border: '1px solid rgba(0,0,0,0.5)',
          boxShadow: '0 0 15px rgba(226, 194, 100, 0.6)',
          // opacity: 0.9
        }} />

        {/* Decorative Inner Ring */}
        <div style={{
            position: 'absolute',
            width: '15%', height: '15%',
            border: '1px dashed rgba(226, 194, 100, 0.12)',
            borderRadius: '50%',
            zIndex: 5
        }} />

      </div>
    </div>
  );
};

export default Clock;