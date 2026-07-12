import permanentMarkerFont from '@/assets/fonts/25fonts/25-04-19-sph.ttf?url';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import styles from './Clock.module.css';

export const assets = [permanentMarkerFont];

type RoomName = 'hours' | 'minutes' | 'seconds';

interface BallProperties {
  bounce: number;
  friction: number;
}

interface RoomConfig {
  name: RoomName;
  max: number;
  baseSize: number;
  gravity: number;
  properties: BallProperties;
  baseWidth: number;
  baseHeight: number;
  gradient: string;
  label: string;
}

interface BallPhysics {
  id: string;
  label: number;
  posX: number;
  posY: number;
  posZ: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  bouncing: boolean;
  isLatest: boolean;
}

interface BallMeta {
  id: string;
  label: number;
}

const ROOM_CONFIGS: RoomConfig[] = [
  {
    name: 'hours',
    max: 12,
    baseSize: 10,
    gravity: 42,
    properties: { bounce: 0.82, friction: 0.93 },
    baseWidth: 100,
    baseHeight: 26,
    gradient: 'radial-gradient(circle at 32% 28%, #5ee7ff, #0dcaec 45%, #056d7b)',
    label: 'H',
  },
  {
    name: 'minutes',
    max: 60,
    baseSize: 7,
    gravity: 52,
    properties: { bounce: 0.8, friction: 0.95 },
    baseWidth: 100,
    baseHeight: 34,
    gradient: 'radial-gradient(circle at 32% 28%, #f5ff6a, #dce30b 45%, #c2b30c)',
    label: 'M',
  },
  {
    name: 'seconds',
    max: 60,
    baseSize: 5.5,
    gravity: 60,
    properties: { bounce: 0.82, friction: 0.96 },
    baseWidth: 100,
    baseHeight: 34,
    gradient: 'radial-gradient(circle at 32% 28%, #ffb347, #f80 45%, #c50)',
    label: 'S',
  },
];

type Device = 'phone' | 'tablet' | 'desktop' | 'tv';

const getDevice = (w: number): Device => {
  if (w < 768) return 'phone';
  if (w < 1024) return 'tablet';
  if (w < 1920) return 'desktop';
  return 'tv';
};

/** Scales room/ball units so boxes stay compact per screen */
const DEVICE_SCALE: Record<Device, { box: number; ball: number }> = {
  phone: { box: 1.08, ball: 1.12 },
  tablet: { box: 1.05, ball: 1.08 },
  desktop: { box: 1.05, ball: 1.1 },
  tv: { box: 1.02, ball: 1.15 },
};

const emptyBallLists = (): Record<RoomName, BallMeta[]> => ({
  hours: [],
  minutes: [],
  seconds: [],
});

const emptyPhysics = (): Record<RoomName, BallPhysics[]> => ({
  hours: [],
  minutes: [],
  seconds: [],
});

const pad = (n: number) => String(n).padStart(2, '0');
let ballSeq = 0;

function placeSettled(
  room: RoomConfig,
  label: number,
  size: number,
  roomHeight: number,
  index: number,
): BallPhysics {
  const width = room.baseWidth;
  const floorY = Math.max(0, roomHeight - size);
  const cols = Math.max(1, Math.floor(width / (size * 1.15)));
  const col = index % cols;
  const row = Math.floor(index / cols);
  const gapX = (width - size) / Math.max(1, cols - 1 || 1);
  const posX = cols === 1 ? (width - size) / 2 : col * gapX;
  // Slight z stagger so big hour balls don't perfectly stack-trap
  const posZ = ((row * 17 + label * 11) % Math.max(1, Math.floor(width - size)));

  return {
    id: `${room.name}-${label}-${++ballSeq}`,
    label,
    posX: Math.max(0, Math.min(width - size, posX + (Math.random() - 0.5) * size * 0.15)),
    posY: floorY,
    posZ: Math.max(0, Math.min(width - size, posZ)),
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    bouncing: false,
    isLatest: false,
  };
}

