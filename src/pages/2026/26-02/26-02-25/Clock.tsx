import React, { useState, useEffect, useRef } from 'react';
import { useSecondClock } from '@/utils/useSmoothClock';
import cocteauVideo from '@/assets/images/2026/26-02/26-02-25/cocteau.mp4';
import starWebp from '@/assets/images/2026/26-02/26-02-25/star.webp';

const CocteauClock: React.FC = () => {
  const time = useSecondClock();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay blocked by browser/battery saver:', err);
      });
    }
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  const handStyle = (length, width, color, angle) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: width,
    height: length,
    backgroundColor: color,
    borderRadius: '50% 50% 2px 2px',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    transformOrigin: '50% 100%',
    filter: 'url(#cocteau-line)',
    zIndex: 12,
  });

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000', // Prevents white flash while video loads
      }}
    >
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.9,
          zIndex: 1,
        }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={cocteauVideo} type="video/mp4" />
      </video>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="cocteau-line">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </svg>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: 'min(75vw, 75vh)',
          height: 'min(75vw, 75vh)',
          borderRadius: '52% 48% 51% 49% / 49% 52% 48% 51%',
          filter: 'url(#cocteau-line)',
          opacity: 0.7,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40px',
            height: '40px',
            backgroundImage: `url(${starWebp})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />

        <div style={handStyle('42%', '7px', '#E2C264', minuteAngle)} />
        <div style={handStyle('26%', '8px', '#8BC7D0', hourAngle)} />
        <div
          style={{
            ...handStyle('46%', '5px', '#F3F2EB', secondAngle),
            zIndex: 15,
          }}
        />
      </div>
    </div>
  );
};

export default CocteauClock;
