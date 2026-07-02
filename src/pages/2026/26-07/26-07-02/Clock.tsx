import chandelierBg from '@/assets/images/26_images/26-07/26-07-02/dive1.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useRef, useState } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-02.ttf?url';

export const assets = [chandelierBg, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_27',
    fontUrl,
  },
];

interface FloatingClock {
  id: number;
  x: number; 
  y: number; 
  speed: number;
  scale: number;
  opacity: number;
  // Current angles for each axis
  rotX: number;
  rotY: number;
  rotZ: number;
  // Unique slow rotation velocities per frame
  velX: number;
  velY: number;
  velZ: number;
}

const formatTime = (date: Date) => {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; 
  const hoursStr = String(hours).padStart(2, '0');

  return `${hoursStr}:${minutes}:${seconds} ${ampm}`;
};

const FloatingDigitalClocks: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [timeString, setTimeString] = useState(formatTime(new Date()));
  const [clocks, setClocks] = useState<FloatingClock[]>([]);

  // 1. Maintain the master clock time string
  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeString(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Helper to generate a slow random velocity between -0.3 and +0.3 degrees per frame
  const getRandomVelocity = () => (Math.random() * 0.001 - 0.05);

  // 2. Initialize floating clocks with random positions, initial rotations, and spin rates
  useEffect(() => {
    const initialClocks: FloatingClock[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,         
      y: Math.random() * 120,             
      speed: Math.random() * 0.05 + 0.03, 
      scale: Math.random() * 0.5 + 0.6,   
      opacity: Math.random() * 0.4 + 0.3, 
      // Initialize random start angles spanning a full 3D space
      rotX: Math.random() * 360,
      rotY: Math.random() * 360,
      rotZ: Math.random() * 180 - 90,
      // Slow structural velocities
      velX: getRandomVelocity(),
      velY: getRandomVelocity(),
      velZ: getRandomVelocity(),
    }));
    setClocks(initialClocks);
  }, []);

  // 3. High-performance Animation Loop handling positional float and 3D rotations
  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      setClocks((prevClocks) =>
        prevClocks.map((clock) => {
          let nextY = clock.y - clock.speed;
          let nextX = clock.x;
          
          // Increment rotations steadily
          let nextRotX = (clock.rotX + clock.velX) % 360;
          let nextRotY = (clock.rotY + clock.velY) % 360;
          let nextRotZ = (clock.rotZ + clock.velZ) % 360;

          let nextVelX = clock.velX;
          let nextVelY = clock.velY;
          let nextVelZ = clock.velZ;

          // Recycle when leaving top boundary
          if (nextY < -10) {
            nextY = 110;
            nextX = Math.random() * 80 + 10;
            // Mix up the rotation values and dynamics on respawn
            nextRotX = Math.random() * 360;
            nextRotY = Math.random() * 360;
            nextRotZ = Math.random() * 180 - 90;
            nextVelX = getRandomVelocity();
            nextVelY = getRandomVelocity();
            nextVelZ = getRandomVelocity();
          }

          return { 
            ...clock, 
            y: nextY, 
            x: nextX, 
            rotX: nextRotX, 
            rotY: nextRotY, 
            rotZ: nextRotZ,
            velX: nextVelX,
            velY: nextVelY,
            velZ: nextVelZ
          };
        })
      );
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 4. Handle video playback safely
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch((error) =>
        console.error('Video play failed:', error)
      );
    }
  }, []);

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        src={chandelierBg}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={styles.backgroundVideo}
      />

      {/* Floating Clocks Layer */}
      <div style={styles.clocksLayer}>
        {clocks.map((clock) => (
          <div
            key={clock.id}
            style={{
              ...styles.digitalClock,
              left: `${clock.x}%`,
              top: `${clock.y}%`,
              // Chains 3D translates and custom rotation properties sequentially
              transform: `translate(-50%, -50%) scale(${clock.scale}) rotateX(${clock.rotX}deg) rotateY(${clock.rotY}deg) rotateZ(${clock.rotZ}deg)`,
              opacity: clock.opacity,
            }}
          >
            {timeString.split('').map((char, index) => (
              <span key={index} style={styles.digitBox}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
    // Adds depth perception so the X and Y rotations look accurately three-dimensional
    perspective: '1000px', 
  },
  backgroundVideo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    height: '100dvh',
    objectFit: 'cover',
    zIndex: 1,
  },
  clocksLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
    // Ensures nested 3D spaces are preserved
    transformStyle: 'preserve-3d', 
  },
  digitalClock: {
    position: 'absolute',
    fontFamily: "'ClockFont_26_06_27', monospace",
    fontSize: '19vh',
    color: '#35359C',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    display: 'flex',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    textShadow: '0 1px 0px rgba(215, 228, 217, 0.6), 0 1px 0px rgba(233, 220, 220, 0.5)',
    // Removed the linear CSS transition to prevent conflicts with the continuous requestAnimationFrame loop updates
    transformStyle: 'preserve-3d',
  },
  digitBox: {
    display: 'inline-block',
    // Proportional width adjustments matching your larger 19vh font-size structure
    width: '11vh', 
    textAlign: 'center',
  },
};

export default FloatingDigitalClocks;