function createBall(room: RoomConfig, label: number, size: number, roomHeight: number): BallPhysics {
  const width = room.baseWidth;
  const floorY = Math.max(0, roomHeight - size);
  // Spawn near top of room with clear fall space (important for large hour balls)
  const spawnY = Math.min(2, Math.max(0, floorY * 0.08));

  return {
    id: `${room.name}-${label}-${++ballSeq}`,
    label,
    posX: Math.random() * Math.max(1, width - size),
    posY: spawnY,
    posZ: Math.random() * Math.max(1, width - size),
    velocityY: 6 + Math.random() * 12,
    velocityX: (Math.random() - 0.5) * (room.name === 'hours' ? 90 : 70),
    velocityZ: (Math.random() - 0.5) * (room.name === 'hours' ? 90 : 70),
    bouncing: true,
    isLatest: true,
  };
}

function maxBounceSpeed(roomHeight: number, size: number) {
  return Math.max(22, (roomHeight - size) * 2.6);
}

function reenergize(ball: BallPhysics, room: RoomConfig, roomHeight: number, size: number) {
  const maxUp = maxBounceSpeed(roomHeight, size);
  const base = room.name === 'hours' ? 0.85 : 0.8;
  const kick = maxUp * base;
  ball.bouncing = true;
  ball.velocityY = -(kick * (0.88 + Math.random() * 0.15));
  // Strong lateral kick so big hour balls don't wedge in corners
  const lateral = room.name === 'hours' ? 36 : 22;
  ball.velocityX += (Math.random() - 0.5) * lateral;
  ball.velocityZ += (Math.random() - 0.5) * lateral;
}

function freezeBall(ball: BallPhysics, floorY: number) {
  ball.bouncing = false;
  ball.velocityX = 0;
  ball.velocityY = 0;
  ball.velocityZ = 0;
  ball.posY = floorY;
}

function clampBallInRoom(ball: BallPhysics, size: number, width: number, height: number, bounce: number) {
  const maxPos = Math.max(0, width - size);
  const floorY = Math.max(0, height - size);
  const ceilingY = 0;

  if (ball.posX < 0) {
    ball.posX = 0;
    ball.velocityX = Math.abs(ball.velocityX) * bounce;
  } else if (ball.posX > maxPos) {
    ball.posX = maxPos;
    ball.velocityX = -Math.abs(ball.velocityX) * bounce;
  }

  if (ball.posZ < 0) {
    ball.posZ = 0;
    ball.velocityZ = Math.abs(ball.velocityZ) * bounce;
  } else if (ball.posZ > maxPos) {
    ball.posZ = maxPos;
    ball.velocityZ = -Math.abs(ball.velocityZ) * bounce;
  }

  if (ball.posY < ceilingY) {
    ball.posY = ceilingY;
    ball.velocityY = Math.abs(ball.velocityY) * bounce;
  } else if (ball.posY > floorY) {
    ball.posY = floorY;
    ball.velocityY = -Math.abs(ball.velocityY) * bounce;
  }

  const maxSpeed = maxBounceSpeed(height, size);
  ball.velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, ball.velocityY));
  ball.velocityX = Math.max(-maxSpeed * 1.3, Math.min(maxSpeed * 1.3, ball.velocityX));
  ball.velocityZ = Math.max(-maxSpeed * 1.3, Math.min(maxSpeed * 1.3, ball.velocityZ));
}

