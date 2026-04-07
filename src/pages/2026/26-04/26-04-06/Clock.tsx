import React, { useState, useEffect } from 'react';
import { useClockTime } from '@/utils/clockUtils';

// Importing assets (keeping your existing imports)
import img1 from '@/assets/images/2026/26-04/26-04-06/1400655_orig.gif';
import img2 from '@/assets/images/2026/26-04/26-04-06/2681501_orig.gif';
import img3 from '@/assets/images/2026/26-04/26-04-06/2CombinedPulleyAnimated.gif';
import img4 from '@/assets/images/2026/26-04/26-04-06/894eac29691d8796dde39b56a82cd872.gif';
import img5 from '@/assets/images/2026/26-04/26-04-06/PatBox1.gif';
import img6 from '@/assets/images/2026/26-04/26-04-06/csDCasdcASDCgiphy.gif';
import img7 from '@/assets/images/2026/26-04/26-04-06/movablepulley_animated.gif';
import img8 from '@/assets/images/2026/26-04/26-04-06/pulley1.webp';
import img9 from '@/assets/images/2026/26-04/26-04-06/pulley_2_orig.gif';
import img10 from '@/assets/images/2026/26-04/26-04-06/simplepulley_animated.gif';

const IMAGES = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

const getRandomPosition = () => ({
  top: `${Math.random() * 70}%`,
  left: `${Math.random() * 70}%`,
  transform: `scale(${0.5 + Math.random()})`,
});

const Clock: React.FC = () => {
  const time = useClockTime();
  
  // Start with all 10 images loaded at random positions
  const [displayedImages, setDisplayedImages] = useState<Array<{ src: string; pos: any; id: number }>>(() => {
    return IMAGES.map((src) => ({
      src,
      pos: getRandomPosition(),
      id: Date.now() + Math.random(),
    }));
  });

  // Use the raw seconds value to trigger the effect
  const seconds = time.getSeconds();

  useEffect(() => {
    setDisplayedImages((prev) => {
      const randomIndex = Math.floor(Math.random() * IMAGES.length);
      const newImage = {
        src: IMAGES[randomIndex],
        pos: getRandomPosition(),
        id: Date.now(),
      };

      // Create new array with new image at the end
      const next = [...prev, newImage];

      // Once we reach 30, start removing the oldest (first) each second
      if (next.length > 30) {
        next.shift();
      }
      
      return next;
    });
  }, [seconds]);

  // Styles
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  // Clock Hand Calculations
  const secondDegrees = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;
  const minuteDegrees = (time.getMinutes() + time.getSeconds() / 60) * 6;
  const hourDegrees = ((time.getHours() % 12) + time.getMinutes() / 60) * 30;
  const clockSize = Math.min(window.innerWidth, window.innerHeight) * 0.7;

  return (
    <div style={containerStyle}>
      {/* Background Images Layer */}
      {displayedImages.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          style={{
            position: 'absolute',
            maxWidth: '250px',
            maxHeight: '250px',
            opacity: 0.8,
            transition: 'all 0.5s ease-in-out',
            zIndex: 1, // Higher index in array naturally renders later (on top)
            ...img.pos,
          }}
        />
      ))}

      {/* Clock SVG Layer */}
      <svg 
        width={clockSize} 
        height={clockSize} 
        viewBox="0 0 100 100" 
        style={{ position: 'relative', zIndex: 100, filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
      >
        
        {/* Markers */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50" y1="5" x2="50" y2={i % 3 === 0 ? "10" : "8"}
            stroke="#000"
            strokeWidth={i % 3 === 0 ? "1" : "0.5"}
            transform={`rotate(${i * 30} 50 50)`}
          />
        ))}

        {/* Hands */}
        <line x1="50" y1="50" x2="50" y2="25" stroke="#000" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${hourDegrees} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${minuteDegrees} 50 50)`} />
        <line x1="50" y1="55" x2="50" y2="8" stroke="#f00" strokeWidth="0.7" strokeLinecap="round" transform={`rotate(${secondDegrees} 50 50)`} />
        
        <circle cx="50" cy="50" r="2" fill="#000" />
      </svg>
    </div>
  );
};

export default Clock;