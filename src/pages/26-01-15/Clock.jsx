import React, { useEffect, useState, useRef } from 'react';
import overlayBg from "../../assets/clocks/26-01-15/red.gif";
import baseBg from "../../assets/clocks/26-01-15/sph.gif";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const requestRef = useRef();

  // Animation loop for smooth movement (60fps+)
  const animate = () => {
    setTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Calculate rotations
  const ms = time.getMilliseconds();
  const sec = time.getSeconds() + ms / 1000;
  const min = time.getMinutes() + sec / 60;
  const hrs = (time.getHours() % 12) + min / 60;

  // Rotation Values
  const rotations = {
    hour: (360 / 12) * hrs,
    minute: (360 / 60) * min,
  };

  return (
    <main style={styles.wrapper}>
      {/* Base Background Layer */}
      <div style={styles.baseBackground} />
      
      {/* Red Overlay */}
      <div style={styles.redOverlay} />
      
      {/* Animated Overlay */}
      <div style={styles.gifOverlay} />

      {/* Clock Face */}
      <div style={styles.clockContainer}>
        <Hand type="hour" rotation={rotations.hour} />
        <Hand type="minute" rotation={rotations.minute} />
      </div>
    </main>
  );
};

// Sub-component for cleaner JSX
const Hand = ({ type, rotation }) => {
  const isHour = type === 'hour';
  const handStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '4px',
    backgroundColor: isHour ? '#F20505' : '#FC0404',
    width: isHour ? '1%' : '0.5%',
    height: isHour ? '17%' : '30%',
    zIndex: isHour ? 3 : 2,
    // Combined the centering and the rotation
    transform: `translateX(-50%) rotate(${rotation}deg)`,
    willChange: 'transform', // Optimization for animations
  };

  return <div style={handStyle} />;
};

const styles = {
  wrapper: {
    position: 'relative',
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#000000', // Black background behind entire component
  },
  baseBackground: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#FF000035', // Solid red
    backgroundImage: `url(${baseBg})`,
    backgroundSize: '35%', // Made the tiles smaller
    backgroundPosition: 'center center', // Centered starting point
    backgroundBlendMode: 'overlay', // Blend the image with the red background
    backgroundRepeat: 'repeat', // Changed to repeat for tiling effect
    zIndex: 1,
    pointerEvents: 'none',
  },

  gifOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#FF000075', // Solid red
    backgroundImage: `url(${overlayBg})`,
    backgroundSize: '50%', // Made the tiles smaller
    backgroundPosition: 'center center', // Centered starting point
    backgroundBlendMode: 'overlay', // Blend the image with the red background
    backgroundRepeat: 'repeat', // Changed to repeat for tiling effect
    zIndex: 2,
    pointerEvents: 'none',
  },
  clockContainer: {
    position: 'relative',
    width: '60vmin',
    height: '60vmin',
    borderRadius: '50%',
    zIndex: 3,
  },
};

export default Clock;