/** Only the moving (highest) ball is pushed; frozen balls stay put */
function separateFromFrozen(balls: BallPhysics[], size: number, width: number, height: number) {
  const minDist = size * 0.88;
  const maxPos = Math.max(0, width - size);
  const floorY = Math.max(0, height - size);
  const moving = balls.find((b) => b.isLatest);
  if (!moving || !moving.bouncing) return;

  let stuckHits = 0;

  for (const other of balls) {
    if (other === moving) continue;

    const ax = moving.posX + size / 2;
    const ay = moving.posY + size / 2;
    const az = moving.posZ + size / 2;
    const bx = other.posX + size / 2;
    const by = other.posY + size / 2;
    const bz = other.posZ + size / 2;
    let dx = ax - bx;
    let dy = ay - by;
    let dz = az - bz;
    let dist = Math.hypot(dx, dy, dz);

    if (dist < 0.001) {
      dx = (Math.random() - 0.5) || 0.15;
      dy = -0.35;
      dz = (Math.random() - 0.5) || 0.15;
      dist = Math.hypot(dx, dy, dz);
    }

    if (dist < minDist) {
      stuckHits += 1;
      const overlap = minDist - dist + 0.15;
      const nx = dx / dist;
      const ny = dy / dist;
      const nz = dz / dist;

      // Prefer sliding up/over frozen piles instead of wedging
      moving.posX = Math.max(0, Math.min(maxPos, moving.posX + nx * overlap));
      moving.posY = Math.max(0, Math.min(floorY, moving.posY + Math.min(ny, -0.35) * overlap));
      moving.posZ = Math.max(0, Math.min(maxPos, moving.posZ + nz * overlap));

      const velAlong = moving.velocityX * nx + moving.velocityY * ny + moving.velocityZ * nz;
      if (velAlong < 0) {
        moving.velocityX -= velAlong * nx * 1.25;
        moving.velocityY -= velAlong * ny * 1.25;
        moving.velocityZ -= velAlong * nz * 1.25;
      }
      moving.velocityY -= 2;
    }
  }

  return stuckHits;
}

