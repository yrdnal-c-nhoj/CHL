import React, { useEffect, useState } from 'react';

// Asset URLs (Vite-safe)
const one = new URL('../../../assets/clocks/25-11-10/1.gif', import.meta.url).href;
const two = new URL('../../../assets/clocks/25-11-10/2.webp', import.meta.url).href;
const three = new URL('../../../assets/clocks/25-11-10/3.webp', import.meta.url).href;
const four = new URL('../../../assets/clocks/25-11-10/4.webp', import.meta.url).href;
const five = new URL('../../../assets/clocks/25-11-10/5.webp', import.meta.url).href;
const six = new URL('../../../assets/clocks/25-11-10/6.webp', import.meta.url).href;
const seven = new URL('../../../assets/clocks/25-11-10/7.webp', import.meta.url).href;
const eight = new URL('../../../assets/clocks/25-11-10/8.webp', import.meta.url).href;
const nine = new URL('../../../assets/clocks/25-11-10/9.webp', import.meta.url).href;
const ten = new URL('../../../assets/clocks/25-11-10/10.webp', import.meta.url).href;
const eleven = new URL('../../../assets/clocks/25-11-10/11.webp', import.meta.url).href;
const twelve = new URL('../../../assets/clocks/25-11-10/12.webp', import.meta.url).href;

const hourHand = new URL('../../../assets/clocks/25-11-10/hour.webp', import.meta.url).href;
const minuteHand = new URL('../../../assets/clocks/25-11-10/min.webp', import.meta.url).href;
const secondHand = new URL('../../../assets/clocks/25-11-10/sec.webp', import.meta.url).href;

const pageBackground = new URL('../../../assets/clocks/25-11-10/pong.webp', import.meta.url).href;
const extraBg = new URL('../../../assets/clocks/25-11-10/bg.webp', import.meta.url).href;

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingError, setLoadingError] = useState(null);

  // Smooth animation loop
  useEffect(() => {
    let raf;
    const tick = () => {
      setTime(new Date());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Preload images
  useEffect(() => {
    const sources = [
      one, two, three, four, five, six,
      seven, eight, nine, ten, eleven, twelve,
      hourHand, minuteHand, secondHand,
      pageBackground, extraBg
    ];

    let loaded = 0;

    sources.forEach(src => {
      const img = new Image();
      img.src = src;

      img.onload = img.onerror = () => {
        loaded++;
        setLoadingProgress(Math.round((loaded / sources.length) * 100));
        if (loaded === sources.length) {
          setTimeout(() => setIsLoaded(true), 200);
        }
      };
    });
  }, []);

  if (!isLoaded) {
    return (
      <div style={{
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        background: '#000',
        fontSize: '1.2rem'
      }}>
        Loading… {loadingProgress}%
      </div>
    );
  }

  // Time math
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

  const numbers = [
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
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      background: '#000'
    }}>

      {/* Background layers */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${extraBg})`,
        backgroundSize: 'cover',
        filter: 'brightness(0.5) hue-rotate(230deg)',
        zIndex: 1
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${pageBackground})`,
        backgroundSize: '100% 100%',
        zIndex: 6
      }} />

      {/* Clock */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5
      }}>
        <div style={{
          width: clockSize,
          height: clockSize,
          position: 'relative'
        }}>

          {numbers.map(({ src, angle }, i) => {
            const rad = angle * Math.PI / 180;
            return (
              <img
                key={i}
                src={src}
                style={{
                  position: 'absolute',
                  width: numberSize,
                  height: numberSize,
                  left: `calc(50% + ${radius} * ${Math.sin(rad)} - ${numberSize} / 2)`,
                  top: `calc(50% - ${radius} * ${Math.cos(rad)} - ${numberSize} / 2)`
                }}
              />
            );
          })}

          <img src={hourHand} style={{
            position: 'absolute',
            width: handWidth,
            height: hourHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${hourHandLength} * 0.75)`,
            transform: `rotate(${hourDeg}deg)`,
            transformOrigin: 'center 75%'
          }} />

          <img src={minuteHand} style={{
            position: 'absolute',
            width: handWidth,
            height: minuteHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${minuteHandLength} * 0.75)`,
            transform: `rotate(${minuteDeg}deg)`,
            transformOrigin: 'center 75%'
          }} />

          <img src={secondHand} style={{
            position: 'absolute',
            width: handWidth,
            height: secondHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${secondHandLength} * 0.75)`,
            transform: `rotate(${secondDeg}deg)`,
            transformOrigin: 'center 75%'
          }} />

        </div>
      </div>

      {loadingError && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#ff4444'
        }}>
          {loadingError}
        </div>
      )}
    </div>
  );
};

export default Clock;
