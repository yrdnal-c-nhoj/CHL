import React, { useState, useEffect } from 'react';

// Asset imports
import clockDigitImage from '../../../assets/clocks/26-01-23/eye.gif';
import clockBackground from '../../../assets/clocks/26-01-23/eye.webp';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let animationFrame;
    const update = () => {
      setTime(new Date());
      animationFrame = requestAnimationFrame(update);
    };
    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Calculate time values including milliseconds for smooth movement
  const ms = time.getMilliseconds();
  const seconds = time.getSeconds() + ms / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() + minutes / 60;

  // Rotations
  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360;
  const hourDeg = ((hours % 12) / 12) * 360;

  // Background rotation: Counter-clockwise (-), once per 60 seconds
  const bgRotation = -(seconds / 60) * 360;

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0D0D0E',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    },
   clockFace: {
  position: 'relative',
  // Takes up the smaller of the two viewport dimensions
  width: '95vmin', 
  // Keeps it a perfect circle regardless of content
  aspectRatio: '1 / 1', 
  // Caps the size so it doesn't get comically large on monitors
  maxWidth: '800px', 
  
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // Optional: ensures it stays centered if the parent is larger
  margin: 'auto', 
},
    bgLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${clockBackground})`,
      backgroundSize: '60%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      transform: `rotate(${bgRotation}deg)`,
      willChange: 'transform',
      zIndex: 1,
    },
    hand: (deg, width, length, color, zIndex) => ({
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      transformOrigin: 'bottom',
      transform: `translateX(-50%) rotate(${deg}deg)`,
      width: width,
      height: length,
      backgroundColor: color,
      borderRadius: '10px',
      zIndex: zIndex,
      filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.79))',
    }),
    digitContainer: (rotation) => ({
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: `rotate(${rotation}deg)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      zIndex: 2,
    }),
    digitImage: {
      width: 'min(12vw, 12vh, 48px)',
      height: 'min(12vw, 12vh, 48px)',
      objectFit: 'contain',
      transform: `translateY(-20%)`, 
    },
    centerDot: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 'clamp(12px, 4vw, 18px)',
      height: 'clamp(12px, 4vw, 18px)',
      backgroundColor: '#f8fafc',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.88)',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.clockFace}>
        
        {/* Rotating Background Layer */}
        <div style={styles.bgLayer} />

        {/* Static Digits Layer */}
        {[...Array(12)].map((_, i) => {
          const rotation = (i + 1) * 30;
          return (
            <div key={i} style={styles.digitContainer(rotation)}>
              <img 
                src={clockDigitImage} 
                alt={`digit-${i + 1}`} 
                style={styles.digitImage} 
              />
            </div>
          );
        })}

        {/* Hands */}
        <div style={styles.hand(hourDeg, '8px', '11%', '#ffffff', 3)} />
        <div style={styles.hand(minDeg, '5px', '25%', '#cbd5e1', 4)} />
        <div style={styles.hand(secDeg, '2px', '25%', '#ef4444', 5)} />
        
        {/* Center Pivot */}
        <div style={styles.centerDot} />
      </div>
    </div>
  );
};

export default Clock;