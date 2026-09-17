import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Clock.module.css';

export type RoomType = 'hours' | 'minutes' | 'seconds';

export interface RoomConfig {
  id: RoomType;
  max: number;
  radiusPx: number;
  gravity: number;
  bounce: number;
  friction: number;
  bgGradient: string;
}

interface SpherePhysics {
  id: string;
  num: number;
  room: RoomType;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  isDraining?: boolean;
}

interface SphereMeta {
  id: string;
  num: number;
  room: RoomType;
}

const ROOM_CONFIGS: RoomConfig[] = [
  {
    id: 'hours',
    max: 12,
    radiusPx: 24,
    gravity: 0.025,
    bounce: 0.94,
    friction: 0.996,
    bgGradient: 'radial-gradient(circle at 30%, #0dcaec, #056d7b)',
  },
  {
    id: 'minutes',
    max: 60,
    radiusPx: 16,
    gravity: 0.03,
    bounce: 0.94,
    friction: 0.996,
    bgGradient: 'radial-gradient(circle at 30%, #dce30b, #c2b30c)',
  },
  {
    id: 'seconds',
    max: 60,
    radiusPx: 12,
    gravity: 0.035,
    bounce: 0.92,
    friction: 0.995,
    bgGradient: 'radial-gradient(circle at 30%, #f80, #c50)',
  },
];

