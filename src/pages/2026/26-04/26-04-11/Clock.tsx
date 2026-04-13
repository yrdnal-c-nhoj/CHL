import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useClockTime } from '@/utils/clockUtils';

// Import hand images
import hourHandImg from '@/assets/images/2026/26-04/26-04-11/hand.webp';
import minuteHandImg from '@/assets/images/2026/26-04/26-04-11/hand2.webp';
import secondHandImg from '@/assets/images/2026/26-04/26-04-11/hand3.gif';
import bgImage from '@/assets/images/2026/26-04/26-04-11/background.jpg';

// Import marker images
import m1 from '@/assets/images/2026/26-04/26-04-11/1.webp';
import m2 from '@/assets/images/2026/26-04/26-04-11/2.gif';
import m3 from '@/assets/images/2026/26-04/26-04-11/3.gif';
import m4 from '@/assets/images/2026/26-04/26-04-11/4.gif';
import m5 from '@/assets/images/2026/26-04/26-04-11/5.gif';
import m6 from '@/assets/images/2026/26-04/26-04-11/6.webp';
import m7 from '@/assets/images/2026/26-04/26-04-11/7.webp';
import m8 from '@/assets/images/2026/26-04/26-04-11/8.gif';
import m9 from '@/assets/images/2026/26-04/26-04-11/9.webp';
import m10 from '@/assets/images/2026/26-04/26-04-11/10.gif';
import m11 from '@/assets/images/2026/26-04/26-04-11/11.gif';
import m12 from '@/assets/images/2026/26-04/26-04-11/12.webp';
import m13 from '@/assets/images/2026/26-04/26-04-11/13.webp';

const handImages = {
  hour: hourHandImg,
  minute: minuteHandImg,
  second: secondHandImg,
};

const allMatchImages = [
  m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13
];

const Clock: React.FC = () => {
  const time = useClockTime(); // Assumes this returns a Date object updated frequently
  const [positionImages, setPositionImages] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const lastProcessedSecond = useRef<number>(-1);

  // Debug: log current images
  console.log('positionImages:', positionImages);
  console.log('Current time:', time.toLocaleTimeString());

  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  useEffect(() => {
    if (seconds !== lastProcessedSecond.current) {
      lastProcessedSecond.current = seconds;
      
      setPositionImages(prev => {
        const next = [...prev];
        const positionToChange = seconds % 12;

        // Special logic for the 1st second swap
        if (seconds === 1) {
          next[0] = 12; // Use the 13th image (index 12)
        } else {
          // Find an image index that is NOT currently displayed on the clock face
          const currentImages = new Set(next);
          const unusedImageIndex = allMatchImages.findIndex((_, idx) => !currentImages.has(idx));
          
          if (unusedImageIndex !== -1) {
            next[positionToChange] = unusedImageIndex;
          }
        }
        return next;
      });
    }
  }, [seconds]);

  const rotations = useMemo(() => {
    const s = seconds + milliseconds / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    
    return {
      secondDegrees: s * 6,
      minuteDegrees: m * 6,
      hourDegrees: h * 30,
    };
  }, [time, seconds, milliseconds]);

  // --- Styles ---
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    margin: 0,
    overflow: 'hidden',
  };

  const clockWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
  };

  const handStyle = (deg: number, width: string, height: string, zIndex: number): React.CSSProperties => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width,
    height,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    objectFit: 'contain',
    pointerEvents: 'none',
    zIndex,
    // Add a transition for the second hand if you want a "sweeping" effect
    transition: milliseconds < 100 ? 'none' : 'transform 0.1s linear', 
  });

  return (
    <div style={containerStyle}>
      <div style={clockWrapperStyle}>
        
        {/* Hour Markers (1 to 12) */}
        {positionImages.map((imageIdx, i) => {
          const hour = i + 1;
          const angle = hour * 30 - 90; // Offset by 90 to start at 3 o'clock position mathematically
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 40 * Math.cos(rad); // 40% radius to keep icons inside the circle
          const y = 50 + 40 * Math.sin(rad);

          return (
            <img
              key={i}
              src={allMatchImages[imageIdx]}
              alt={`marker-${hour}`}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                width: '15%',
                height: '15%',
                transform: 'translate(-50%, -50%)',
                objectFit: 'contain',
              }}
            />
          );
        })}

        {/* Clock Hands */}
        <img 
          src={handImages.hour} 
          style={handStyle(rotations.hourDegrees, '26%', '30%', 2)} 
          alt="hour hand" 
        />
        <img 
          src={handImages.minute} 
          style={handStyle(rotations.minuteDegrees, '54%', '60%', 3)} 
          alt="minute hand" 
        />
        <img 
          src={handImages.second} 
          style={handStyle(rotations.secondDegrees, '52%', '50%', 4)} 
          alt="second hand" 
        />
        

      </div>
    </div>
  );
};

export default Clock;