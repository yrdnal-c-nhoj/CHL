import React, { useEffect, useRef, useState } from 'react';

interface AnalogClockProps {
  size?: number;
  showSeconds?: boolean;
  className?: string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  size = 280,
  showSeconds = true,
  className = '',
}) => {
  const [time, setTime] = useState(new Date());
  const [rotation, setRotation] = useState(0);

  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<'waiting' | 'spinning' | 'holding'>('waiting');
  const directionRef = useRef<-1 | 1>(-1); // -1 = CCW, 1 = CW
  const spinStartRef = useRef(0);
  const currentAngleRef = useRef(0);
  const startTimeRef = useRef(0);

  // Update hands every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animation loop
  useEffect(() => {
    const INITIAL_DELAY = 1000;   // 1 second after load
    const SPIN_DURATION = 10000;  // 5s accelerate + 5s decelerate
    const HOLD_DURATION = 1000;   // 1 second pause (never longer)
    const TOTAL_DEGREES = 2160;   // 6 full rotations

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;

      // 1. Initial wait (only once)
      if (phaseRef.current === 'waiting') {
        if (elapsed >= INITIAL_DELAY) {
          phaseRef.current = 'spinning';
          spinStartRef.current = now;
          directionRef.current = -1; // start counterclockwise
        }
      }

      // 2. Spinning
      if (phaseRef.current === 'spinning') {
        const spinElapsed = now - spinStartRef.current;
        const progress = Math.min(spinElapsed / SPIN_DURATION, 1);
        const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);

        const newAngle =
          currentAngleRef.current +
          directionRef.current * TOTAL_DEGREES * eased;

        setRotation(newAngle);

        if (progress >= 1) {
          currentAngleRef.current = newAngle;
          phaseRef.current = 'holding';
          spinStartRef.current = now;
        }
      }

      // 3. 1-second hold, then immediately flip direction and spin again
      if (phaseRef.current === 'holding') {
        const holdElapsed = now - spinStartRef.current;

        if (holdElapsed >= HOLD_DURATION) {
          // Flip direction and start next spin
          directionRef.current = (directionRef.current * -1) as -1 | 1;
          phaseRef.current = 'spinning';
          spinStartRef.current = now;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Hand angles
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;

  const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '8px solid #1a1a1a',
          background: 'radial-gradient(circle at 30% 30%, #f8f8f8, #e0e0e0)',
          position: 'relative',
          boxShadow:
            '0 8px 24px rgba(0,0,0,0.25), inset 0 0 20px rgba(0,0,0,0.1)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          transform: `rotate(${rotation}deg)`,
          transition: 'none',
          flexShrink: 0,
          pointerEvents: 'auto',
        }}
      >
        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 0.04,
            height: size * 0.04,
            background: '#1a1a1a',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />

        {/* Numbers */}
        {numbers.map((num) => {
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const radius = size * 0.38;
          const x = size / 2 + radius * Math.cos(angle);
          const y = size / 2 + radius * Math.sin(angle);

          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                fontSize: size * 0.085,
                fontWeight: 600,
                color: '#1a1a1a',
                userSelect: 'none',
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Hour hand */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 0.04,
            height: size * 0.25,
            background: '#1a1a1a',
            borderRadius: 4,
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`,
            zIndex: 3,
          }}
        />

        {/* Minute hand */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 0.03,
            height: size * 0.35,
            background: '#333',
            borderRadius: 3,
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`,
            zIndex: 4,
          }}
        />

        {/* Second hand */}
        {showSeconds && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: size * 0.012,
              height: size * 0.4,
              background: '#e63946',
              borderRadius: 2,
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`,
              zIndex: 5,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AnalogClock;