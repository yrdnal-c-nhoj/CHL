import React, { useEffect, useState, useMemo } from 'react';

// Asset URLs
const ASSETS = {
  numbers: [
    new URL('../../assets/clocks/26-01-02/12.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/1.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/2.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/3.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/4.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/5.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/6.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/7.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/8.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/9.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/10.webp', import.meta.url).href,
    new URL('../../assets/clocks/26-01-02/11.webp', import.meta.url).href,
  ],
  background: new URL('../../assets/clocks/26-01-02/swi.jpg', import.meta.url).href
};

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [flickeringNumbers, setFlickeringNumbers] = useState({});

  // Unified Scaling Constants (All in vmin)
  const CLOCK_SIZE = 85;   // Total diameter of clock area
  const NUMBER_SIZE = 12;  // Size of the number images
  const RADIUS = 35;       // Distance from center to number center

  // 1. Smooth Clock Movement
  useEffect(() => {
    let raf;
    const tick = () => {
      setTime(new Date());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 2. Flickering Logic
  useEffect(() => {
    let timeoutId;
    const flicker = () => {
      const newFlickerState = {};
      for (let i = 0; i < 12; i++) {
        newFlickerState[i] = Math.random() > 0.25; // 75% chance visible
      }
      setFlickeringNumbers(newFlickerState);
      
      const nextDelay = 80 + Math.random() * 250;
      timeoutId = setTimeout(flicker, nextDelay);
    };

    flicker();
    return () => clearTimeout(timeoutId);
  }, []);

  // 3. Asset Preloading
  useEffect(() => {
    const sources = [...ASSETS.numbers, ASSETS.background];
    let loadedCount = 0;

    sources.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / sources.length) * 100));
        if (loadedCount === sources.length) {
          setTimeout(() => setIsLoaded(true), 300);
        }
      };
    });
  }, []);

  // Time calculations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  // Hand Style Helper
  const getHandStyle = (width, height, color, deg, zIndex) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}vmin`,
    height: `${height}vmin`,
    backgroundColor: color,
    borderRadius: '1vmin',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex: zIndex,
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    transition: deg === 0 ? 'none' : 'transform 0.05s linear', // Prevents snap-back at 12
  });

  if (!isLoaded) {
    return (
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#000', fontFamily: 'sans-serif' }}>
        LOADING {loadingProgress}%
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      overflow: 'hidden', 
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      {/* Background Layer */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: `url(${ASSETS.background})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        zIndex: 1,
        opacity: 0.8
      }} />

      {/* Clock Face Container */}
      <div style={{ 
        width: `${CLOCK_SIZE}vmin`, 
        height: `${CLOCK_SIZE}vmin`, 
        position: 'relative', 
        zIndex: 5,
        // Optional: border for debugging centering
        // border: '1px solid rgba(255,255,255,0.1)',
        // borderRadius: '50%'
      }}>
        
        {/* Numbers */}
        {ASSETS.numbers.map((src, i) => {
          const angle = i * 30; // 0, 30, 60...
          const rad = (angle * Math.PI) / 180;
          const isVisible = flickeringNumbers[i] !== false;
          
          return (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                position: 'absolute',
                width: `${NUMBER_SIZE}vmin`,
                height: `${NUMBER_SIZE}vmin`,
                // Calculate position from center
                left: `calc(50% + ${RADIUS}vmin * ${Math.sin(rad)} - ${NUMBER_SIZE / 2}vmin)`,
                top: `calc(50% - ${RADIUS}vmin * ${Math.cos(rad)} - ${NUMBER_SIZE / 2}vmin)`,
                opacity: isVisible ? 1 : 0.15,
                transition: 'opacity 0.08s ease-in-out',
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.9))',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            />
          );
        })}

        {/* Clock Hands */}
        {/* Hour Hand */}
        <div style={getHandStyle(1.8, 28, '#fff', hours * 30, 10)} />
        
        {/* Minute Hand */}
        <div style={getHandStyle(1.2, 38, '#ddd', minutes * 6, 11)} />
        
        {/* Second Hand */}
        <div style={getHandStyle(0.6, 42, '#ff3b3b', seconds * 6, 12)} />

        {/* Center Pin */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '3vmin',
          height: '3vmin',
          backgroundColor: '#fff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          boxShadow: '0 0 10px rgba(0,0,0,0.8)'
        }} />
      </div>
    </div>
  );
};

export default Clock;