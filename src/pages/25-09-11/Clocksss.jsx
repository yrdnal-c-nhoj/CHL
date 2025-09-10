import React, { useEffect, useState } from 'react';

const StarsParallax = () => {
  const [stars, setStars] = useState({
    near: [],
    mid: [],
    far: []
  });

  useEffect(() => {
    const generateStars = (count, sizeMin, sizeMax, speed) => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (sizeMax - sizeMin) + sizeMin,
        speed: speed
      }));
    };

    setStars({
      near: generateStars(50, 0.1, 0.3, 0.3),
      mid: generateStars(100, 0.05, 0.2, 0.2),
      far: generateStars(150, 0.03, 0.1, 0.1)
    });

    const animateStars = () => {
      setStars((prev) => ({
        near: prev.near.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        })),
        mid: prev.mid.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        })),
        far: prev.far.map(star => ({
          ...star,
          y: star.y - star.speed < 0 ? 100 : star.y - star.speed
        }))
      }));
    };

    const interval = setInterval(animateStars, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {stars.far.map((star, index) => (
        <div
          key={`far-${index}`}
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: '#ffffff',
            borderRadius: '50%',
            opacity: 0.4
          }}
        />
      ))}
      {stars.mid.map((star, index) => (
        <div
          key={`mid-${index}`}
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: '#ffffff',
            borderRadius: '50%',
            opacity: 0.6
          }}
        />
      ))}
      {stars.near.map((star, index) => (
        <div
          key={`near-${index}`}
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            top: `${star.y}dvh`,
            width: `${star.size}rem`,
            height: `${star.size}rem`,
            background: '#ffffff',
            borderRadius: '50%',
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};

export default StarsParallax;