export default function SphereDropClock(): JSX.Element {
  const [time, setTime] = useState(() => new Date());

  const [activeSpheres, setActiveSpheres] = useState<Record<RoomType, SphereMeta[]>>({
    hours: [],
    minutes: [],
    seconds: [],
  });

  const physicsMapRef = useRef<Map<string, SpherePhysics>>(new Map());
  const elementsMapRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const [chamberDimensions, setChamberDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth - 32 : 800,
    hourHeight: 180,
    minuteHeight: 200,
    secondHeight: 200,
  });

  const roomBoundsRef = useRef<Record<RoomType, { width: number; height: number; depth: number }>>({
    hours: { width: 800, height: 180, depth: 60 },
    minutes: { width: 800, height: 200, depth: 60 },
    seconds: { width: 800, height: 200, depth: 60 },
  });

  const animFrameRef = useRef<number | null>(null);

  // Recalculate chamber size to fit screen perfectly without edge clipping
  useEffect(() => {
    const handleResize = () => {
      const paddingX = 32;
      const totalWidth = Math.max(280, window.innerWidth - paddingX);
      const totalHeight = window.innerHeight;

      const verticalPadding = 64;
      const availableHeight = totalHeight - verticalPadding;
      const hHeight = Math.max(130, Math.floor(availableHeight * 0.3));
      const mHeight = Math.max(150, Math.floor(availableHeight * 0.35));
      const sHeight = Math.max(150, Math.floor(availableHeight * 0.35));

      setChamberDimensions({
        width: totalWidth,
        hourHeight: hHeight,
        minuteHeight: mHeight,
        secondHeight: sHeight,
      });

      // Z depth kept subtle so 3D scale expansion doesn't bleed out of chamber
      roomBoundsRef.current = {
        hours: { width: totalWidth, height: hHeight, depth: 60 },
        minutes: { width: totalWidth, height: mHeight, depth: 60 },
        seconds: { width: totalWidth, height: sHeight, depth: 60 },
      };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const targetCounts = useMemo(() => {
    const rawHours = time.getHours();
    const hours = rawHours % 12 === 0 ? 12 : rawHours % 12;
    return {
      hours,
      minutes: time.getMinutes(),
      seconds: time.getSeconds(),
    };
  }, [time]);

  useEffect(() => {
    const nextSpheresState: Record<RoomType, SphereMeta[]> = { hours: [], minutes: [], seconds: [] };

    ROOM_CONFIGS.forEach((config) => {
      const room = config.id;
      const targetCount = targetCounts[room];
      let currentList = activeSpheres[room];

      if (targetCount < currentList.length) {
        currentList.forEach((meta) => {
          const phys = physicsMapRef.current.get(meta.id);
          if (phys) phys.isDraining = true;
        });
        currentList = [];
      }

      while (currentList.length < targetCount) {
        const nextNum = currentList.length + 1;
        const sphereId = `${room}-sphere-${Date.now()}-${nextNum}`;
        const bounds = roomBoundsRef.current[room];

        const newPhysics: SpherePhysics = {
          id: sphereId,
          num: nextNum,
          room,
          x: bounds.width / 2 + (Math.random() - 0.5) * (bounds.width * 0.3),
          y: -config.radiusPx * 2,
          z: (Math.random() - 0.5) * (bounds.depth * 0.4),
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 2 + 1,
          vz: (Math.random() - 0.5) * 3,
          radius: config.radiusPx,
        };

        physicsMapRef.current.set(sphereId, newPhysics);
        currentList = [...currentList, { id: sphereId, num: nextNum, room }];
      }

      nextSpheresState[room] = currentList;
    });

    setActiveSpheres(nextSpheresState);
  }, [targetCounts]);

  // Physics loop with anti-clipping buffer & gentle float dynamics
  useEffect(() => {
    const updatePhysics = () => {
      ROOM_CONFIGS.forEach((config) => {
        const room = config.id;
        const bounds = roomBoundsRef.current[room];
        const allRoomSpheres = Array.from(physicsMapRef.current.values()).filter(
          (s) => s.room === room
        );

        const maxNum = allRoomSpheres.reduce((max, s) => (s.isDraining ? max : Math.max(max, s.num)), 0);

        allRoomSpheres.forEach((s) => {
          if (s.isDraining) {
            s.vy += config.gravity * 2;
            s.y += s.vy;
            if (s.y > bounds.height + 100) {
              physicsMapRef.current.delete(s.id);
              elementsMapRef.current.delete(s.id);
            }
            return;
          }

          const isCurrentActiveBall = s.num === maxNum;
          const isHourOrMinuteWanderer = isCurrentActiveBall && (s.room === 'hours' || s.room === 'minutes');

          if (isHourOrMinuteWanderer) {
            // Ultra-gentle force for continuous, slow drift
            s.vx += (Math.random() - 0.5) * 0.025;
            s.vy += (Math.random() - 0.5) * 0.025;
            s.vz += (Math.random() - 0.5) * 0.025;

            // Cap velocity at low speed (0.35px/frame)
            const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy + s.vz * s.vz);
            const maxWanderSpeed = 0.35;
            if (speed > maxWanderSpeed) {
              s.vx = (s.vx / speed) * maxWanderSpeed;
              s.vy = (s.vy / speed) * maxWanderSpeed;
              s.vz = (s.vz / speed) * maxWanderSpeed;
            }

            s.vx *= 0.992;
            s.vy *= 0.992;
            s.vz *= 0.992;
          } else {
            // Low gravity and minimal friction loss for long bouncing
            s.vy += config.gravity;
            s.vx *= config.friction;
            s.vz *= config.friction;
          }

          s.x += s.vx;
          s.y += s.vy;
          s.z += s.vz;

          // Boundary offsets prevent box-shadow/border clipping
          const PADDING = 2;
          const floorY = bounds.height - s.radius - PADDING;
          const ceilingY = s.radius + PADDING;
          const minX = s.radius + PADDING;
          const maxX = bounds.width - s.radius - PADDING;

          if (s.y >= floorY) {
            s.y = floorY;
            s.vy = -s.vy * config.bounce;
          } else if (s.y <= ceilingY) {
            s.y = ceilingY;
            s.vy = -s.vy * config.bounce;
          }

          if (s.x <= minX) {
            s.x = minX;
            s.vx = -s.vx * config.bounce;
          } else if (s.x >= maxX) {
            s.x = maxX;
            s.vx = -s.vx * config.bounce;
          }

          const maxZ = bounds.depth / 2 - s.radius;
          if (s.z <= -maxZ) {
            s.z = -maxZ;
            s.vz = -s.vz * config.bounce;
          } else if (s.z >= maxZ) {
            s.z = maxZ;
            s.vz = -s.vz * config.bounce;
          }
        });

        // Sphere-to-sphere collisions
        for (let i = 0; i < allRoomSpheres.length; i++) {
          for (let j = i + 1; j < allRoomSpheres.length; j++) {
            const s1 = allRoomSpheres[i];
            const s2 = allRoomSpheres[j];
            if (s1.isDraining || s2.isDraining) continue;

            const dx = s2.x - s1.x;
            const dy = s2.y - s1.y;
            const dz = s2.z - s1.z;
            const distSq = dx * dx + dy * dy + dz * dz;
            const minDist = s1.radius + s2.radius;

            if (distSq < minDist * minDist && distSq > 0.0001) {
              const dist = Math.sqrt(distSq);
              const overlap = 0.5 * (minDist - dist);

              const nx = dx / dist;
              const ny = dy / dist;
              const nz = dz / dist;

              s1.x -= nx * overlap;
              s1.y -= ny * overlap;
              s1.z -= nz * overlap;
              s2.x += nx * overlap;
              s2.y += ny * overlap;
              s2.z += nz * overlap;

              const kx = s1.vx - s2.vx;
              const ky = s1.vy - s2.vy;
              const kz = s1.vz - s2.vz;
              const impulse = (nx * kx + ny * ky + nz * kz) * (1 + config.bounce) * 0.5;

              s1.vx -= impulse * nx;
              s1.vy -= impulse * ny;
              s1.vz -= impulse * nz;
              s2.vx += impulse * nx;
              s2.vy += impulse * ny;
              s2.vz += impulse * nz;
            }
          }
        }

        allRoomSpheres.forEach((s) => {
          const el = elementsMapRef.current.get(s.id);
          if (el) {
            el.style.transform = `translate3d(${s.x - s.radius}px, ${s.y - s.radius}px, ${s.z}px)`;
          }
        });
      });

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className={styles.stage}>
      <div className={styles.tower}>
        {ROOM_CONFIGS.map((config) => {
          const roomName = config.id;
          const currentSpheres = activeSpheres[roomName];

          const currentHeight =
            roomName === 'hours'
              ? chamberDimensions.hourHeight
              : roomName === 'minutes'
              ? chamberDimensions.minuteHeight
              : chamberDimensions.secondHeight;

          return (
            <div
              key={roomName}
              className={styles.glassChamber}
              style={{
                height: `${currentHeight}px`,
                width: `${chamberDimensions.width}px`,
              }}
            >
              {currentSpheres.map((s) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    if (el) elementsMapRef.current.set(s.id, el);
                    else elementsMapRef.current.delete(s.id);
                  }}
                  className={styles.sphere}
                  style={
                    {
                      '--size': `${config.radiusPx * 2}px`,
                      '--bg': config.bgGradient,
                      '--fontSize': `${config.radiusPx * 1.1}px`,
                    } as React.CSSProperties
                  }
                >
                  <span className={styles.sphereLabel}>{s.num}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}