export default function SphereDropClock(): JSX.Element {
  const fontConfigs = useMemo<FontConfig[]>(
    () => [{ fontFamily: 'SphFont', fontUrl: permanentMarkerFont, options: { weight: 'normal', style: 'normal' } }],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useSecondClock();
  const [device, setDevice] = useState<Device>(() =>
    typeof window !== 'undefined' ? getDevice(window.innerWidth) : 'desktop',
  );
  const [ballLists, setBallLists] = useState(emptyBallLists);

  const physicsRef = useRef(emptyPhysics());
  const elRef = useRef<Record<string, HTMLDivElement | null>>({});
  const latestClassRef = useRef<Record<string, boolean>>({});
  const requestRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const deviceRef = useRef(device);

  useEffect(() => {
    const handleResize = () => setDevice(getDevice(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    deviceRef.current = device;
  }, [device]);

  const scale = DEVICE_SCALE[device];

  const targetCounts = useMemo(() => {
    const hours = currentTime.getHours();
    return {
      hours: hours % 12 === 0 ? 12 : hours % 12,
      minutes: currentTime.getMinutes(),
      seconds: currentTime.getSeconds(),
    };
  }, [currentTime]);

  const digitalLabel = useMemo(() => {
    const h = currentTime.getHours() % 12 || 12;
    return `${h}:${pad(currentTime.getMinutes())}:${pad(currentTime.getSeconds())}`;
  }, [currentTime]);

  const computedOffsets = useMemo(() => {
    const rooms = ROOM_CONFIGS.map((room) => ({
      ...room,
      height: room.baseHeight * scale.box,
      size: room.baseSize * scale.ball,
    }));
    const total = rooms.reduce((sum, r) => sum + r.height, 0);
    const topPad = Math.max(4, (100 - total) / 2);
    let currentSum = topPad;
    return rooms.map((room) => {
      const offset = currentSum;
      currentSum += room.height;
      return { ...room, offset };
    });
  }, [scale]);

  const stuckTimerRef = useRef<Record<RoomName, number>>({ hours: 0, minutes: 0, seconds: 0 });

  // Incremental sync: add/remove balls to match target counts
  useEffect(() => {
    const { box, ball: ballScale } = DEVICE_SCALE[deviceRef.current];

    setBallLists((prev) => {
      let changed = false;
      const nextLists = { ...prev };
      const nextPhysics = {
        hours: [...physicsRef.current.hours],
        minutes: [...physicsRef.current.minutes],
        seconds: [...physicsRef.current.seconds],
      };

      ROOM_CONFIGS.forEach((room) => {
        const target = targetCounts[room.name];
        let metas = [...nextLists[room.name]];
        let physics = [...nextPhysics[room.name]];
        const size = room.baseSize * ballScale;
        const roomHeight = room.baseHeight * box;

        // Hours wrap (e.g. 12 → 1): rebuild so labels stay coherent
        if (
          room.name === 'hours' &&
          metas.length > 0 &&
          target < metas.length &&
          target <= 2 &&
          metas.length >= 10
        ) {
          metas.forEach((m) => {
            delete elRef.current[m.id];
            delete latestClassRef.current[m.id];
          });
          metas = [];
          physics = [];
          changed = true;
        }

        while (metas.length > target) {
          const removed = metas.pop();
          physics.pop();
          if (removed) {
            delete elRef.current[removed.id];
            delete latestClassRef.current[removed.id];
          }
          changed = true;
        }

        const deficit = target - metas.length;
        if (deficit > 0) {
          // Bulk load: settle all but the newest instantly (faster initial paint)
          if (deficit > 1) {
            const start = metas.length;
            for (let i = 0; i < deficit - 1; i++) {
              const label = start + i + 1;
              const settled = placeSettled(room, label, size, roomHeight, start + i);
              metas.push({ id: settled.id, label: settled.label });
              physics.push(settled);
            }
          }
          const label = metas.length + 1;
          const ball = createBall(room, label, size, roomHeight);
          physics.forEach((b) => {
            b.isLatest = false;
          });
          ball.isLatest = true;
          ball.bouncing = true;
          metas.push({ id: ball.id, label: ball.label });
          physics.push(ball);
          changed = true;
          stuckTimerRef.current[room.name] = 0;
        }

        physics.forEach((b, i) => {
          b.isLatest = i === physics.length - 1;
          if (b.isLatest) b.bouncing = true;
        });

        nextLists[room.name] = metas;
        nextPhysics[room.name] = physics;
      });

      physicsRef.current = nextPhysics;
      return changed ? nextLists : prev;
    });
  }, [targetCounts, device]);

  // Physics loop — updates transforms directly; no React state per frame
  useEffect(() => {
    lastTsRef.current = performance.now();

    const animate = (ts: number) => {
      const rawDt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const dt = Math.min(rawDt, 0.032);
      const { box, ball: ballScale } = DEVICE_SCALE[deviceRef.current];

      ROOM_CONFIGS.forEach((room) => {
        const balls = physicsRef.current[room.name];
        const size = room.baseSize * ballScale;
        const height = room.baseHeight * box;
        const width = room.baseWidth;
        const floorY = height - size;

        balls.forEach((ball) => {
          // Frozen lower-number balls stay still
          if (!ball.bouncing && !ball.isLatest) {
            ball.posY = floorY;
            ball.velocityX = 0;
            ball.velocityY = 0;
            ball.velocityZ = 0;
            return;
          }

          // Highest number always stays active
          if (ball.isLatest) ball.bouncing = true;

          ball.velocityY += room.gravity * dt;
          const drag = Math.pow(ball.isLatest ? 0.99 : 0.95, dt * 60);
          ball.velocityX *= drag;
          ball.velocityZ *= drag;
          ball.velocityY *= Math.pow(ball.isLatest ? 0.997 : 0.96, dt * 60);

          ball.posX += ball.velocityX * dt;
          ball.posY += ball.velocityY * dt;
          ball.posZ += ball.velocityZ * dt;

          const hitFloor = ball.posY >= floorY;
          const bounce = ball.isLatest ? room.properties.bounce : room.properties.bounce * 0.5;
          clampBallInRoom(ball, size, width, height, bounce);

          if (hitFloor || ball.posY >= floorY - 0.05) {
            const friction = ball.isLatest ? room.properties.friction : 0.65;
            ball.velocityX *= friction;
            ball.velocityZ *= friction;

            if (ball.isLatest) {
              if (Math.abs(ball.velocityY) < (room.name === 'hours' ? 16 : 14)) {
                reenergize(ball, room, height, size);
                clampBallInRoom(ball, size, width, height, room.properties.bounce);
              }
              if (Math.random() < 0.004) {
                ball.velocityX += (Math.random() - 0.5) * (room.name === 'hours' ? 28 : 18);
                ball.velocityZ += (Math.random() - 0.5) * (room.name === 'hours' ? 28 : 18);
              }
            } else if (
              Math.abs(ball.velocityY) < 5 &&
              Math.abs(ball.velocityX) < 3 &&
              Math.abs(ball.velocityZ) < 3
            ) {
              freezeBall(ball, floorY);
            }
          }
        });

        const stuckHits = separateFromFrozen(balls, size, width, height) ?? 0;
        const latest = balls.find((b) => b.isLatest);
        if (latest) {
          const speed = Math.hypot(latest.velocityX, latest.velocityY, latest.velocityZ);
          if (speed < 8 || stuckHits >= 2) {
            stuckTimerRef.current[room.name] += dt;
          } else {
            stuckTimerRef.current[room.name] = 0;
          }
          // Unstick blue/large hour balls (and others) if wedged
          if (stuckTimerRef.current[room.name] > 0.35) {
            reenergize(latest, room, height, size);
            latest.posX = Math.random() * Math.max(1, width - size);
            latest.posZ = Math.random() * Math.max(1, width - size);
            latest.posY = Math.min(2, floorY * 0.15);
            stuckTimerRef.current[room.name] = 0;
          }
        }

        balls.forEach((ball) => {
          if (ball.bouncing || ball.isLatest) {
            clampBallInRoom(ball, size, width, height, room.properties.bounce);
          }

          const el = elRef.current[ball.id];
          if (!el) return;

          const scale = ball.isLatest ? 1.08 : 1;

          // Positions as % of room so layout scales on every screen
          if (!ball.bouncing && !ball.isLatest) {
            if (el.dataset.settled !== '1') {
              el.dataset.settled = '1';
              el.style.left = `${(ball.posX / width) * 100}%`;
              el.style.top = `${(ball.posY / height) * 100}%`;
              el.style.transform = 'none';
              el.style.zIndex = String(ball.label);
              el.className = `${styles.ball} ${styles.ballStatic}`;
              latestClassRef.current[ball.id] = false;
            }
            return;
          }

          el.dataset.settled = '0';
          el.style.left = `${(ball.posX / width) * 100}%`;
          el.style.top = `${(ball.posY / height) * 100}%`;
          el.style.transform = `scale(${scale})`;
          el.style.zIndex = String(ball.isLatest ? 2000 + ball.label : ball.label);

          const wasLatest = latestClassRef.current[ball.id];
          if (wasLatest !== ball.isLatest) {
            latestClassRef.current[ball.id] = ball.isLatest;
            el.className = `${styles.ball} ${ball.isLatest ? styles.ballCurrent : styles.ballStatic}`;
          }
        });
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className={styles.tower} data-device={device}>
      <time className={styles.digital} dateTime={currentTime.toISOString()}>
        {digitalLabel}
      </time>

      <div className={styles.stage}>
        {computedOffsets.map((room) => {
          const balls = ballLists[room.name];
          const ballPct = (room.size / room.height) * 100;

          return (
            <section
              key={room.name}
              className={styles.room}
              style={{ height: `${room.height}%`, top: `${room.offset}%` }}
              aria-label={`${room.label} room`}
            >
              <div className={styles.floor} aria-hidden />
              <div className={styles.wallLeft} aria-hidden />
              <div className={styles.wallRight} aria-hidden />

              {balls.map((ball) => {
                const ballStyle = {
                  '--ball-size': `${ballPct}%`,
                  '--ball-gradient': room.gradient,
                } as CSSProperties;

                return (
                  <div
                    key={ball.id}
                    ref={(node) => {
                      elRef.current[ball.id] = node;
                      if (node && latestClassRef.current[ball.id] === undefined) {
                        latestClassRef.current[ball.id] = ball.label === balls.length;
                        node.className = `${styles.ball} ${
                          ball.label === balls.length ? styles.ballCurrent : styles.ballStatic
                        }`;
                      }
                    }}
                    className={`${styles.ball} ${ball.label === balls.length ? styles.ballCurrent : styles.ballStatic}`}
                    style={ballStyle}
                  >
                    {ball.label}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}
