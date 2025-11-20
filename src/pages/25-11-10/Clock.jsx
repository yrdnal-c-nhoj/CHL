import React, { useEffect, useState } from 'react';
import one from './1.gif';
import two from './2.webp';
import three from './3.webp';
import four from './4.webp';
import five from './5.webp';
import six from './6.webp';
import seven from './7.webp';
import eight from './8.webp';
import nine from './9.webp';
import ten from './10.png';
import eleven from './11.webp';
import twelve from './12.webp';
import hourHand from './hour.webp';
import minuteHand from './min.webp';
import secondHand from './sec.webp';
import pageBackground from './pong.webp';
import extraBg from './bg.webp';   // ⭐ NEW BACKGROUND IMPORT

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Preload all images
  useEffect(() => {
    const imageSources = [
      one, two, three, four, five, six, seven, eight, nine, ten,
      eleven, twelve, hourHand, minuteHand, secondHand,
      pageBackground, extraBg
    ];
    let loadedCount = 0;
    const total = imageSources.length;

    imageSources.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === total) {
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

      {/* Fade-in overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          transition: 'opacity 0.1s ease',
          opacity: isLoaded ? 0 : 1,
          pointerEvents: isLoaded ? 'none' : 'auto',
          zIndex: 10,
        }}
      />
    </div>
  );
};

export default Clock;
