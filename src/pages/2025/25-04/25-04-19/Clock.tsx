import permanentMarkerFont from '@/assets/fonts/25fonts/25-04-19-sph.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

// --- Configuration & Types ---
interface BallProperties {
  bounce: number;
  friction: number;
}

interface RoomConfig {
  name: 'hours' | 'minutes' | 'seconds';
  max: number;
  baseSize: number; 
  gravity: number;
  properties: BallProperties;
  baseWidth: number; 
  baseHeight: number; 
  gradient: string;
}

interface BallInstance {
  id: string;
  label: number;
  posX: number;
  posY: number;
  posZ: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  bouncing: boolean;
  element?: HTMLDivElement;
}

const ROOM_CONFIGS: RoomConfig[] = [
  {
    name: 'hours',
    max: 12,
    baseSize: 15,
    gravity: 6,
    properties: { bounce: 0.7, friction: 0.1 },
    baseWidth: 75,
    baseHeight: 20,
    gradient: 'radial-gradient(circle at 30%, #0dcaec, #056d7b)',
  },
  {
    name: 'minutes',
    max: 60,
    baseSize: 9,
    gravity: 7,
    properties: { bounce: 0.6, friction: 0.8 },
    baseWidth: 75,
    baseHeight: 35,
    gradient: 'radial-gradient(circle at 30%, #dce30b, #c2b30c)',
  },
  {
    name: 'seconds',
    max: 60,
    baseSize: 6.5,
    gravity: 8,
    properties: { bounce: 0.4, friction: 0.999 },
    baseWidth: 75,
    baseHeight: 35,
    gradient: 'radial-gradient(circle at 30%, #f80, #c50)',
  },
];

