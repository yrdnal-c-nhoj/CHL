import React, { useState, useEffect, useRef } from 'react';

const containerStyle = {
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  background: 'linear-gradient(to top, #DCD5B4, #D6F1F1)',
  position: 'relative',
  margin: 0,
};

const App: React.FC = () => {
  const [clocks, setClocks] = useState<any>([]);
  const containerRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const spawnClock: React.FC = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const sizes = [30, 60, 100, 180, 260];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      // Inverse Gravity: Large is slow, Small is fast
      const gravity = 2.2 / size + 0.005;
      // Higher bounce for larger "lighter" clocks
      const bounce = Math.min(0.92, 0.2 + size / 320);

      const newClock = {
        id,
        size,
        gravity,
        bounce,
        x: Math.random() * 90,
        y: -20,
        vy: 0,
        squash: 1, // 1 = normal, < 1 = squashed
        color: `hsl(${Math.floor(Math.random() * 360)}, 30%, 50%)`,
        born: Date.now(),
      };
      setClocks((prev) => [...prev, newClock]);
    };

    const interval = setInterval(spawnClock, 1800);
    return () => clearInterval(interval);
  }, []);

  const animate: React.FC = () => {
    setClocks((prevClocks) => {
      const floor =
        (containerRef.current?.offsetHeight || window.innerHeight) / 16;

      return prevClocks
        .filter((c) => Date.now() - c.born < 45000)
        .map((c) => {
          let nextVy = c.vy + c.gravity;
          let nextY = c.y + nextVy;
          let nextSquash = 1;
          const sizeRem = c.size / 16;

          // 1. Calculate Stretch based on velocity (velocity-based elongation)
          // As it falls faster, it stretches slightly: scaleY > 1
          nextSquash = 1 + Math.abs(nextVy) * 0.15;

          // 2. Floor Collision & Squash
          if (nextY > floor - sizeRem) {
            nextY = floor - sizeRem;

            // If impact velocity is significant, trigger squash
            if (Math.abs(nextVy) > 0.1) {
              nextSquash = 0.6; // Flatten to 60% height
            }

            nextVy *= -c.bounce;
            if (Math.abs(nextVy) < 0.01) nextVy = 0;
          }

          // Smoothly return squash back to 1 if it was squashed
          const finalSquash = c.squash + (nextSquash - c.squash) * 0.2;

          return { ...c, y: nextY, vy: nextVy, squash: finalSquash };
        });
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div ref={containerRef} style={containerStyle}>
      {clocks.map((clock) => (
        <ClockItem key={clock.id} clock={clock} />
      ))}
    </div>
  );
};

const ClockItem = ({ clock }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const m = time.getMinutes() * 6;

  // Calculate the scale: squash affects Y, and to preserve volume, X does the opposite
  // (Traditional animation rule: if height goes down, width goes out)
  const scaleX = 1 / clock.squash;
  const scaleY = clock.squash;

  const clockStyle = {
    position: 'absolute',
    width: `${clock.size / 16}rem`,
    height: `${clock.size / 16}rem`,
    left: `${clock.x}vw`,
    backgroundColor: clock.color,
    borderRadius: '50%',
    border: '3px solid rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Apply the combined physics transform
    transform: `translateY(${clock.y}rem) scale(${scaleX}, ${scaleY})`,
    transformOrigin: 'bottom center', // Squash happens relative to the floor
    willChange: 'transform',
  };

  return (
    <div style={clockStyle}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '5px',
            height: '28%',
            backgroundColor: '#fff',
            transformOrigin: 'bottom',
            transform: `translateX(-50%) rotate(${h}deg)`,
            borderRadius: '5px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: '3px',
            height: '42%',
            backgroundColor: 'rgba(255,255,255,0.7)',
            transformOrigin: 'bottom',
            transform: `translateX(-50%) rotate(${m}deg)`,
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  );
};

export default App;
