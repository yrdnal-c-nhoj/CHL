import React, { useEffect, useState } from 'react';

// Asset URLs
const one = new URL('../../../assets/images/26-01-03/1.webp', import.meta.url).href;
const two = new URL('../../../assets/images/26-01-03/2.webp', import.meta.url).href;
const three = new URL('../../../assets/images/26-01-03/3.webp', import.meta.url).href;
const four = new URL('../../../assets/images/26-01-03/4.webp', import.meta.url).href;
const five = new URL('../../../assets/images/26-01-03/5.webp', import.meta.url).href;
const six = new URL('../../../assets/images/26-01-03/6.webp', import.meta.url).href;
const seven = new URL('../../../assets/images/26-01-03/7.webp', import.meta.url).href;
const eight = new URL('../../../assets/images/26-01-03/8.webp', import.meta.url).href;
const nine = new URL('../../../assets/images/26-01-03/9.webp', import.meta.url).href;
const ten = new URL('../../../assets/images/26-01-03/10.webp', import.meta.url).href;
const eleven = new URL('../../../assets/images/26-01-03/11.webp', import.meta.url).href;
const twelve = new URL('../../../assets/images/26-01-03/12.webp', import.meta.url).href;
const pageBackground = new URL('../../../assets/images/26-01-03/swi.jpg', import.meta.url).href;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightsOff, setLightsOff] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  // 1. Clock Motion
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 100); // Update every 100ms for smooth time display
    return () => clearInterval(interval);
  }, []);

  // 2. Light Switch Logic (Smooth rhythm)
  useEffect(() => {
    if (!isLoaded) return;

    let timeout;
    const toggleLights = () => {
      setLightsOff(prev => !prev);
      setIsShaking(true);
      
      // Stop shaking shortly after the "click"
      setTimeout(() => setIsShaking(false), 150);

      // Randomize the "on" vs "off" duration for a human feel (longer intervals)
      const nextInterval = 800 + Math.random() * 1200; // Increased from 400-800 to 800-1200ms
      timeout = setTimeout(toggleLights, nextInterval);
    };

    // Start the first flicker within 1 second
    timeout = setTimeout(toggleLights, 1200); // Increased from 800 to 1200ms

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  // 3. Asset Preloading
  useEffect(() => {
    const sources = [one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, pageBackground];
    let loaded = 0;
    sources.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === sources.length) setIsLoaded(true);
      };
    });
  }, []);

  // Separate gate to ensure we don't render until assets flag is on
  useEffect(() => {
    if (isLoaded) {
      const t = setTimeout(() => setAssetsReady(true), 50);
      return () => clearTimeout(t);
    }
  }, [isLoaded]);

  if (!assetsReady) return <div style={{ height: '100dvh', background: '#000' }} />;

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
    width,
    height,
    backgroundColor: color,
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex,
    boxShadow: '0 0 15px rgba(0,0,0,0.4)',
  });

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: '#000', 
      overflow: 'hidden',
      animation: isShaking ? 'camera-shake 0.12s ease-in-out' : 'none'
    }}>
      <style>{`
        @keyframes camera-shake {
          0% { transform: translate(0,0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 1px); }
          100% { transform: translate(0,0); }
        }
      `}</style>

      {/* 1. Background Layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1,
        // Background dims slightly, but stays visible
        filter: lightsOff ? 'brightness(0.4) contrast(0.8)' : 'brightness(1)',
        transition: 'filter 0.1s linear'
      }} />

      {/* 2. Hands Layer */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, pointerEvents: 'none' }}>
        <div style={{ width: clockSize, height: clockSize, position: 'relative' }}>
          <div style={handStyle('1.7vmin', '20vmin', '#43474B', hours * 30, 2)} />
          <div style={handStyle('1vmin', '35vmin', '#A6A4A9', minutes * 6, 3)} />
          <div style={handStyle('0.4vmin', '40vmin', '#696891', seconds * 6, 4)} />
        </div>
      </div>

      {/* 3. Room Light Gradient Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        // Radial gradient: darker in the center, much darker at edges
        background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)',
        opacity: lightsOff ? 1 : 0,
        transition: 'opacity 0.08s linear', // Mimics the speed of a physical switch
        zIndex: 3,
        pointerEvents: 'none'
      }} />

      {/* 4. Digits (Illuminated Layer) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 4 
      }}>
        <div style={{ width: clockSize, height: clockSize, position: 'relative' }}>
          {numbers.map(({ src, angle }, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <img decoding="async" loading="lazy"
                key={i}
                src={src}
                alt=""
                style={{
                  position: 'absolute',
                  width: numberSize,
                  height: numberSize,
                  left: `calc(50% + ${radius} * ${Math.sin(rad)} - ${numberSize} / 2)`,
                  top: `calc(50% - ${radius} * ${Math.cos(rad)} - ${numberSize} / 2)`,
                  filter: lightsOff 
                    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' 
                    : 'drop-shadow(2px 2px 8px rgba(0,0,0,0.6))',
                  transition: 'filter 0.1s linear'
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Clock;