import React, { useEffect, useState } from 'react';

// Asset URLs
const one = new URL('../../assets/clocks/26-01-03/1.webp', import.meta.url).href;
const two = new URL('../../assets/clocks/26-01-03/2.webp', import.meta.url).href;
const three = new URL('../../assets/clocks/26-01-03/3.webp', import.meta.url).href;
const four = new URL('../../assets/clocks/26-01-03/4.webp', import.meta.url).href;
const five = new URL('../../assets/clocks/26-01-03/5.webp', import.meta.url).href;
const six = new URL('../../assets/clocks/26-01-03/6.webp', import.meta.url).href;
const seven = new URL('../../assets/clocks/26-01-03/7.webp', import.meta.url).href;
const eight = new URL('../../assets/clocks/26-01-03/8.webp', import.meta.url).href;
const nine = new URL('../../assets/clocks/26-01-03/9.webp', import.meta.url).href;
const ten = new URL('../../assets/clocks/26-01-03/10.webp', import.meta.url).href;
const eleven = new URL('../../assets/clocks/26-01-03/11.webp', import.meta.url).href;
const twelve = new URL('../../assets/clocks/26-01-03/12.webp', import.meta.url).href;

const pageBackground = new URL('../../assets/clocks/26-01-03/swi.jpg', import.meta.url).href;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // State for the background flicker
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  // Clock movement
  useEffect(() => {
    let raf;
    const tick = () => {
      setTime(new Date());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Smoother, less frequent flicker logic
  useEffect(() => {
    let timeoutId;

    const triggerFlicker = () => {
      // 50/50 chance of being dark/light
      setOverlayOpacity(Math.random() > 0.7 ? 0.9 : 0);

      // Frequency: Longer delays (300ms to 1000ms) for a less frantic feel
      const nextDelay = 300 + Math.random() * 700;
      timeoutId = setTimeout(triggerFlicker, nextDelay);
    };

    triggerFlicker();
    return () => clearTimeout(timeoutId);
  }, []);

  // Asset Preloading
  useEffect(() => {
    const sources = [one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, pageBackground];
    let loaded = 0;
    sources.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        setLoadingProgress(Math.round((loaded / sources.length) * 100));
        if (loaded === sources.length) setTimeout(() => setIsLoaded(true), 200);
      };
    });
  }, []);

  if (!isLoaded) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#000', fontFamily: 'sans-serif' }}>
        Loading… {loadingProgress}%
      </div>
    );
  }

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const clockSize = '90vh';
  const numberSize = '12vh';
  const radius = '32vmin';

  const numbers = [
    { src: twelve, angle: 0 }, { src: one, angle: 30 }, { src: two, angle: 60 },
    { src: three, angle: 90 }, { src: four, angle: 120 }, { src: five, angle: 150 },
    { src: six, angle: 180 }, { src: seven, angle: 210 }, { src: eight, angle: 240 },
    { src: nine, angle: 270 }, { src: ten, angle: 300 }, { src: eleven, angle: 330 },
  ];

  const handStyle = (width, height, color, deg, zIndex) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: width,
    height: height,
    backgroundColor: color,
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex: zIndex,
    boxShadow: '0 0 15px 5px rgba(0,0,0,0.3)',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}>
      
      {/* 1. Background Image Layer */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: `url(${pageBackground})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1 
      }} />

      {/* 2. Smoother Gradient Overlay: Darker in middle, fading to black/neutral */}
      <div style={{
        position: 'absolute',
        inset: 0,
        // Radial gradient: Darkest (80% black) in the center, slightly lighter at edges
        background: 'radial-gradient(circle, rgb(0, 0, 0) 0%, rgba(4, 12, 62, 0.8) 100%)',
        opacity: overlayOpacity,
        // Longer transition for a "smooth" light-dimming effect
        transition: 'opacity 0.4s ease-in-out', 
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* 3. Clock Face Layer */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        <div style={{ width: clockSize, height: clockSize, position: 'relative' }}>
          
          {numbers.map(({ src, angle }, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <img
                key={i}
                src={src}
                alt=""
                style={{
                  position: 'absolute',
                  width: numberSize,
                  height: numberSize,
                  left: `calc(50% + ${radius} * ${Math.sin(rad)} - ${numberSize} / 2)`,
                  top: `calc(50% - ${radius} * ${Math.cos(rad)} - ${numberSize} / 2)`,
                  opacity: 1, 
                  filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.8))',
                }}
              />
            );
          })}

          <div style={handStyle('1.5vmin', '25vmin', '#fff', hours * 30, 10)} />
          <div style={handStyle('1vmin', '35vmin', '#eee', minutes * 6, 11)} />
          <div style={handStyle('0.5vmin', '40vmin', '#EBE7E7', seconds * 6, 12)} />

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2.5vmin',
            height: '2.5vmin',
            backgroundColor: '#fff',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15
          }} />
        </div>
      </div>
    </div>
  );
};

export default Clock;