// --- Dynamic Styles ---
export default function SphereDropClock(): JSX.Element {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'SphFont', fontUrl: permanentMarkerFont, options: { weight: 'normal', style: 'normal' } }],
    []
  );
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useSecondClock();
  const [isMobile, setIsMobile] = useState(false);
  
  const ballsMapRef = useRef<Record<string, BallInstance[]>>({ hours: [], minutes: [], seconds: [] });
  const latestBallRef = useRef<Record<string, BallInstance | null>>({ hours: null, minutes: null, seconds: null });
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const targetCounts = useMemo(() => {
    const hours = currentTime.getHours();
    return {
      hours: hours % 12 === 0 ? 12 : hours % 12,
      minutes: currentTime.getMinutes(),
      seconds: currentTime.getSeconds(),
    };
  }, [currentTime]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalMargin = document.body.style.margin;
    const originalBackground = document.body.style.background;
    
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.background = '#5B032EFF';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.margin = originalMargin;
      document.body.style.background = originalBackground;
    };
  }, []);

  const computedOffsets = useMemo(() => {
    let currentSum = 0;
    return ROOM_CONFIGS.map((room) => {
      const actualHeight = isMobile ? room.baseHeight * 0.85 : room.baseHeight;
      const offset = currentSum;
      currentSum += actualHeight;
      return { name: room.name, height: actualHeight, offset };
    });
  }, [isMobile]);

  // Physics Simulation Loop
  useEffect(() => {
    const animate = () => {
      ROOM_CONFIGS.forEach((room) => {
        const balls = ballsMapRef.current[room.name];
        const latestBall = latestBallRef.current[room.name];
        
        const actualWidth = room.baseWidth; 
        const actualSize = isMobile ? room.baseSize * 0.8 : room.baseSize;
        const actualHeight = isMobile ? room.baseHeight * 0.85 : room.baseHeight;

        balls.forEach((ball) => {
          const isLatest = latestBall === ball;

          if (ball.bouncing) {
            ball.velocityY += room.gravity * 0.016;
            ball.posX += ball.velocityX * 0.016;
            ball.posY += ball.velocityY * 0.016;
            ball.posZ += ball.velocityZ * 0.016;

            // X Walls
            if (ball.posX <= 0 || ball.posX >= actualWidth - actualSize) {
              ball.posX = Math.max(0, Math.min(ball.posX, actualWidth - actualSize));
              ball.velocityX = -ball.velocityX * room.properties.bounce;
            }
            // Z Depth
            if (ball.posZ <= 0 || ball.posZ >= actualWidth - actualSize) {
              ball.posZ = Math.max(0, Math.min(ball.posZ, actualWidth - actualSize));
              ball.velocityZ = -ball.velocityZ * room.properties.bounce;
            }
            // Floor Collision
            if (ball.posY >= actualHeight - actualSize) {
              ball.posY = actualHeight - actualSize;
              ball.velocityY = -ball.velocityY * room.properties.bounce;
              ball.velocityX *= room.properties.friction;
              ball.velocityZ *= room.properties.friction;

              if (Math.abs(ball.velocityY) < 2 && Math.abs(ball.velocityX) < 2 && Math.abs(ball.velocityZ) < 2) {
                ball.bouncing = false;
                if (isLatest && (room.name === 'hours' || room.name === 'minutes')) {
                  ball.velocityX = (Math.random() - 0.5) * 10;
                  ball.velocityZ = (Math.random() - 0.5) * 10;
                }
              }
            }
          } else if (isLatest && (room.name === 'hours' || room.name === 'minutes')) {
            ball.posX += ball.velocityX * 0.016;
            ball.posZ += ball.velocityZ * 0.016;

            if (ball.posX <= 0 || ball.posX >= actualWidth - actualSize) {
              ball.posX = Math.max(0, Math.min(ball.posX, actualWidth - actualSize));
              ball.velocityX = -ball.velocityX;
            }
            if (ball.posZ <= 0 || ball.posZ >= actualWidth - actualSize) {
              ball.posZ = Math.max(0, Math.min(ball.posZ, actualWidth - actualSize));
              ball.velocityZ = -ball.velocityZ;
            }
            if (Math.random() < 0.01) {
              ball.velocityX = (Math.random() - 0.5) * 10;
              ball.velocityZ = (Math.random() - 0.5) * 10;
            }
          }

          if (ball.element) {
            const displayY = isLatest && !ball.bouncing && room.name === 'minutes'
              ? ball.posY - Math.abs(Math.sin(Date.now() / 600) * 4)
              : ball.posY;
            
            const zDepthShift = isLatest ? (ball.posZ - 38) : (ball.posZ - 50);
            ball.element.className = `${styles.ball} ${isLatest ? styles.ballCurrent : styles.ballStatic}`;
            ball.element.style.transform = `translateX(${ball.posX}vw) translateY(${displayY}vh) translateZ(${zDepthShift}vh)`;
          }
        });
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  // Sync state transitions 
  useEffect(() => {
    ROOM_CONFIGS.forEach((room) => {
      const targetCount = targetCounts[room.name];
      let currentBalls = [...ballsMapRef.current[room.name]];
      
      const actualWidth = room.baseWidth;
      const actualSize = isMobile ? room.baseSize * 0.8 : room.baseSize;

      if (targetCount < currentBalls.length || (targetCount > 0 && currentBalls.length === 0)) {
        currentBalls.forEach(b => b.element?.remove());
        currentBalls = [];
        latestBallRef.current[room.name] = null;
      }

      while (currentBalls.length < targetCount) {
        const nextNumber = currentBalls.length + 1;
        const roomDom = document.getElementById(`${room.name}-room`);
        if (!roomDom) break; // Ensure room exists before adding balls

        const newBall: BallInstance = {
          id: `${room.name}-ball-${Date.now()}-${nextNumber}`,
          label: nextNumber,
          posX: (actualWidth / 2) - (actualSize / 2) + (Math.random() - 0.5) * 10,
          posY: -30,
          posZ: Math.random() * (actualWidth - actualSize),
          velocityY: 0,
          velocityX: (Math.random() - 0.5) * 100,
          velocityZ: (Math.random() - 0.5) * 100,
          bouncing: true,
        };

        const ballEl = document.createElement('div');
        ballEl.className = styles.ball;
        ballEl.style.setProperty('--ball-size', `${actualSize}vh`);
        ballEl.style.setProperty('--ball-gradient', room.gradient);
        ballEl.innerText = String(nextNumber);

        newBall.element = ballEl;
        latestBallRef.current[room.name] = newBall;
        roomDom.appendChild(ballEl);
        currentBalls.push(newBall);
      }

      ballsMapRef.current[room.name] = currentBalls;
    });
  }, [targetCounts, isMobile]);

  const initialTopOffset = isMobile ? 2 : 5;

  return (
    <div id="tower" className={styles.tower}>
      {computedOffsets.map(({ name, height, offset }) => (
        <div 
          key={name} 
          id={`${name}-room`} 
          className={`${styles.room} ${name === 'minutes' ? styles.roomMinutes : ''}`}
          style={{ height: `${height}vh`, top: `${offset + initialTopOffset}vh` }}
        />
      ))}
    </div>
  );
}