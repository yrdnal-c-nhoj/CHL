import React, { useEffect, useState } from 'react';

// Asset URLs
const one = new URL('../../assets/clocks/26-01-02/1.webp', import.meta.url).href;
const two = new URL('../../assets/clocks/26-01-02/2.webp', import.meta.url).href;
const three = new URL('../../assets/clocks/26-01-02/3.webp', import.meta.url).href;
const four = new URL('../../assets/clocks/26-01-02/4.webp', import.meta.url).href;
const five = new URL('../../assets/clocks/26-01-02/5.webp', import.meta.url).href;
const six = new URL('../../assets/clocks/26-01-02/6.webp', import.meta.url).href;
const seven = new URL('../../assets/clocks/26-01-02/7.webp', import.meta.url).href;
const eight = new URL('../../assets/clocks/26-01-02/8.webp', import.meta.url).href;
const nine = new URL('../../assets/clocks/26-01-02/9.webp', import.meta.url).href;
const ten = new URL('../../assets/clocks/26-01-02/10.webp', import.meta.url).href;
const eleven = new URL('../../assets/clocks/26-01-02/11.webp', import.meta.url).href;
const twelve = new URL('../../assets/clocks/26-01-02/12.webp', import.meta.url).href;

// The single background image
const pageBackground = new URL('../../assets/clocks/26-01-02/swi.jpg', import.meta.url).href;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [flickeringNumbers, setFlickeringNumbers] = useState({});

  useEffect(() => {
    let raf;
    const tick = () => {
      setTime(new Date());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Flickering effect - update randomly every 100-300ms
  useEffect(() => {
    const flicker = () => {
      setFlickeringNumbers(prev => {
        const newFlickering = {};
        // Randomly flicker each number with 1/3 chance of being dark
        for (let i = 0; i < 12; i++) {
          newFlickering[i] = Math.random() > 0.33; // 67% visible, 33% dark
        }
        return newFlickering;
      });
    };

    // Initial flicker
    flicker();
    
    // Set up random interval between 100-300ms
    const scheduleNextFlicker = () => {
      const delay = 100 + Math.random() * 200; // Random delay between 100-300ms
      setTimeout(() => {
        flicker();
        scheduleNextFlicker();
      }, delay);
    };
    
    scheduleNextFlicker();
  }, []);

  useEffect(() => {
    const sources = [
      one, two, three, four, five, six, 
      seven, eight, nine, ten, eleven, twelve, 
      pageBackground
    ];
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
      <div style={{ height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#000' }}>
        Loading… {loadingProgress}%
      </div>
    );
  }

  // Time calculations
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

  // Hand Style Helper
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
    boxShadow: '0 0 15px 5px rgba(0,0,0,0.3), 0 0 13px 10px rgba(0,0,0,0.2), 0 0 50px 15px rgba(0,0,0,0.2)',
    filter: 'drop-shadow(0 0 13px rgba(0,0,0,0.4)) drop-shadow(0 0 12px rgba(0,0,0,0.2))',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#000' }}>
      
      {/* Background Layer */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: `url(${pageBackground})`, 
        backgroundSize: 'cover', // Cover the entire area
        backgroundRepeat: 'no-repeat', // No tiling
        backgroundPosition: 'center', // Center the image
        zIndex: 1 
      }} />

      {/* Clock Face Container */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
        <div style={{ width: clockSize, height: clockSize, position: 'relative' }}>
          
          {/* Numbers */}
          {numbers.map(({ src, angle }, i) => {
            const rad = (angle * Math.PI) / 180;
            const isVisible = flickeringNumbers[i] !== false; // Default to visible if not set
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
                  opacity: isVisible ? 1 : 0.1, // Dark when flickering off
                  transition: 'opacity 0.1s ease-in-out', // Smooth transition
                  filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.8)) drop-shadow(-2px -2px 10px rgba(0,0,0,0.8))',
                  // Additional strong shadows for extra emphasis
                  textShadow: '2px 2px 20px rgba(0,0,0,0.9), -2px -2px 20px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.8)',
                }}
              />
            );
          })}

          {/* Clock Hands */}
          {/* Hour Hand */}
          <div style={handStyle('1.5vmin', '25vmin', '#fff', hours * 30, 10)} />
          
          {/* Minute Hand */}
          <div style={handStyle('1vmin', '35vmin', '#eee', minutes * 6, 11)} />
          
          {/* Second Hand */}
          <div style={handStyle('0.5vmin', '40vmin', '#EBE7E7', seconds * 6, 12)} />

          {/* Center Pin */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '2.5vmin',
            height: '2.5vmin',
            backgroundColor: '#fff',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }} />
        </div>
      </div>
    </div>
  );
};

export default Clock;
