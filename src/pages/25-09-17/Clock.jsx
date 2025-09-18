import React, { useState, useEffect } from 'react';
import backgroundImage from './crush.jpg';
import fontFile from './crush.ttf';
import centerImage from './crush.gif'; // middle image
import topImage from './crr.gif';   // top overlay image
import overlay1 from './ccr.gif';
import overlay2 from './cr.gif';
import overlay3 from './crush2.gif';

const pad = (n) => n.toString().padStart(2, '0');

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeIndex, setFadeIndex] = useState(-1);

  // Load font and images
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${fontFile}) format('truetype');
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
        font-variation-settings: 'wght' 400;
      }
    `;
    document.head.appendChild(style);

    const fontPromise = document.fonts.load('10rem CustomClockFont');

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });

    Promise.all([
      fontPromise,
      loadImage(backgroundImage),
      loadImage(centerImage),
      loadImage(topImage),
      loadImage(overlay1),
      loadImage(overlay2),
      loadImage(overlay3),
    ])
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true));

    return () => document.head.removeChild(style);
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fade logic for digits
  useEffect(() => {
    let currentIndex = 0;
    const digitsCount = 8;
    const interval = setInterval(() => {
      setFadeIndex(currentIndex);
      setTimeout(() => setFadeIndex(-1), 1000);
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % digitsCount;
      }, 2000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const hours = pad(time.getHours() % 12 || 12);
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const digits = [
    hours[0], hours[1],
    minutes[0], minutes[1],
    seconds[0], seconds[1],
    ampm[0], ampm[1],
  ];

  if (!isLoaded) {
    return <div style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 9999 }} />;
  }

  const getOpacity = (index, defaultOpacity = 1) =>
    fadeIndex === index ? 0 : defaultOpacity;

  // Config for additional overlay images
  const overlayImages = [
    {
      src: overlay1,
      top: '25%',
      left: '85%',
      width: '20vw',
      height: '20vh',
      rotate: '35deg',
      opacity: 0.3,
      filter: 'saturate(150%) hue-rotate(50deg)',
      zIndex: 5,
    },
    {
      src: overlay2,
      top: '50%',
      left: '70%',
      width: '25vw',
      height: '25vh',
      rotate: '-30deg',
      opacity: 0.6,
      filter: 'saturate(120%) hue-rotate(180deg)',
      zIndex: 6,
    },
    {
      src: overlay3,
      top: '75%',
      left: '75%',
      width: '35vw',
      height: '25vh',
      rotate: '0deg',
      opacity: 0.4,
      filter: 'saturate(200%) hue-rotate(-260deg)',
      zIndex: 7,
    },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        fontFamily: 'CustomClockFont, sans-serif',
        fontVariationSettings: '"wght" 400',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(300%) hue-rotate(-240deg) opacity(1)',
          zIndex: 1,
        }}
      />

      {/* Center Image */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          transform: 'translate(-50%, -50%) rotate(-32deg)',
          width: '35vw',
          height: '35vh',
          opacity: 0.2,
          filter: 'saturate(120%) hue-rotate(290deg)',
          zIndex: 2,
        }}
      >
        <img
          src={centerImage}
          alt="Center"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Top overlay image */}
      <div
        style={{
          position: 'absolute',
          top: '77%',
          left: '40%',
          transform: 'translate(-50%, -50%) rotate(20deg)',
          width: '30vw',
          height: '30vh',
          opacity: 0.3,
          filter: 'saturate(150%) hue-rotate(10deg)',
          zIndex: 4,
        }}
      >
        <img
          src={topImage}
          alt="Top overlay"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Additional overlay images */}
      {overlayImages.map((img, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: img.top,
            left: img.left,
            width: img.width,
            height: img.height,
            transform: `translate(-50%, -50%) rotate(${img.rotate})`,
            opacity: img.opacity,
            filter: img.filter,
            zIndex: img.zIndex,
          }}
        >
          <img
            src={img.src}
            alt={`overlay-${i}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      ))}

      {/* Clock digits */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Hours */}
        <div style={{ position: 'absolute', top: '1vh', left: '2rem', transform: 'rotate(23deg)', fontSize: '23vh', color: '#F65427FF', opacity: getOpacity(0, 0.9), transition: 'opacity 0.5s ease-in-out' }}>
          {digits[0]}
        </div>
        <div style={{ position: 'absolute', top: '16vh', left: '10rem', transform: 'rotate(-20deg)', fontSize: '29vh', color: '#589CE9FF', opacity: getOpacity(1, 0.8), transition: 'opacity 0.5s ease-in-out' }}>
          {digits[1]}
        </div>

        {/* Minutes */}
        <div style={{ position: 'absolute', top: '33vh', left: '4rem', transform: 'rotate(27deg) translateY(50%)', fontSize: '33vh', color: '#07DFDFFF', opacity: getOpacity(2, 0.9), transition: 'opacity 0.5s ease-in-out' }}>
          {digits[2]}
        </div>
        <div style={{ position: 'absolute', top: '55vh', left: '3rem', transform: 'rotate(-67deg) translateY(50%)', fontSize: '33vh', color: '#F0F406FF', opacity: getOpacity(3, 1), transition: 'opacity 0.5s ease-in-out' }}>
          {digits[3]}
        </div>

        {/* Seconds */}
        <div style={{ position: 'absolute', top: '1vh', right: '28vw', transform: 'rotate(52deg)', fontSize: '33vh', color: '#EB0CC5FF', opacity: getOpacity(4, 0.7), transition: 'opacity 0.5s ease-in-out' }}>
          {digits[4]}
        </div>
        <div style={{ position: 'absolute', top: '3vh', right: '5vw', transform: 'rotate(-22deg)', fontSize: '23vh', color: '#AEF606FF', opacity: getOpacity(5, 0.8), transition: 'opacity 0.5s ease-in-out' }}>
          {digits[5]}
        </div>

        {/* AM/PM */}
        <div style={{ position: 'absolute', top: '61vh', right: '5vw', transform: 'rotate(-6deg)', fontSize: '23vh', color: '#7A73E5FF', opacity: getOpacity(6, 0.7), transition: 'opacity 0.5s ease-in-out', fontWeight: 'bold' }}>
          {digits[6]}
        </div>
        <div style={{ position: 'absolute', top: '78vh', right: '3vw', transform: 'rotate(22deg)', fontSize: '19vh', color: '#E50AD6FF', opacity: getOpacity(7, 0.8), transition: 'opacity 0.5s ease-in-out', fontWeight: 'bold' }}>
          {digits[7]}
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
