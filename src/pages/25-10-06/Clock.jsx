import React, { useState, useEffect } from 'react';
import font20251006 from './shado.ttf'; 

export default function DigitalClock() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const [shadowAngle, setShadowAngle] = useState(0);

  // Inject font-face
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'ClockFont';
        src: url(${font20251006}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Load font explicitly
  useEffect(() => {
    const font = new FontFace('ClockFont', `url(${font20251006})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    });
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate shadow rotation
  useEffect(() => {
    let animationFrameId;
    const startTime = performance.now();
    const updateShadow = (currentTimeMs) => {
      const elapsedSeconds = (currentTimeMs - startTime) / 1000;
      const angle = -((elapsedSeconds % 60) * 6); // Counterclockwise
      setShadowAngle(angle);
      animationFrameId = requestAnimationFrame(updateShadow);
    };
    animationFrameId = requestAnimationFrame(updateShadow);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!fontLoaded) {
    return (
      <div
        style={{
          height: '100dvh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
          color: 'white',
          fontSize: '2.5rem',
          fontFamily: 'sans-serif',
        }}
      >
        Loading...
      </div>
    );
  }

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const radians = (shadowAngle * Math.PI) / 180;

  // --- Modified shadow logic ---
  const shadowLayers = 14; // fewer, more spaced
  const textShadows = Array.from({ length: shadowLayers }, (_, i) => {
    // 3px shadow + 9px gap pattern = 12px spacing per step
    const distance = i * 12 + 3;
    const x = -Math.cos(radians) * distance;
    const y = -Math.sin(radians) * distance;

    // progress along the stack
    const progress = i / (shadowLayers - 1);

    let color = '#EB0DA9FF';
    if (progress > 0.85 && progress < 0.98) {
      const redIntensity = Math.floor(128 + (progress - 0.85) * 800);
      color = `rgb(${redIntensity},0,0)`;
    } else if (progress >= 0.98) {
      color = '#E9CF06FF';
    }

    return `${x}px ${y}px 0 ${color}`;
  }).join(', ');

  const styles = {
    root: {
      height: '100dvh',
      width: '100vw',
      backgroundImage: `
        radial-gradient(rgb(96, 137, 39) 30.8%, transparent 30.8%),
        radial-gradient(rgb(0, 0, 0) 30.8%, transparent 30.8%)
      `,
      backgroundPosition: '4px 4px, 3.6px 4.4px',
      backgroundSize: '8px 8px',
      backgroundColor: 'rgb(131, 159, 7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    timeWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    time: {
      fontFamily: 'ClockFont, sans-serif',
      fontSize: '88px',
      color: '#C40D53FF',
      textShadow: textShadows,
      letterSpacing: '3vh',
      textAlign: 'center',
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.root}>
      <div style={styles.timeWrapper}>
        <div style={styles.time}>
          {displayHours}:{displayMinutes}
        </div>
      </div>
    </div>
  );
}
