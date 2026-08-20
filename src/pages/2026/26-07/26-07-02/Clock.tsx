import chandelierBg from '@/assets/images/26_images/26-07/26-07-02/dive1.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { useEffect, useRef, useState, memo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-07-02.ttf?url';
import styles from './Clock.module.css';

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
  rotX: number;
  rotY: number;
  rotZ: number;
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

const getRandomVelocity = () => (Math.random() * 0.001 - 0.05);

const FloatingDigitalClocks =  () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useSecondClock();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [clocks, setClocks] = useState<FloatingClock[]>([]);

  const timeString = formatTime(time);

  useEffect(() => {
    const initialClocks: FloatingClock[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 120,
      speed: Math.random() * 0.05 + 0.03,
      scale: Math.random() * 0.5 + 0.6,
      opacity: Math.random() * 0.4 + 0.3,
      rotX: Math.random() * 360,
      rotY: Math.random() * 360,
      rotZ: Math.random() * 180 - 90,
      velX: getRandomVelocity(),
      velY: getRandomVelocity(),
      velZ: getRandomVelocity(),
    }));
    setClocks(initialClocks);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      setClocks((prevClocks) =>
        prevClocks.map((clock) => {
          let nextY = clock.y - clock.speed;
          let nextX = clock.x;

          let nextRotX = (clock.rotX + clock.velX) % 360;
          let nextRotY = (clock.rotY + clock.velY) % 360;
          let nextRotZ = (clock.rotZ + clock.velZ) % 360;

          let nextVelX = clock.velX;
          let nextVelY = clock.velY;
          let nextVelZ = clock.velZ;

          if (nextY < -10) {
            nextY = 110;
            nextX = Math.random() * 80 + 10;
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
            velZ: nextVelZ,
          };
        })
      );
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.play().catch((error) =>
        console.error('Video play failed:', error)
      );
    }
  }, []);

  return (
    <main className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <video
        ref={videoRef}
        src={chandelierBg}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className={styles.backgroundVideo}
      />

      {/* Floating Clocks Layer */}
      <div className={styles.clocksLayer}>
        {clocks.map((clock) => (
          <div
            key={clock.id}
            className={styles.digitalClock}
            style={{
              left: `${clock.x}%`,
              top: `${clock.y}%`,
              transform: `translate(-50%, -50%) scale(${clock.scale}) rotateX(${clock.rotX}deg) rotateY(${clock.rotY}deg) rotateZ(${clock.rotZ}deg)`,
              opacity: clock.opacity,
            }}
          >
            {timeString.split('').map((char, index) => (
              <span key={index} className={styles.digitBox}>
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

const MemoizedFloatingDigitalClocks = memo(FloatingDigitalClocks);
MemoizedFloatingDigitalClocks.displayName = 'Clock_26_07_02';
export default MemoizedFloatingDigitalClocks;
