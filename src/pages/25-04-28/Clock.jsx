import React, { useState, useEffect, useRef } from 'react';
import SkaterFont from './fonts/Skater.ttf';

const fontFaceStyle = `
  @font-face {
    font-family: 'Skater';
    src: url(${SkaterFont}) format('truetype');
  }
`;

const grayShades = [
  '#747070', '#767D7C', '#33312D', '#4D4E55', '#DAD3DB',
  '#282838', '#171417', '#d6d6d6', '#262616', '#161414'
];

const ClockApp = () => {
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [impressions, setImpressions] = useState([]);
  const [impressionCount, setImpressionCount] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const getRandomPosition = () => {
    const x = Math.random() * (100 - 38.5);
    const y = Math.random() * (100 - 43.125);
    return { x, y };
  };

  const getRandomRotation = () => ({
    rotationX: Math.random() * 360,
    rotationY: Math.random() * 360,
    rotationZ: Math.random() * 360,
  });

  const getRandomGrayShade = () => grayShades[Math.floor(Math.random() * grayShades.length)];

  const getRandomSize = () => {
    const size = Math.random() * (6.25 - 0.625) + 0.625;
    return `${size}rem`;
  };

  const getRandomSkew = () => {
    const skewX = Math.random() * 60 - 30;
    const skewY = Math.random() * 60 - 30;
    return `skew(${skewX}deg, ${skewY}deg)`;
  };

  const addClockImpression = () => {
    if (impressionCount >= 1000) {
      clearInterval(intervalRef.current);
      return;
    }

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setCurrentTime(timeString);

    const { x, y } = getRandomPosition();
    const { rotationX, rotationY, rotationZ } = getRandomRotation();

    const newImpression = {
      id: impressionCount,
      time: timeString,
      style: {
        position: 'absolute',
        left: `${x}vw`,
        top: `${y}vh`,
        transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg) ${getRandomSkew()}`,
        fontSize: getRandomSize(),
        color: getRandomGrayShade(),
      },
    };

    setImpressions((prev) => [...prev, newImpression]);
    setImpressionCount((prev) => prev + 1);
  };

  useEffect(() => {
    // Start after 0.5s
    timeoutRef.current = setTimeout(() => {
      addClockImpression(); // First one
      intervalRef.current = setInterval(addClockImpression, 250); // Then every 0.25s
    }, 500);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const bodyStyle = {
    fontFamily: "'Skater', sans-serif",
    height: '100vh',
    width: '100vw',
    backgroundColor: '#929dae',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <>
      <style>{fontFaceStyle}</style>
      <div style={bodyStyle}>
        {/* Current time hidden offscreen or removed if not needed */}
        {impressions.map((impression) => (
          <div
            key={impression.id}
            className="clock-impression"
            style={impression.style}
          >
            {impression.time}
          </div>
        ))}
      </div>
    </>
  );
};

export default ClockApp;
