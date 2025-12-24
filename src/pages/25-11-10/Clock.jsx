import React, { useEffect, useState } from 'react';

// Dynamic imports with proper URL handling for production
const one = new URL('./1.gif', import.meta.url).href;
const two = new URL('./2.webp', import.meta.url).href;
const three = new URL('./3.webp', import.meta.url).href;
const four = new URL('./4.webp', import.meta.url).href;
const five = new URL('./5.webp', import.meta.url).href;
const six = new URL('./6.webp', import.meta.url).href;
const seven = new URL('./7.webp', import.meta.url).href;
const eight = new URL('./8.webp', import.meta.url).href;
const nine = new URL('./9.webp', import.meta.url).href;
const ten = new URL('./10.png', import.meta.url).href;
const eleven = new URL('./11.webp', import.meta.url).href;
const twelve = new URL('./12.webp', import.meta.url).href;
const hourHand = new URL('./hour.webp', import.meta.url).href;
const minuteHand = new URL('./min.webp', import.meta.url).href;
const secondHand = new URL('./sec.webp', import.meta.url).href;
const pageBackground = new URL('./pong.webp', import.meta.url).href;
const extraBg = new URL('./bg.webp', import.meta.url).href;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingError, setLoadingError] = useState(null);

  // Continuous smooth time updates
  useEffect(() => {
    let frameId;
    const updateTime = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(updateTime);
    };
    frameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Preload all images with better error handling
  useEffect(() => {
    const imageSources = [
      { name: 'one', src: one },
      { name: 'two', src: two },
      { name: 'three', src: three },
      { name: 'four', src: four },
      { name: 'five', src: five },
      { name: 'six', src: six },
      { name: 'seven', src: seven },
      { name: 'eight', src: eight },
      { name: 'nine', src: nine },
      { name: 'ten', src: ten },
      { name: 'eleven', src: eleven },
      { name: 'twelve', src: twelve },
      { name: 'hourHand', src: hourHand },
      { name: 'minuteHand', src: minuteHand },
      { name: 'secondHand', src: secondHand },
      { name: 'pageBackground', src: pageBackground },
      { name: 'extraBg', src: extraBg }
    ];
    
    let loadedCount = 0;
    const total = imageSources.length;
    const loadedImages = {};

    imageSources.forEach(({ name, src }) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        console.log(`✅ Loaded image: ${name}`, src);
        loadedImages[name] = src;
        loadedCount++;
        const progress = Math.round((loadedCount / total) * 100);
        setLoadingProgress(progress);
        
        if (loadedCount === total) {
          console.log('🎉 All images loaded successfully!', loadedImages);
          setTimeout(() => setIsLoaded(true), 300);
        }
      };
      
      img.onerror = (error) => {
        console.error(`❌ Failed to load image: ${name}`, { src, error });
        setLoadingError(`Failed to load image: ${name}`);
        loadedCount++;
        const progress = Math.round((loadedCount / total) * 100);
        setLoadingProgress(progress);
        
        if (loadedCount === total) {
          console.warn('⚠️ Some images failed to load, but continuing...');
          setTimeout(() => setIsLoaded(true), 300);
        }
      };
    });
  }, []);

  // Time calculations (smooth)
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  const clockSize = '90vh';
  const numberSize = '15vh';
  const handWidth = '10vmin';
  const hourHandLength = '30vmin';
  const minuteHandLength = '38vmin';
  const secondHandLength = '42vmin';
  const radius = '32vmin';

  const numberPositions = [
    { src: twelve, angle: 0 },
    { src: one, angle: 30 },
    { src: two, angle: 60 },
    { src: three, angle: 90 },
    { src: four, angle: 120 },
    { src: five, angle: 150 },
    { src: six, angle: 180 },
    { src: seven, angle: 210 },
    { src: eight, angle: 240 },
    { src: nine, angle: 270 },
    { src: ten, angle: 300 },
    { src: eleven, angle: 330 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
      }}
    >

      {/* ⭐ Layer 1 — Atmospheric gradient */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          // background: `
          //   radial-gradient(circle at 30% 50%, rgba(100, 200, 255, 0.15) 0%, transparent 50%),
          //   radial-gradient(circle at 70% 70%, rgba(255, 100, 200, 0.12) 0%, transparent 50%),
          //   #0f0f1b
          // `,
          // filter: ' brightness(0.3)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ⭐ Layer 2 — NEW extra background layer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${extraBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          // opacity: 0.85,
          filter: 'brightness(0.5) hue-rotate(230deg) saturate(0.8) contrast(0.7)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* ⭐ Layer 3 — Pong background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${pageBackground})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 6,
          // opacity: 0.95,
        }}
      />

      {/* Clock container */}
      <div
        style={{
          width: clockSize,
          height: clockSize,
          position: 'relative',
          borderRadius: '50%',
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        {numberPositions.map(({ src, angle }, index) => {
          const rad = (angle * Math.PI) / 180;
          const x = `calc(50% + ${radius} * ${Math.sin(rad)} - ${numberSize} / 2)`;
          const y = `calc(50% - ${radius} * ${Math.cos(rad)} - ${numberSize} / 2)`;

          return (
            <img
              key={index}
              src={src}
              alt={`number-${index + 1}`}
              style={{
                position: 'absolute',
                width: numberSize,
                height: numberSize,
                left: x,
                top: y,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                objectFit: 'contain',
                filter: 'saturate(1.9) brightness(1.1)',
                zIndex: 2,
              }}
            />
          );
        })}

        {/* Hour hand */}
        <img
          src={hourHand}
          alt="hour hand"
          style={{
            position: 'absolute',
            width: handWidth,
            height: hourHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${hourHandLength} * 0.75)`,
            transform: `rotate(${hourDeg}deg)`,
            transformOrigin: 'center 75%',
            objectFit: 'contain',
            zIndex: 3,
            opacity: 0.8,
          }}
        />

        {/* Minute hand */}
        <img
          src={minuteHand}
          alt="minute hand"
          style={{
            position: 'absolute',
            width: handWidth,
            height: minuteHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${minuteHandLength} * 0.75)`,
            transform: `rotate(${minuteDeg}deg)`,
            transformOrigin: 'center 75%',
            objectFit: 'contain',
            zIndex: 3,
            // opacity: 0.8,
          }}
        />

        {/* Second hand */}
        <img
          src={secondHand}
          alt="second hand"
          style={{
            position: 'absolute',
            width: handWidth,
            height: secondHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${secondHandLength} * 0.75)`,
            transform: `rotate(${secondDeg}deg)`,
            transformOrigin: 'center 75%',
            objectFit: 'contain',
            zIndex: 4,
            // opacity: 0.8,
          }}
        />
      </div>

      {/* Enhanced loading overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          transition: 'opacity 0.5s ease',
          opacity: isLoaded ? 0 : 1,
          pointerEvents: isLoaded ? 'none' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: 'monospace',
          textAlign: 'center',
          padding: '20px',
          zIndex: 1000
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Loading Clock...</h2>
        <div style={{
          width: '80%',
          maxWidth: '400px',
          height: '20px',
          backgroundColor: '#333',
          borderRadius: '10px',
          margin: '20px 0',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            backgroundColor: loadingError ? '#ff4444' : '#4CAF50',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {loadingProgress}%
          </div>
        </div>
        {loadingError && (
          <div style={{ 
            color: '#ff4444', 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            borderRadius: '4px',
            maxWidth: '80%',
            wordBreak: 'break-word'
          }}>
            {loadingError}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clock;
