import React, { useMemo, useState, useEffect } from 'react';
import pano260127font from "../../../assets/fonts/26-01-27-pan.ttf";

/**
 * Panorama Component
 * Creates a seamless, infinite horizontal scroll using a single tileable image.
 */
const Panorama = () => {
  // Replace this with your seamless panoramic image source
  const imageUrl = "../../../src/assets/clocks/26-01-27/pan.jpg";
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const font = new FontFace("pan", `url(${pano260127font})`);
    font.load().then(() => {
      document.fonts.add(font);
    });
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes}${ampm}`;
  };

  const styles = useMemo(() => ({
    wrapper: {
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    // The track moves left. Once it hits -50%, it resets to 0% instantly.
    // Since the image is tileable, the reset is invisible.
    track: {
      display: 'flex',
      flexDirection: 'row',
      width: 'fit-content',
      height: '100%',
      willChange: 'transform',
      animation: 'pan-scroll 60s linear infinite',
    },
    image: {
      height: '100dvh',
      width: 'auto', // Keeps the original aspect ratio
      minWidth: '101vw', // Slight overlap to prevent sub-pixel gaps
      display: 'block',
      objectFit: 'cover',
      flexShrink: 0,
      pointerEvents: 'none',
      userSelect: 'none',
    },
    clockContainer: {
      position: 'fixed',
      bottom: '20px',
      left: '0',
      width: '100%',
      display: 'flex',
      gap: '20px',
      zIndex: 10,
      animation: 'scroll-clocks 20s linear infinite',
    },
    digitalClock: {
      fontFamily: "'pan', sans-serif",
      fontSize: '12vh',
      color: '#0DBEC1',
      textShadow: '0 -1px 0 white, 0 1px 0 white',
    },
  }), []);

  return (
    <div style={styles.wrapper}>
      {/* Injecting the keyframes directly. 
        Moving to -50% works because we have two identical images.
      */}
      <style>
        {`
          @keyframes pan-scroll {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes scroll-clocks {
            from { transform: translate3d(-100%, 0, 0); }
            to { transform: translate3d(0, 0, 0); }
          }
          body, html { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            width: 100%; 
            height: 100%; 
          }
        `}
      </style>

      <div style={styles.track}>
        <img 
          src={imageUrl} 
          style={styles.image} 
          alt="Panoramic view part A" 
          loading="eager"
        />
        <img 
          src={imageUrl} 
          style={styles.image} 
          alt="Panoramic view part B" 
          aria-hidden="true"
          loading="eager"
        />
      </div>
      
      {/* Digital Clock Display - continuous scrolling at bottom */}
      <div style={styles.clockContainer}>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
        <div style={styles.digitalClock}>{formatTime(time)}</div>
      </div>
    </div>
  );
};

export default Panorama;