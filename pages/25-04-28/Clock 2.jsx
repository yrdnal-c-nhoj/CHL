import React, { useEffect, useRef } from 'react';
import skaterFont from './fonts/Skater.ttf';

const grayShades = [
  '#747070', '#767D7C', '#33312D', '#4D4E55', '#DAD3DB',
  '#282838', '#171417', '#d6d6d6', '#262616', '#161414'
];

const JacksonPollockClock = () => {
  const impressionCount = useRef(0);

  useEffect(() => {
    const font = new FontFace('Skater', `url(${skaterFont})`);
    font.load().then(loadedFont => {
      document.fonts.add(loadedFont);
    });

    const getRandomPosition = () => {
      const x = Math.random() * (window.innerWidth - 200);
      const y = Math.random() * (window.innerHeight - 50);
      return { x, y };
    };

    const getRandomRotation = () => {
      return {
        rotationX: Math.random() * 360,
        rotationY: Math.random() * 360,
        rotationZ: Math.random() * 360,
      };
    };

    const getRandomGrayShade = () => {
      return grayShades[Math.floor(Math.random() * grayShades.length)];
    };

    const getRandomSize = () => {
      return `${Math.random() * 90 + 10}px`;
    };

    const getRandomSkew = () => {
      const skewX = Math.random() * 60 - 3;
      const skewY = Math.random() * 60 - 3;
      return `skew(${skewX}deg, ${skewY}deg)`;
    };

    const updateClock = () => {
      if (impressionCount.current >= 1000) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timeString = `${hours}:${minutes}:${seconds}`;

      const currentTime = document.getElementById('current-time');
      if (currentTime) currentTime.textContent = timeString;

      const impression = document.createElement('div');
      impression.textContent = timeString;
      impression.style.position = 'absolute';
      const { x, y } = getRandomPosition();
      impression.style.left = `${x}px`;
      impression.style.top = `${y}px`;

      const { rotationX, rotationY, rotationZ } = getRandomRotation();
      impression.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg) ${getRandomSkew()}`;
      impression.style.fontSize = getRandomSize();
      impression.style.color = getRandomGrayShade();
      impression.style.fontFamily = 'Skater, sans-serif';

      document.body.appendChild(impression);
      impressionCount.current++;
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      style={{
        fontFamily: 'Skater, sans-serif',
        height: '100vh',
        backgroundColor: '#929dae',
        overflow: 'hidden',
      }}
    >
      <div id="current-time" style={{ fontSize: '2rem', padding: '10px' }}>00:00:00</div>
    </div>
  );
};

export default JacksonPollockClock;