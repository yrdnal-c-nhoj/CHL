import React, { useEffect, useRef } from 'react';
import bgImage from './bg.webp';

import img12 from './Khea.gif';
import img1 from './qspades.jpg';
import img2 from './Jdi.gif';
import img3 from './Kclubs.webp';
import img4 from './Qhea.gif';
import img5 from './JSpades.png';
import img6 from './Kdi.gif';
import img7 from './Qclu.gif';
import img8 from './Jheart.jpg';
import img9 from './Kspa.gif';
import img10 from './Qdi.gif';
import img11 from './Jclu.gif';

const images = [img12, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

const FaceCardClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const seconds = now.getSeconds() + ms / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;

      const secondDeg = (seconds / 60) * 360;
      const minuteDeg = (minutes / 60) * 360;
      const hourDeg = (hours / 12) * 360;

      secondRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      hourRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);
  }, []);

  const bgStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '150dvw',
    height: '150dvh',
    objectFit: 'cover',
    filter: 'contrast(2.7) brightness(0.3)',
    zIndex: 0,
    transform: 'translate(-50%, -50%)',
    transformOrigin: 'center center',
    animation: 'slow-rotate 720s linear infinite',
  };

  const clockContainer = {
    position: 'relative',
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  };

  const numberBase = {
    position: 'absolute',
    width: '23vmin',
    height: '23vmin',
    top: '50%',
    left: '50%',
    transformOrigin: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const handBase = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    borderRadius: '5px',
    boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.8), -1px -1px 0px rgba(205, 201, 201)',
  };

  const centerDot = {
    position: 'absolute',
    width: '2vmin',
    height: '2vmin',
    backgroundColor: '#979b99',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100dvh',
        width: '100dvw',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <img src={bgImage} style={bgStyle} alt="Background" />

      <div style={clockContainer}>
        {images.map((src, i) => {
          const angle = i * 30;
          return (
            <div
              key={i}
              style={{
                ...numberBase,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-39vmin)`,
              }}
            >
              <img src={src} alt={`card-${i}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          );
        })}

        <div
          ref={hourRef}
          style={{
            ...handBase,
            width: '5vmin',
            height: '17vmin',
            backgroundColor: '#575a59',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          ref={minuteRef}
          style={{
            ...handBase,
            width: '3vmin',
            height: '27vmin',
            backgroundColor: '#72878b',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          ref={secondRef}
          style={{
            ...handBase,
            width: '0.5vmin',
            height: '50vmin',
            backgroundColor: 'rgb(254, 254, 254)',
            transform: 'translateX(-50%)',
          }}
        />
        <div style={centerDot}></div>
      </div>

      <style>
        {`
          @keyframes slow-rotate {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(-360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default FaceCardClock;