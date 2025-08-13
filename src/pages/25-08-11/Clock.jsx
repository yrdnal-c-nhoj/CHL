import React, { useState, useEffect, useRef } from 'react';
import customFont from './wash.otf';
import bgImage from './mach.gif';
import topImage from './wash.gif';
import img1 from './a.gif';
import img2 from './b.png';
import img3 from './c.gif';
import img4 from './e.gif';
import img5 from './f.gif';
import img6 from './z.png';
import img7 from './y.gif';
import img8 from './i.png';
import img9 from './q.gif';
import img10 from './aa.gif';
import img11 from './bb.webp';

const SwirlingImages = () => {
  const imageSizes = [9, 8, 10, 11, 9, 9, 9, 11, 9, 9, 8];
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [time, setTime] = useState(new Date());

  const imagesRef = useRef(null);

  if (!imagesRef.current) {
    const remToPx = (rem) => rem * 16;
    const maxImageHalfPx = Math.max(...imageSizes) / 2 * 16;
    const baseOrbitRadiusPx = Math.min(viewport.width, viewport.height) / 2 - maxImageHalfPx - 10;

    const orbitRadiusFactor = 0.65;
    const baseOrbitRadiusVh = ((baseOrbitRadiusPx / viewport.height) * 100) * orbitRadiusFactor;

    imagesRef.current = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11].map((src, i) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const baseSpeed = 3;
      const speedVariance = Math.random() * 3;
      return {
        id: i,
        src,
        size: imageSizes[i] || 6,
        startAngle: Math.random() * 360,
        distance: baseOrbitRadiusVh + (i % 2 === 0 ? i * 4 : -i * 4),
        orbitSpeed: baseSpeed + speedVariance,
        orbitDirection: direction,
        wobbleAmplitude: 0.3 + Math.random() * 1.2,
        wobbleSpeed: 1.5 + Math.random() * 2.5,
        opacity: 1.0,
        selfSpinSpeed: 2 + Math.random() * 4,
      };
    });
  }

  const images = imagesRef.current;

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);

    const timer = setInterval(() => setTime(new Date()), 1000);

    return () => {
      window.removeEventListener('resize', onResize);
      clearInterval(timer);
    };
  }, []);

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: '"CustomFont", sans-serif',
  };

  const backgroundStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: '230%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: 'scaleX(-1)',
  };

  const topImageStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '160vw',
    height: '160vh',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    opacity: 1.0,
    zIndex: 1,
  };

  const imageContainerStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  };

  const clockContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20rem',
    height: '20rem',
    borderRadius: '50%',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'clock-face-rotate 60s linear infinite reverse',
  };

  const clockNumberStyle = {
    position: 'absolute',
    color: '#D4E7F7FF',
    fontFamily: '"CustomFont", sans-serif',
    fontSize: '4.2rem',
    textAlign: 'center',
    width: '2rem',
    height: '2rem',
  };

  const handStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    background: '#fff',
    borderRadius: '2px',
  };

  // Calculate rotation degrees based on current time
  const hourDegrees = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5; // 30deg per hour + 0.5deg per min
  const minuteDegrees = time.getMinutes() * 6; // 6deg per minute
  const secondDegrees = time.getSeconds() * 6; // 6deg per second

  const hourHandStyle = {
    ...handStyle,
    width: '4px',
    height: '5rem',
    transform: `translateX(-50%) rotate(${hourDegrees}deg)`,
  };

  const minuteHandStyle = {
    ...handStyle,
    width: '3px',
    height: '7rem',
    transform: `translateX(-50%) rotate(${minuteDegrees}deg)`,
  };

  const secondHandStyle = {
    ...handStyle,
    width: '2px',
    height: '8rem',
    background: '#FBF9F9FF',
    transform: `translateX(-50%) rotate(${secondDegrees}deg)`,
  };

  const getOrbitWrapperStyle = (img) => ({
    position: 'absolute',
    '--start-angle': `${img.startAngle}deg`,
    '--distance': `${img.distance}vh`,
    '--img-half': `${img.size / 2}rem`,
    animationName: `orbit-${img.id}`,
    animationDuration: `${img.orbitSpeed}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: img.orbitDirection > 0 ? 'normal' : 'reverse',
    opacity: img.opacity,
  });

  const getInnerWrapperStyle = (img) => ({
    animation: `wobble-${img.id} ${img.wobbleSpeed}s ease-in-out infinite alternate`,
  });

  const getImageStyle = (img) => ({
    width: `${img.size}rem`,
    height: `${img.size}rem`,
    borderRadius: '0.8rem',
    objectFit: 'cover',
    display: 'block',
    animation: `self-spin-${img.id} ${img.selfSpinSpeed}s linear infinite`,
  });

  const generateKeyframes = () => {
    let keyframes = `
      @font-face {
        font-family: "CustomFont";
        src: url(${customFont}) format("truetype");
      }
    `;

    images.forEach((img) => {
      keyframes += `
        @keyframes orbit-${img.id} {
          0% { transform: rotate(calc(var(--start-angle) * 1)) translateX(calc(var(--distance) - var(--img-half))); }
          100% { transform: rotate(calc(var(--start-angle) * 1 + 360deg)) translateX(calc(var(--distance) - var(--img-half))); }
        }
        @keyframes wobble-${img.id} {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(${img.wobbleAmplitude}vh) translateX(${img.wobbleAmplitude * 0.5}vw); }
        }
        @keyframes self-spin-${img.id} {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
    });

    keyframes += `
      @keyframes clock-face-rotate {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(-360deg); }
      }
    `;

    return keyframes;
  };

  const selectedNumbers = [
    { num: '12', angleDeg: -90 },
    { num: '3', angleDeg: 0 },
    { num: '6', angleDeg: 90 },
    { num: '9', angleDeg: 180 },
  ];

  const clockNumbers = selectedNumbers.map(({ num, angleDeg }) => {
    const angle = (angleDeg * Math.PI) / 180;
    const radius = 8.5; // rem
    return {
      num,
      style: {
        ...clockNumberStyle,
        transform: `translate(-50%, -50%) translate(${radius * Math.cos(angle)}rem, ${radius * Math.sin(angle)}rem)`,
      },
    };
  });

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle} />
      <img src={topImage} alt="Top image overlay" style={topImageStyle} />

      <div style={imageContainerStyle}>
        {images.map((img) => (
          <div key={img.id} style={getOrbitWrapperStyle(img)}>
            <div style={getInnerWrapperStyle(img)}>
              <img src={img.src} alt={`Swirling image ${img.id + 1}`} style={getImageStyle(img)} />
            </div>
          </div>
        ))}
      </div>

      {/* Analog Clock */}
      <div style={clockContainerStyle}>
        {clockNumbers.map((num) => (
          <div key={num.num} style={num.style}>
            {num.num}
          </div>
        ))}
        <div style={hourHandStyle} />
        <div style={minuteHandStyle} />
        <div style={secondHandStyle} />
      </div>

      <style>{generateKeyframes()}</style>
    </div>
  );
};

export default SwirlingImages;
