import React, { useState, useEffect, useMemo } from 'react';
import './Clock.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute values once per second
  const { digits, rotation } = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    
    return {
      digits: [h[0], h[1], m[0], m[1], s[0], s[1]],
      rotation: (time.getSeconds() / 60) * 360,
    };
  }, [time]);

  return (
    <>
      {/* High-Performance SVG Shadow Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="deep-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
          <feOffset dx="0" dy="0" result="offsetBlur" />
          <feFlood floodColor="rgba(0,0,0,1)" result="color" />
          <feComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
          
          {/* Layering for extreme length and darkness */}
          <feMorphology operator="dilate" radius="5" in="shadow" result="expandedShadow" />
          <feGaussianBlur in="expandedShadow" stdDeviation="40" result="finalBlur" />
          
          <feMerge>
            <feMergeNode in="finalBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <div style={styles.container}>
        <div style={styles.wrapper}>
          {digits.map((digit, i) => (
            <div 
              key={i} 
              style={{ 
                ...styles.digitBox, 
                transform: `rotate(${rotation}deg)` 
              }}
            >
              <span style={styles.text}>{digit}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: '100dvh',
    background: 'radial-gradient(circle at center, rgba(221, 131, 131, 0) 0%, rgba(221, 131, 131, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    border: '5px solid #000',
    boxSizing: 'border-box',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'baseline',
  },
  digitBox: {
    display: 'inline-block',
    width: '11vw', // Responsive baseline
    textAlign: 'center',
    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', // Snappy rotation
    willChange: 'transform',
    zIndex: 2,
  },
  text: {
    fontFamily: '"26-03-15-shadow", "Avant Garde", "Century Gothic", sans-serif',
    color: '#DD8383',
    fontSize: '36vw',
    margin: 0,
    filter: 'url(#deep-shadow)', // Applying the SVG filter here
    lineHeight: 1,
  }
};

export default Clock;