import React, { useState, useEffect } from 'react';

// Asset imports
import clockDigitImage from '../../assets/clocks/26-01-22/eye.webp';
// Replace this with your actual background image path
import clockBackground from '../../assets/clocks/26-01-22/eye.webp';

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

  // Calculate rotations
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secDeg = (seconds / 60) * 360;
  const minDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = ((hours % 12 + minutes / 60) / 12) * 360;

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000000',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    },
    clockFace: {
      position: 'relative',
      width: 'min(90vw, 90vh)',
      height: 'min(90vw, 90vh)',
      borderRadius: '50%',
      // Background Image implementation
      backgroundImage: `url(${clockBackground})`,
      backgroundSize: '60%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
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
      // Prevents the "snap back" spin at 60s/0s
      transition: seconds === 0 ? 'none' : 'transform 0.05s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
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
    }),
    digitImage: {
      width: 'min(15vw, 15vh)',
      height: 'min(15vw, 15vh)',
      objectFit: 'contain',
      transform: `translateY(-20%)`, 
    },
    centerDot: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '18px',
      height: '18px',
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
        
        {/* Render 12 digits */}
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
        {/* Hour Hand */}
        <div style={styles.hand(hourDeg, '8px', '25%', '#ffffff', 3)} />
        {/* Minute Hand */}
        <div style={styles.hand(minDeg, '5px', '37%', '#cbd5e1', 4)} />
        {/* Second Hand */}
        <div style={styles.hand(secDeg, '2px', '52%', '#ef4444', 5)} />
        
        {/* Center Pivot */}
        <div style={styles.centerDot} />
      </div>
    </div>
  );
};

export default Clock;